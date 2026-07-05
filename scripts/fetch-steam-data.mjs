// Steamの公開ストアAPI（Web APIキー不要）からセール中タイトルを取得し、
// セール偏差値を計算して data/deals.json に書き出すスクリプト。
// GitHub Actions から定期実行される想定（.github/workflows/update-data.yml）。
//
// 注意：
// - 使用しているのは Steam の非公式に近い公開JSONエンドポイント（featuredcategories, appreviews）。
//   Valveの Steam Web API 利用規約の対象であり、仕様変更・停止はValve都合でいつでも起こり得る。
// - featuredcategories の "specials" は Steam が選定した注目セール（十数件程度）。
//   将来的に対象を広げたい場合は search API のページングに置き換える必要がある。

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { computeHensachi } from "./scoring.mjs";

const FEATURED_URL =
  "https://store.steampowered.com/api/featuredcategories/?cc=jp&l=japanese";

const REVIEWS_URL = (appid) =>
  `https://store.steampowered.com/appreviews/${appid}?json=1&language=all&purchase_type=all&num_per_page=0`;
  
const APPDETAILS_URL = (appid) =>
  `https://store.steampowered.com/api/appdetails?appids=${appid}&l=japanese&cc=jp`;
  
const REQUEST_DELAY_MS = 200; // Steam側への配慮のための最小限のウェイト

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "steam-sale-hensachi/0.1 (personal project)" },
  });
  if (!res.ok) {
    throw new Error(`Request failed ${res.status} for ${url}`);
  }
  return res.json();
}

async function fetchFeaturedSpecials() {
  const data = await fetchJson(FEATURED_URL);

  // specialsだけでなく、top_sellers・new_releasesにもセール中タイトルが
  // 混ざっているため、合算して母集団を広げる（ジャンル絞り込みの精度向上のため）
  const buckets = [
    data?.specials?.items,
    data?.top_sellers?.items,
    data?.new_releases?.items,
  ];

  const merged = buckets.flatMap((items) => items ?? []);
  const discounted = merged.filter((item) => item.discount_percent > 0);

  const seen = new Set();
  const deduped = [];
  for (const item of discounted) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    deduped.push(item);
  }
  return deduped;
}

async function fetchReviewStats(appid) {
  try {
    const data = await fetchJson(REVIEWS_URL(appid));
    const summary = data?.query_summary;
    if (!summary || summary.total_reviews === 0) {
      return { reviewPositiveRate: 0, reviewCount: 0 };
    }
    const reviewPositiveRate =
      (summary.total_positive / summary.total_reviews) * 100;
    return {
      reviewPositiveRate: Math.round(reviewPositiveRate * 10) / 10,
      reviewCount: summary.total_reviews,
    };
  } catch (err) {
    console.warn(`  ! review fetch failed for appid ${appid}:`, err.message);
    return { reviewPositiveRate: 0, reviewCount: 0 };
  }
}

function extractYear(dateStr) {
  const match = /(\d{4})/.exec(dateStr ?? "");
  return match ? Number(match[1]) : null;
}

async function fetchAppDetailsExtra(appid) {
  const fallback = { genres: [], supportsJapanese: false, releaseYear: null, shortDescription: "" };
  try {
    const data = await fetchJson(APPDETAILS_URL(appid));
    const entry = data?.[appid];
    if (!entry?.success) return fallback;

    const d = entry.data ?? {};
    const genres = (d.genres ?? []).map((g) => g.description).filter(Boolean);
    const supportsJapanese = typeof d.supported_languages === "string" && d.supported_languages.includes("日本語");
    const releaseYear = extractYear(d.release_date?.date);
    const shortDescription = (d.short_description ?? "").trim();

    return { genres, supportsJapanese, releaseYear, shortDescription };
  } catch (err) {
    console.warn(`  ! appdetails fetch failed for appid ${appid}:`, err.message);
    return fallback;
  }
}

async function buildRawDeals(items) {
  const rawDeals = [];

  for (const item of items) {
    console.log(`Fetching reviews for ${item.name} (${item.id})...`);
    const { reviewPositiveRate, reviewCount } = await fetchReviewStats(item.id);
    await sleep(REQUEST_DELAY_MS);

    const { genres, supportsJapanese, releaseYear, shortDescription } = await fetchAppDetailsExtra(item.id);

    rawDeals.push({
      appid: item.id,
      name: item.name,
      headerImage: item.header_image,
      discountPercent: item.discount_percent,
      initialPriceCents: item.original_price ?? item.final_price,
      finalPriceCents: item.final_price,
      reviewPositiveRate,
      reviewCount,
      storeUrl: `https://store.steampowered.com/app/${item.id}/`,
      genres,
      supportsJapanese,
      releaseYear,
      shortDescription,
    });

    await sleep(REQUEST_DELAY_MS);
  }

  return rawDeals;
}

async function main() {
  console.log("Fetching featured specials from Steam...");
  const items = await fetchFeaturedSpecials();

  if (items.length === 0) {
    console.warn("No specials found. Keeping previous data/deals.json as-is.");
    return;
  }

  const rawDeals = await buildRawDeals(items);
  const deals = computeHensachi(rawDeals);

  const averageDiscount =
    Math.round(
      (rawDeals.reduce((sum, d) => sum + d.discountPercent, 0) /
        rawDeals.length) *
        10
    ) / 10;

  const dataset = {
    fetchedAt: new Date().toISOString(),
    currency: "JPY",
    count: deals.length,
    averageDiscount,
    deals,
  };

  const outDir = path.resolve("data");
  await mkdir(outDir, { recursive: true });
  await writeFile(
    path.join(outDir, "deals.json"),
    JSON.stringify(dataset, null, 2),
    "utf-8"
  );

  console.log(`Wrote ${deals.length} deals to data/deals.json`);
}

main().catch((err) => {
  console.error("fetch-steam-data failed:", err);
  process.exit(1);
});

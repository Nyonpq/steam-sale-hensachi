// Steamの公開ストアAPI（Web APIキー不要）からセール中タイトルを取得し、
// セール偏差値を計算して data/deals.json に書き出すスクリプト。
// GitHub Actions から定期実行される想定（.github/workflows/update-data.yml）。

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { computeHensachi } from "./scoring.mjs";

const FEATURED_URL =
  "https://store.steampowered.com/api/featuredcategories/?cc=jp&l=japanese";

const REVIEWS_URL = (appid) =>
  `https://store.steampowered.com/appreviews/${appid}?json=1&language=all&purchase_type=all&num_per_page=0`;

const REVIEW_SNIPPET_URL = (appid) =>
  `https://store.steampowered.com/appreviews/${appid}?json=1&language=japanese&purchase_type=all&num_per_page=3&filter=summary`;

const APPDETAILS_URL = (appid) =>
  `https://store.steampowered.com/api/appdetails?appids=${appid}&l=japanese&cc=jp`;

const STEAMSPY_URL = (appid) =>
  `https://steamspy.com/api.php?request=appdetails&appid=${appid}`;

const NICHE_TAG_TRANSLATIONS = {
  Roguelike: "ローグライク",
  Roguelite: "ローグライト",
  "Rogue-like": "ローグライク",
  "Rogue-lite": "ローグライト",
  "Hack and Slash": "ハクスラ",
  "Souls-like": "ソウルライク",
  Metroidvania: "メトロイドヴァニア",
  Deckbuilding: "デッキ構築",
  "Bullet Hell": "弾幕",
  "Tower Defense": "タワーディフェンス",
  "Turn-Based Strategy": "ターン制ストラテジー",
  Survival: "サバイバル",
  "Visual Novel": "ビジュアルノベル",
  Platformer: "プラットフォーマー",
};

async function fetchNicheTags(appid) {
  try {
    const data = await fetchJson(STEAMSPY_URL(appid));
    const tags = data?.tags;
    if (!tags || typeof tags !== "object" || Array.isArray(tags)) return [];

    const lowerMap = new Map(
      Object.entries(NICHE_TAG_TRANSLATIONS).map(([k, v]) => [k.toLowerCase(), v])
    );

    const sorted = Object.entries(tags).sort((a, b) => b[1] - a[1]);
    const translated = [];
    for (const [tagName] of sorted) {
      const jp = lowerMap.get(tagName.trim().toLowerCase());
      if (jp && !translated.includes(jp)) translated.push(jp);
      if (translated.length >= 2) break;
    }
    return translated;
  } catch (err) {
    console.warn(`  ! SteamSpy fetch failed for appid ${appid}:`, err.message);
    return [];
  }
}

const REQUEST_DELAY_MS = 200;

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

// 話題性はあるが「注目セール/売れ筋/新作」の枠に入りにくい定番タイトルを
// 独自にウォッチリスト化し、毎回セール中かどうかをSteam公式APIで直接確認する。
// 見つけたタイトルを増やしたくなったら、ここにappidを追加するだけでよい。
const WATCHLIST_APPIDS = [
  413150, // Stardew Valley
  346110, // ARK: Survival Evolved
  292030, // The Witcher 3: Wild Hunt
  367520, // Hollow Knight
  105600, // Terraria
  1245620, // ELDEN RING
  1145360, // Hades
  620, // Portal 2
  271590, // Grand Theft Auto V
  489830, // The Elder Scrolls V: Skyrim Special Edition
  588650, // Dead Cells
  504230, // Celeste
  294100, // RimWorld
  427520, // Factorio
  322330, // Don't Starve Together
  1091500, // Cyberpunk 2077
  // ここから3本：SteamDBの「All-time peak players」上位のうち、
  // 買い切り型（＝実際にセールが起こりうる）タイトルを追加
  // ※F2Pタイトル（PUBG, CS2, Dota 2, Apex Legendsなど）はセール対象外のため除外
  1623730, // Palworld
  2358720, // Black Myth: Wukong
  2246340, // Monster Hunter Wilds
];

async function fetchWatchlistDeals() {
  const items = [];
  for (const appid of WATCHLIST_APPIDS) {
    try {
      const data = await fetchJson(APPDETAILS_URL(appid));
      const entry = data?.[appid];
      const overview = entry?.data?.price_overview;
      if (entry?.success && overview && overview.discount_percent > 0) {
        items.push({
          id: appid,
          name: entry.data.name ?? `App ${appid}`,
          header_image:
            entry.data.header_image ??
            `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/header.jpg`,
          discount_percent: overview.discount_percent,
          original_price: overview.initial,
          final_price: overview.final,
        });
      }
    } catch (err) {
      console.warn(`  ! watchlist check failed for appid ${appid}:`, err.message);
    }
    await sleep(REQUEST_DELAY_MS);
  }
  return items;
}

async function fetchFeaturedSpecials() {
  const data = await fetchJson(FEATURED_URL);
  const buckets = [data?.specials?.items, data?.top_sellers?.items, data?.new_releases?.items];
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
    const reviewPositiveRate = (summary.total_positive / summary.total_reviews) * 100;
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

async function fetchReviewSnippet(appid) {
  try {
    const data = await fetchJson(REVIEW_SNIPPET_URL(appid));
    const reviews = data?.reviews ?? [];
    const candidate = reviews.find(
      (r) => r.voted_up && typeof r.review === "string" && r.review.trim().length >= 10 && r.review.trim().length <= 200
    );
    if (!candidate) return "";
    const cleaned = candidate.review.trim().replace(/\s+/g, " ");
    return cleaned.length > 60 ? `${cleaned.slice(0, 60)}…` : cleaned;
  } catch (err) {
    console.warn(`  ! review snippet fetch failed for appid ${appid}:`, err.message);
    return "";
  }
}

async function buildRawDeals(items) {
  const rawDeals = [];

  for (const item of items) {
    console.log(`Fetching reviews for ${item.name} (${item.id})...`);
    const { reviewPositiveRate, reviewCount } = await fetchReviewStats(item.id);
    await sleep(REQUEST_DELAY_MS);

    const { genres, supportsJapanese, releaseYear, shortDescription } = await fetchAppDetailsExtra(item.id);

    await sleep(1000);
    const nicheTags = await fetchNicheTags(item.id);
    const mergedGenres = [...nicheTags];
    for (const g of genres) {
      if (!mergedGenres.includes(g)) mergedGenres.push(g);
    }

    await sleep(REQUEST_DELAY_MS);
    const reviewSnippet = await fetchReviewSnippet(item.id);

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
      genres: mergedGenres,
      supportsJapanese,
      releaseYear,
      shortDescription,
      reviewSnippet,
    });

    await sleep(REQUEST_DELAY_MS);
  }

  return rawDeals;
}

async function main() {
  console.log("Fetching deal list...");
  const featured = await fetchFeaturedSpecials();
  const watchlist = await fetchWatchlistDeals();

  const merged = [...featured, ...watchlist];
  const seen = new Set();
  const items = [];
  for (const item of merged) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    items.push(item);
  }

  if (items.length === 0) {
    console.warn("No specials found. Keeping previous data/deals.json as-is.");
    return;
  }

  const rawDeals = await buildRawDeals(items);
  const deals = computeHensachi(rawDeals);

  const averageDiscount =
    Math.round((rawDeals.reduce((sum, d) => sum + d.discountPercent, 0) / rawDeals.length) * 10) / 10;

  const dataset = {
    fetchedAt: new Date().toISOString(),
    currency: "JPY",
    count: deals.length,
    averageDiscount,
    deals,
  };

  const outDir = path.resolve("data");
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, "deals.json"), JSON.stringify(dataset, null, 2), "utf-8");

  console.log(`Wrote ${deals.length} deals to data/deals.json`);
}

main().catch((err) => {
  console.error("fetch-steam-data failed:", err);
  process.exit(1);
});
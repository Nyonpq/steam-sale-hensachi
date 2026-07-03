/**
 * 「セール偏差値」計算ロジック
 *
 * 考え方：
 * 単純な割引率だけでなく、レビュー評価・レビュー数（人気/信頼度）を
 * 加味した独自の「お得度スコア」を算出し、さらに"今セール中の全タイトル"
 * を母集団とした偏差値（平均50・標準偏差10）に変換する。
 *
 * これにより「割引率は高いが誰も知らない/評価が低いゲーム」より
 * 「割引率はそこそこでも、評価が高く定番の名作が安くなっている」方が
 * 高スコアになりやすい設計にしている。
 */

const WEIGHTS = {
  discount: 0.45,
  reviewRate: 0.35,
  popularity: 0.2,
};

/**
 * レビュー数を対数スケールで 0-100 に正規化する。
 * 100件未満はほぼ0、10万件以上でほぼ100に近づく。
 */
function normalizePopularity(reviewCount) {
  if (reviewCount <= 0) return 0;
  const logVal = Math.log10(reviewCount + 1); // 0 ~ ~5.3 for 200k reviews
  const maxLog = 5.3;
  return Math.min(100, (logVal / maxLog) * 100);
}

function computeRawScore(deal) {
  const popularity = normalizePopularity(deal.reviewCount);
  return (
    deal.discountPercent * WEIGHTS.discount +
    deal.reviewPositiveRate * WEIGHTS.reviewRate +
    popularity * WEIGHTS.popularity
  );
}

function mean(values) {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function stdDev(values, avg) {
  const variance =
    values.reduce((sum, v) => sum + (v - avg) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

/**
 * @param {import('../lib/types').RawDealInput[]} rawDeals
 * @returns {import('../lib/types').Deal[]}
 */
export function computeHensachi(rawDeals) {
  if (rawDeals.length === 0) return [];

  const withRaw = rawDeals.map((d) => ({
    ...d,
    rawScore: computeRawScore(d),
  }));

  const scores = withRaw.map((d) => d.rawScore);
  const avg = mean(scores);
  const sd = stdDev(scores, avg) || 1; // 0除算防止

  const withHensachi = withRaw.map((d) => ({
    ...d,
    hensachi: Math.round((50 + (10 * (d.rawScore - avg)) / sd) * 10) / 10,
  }));

  withHensachi.sort((a, b) => b.hensachi - a.hensachi);

  return withHensachi.map((d, i) => ({ ...d, rank: i + 1 }));
}

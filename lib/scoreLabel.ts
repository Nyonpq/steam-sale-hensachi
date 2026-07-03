export interface ScoreLabel {
  text: string;
  badgeClass: string;
  ringClass: string;
}

/**
 * 偏差値からラベルと色（Tailwindクラス）を決定する。
 * 平均50・標準偏差10を前提とした一般的な偏差値の感覚に合わせている。
 */
export function getScoreLabel(hensachi: number): ScoreLabel {
  if (hensachi >= 65) {
    return {
      text: "特特特大セール",
      badgeClass: "bg-hanko text-paper",
      ringClass: "border-hanko",
    };
  }
  if (hensachi >= 55) {
    return {
      text: "買い時",
      badgeClass: "bg-hanko-dark text-paper",
      ringClass: "border-hanko-dark",
    };
  }
  if (hensachi >= 45) {
    return {
      text: "平均的",
      badgeClass: "bg-ink-muted text-paper",
      ringClass: "border-ink-muted",
    };
  }
  return {
    text: "様子見",
    badgeClass: "bg-pen text-paper",
    ringClass: "border-pen",
  };
}

export function formatYen(cents: number): string {
  const yen = Math.round(cents / 100);
  return `¥${yen.toLocaleString("ja-JP")}`;
}

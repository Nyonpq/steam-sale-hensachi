export interface ScoreLabel {
  text: string;
  badgeClass: string;
  ringClass: string;
}

export function getScoreLabel(hensachi: number): ScoreLabel {
  if (hensachi >= 65) {
    return {
      text: "特特特大セール",
      badgeClass: "bg-hanko text-white",
      ringClass: "border-hanko",
    };
  }
  if (hensachi >= 55) {
    return {
      text: "買い時",
      badgeClass: "bg-green text-white",
      ringClass: "border-green",
    };
  }
  if (hensachi >= 45) {
    return {
      text: "平均的",
      badgeClass: "bg-ink-muted text-white",
      ringClass: "border-ink-muted",
    };
  }
  return {
    text: "様子見",
    badgeClass: "bg-pen text-white",
    ringClass: "border-pen",
  };
}

export function formatYen(cents: number): string {
  const yen = Math.round(cents / 100);
  return `¥${yen.toLocaleString("ja-JP")}`;
}
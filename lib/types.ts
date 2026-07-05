export interface RawDealInput {
  appid: number;
  name: string;
  headerImage: string;
  discountPercent: number; // 0-100
  initialPriceCents: number; // JPY, no decimals but keep name for clarity
  finalPriceCents: number;
  reviewPositiveRate: number; // 0-100, % of positive reviews
  reviewCount: number; // total number of reviews
  storeUrl: string;
  genres?: string[]; // 例: ["アクション", "インディー"]
  supportsJapanese?: boolean;
  releaseYear?: number | null;
  shortDescription?: string;
}

export interface Deal extends RawDealInput {
  rawScore: number; // internal weighted score before normalization
  hensachi: number; // final "sale hensachi" value, centered around 50
  rank: number;
}

export interface DealsDataset {
  fetchedAt: string; // ISO timestamp
  currency: string;
  count: number;
  averageDiscount: number;
  deals: Deal[];
}

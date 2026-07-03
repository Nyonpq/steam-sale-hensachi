import Image from "next/image";
import { Deal } from "@/lib/types";
import { getScoreLabel, formatYen } from "@/lib/scoreLabel";

export default function RankCard({ deal }: { deal: Deal }) {
  const label = getScoreLabel(deal.hensachi);

  return (
    <a
      href={deal.storeUrl}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="group grid grid-cols-[auto_auto_1fr_auto] items-center gap-4 border-2 border-ink bg-card px-4 py-4 transition-shadow hover:shadow-[4px_4px_0_0_#211D19] sm:gap-6 sm:px-6"
    >
      {/* 順位 */}
      <div className="flex h-10 w-10 flex-none items-center justify-center border-2 border-ink font-mono text-lg font-bold text-ink sm:h-12 sm:w-12">
        {deal.rank}
      </div>

      {/* 偏差値スタンプ */}
      <div
        className={`stamp-rotate flex h-16 w-16 flex-none flex-col items-center justify-center rounded-full border-4 font-display ${label.ringClass}`}
      >
        <span className="text-[9px] font-bold leading-none text-ink-muted">偏差値</span>
        <span className="font-black text-xl leading-tight text-ink">
          {deal.hensachi.toFixed(1)}
        </span>
      </div>

      {/* ゲーム情報 */}
      <div className="min-w-0">
        <div className="mb-2 hidden h-16 w-36 flex-none overflow-hidden border border-ink/30 sm:block">
          {deal.headerImage ? (
            <Image
              src={deal.headerImage}
              alt={deal.name}
              width={288}
              height={128}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : null}
        </div>
        <p className="truncate font-display text-base font-bold text-ink sm:text-lg">
          {deal.name}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-ink-muted">
          <span
            className={`inline-block px-2 py-0.5 text-[11px] font-bold ${label.badgeClass}`}
          >
            {label.text}
          </span>
          <span>レビュー好評率 {deal.reviewPositiveRate}%</span>
          <span>（{deal.reviewCount.toLocaleString("ja-JP")}件）</span>
        </div>
      </div>

      {/* 価格 */}
      <div className="flex-none text-right">
        <p className="font-mono text-[11px] text-ink-muted line-through">
          {formatYen(deal.initialPriceCents)}
        </p>
        <p className="font-display text-lg font-black text-hanko">
          {formatYen(deal.finalPriceCents)}
        </p>
        <p className="font-mono text-[11px] font-bold text-hanko">
          -{deal.discountPercent}%
        </p>
      </div>
    </a>
  );
}

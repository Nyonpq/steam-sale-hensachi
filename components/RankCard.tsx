
import Image from "next/image";
import { Deal } from "@/lib/types";
import { getScoreLabel, formatYen } from "@/lib/scoreLabel";

export default function RankCard({ deal }: { deal: Deal }) {
  const label = getScoreLabel(deal.hensachi);

  return (
    <a href={deal.storeUrl} target="_blank" rel="noopener noreferrer nofollow" className="group block border-2 border-ink bg-card transition-shadow hover:shadow-[4px_4px_0_0_#211D19] sm:grid sm:grid-cols-[auto_auto_1fr_auto] sm:items-stretch sm:gap-6 sm:px-6 sm:py-4">

      <div className="relative aspect-[16/9] w-full overflow-hidden border-b-2 border-ink sm:hidden">
        {deal.headerImage ? (
          <Image src={deal.headerImage} alt={deal.name} fill className="object-cover" unoptimized />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-paper-line font-display text-ink-muted">No Image</div>
        )}
        <div className="absolute left-2 top-2 flex h-9 w-9 items-center justify-center border-2 border-ink bg-card font-mono text-sm font-bold text-ink">{deal.rank}</div>
        <div className={`stamp-rotate absolute right-2 top-2 flex h-14 w-14 flex-col items-center justify-center rounded-full border-4 bg-card font-display ${label.ringClass}`}>
          <span className="text-[8px] font-bold leading-none text-ink-muted">偏差値</span>
          <span className="font-black text-base leading-tight text-ink">{deal.hensachi.toFixed(1)}</span>
        </div>
      </div>

      <div className="hidden h-12 w-12 flex-none items-center justify-center self-center border-2 border-ink font-mono text-lg font-bold text-ink sm:flex">{deal.rank}</div>

      <div className={`stamp-rotate hidden h-16 w-16 flex-none flex-col items-center justify-center self-center rounded-full border-4 font-display sm:flex ${label.ringClass}`}>
        <span className="text-[9px] font-bold leading-none text-ink-muted">偏差値</span>
        <span className="font-black text-xl leading-tight text-ink">{deal.hensachi.toFixed(1)}</span>
      </div>

      <div className="min-w-0 px-4 py-3 sm:px-0 sm:py-3">
        <div className="mb-2 hidden h-16 w-36 flex-none overflow-hidden border border-ink/30 sm:block">
          {deal.headerImage ? (
            <Image src={deal.headerImage} alt={deal.name} width={288} height={128} className="h-full w-full object-cover" unoptimized />
          ) : null}
        </div>
        <p className="truncate font-display text-base font-bold text-ink sm:text-lg">{deal.name}</p>
        {deal.shortDescription && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-muted">{deal.shortDescription}</p>
        )}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-ink-muted">
          <span className={`inline-block px-2.5 py-1 text-xs font-bold tracking-wide ${label.badgeClass}`}>{label.text}</span>
          <span>レビュー好評率 {deal.reviewPositiveRate}%</span>
          <span>（{deal.reviewCount.toLocaleString("ja-JP")}件）</span>
        </div>
        {(deal.genres?.length || deal.releaseYear || deal.supportsJapanese) ? (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {deal.releaseYear && <span className="border border-ink/30 px-1.5 py-0.5 text-[10px] text-ink-muted">{deal.releaseYear}年</span>}
            {deal.supportsJapanese && <span className="border border-pen px-1.5 py-0.5 text-[10px] font-bold text-pen">日本語対応</span>}
            {deal.genres?.slice(0, 4).map((genre) => (
              <span key={genre} className="border border-ink/30 px-1.5 py-0.5 text-[10px] text-ink-muted">{genre}</span>
            ))}
          </div>
        ) : null}
        {deal.reviewSnippet && (
          <p className="mt-2 border-l-2 border-ink/30 pl-2 text-xs italic leading-relaxed text-ink-muted">"{deal.reviewSnippet}"</p>
        )}
      </div>

      <div className="flex-none border-t-2 border-ink bg-hanko/5 px-4 py-3 text-right sm:flex sm:flex-col sm:justify-center sm:self-stretch sm:border-l-2 sm:border-t-0 sm:border-ink">
        <p className="font-mono text-[11px] text-ink-muted line-through">{formatYen(deal.initialPriceCents)}</p>
        <p className="font-display text-2xl font-black text-hanko">{formatYen(deal.finalPriceCents)}</p>
        <span className="mt-1 inline-block bg-hanko px-1.5 py-0.5 font-mono text-[11px] font-bold text-white">-{deal.discountPercent}%</span>
      </div>
    </a>
  );
}
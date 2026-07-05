"use client";

import { useMemo, useState } from "react";
import { Deal } from "@/lib/types";
import RankCard from "./RankCard";

export default function DealsExplorer({ deals }: { deals: Deal[] }) {
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const allGenres = useMemo(() => {
    const set = new Set<string>();
    deals.forEach((d) => d.genres?.forEach((g) => set.add(g)));
    return Array.from(set).sort();
  }, [deals]);

  const filtered = useMemo(() => {
    return deals.filter((deal) => {
      const matchesQuery = deal.name.toLowerCase().includes(query.trim().toLowerCase());
      const matchesGenre = !selectedGenre || (deal.genres ?? []).includes(selectedGenre);
      return matchesQuery && matchesGenre;
    });
  }, [deals, query, selectedGenre]);

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="タイトル名で検索..."
          className="w-full border-2 border-ink bg-card px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-hanko"
        />
      </div>

      {allGenres.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button onClick={() => setSelectedGenre(null)} className={`border-2 px-3 py-1 font-mono text-xs font-bold transition-colors ${selectedGenre === null ? "border-hanko bg-hanko text-paper" : "border-ink/30 bg-card text-ink-muted hover:border-ink"}`}>
            すべて
          </button>
          {allGenres.map((genre) => (
            <button key={genre} onClick={() => setSelectedGenre(genre)} className={`border-2 px-3 py-1 font-mono text-xs font-bold transition-colors ${selectedGenre === genre ? "border-hanko bg-hanko text-paper" : "border-ink/30 bg-card text-ink-muted hover:border-ink"}`}>
              {genre}
            </button>
          ))}
        </div>
      )}

      <p className="mb-3 font-mono text-xs text-ink-muted">{filtered.length} 件のタイトルを表示中</p>

      <section className="space-y-3">
        {filtered.length === 0 ? (
          <p className="border-2 border-ink bg-card px-6 py-8 text-center text-sm text-ink-muted">条件に一致するタイトルが見つかりませんでした。</p>
        ) : (
          filtered.map((deal) => <RankCard key={deal.appid} deal={deal} />)
        )}
      </section>
    </div>
  );
}
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RankCard from "@/components/RankCard";
import dealsData from "@/data/deals.json";
import { DealsDataset } from "@/lib/types";

const dataset = dealsData as DealsDataset;

function formatFetchedAt(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Tokyo",
  }).format(date);
}

export default function Home() {
  const { deals, fetchedAt, averageDiscount, count } = dataset;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <section className="mb-10 border-2 border-ink bg-card px-6 py-8 text-center">
          <p className="font-mono text-xs text-ink-muted">
            {formatFetchedAt(fetchedAt)} 判定 ／ 対象 {count} タイトル ／
            平均割引率 {averageDiscount}%
          </p>
          <h1 className="mt-2 font-display text-3xl font-black tracking-tight text-ink sm:text-4xl">
            本日のセール偏差値ランキング
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-ink-muted">
            割引率だけでなく、レビュー評価と人気度も加味した独自指標
            「セール偏差値」で、今セール中のタイトルをランキング化しています。
            50が平均、65以上は「特特特大セール」の目安です。
          </p>
        </section>

        <section className="space-y-3">
          {deals.map((deal) => (
            <RankCard key={deal.appid} deal={deal} />
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}

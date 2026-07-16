import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { updates } from "@/lib/updates";

export const metadata = {
  title: "更新情報 | セール偏差値",
  alternates: {
    canonical: "/updates",
  },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium" }).format(d);
}

export default function Updates() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-display text-2xl font-black text-ink">更新情報</h1>
        <p className="mt-2 text-sm text-ink-muted">
          サイトの機能追加・変更点をまとめています。
        </p>

        <div className="mt-8 space-y-6">
          {updates.map((entry) => (
            <div key={entry.date} className="border-2 border-ink bg-card px-5 py-4">
              <p className="font-mono text-xs font-bold text-hanko">
                {formatDate(entry.date)}
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink">
                {entry.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllPosts } from "@/lib/blog";

export const metadata = {
  title: "コラム | セール偏差値",
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium" }).format(d);
}

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-display text-2xl font-black text-ink">コラム</h1>
        <p className="mt-2 text-sm text-ink-muted">セール偏差値の仕組みや、実際にお得だったセールについて書いています。</p>

        <div className="mt-8 space-y-4">
          {posts.length === 0 && <p className="text-sm text-ink-muted">まだ記事がありません。</p>}
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block border-2 border-ink bg-card px-5 py-4 transition-shadow hover:shadow-[4px_4px_0_0_#211D19]">
              <p className="font-mono text-xs text-ink-muted">{formatDate(post.date)}</p>
              <p className="mt-1 font-display text-lg font-bold text-ink">{post.title}</p>
              <p className="mt-1 text-sm text-ink-muted">{post.description}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
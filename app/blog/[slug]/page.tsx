import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "記事が見つかりません | セール偏差値" };
  return { title: `${post.title} | セール偏差値`, description: post.description };
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium" }).format(d);
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <p className="font-mono text-xs text-ink-muted">{formatDate(post.date)}</p>
        <h1 className="mt-2 font-display text-2xl font-black text-ink sm:text-3xl">{post.title}</h1>
        <article className="prose-article mt-6 border-t-2 border-ink pt-6 text-ink" dangerouslySetInnerHTML={{ __html: post.html }} />
      </main>
      <Footer />
    </>
  );
}
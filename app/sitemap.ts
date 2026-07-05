import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

const BASE_URL = "https://steam-sale-hensachi.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.date || new Date().toISOString(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "hourly", priority: 1 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    ...postEntries,
  ];
}
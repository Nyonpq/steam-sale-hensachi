import type { Metadata } from "next";
// 1. Vercel Analytics をインポート（追加）
import { Analytics } from "@vercel/analytics/next";
import { Zen_Kaku_Gothic_New, Noto_Sans_JP, Roboto_Mono } from "next/font/google";
import "./globals.css";

const display = Zen_Kaku_Gothic_New({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-display",
});

const body = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
});

const mono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://steam-sale-hensachi.com"),
  title: "セール偏差値 | Steamセールお得度ランキング",
  description:
    "Steamで今セール中のゲームを「偏差値」でランキング化。割引率だけでなくレビュー評価・人気度も加味した独自指標でお得なセールを発見。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
     <body className={`${display.variable} ${body.variable} ${mono.variable} font-body text-ink`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "セール偏差値",
              url: "https://steam-sale-hensachi.com",
              description: "Steamで今セール中のゲームを偏差値でランキング化するファンサイト",
              inLanguage: "ja",
            }),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}

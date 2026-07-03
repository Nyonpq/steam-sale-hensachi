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
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} font-body text-ink`}
      >
        {children}
        {/* 2. bodyの閉じタグ直前に設置（追加） */}
        <Analytics />
      </body>
    </html>
  );
}

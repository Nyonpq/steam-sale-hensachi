import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProfileCard from "@/components/ProfileCard";

export const metadata = {
  title: "このサイトについて | セール偏差値",
  alternates: {
    canonical: "/about",
  },
};

export default function About() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-display text-2xl font-black text-ink">
          このサイトについて
        </h1>

        <div className="mt-6 space-y-6 text-sm leading-relaxed text-ink">
          <section>
            <h2 className="font-display text-lg font-bold text-ink">
              「セール偏差値」とは
            </h2>
            <p className="mt-2">
              Steamでは常に多数のタイトルがセール中ですが、単純な割引率だけでは
              「本当にお得なセールか」は分かりません。評価の低い作品が90%オフに
              なっていても、それが良い買い物とは限らないからです。
            </p>
            <p className="mt-2">
              そこで本サイトでは、割引率・レビュー好評率・レビュー数（人気/信頼度）
              の3つを重み付けして合成スコアを算出し、さらに
              <strong>「今セール中の全タイトルを母集団とした偏差値」</strong>
              に変換しています。平均は常に50になるように設計されているため、
              セールの時期によらず「その日のセール群の中で相対的にどれだけ
              お得か」を直感的に比較できます。
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">
              データの更新頻度
            </h2>
            <p className="mt-2">
              Steamの公開APIから自動取得しており、6時間ごとに更新しています。
              価格や割引率は変動する可能性があるため、購入前には必ずSteam公式
              ストアページで最新情報をご確認ください。
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">
              運営者について
            </h2>
            <p className="mt-2">
              本サイトは、大学生が個人で運営しているファンサイトです。
              Valve CorporationおよびSteamとは一切関係ありません。
            </p>

            <ProfileCard />

            <p className="mt-4">
              コードの一部はAI（Claude）の力を借りながら、企画・デザインの
              方向性やスコアリングの仕組みなどは自分で考えて作っています。
              開発の経緯や裏側については、コラムの
              <Link
                href="/blog/about-me-student-developer"
                className="underline underline-offset-4 hover:text-hanko"
              >
                「大学生がSteamセールサイトを個人開発した話」
              </Link>
              で詳しく書いているので、興味があれば読んでみてください。
            </p>
            <p className="mt-2">
              サイトの変更点は
              <Link
                href="/updates"
                className="underline underline-offset-4 hover:text-hanko"
              >
                更新情報ページ
              </Link>
              にまとめています。
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "プライバシーポリシー | セール偏差値",
};

export default function Privacy() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-display text-2xl font-black text-ink">
          プライバシーポリシー
        </h1>

        <div className="mt-6 space-y-6 text-sm leading-relaxed text-ink">
          <section>
            <h2 className="font-display text-lg font-bold text-ink">
              広告について
            </h2>
            <p className="mt-2">
              当サイトは、第三者配信の広告サービス（Google
              AdSense）を利用する予定です。広告配信事業者はCookieを使用して、
              当サイトや他サイトへの過去のアクセス情報に基づいて広告を配信する
              ことがあります。
            </p>
            <p className="mt-2">
              Googleが広告配信にCookieを使用することにより、当サイトや他のサイト
              へアクセスした際の情報に基づいて、Google及びそのパートナーが適切な
              広告を表示します。ユーザーは
              <a
                href="https://adssettings.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-hanko"
              >
                広告設定
              </a>
              でパーソナライズ広告を無効にできます。
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">
              アクセス解析について
            </h2>
            <p className="mt-2">
              当サイトでは、サイト改善のためアクセス解析ツールを導入する場合が
              あります。これらのツールはCookie等を用いてトラフィックデータを
              収集しますが、個人を特定する情報は含まれません。
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-ink">
              免責事項
            </h2>
            <p className="mt-2">
              当サイトに掲載する情報の正確性には配慮していますが、内容を保証する
              ものではありません。価格・セール情報の変動により生じた損害について、
              運営者は責任を負いかねます。
            </p>
          </section>

         <section>
            <h2 className="font-display text-lg font-bold text-ink">
              お問い合わせ
            </h2>
            <p className="mt-2">
              本ポリシーおよび当サイトに関するお問い合わせは、以下のメール
              アドレスまでご連絡ください。
            </p>
            <p className="mt-2 font-mono">
              
                href="mailto:steam.sale.hensachi@gmail.com"
                className="underline underline-offset-4 hover:text-hanko"
              >
                steam.sale.hensachi@gmail.com
              </a>
            </p>
          </section>
          
          <p className="pt-4 text-xs text-ink-muted">最終更新日：2026年7月</p>
        </div>
      </main>
      <Footer />
    </>
  );
}

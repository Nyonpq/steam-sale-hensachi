import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t-2 border-ink hairline">
      <div className="mx-auto max-w-5xl px-4 py-8 text-xs text-ink-muted font-mono space-y-3">
        <p>
          本サイトはValve Corporationとは無関係の非公式ファンサイトです。
          価格・セール情報はSteam公開APIを基に自動取得していますが、
          正確性を保証するものではありません。購入前に必ずSteam公式ストアで
          最新情報をご確認ください。
        </p>
        <div className="flex gap-4">
          <Link href="/about" className="underline underline-offset-4 hover:text-hanko">
            このサイトについて
          </Link>
          <Link href="/privacy" className="underline underline-offset-4 hover:text-hanko">
            プライバシーポリシー
          </Link>
        </div>
      </div>
    </footer>
  );
}

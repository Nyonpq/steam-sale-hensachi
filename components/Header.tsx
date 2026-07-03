import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b-2 border-ink hairline">
      <div className="mx-auto max-w-5xl px-4 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="stamp-rotate flex h-12 w-12 flex-none items-center justify-center rounded-full border-2 border-hanko text-hanko font-display font-black text-xs leading-tight text-center">
            本日
            <br />
            判定
          </div>
          <div>
            <p className="font-display font-black text-2xl tracking-tight text-ink">
              セール偏差値
            </p>
            <p className="font-mono text-[11px] text-ink-muted tracking-wide">
              STEAM SALE HENSACHI MOCK EXAM
            </p>
          </div>
        </Link>
        <nav className="font-mono text-xs text-ink-muted flex gap-4">
          <Link href="/about" className="hover:text-hanko underline underline-offset-4">
            このサイトについて
          </Link>
        </nav>
      </div>
    </header>
  );
}

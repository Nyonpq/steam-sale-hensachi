export default function ProfileCard() {
  return (
    <div className="mt-4 flex flex-col gap-4 border-2 border-ink bg-card p-5 sm:flex-row sm:items-start">
      <div className="flex h-20 w-20 flex-none items-center justify-center rounded-full border-4 border-hanko bg-paper text-hanko">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-9 w-9"
        >
          <path d="M6 12h4m-2-2v4" />
          <circle cx="16" cy="10" r="1" fill="currentColor" stroke="none" />
          <circle cx="18" cy="13" r="1" fill="currentColor" stroke="none" />
          <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
        </svg>
      </div>
      <div className="flex-1">
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
          <dt className="font-mono text-xs text-ink-muted">運営形態</dt>
          <dd className="text-ink">大学生 / 個人開発</dd>

          <dt className="font-mono text-xs text-ink-muted">運営歴</dt>
          <dd className="text-ink">2026年7月〜</dd>

          <dt className="font-mono text-xs text-ink-muted">好きなジャンル</dt>
          <dd className="text-ink">FPS、ソウルライク、ローグライク、MOBA</dd>
        </dl>
        <p className="mt-3 border-l-2 border-hanko pl-3 text-sm italic text-ink-muted">
          ごく普通の大学生。自分の力でなにか収益化したい。
        </p>
      </div>
    </div>
  );
}
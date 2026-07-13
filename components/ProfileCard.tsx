export default function ProfileCard() {
  return (
    <div className="mt-4 flex flex-col gap-4 border-2 border-ink bg-card p-5 sm:flex-row sm:items-start">
      <div className="flex h-20 w-20 flex-none items-center justify-center rounded-full border-4 border-hanko bg-paper font-display text-3xl font-black text-hanko">
        運
      </div>
      <div className="flex-1">
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
          <dt className="font-mono text-xs text-ink-muted">運営形態</dt>
          <dd className="text-ink">大学生 / 個人開発</dd>

          <dt className="font-mono text-xs text-ink-muted">運営歴</dt>
          <dd className="text-ink">2026年7月〜</dd>

          <dt className="font-mono text-xs text-ink-muted">好きなジャンル</dt>
          <dd className="text-ink">
            FPS、ソウルライク、ローグライク、MOBA
          </dd>
        </dl>
        <p className="mt-3 border-l-2 border-hanko pl-3 text-sm italic text-ink-muted">
           ごく普通の大学生。自分の力でなにか収益化できたらいいな。
        </p>
      </div>
    </div>
  );
}
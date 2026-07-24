import { nextRating, todayACCount, useAppStore } from '../../store/useAppStore'

/** Header: tiêu đề + các thẻ thống kê nhanh + nút âm thanh */
export default function HeaderStats() {
  const streak = useAppStore((s) => s.streak)
  const problems = useAppStore((s) => s.problems)
  const milestoneIndex = useAppStore((s) => s.milestoneIndex)
  const milestoneProgress = useAppStore((s) => s.milestoneProgress)
  const perMilestone = useAppStore((s) => s.settings.problemsPerMilestone)
  const settings = useAppStore((s) => s.settings)
  const setSettings = useAppStore((s) => s.setSettings)

  const next = nextRating(milestoneIndex)
  const today = todayACCount(problems)
  const remaining = perMilestone - milestoneProgress

  const cards = [
    {
      emoji: '🔥',
      value: `${streak.current} ngày`,
      label: 'Chuỗi hiện tại',
      note: streak.current > 0 ? 'Keep it up!' : 'Bắt đầu lại nào!',
      iconBg: 'linear-gradient(135deg,#fb923c,#ef4444)',
    },
    {
      emoji: '🎯',
      value: next ? String(next) : 'MAX',
      label: 'Mục tiêu tiếp theo',
      note: next ? `Còn ${remaining} AC` : 'Đỉnh cao!',
      iconBg: 'linear-gradient(135deg,#f472b6,#ef4444)',
    },
    {
      emoji: '📅',
      value: `${today} bài`,
      label: 'Hôm nay',
      note: today > 0 ? 'Tuyệt vời!' : 'Chưa có bài',
      iconBg: 'linear-gradient(135deg,#38bdf8,#0ea5e9)',
    },
  ]

  return (
    <header className="flex flex-col xl:flex-row xl:items-center gap-4 mb-5">
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_6px_rgba(30,80,140,0.45)]">
          roadtoworld
          <span className="bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent drop-shadow-none">
            final
          </span>
        </h1>
        <p className="text-sm text-sky-900/70 font-medium mt-1">Mỗi bài AC đưa hiệp sĩ tiến gần hơn tới trận chung kết thế giới ⚔️</p>
      </div>

      <div className="flex items-stretch gap-2 flex-wrap">
        {cards.map((c) => (
          <div key={c.label} className="glass px-3.5 py-2.5 flex items-center gap-3">
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 shadow-md"
              style={{ background: c.iconBg }}
              aria-hidden="true"
            >
              {c.emoji}
            </span>
            <div>
              <div className="text-[10px] text-slate-500 font-bold leading-tight">{c.label}</div>
              <div className="text-base font-extrabold leading-tight">{c.value}</div>
              <div className="text-[10px] text-amber-600 font-bold leading-tight">{c.note}</div>
            </div>
          </div>
        ))}

        <button
          onClick={() => setSettings({ soundOn: !settings.soundOn })}
          className="glass px-3.5 text-lg hover:scale-105 transition-transform"
          title={settings.soundOn ? 'Tắt âm thanh' : 'Bật âm thanh'}
          aria-label={settings.soundOn ? 'Tắt âm thanh' : 'Bật âm thanh'}
        >
          {settings.soundOn ? '🔊' : '🔇'}
        </button>
      </div>
    </header>
  )
}

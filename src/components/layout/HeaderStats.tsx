import { nextRating, todayACCount, useAppStore } from '../../store/useAppStore'

/** Header: tiêu đề + các thẻ thống kê nhanh + nút âm thanh */
export default function HeaderStats() {
  const totalAC = useAppStore((s) => s.totalAC)
  const streak = useAppStore((s) => s.streak)
  const problems = useAppStore((s) => s.problems)
  const milestoneIndex = useAppStore((s) => s.milestoneIndex)
  const settings = useAppStore((s) => s.settings)
  const setSettings = useAppStore((s) => s.setSettings)

  const next = nextRating(milestoneIndex)
  const today = todayACCount(problems)

  const cards = [
    { label: 'Chuỗi hiện tại', value: `${streak.current} ngày`, emoji: '🔥' },
    { label: 'Tổng AC', value: String(totalAC), emoji: '⚡' },
    { label: 'Mục tiêu tiếp theo', value: next ? String(next) : 'MAX', emoji: '🎯' },
    { label: 'Hôm nay', value: `${today} bài`, emoji: '📅' },
  ]

  return (
    <header className="flex flex-col xl:flex-row xl:items-center gap-4 mb-5">
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-sky-600 via-teal-500 to-amber-500 bg-clip-text text-transparent">
          Hành ổn trí viễn [CODE]
        </h1>
        <p className="text-sm text-slate-500 mt-1">Mỗi AC là một hạt năng lượng giúp chim bay xa hơn.</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {cards.map((c) => (
          <div key={c.label} className="glass px-3.5 py-2 flex items-center gap-2.5">
            <span className="text-xl" aria-hidden="true">{c.emoji}</span>
            <div>
              <div className="text-sm font-extrabold leading-tight">{c.value}</div>
              <div className="text-[10px] text-slate-500 font-semibold">{c.label}</div>
            </div>
          </div>
        ))}

        <button
          onClick={() => setSettings({ soundOn: !settings.soundOn })}
          className="glass px-3 py-2.5 text-lg hover:scale-105 transition-transform"
          title={settings.soundOn ? 'Tắt âm thanh' : 'Bật âm thanh'}
          aria-label={settings.soundOn ? 'Tắt âm thanh' : 'Bật âm thanh'}
        >
          {settings.soundOn ? '🔊' : '🔇'}
        </button>
      </div>
    </header>
  )
}

import { useMemo } from 'react'
import { useAppStore } from '../store/useAppStore'
import { formatDateVi, weekStartKey } from '../utils/dates'

const MEDALS = ['🥇', '🥈', '🥉', '4.', '5.']

/** Bảng xếp hạng cá nhân: tự đua với chính mình theo ngày và theo tuần */
export default function LeaderboardPage() {
  const problems = useAppStore((s) => s.problems)
  const streak = useAppStore((s) => s.streak)
  const totalAC = useAppStore((s) => s.totalAC)

  const { topDays, topWeeks, maxDay } = useMemo(() => {
    const byDay = new Map<string, number>()
    const byWeek = new Map<string, number>()
    for (const p of problems) {
      if (p.status !== 'AC') continue
      byDay.set(p.date, (byDay.get(p.date) ?? 0) + 1)
      const wk = weekStartKey(p.date)
      byWeek.set(wk, (byWeek.get(wk) ?? 0) + 1)
    }
    const topDays = [...byDay.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
    const topWeeks = [...byWeek.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
    return { topDays, topWeeks, maxDay: topDays[0]?.[1] ?? 0 }
  }, [problems])

  const records = [
    { label: 'Tổng số bài AC', value: totalAC, emoji: '⚡' },
    { label: 'Chuỗi ngày dài nhất', value: `${streak.longest} ngày`, emoji: '🔥' },
    { label: 'Nhiều bài nhất một ngày', value: `${maxDay} bài`, emoji: '🚀' },
    {
      label: 'Tổng thời gian luyện tập',
      value: `${problems.reduce((s, p) => s + (p.solveTimeMinutes ?? 0), 0)} phút`,
      emoji: '⏱️',
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-1">📊 Bảng xếp hạng cá nhân</h1>
      <p className="text-sm text-slate-500 mb-4">Đối thủ lớn nhất là chính bạn của ngày hôm qua.</p>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
        {records.map((r) => (
          <div key={r.label} className="glass p-4 text-center">
            <div className="text-3xl" aria-hidden="true">{r.emoji}</div>
            <div className="text-xl font-extrabold mt-1">{r.value}</div>
            <div className="text-xs text-slate-500 font-semibold">{r.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass p-5">
          <h2 className="font-extrabold mb-3">🏆 Top ngày bùng nổ nhất</h2>
          {topDays.length === 0 ? (
            <p className="text-sm text-slate-400">Chưa có dữ liệu. AC bài đầu tiên nhé!</p>
          ) : (
            <div className="space-y-2">
              {topDays.map(([date, count], i) => (
                <div key={date} className="flex items-center gap-3">
                  <span className="w-8 text-lg">{MEDALS[i]}</span>
                  <span className="flex-1 text-sm font-semibold">{formatDateVi(date)}</span>
                  <div className="w-28 h-2.5 rounded-full bg-slate-200/80 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full" style={{ width: `${(count / (topDays[0][1] || 1)) * 100}%` }} />
                  </div>
                  <span className="w-12 text-right text-sm font-extrabold text-amber-600">{count} bài</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass p-5">
          <h2 className="font-extrabold mb-3">📅 Top tuần chăm chỉ nhất</h2>
          {topWeeks.length === 0 ? (
            <p className="text-sm text-slate-400">Chưa có dữ liệu tuần nào.</p>
          ) : (
            <div className="space-y-2">
              {topWeeks.map(([week, count], i) => (
                <div key={week} className="flex items-center gap-3">
                  <span className="w-8 text-lg">{MEDALS[i]}</span>
                  <span className="flex-1 text-sm font-semibold">Tuần {formatDateVi(week)}</span>
                  <div className="w-28 h-2.5 rounded-full bg-slate-200/80 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-sky-400 to-teal-400 rounded-full" style={{ width: `${(count / (topWeeks[0][1] || 1)) * 100}%` }} />
                  </div>
                  <span className="w-12 text-right text-sm font-extrabold text-sky-600">{count} bài</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

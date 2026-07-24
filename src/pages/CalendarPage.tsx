import { useMemo, useState } from 'react'
import QuoteBar from '../components/layout/QuoteBar'
import StreakCard from '../components/streak/StreakCard'
import { useAppStore } from '../store/useAppStore'
import { localDateKey } from '../utils/dates'

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

/** Lịch luyện tập theo tháng với cường độ màu theo số bài AC */
export default function CalendarPage() {
  const problems = useAppStore((s) => s.problems)
  const [monthOffset, setMonthOffset] = useState(0)

  const acByDate = useMemo(() => {
    const map = new Map<string, number>()
    for (const p of problems) {
      if (p.status !== 'AC') continue
      map.set(p.date, (map.get(p.date) ?? 0) + 1)
    }
    return map
  }, [problems])

  const now = new Date()
  const first = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1)
  const monthLabel = first.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()
  const startDow = (first.getDay() + 6) % 7 // 0 = Thứ 2
  const today = localDateKey()

  const cells: Array<{ key: string; day: number } | null> = [
    ...Array.from({ length: startDow }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => ({
      key: localDateKey(new Date(first.getFullYear(), first.getMonth(), i + 1)),
      day: i + 1,
    })),
  ]

  const intensity = (count: number) => {
    if (count === 0) return 'bg-white/50 text-slate-400'
    if (count === 1) return 'bg-teal-200 text-teal-800'
    if (count === 2) return 'bg-teal-400 text-white'
    return 'bg-teal-600 text-white'
  }

  const monthTotal = cells.reduce((s, c) => s + (c ? (acByDate.get(c.key) ?? 0) : 0), 0)
  const activeDays = cells.filter((c) => c && (acByDate.get(c.key) ?? 0) > 0).length

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-1">📅 Lịch luyện tập</h1>
      <p className="text-sm text-slate-500 mb-4">Mỗi ô là một ngày — càng đậm, càng nhiều bài AC.</p>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-4">
        <div className="glass p-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setMonthOffset((m) => m - 1)} className="px-3 py-1.5 rounded-xl bg-sky-100 text-sky-600 font-bold hover:bg-sky-200 transition-colors" aria-label="Tháng trước">←</button>
            <div className="font-extrabold capitalize">{monthLabel}</div>
            <button onClick={() => setMonthOffset((m) => Math.min(0, m + 1))} disabled={monthOffset >= 0} className="px-3 py-1.5 rounded-xl bg-sky-100 text-sky-600 font-bold hover:bg-sky-200 transition-colors disabled:opacity-40" aria-label="Tháng sau">→</button>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            {WEEKDAYS.map((d) => (
              <div key={d} className="text-[11px] font-extrabold text-slate-400 py-1">{d}</div>
            ))}
            {cells.map((c, i) =>
              c === null ? (
                <div key={`empty-${i}`} />
              ) : (
                <div
                  key={c.key}
                  title={`${c.key}: ${acByDate.get(c.key) ?? 0} bài AC`}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-transform hover:scale-105
                    ${intensity(acByDate.get(c.key) ?? 0)} ${c.key === today ? 'ring-2 ring-amber-400' : ''}`}
                >
                  {c.day}
                  {(acByDate.get(c.key) ?? 0) > 0 && <span className="text-[9px] leading-none">⚡{acByDate.get(c.key)}</span>}
                </div>
              ),
            )}
          </div>

          <div className="flex items-center gap-4 mt-4 text-xs text-slate-500 font-semibold">
            <span>Tháng này: <b className="text-teal-600">{monthTotal} bài AC</b></span>
            <span>Ngày hoạt động: <b className="text-teal-600">{activeDays}</b></span>
            <span className="ml-auto flex items-center gap-1">
              Ít <span className="w-3 h-3 rounded bg-white/50 border border-slate-200" /><span className="w-3 h-3 rounded bg-teal-200" /><span className="w-3 h-3 rounded bg-teal-400" /><span className="w-3 h-3 rounded bg-teal-600" /> Nhiều
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <StreakCard />
          <QuoteBar />
        </div>
      </div>
    </div>
  )
}

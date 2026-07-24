import { useMemo } from 'react'
import { MILESTONES, problemRatingColor } from '../data/milestones'
import { useAppStore } from '../store/useAppStore'
import { lastNDayKeys, weekStartKey } from '../utils/dates'

/** Trang thống kê với biểu đồ SVG tự vẽ */
export default function StatsPage() {
  const problems = useAppStore((s) => s.problems)
  const milestoneIndex = useAppStore((s) => s.milestoneIndex)
  const milestoneProgress = useAppStore((s) => s.milestoneProgress)
  const perMilestone = useAppStore((s) => s.settings.problemsPerMilestone)

  const ac = useMemo(() => problems.filter((p) => p.status === 'AC'), [problems])

  // AC theo 14 ngày gần nhất
  const dayKeys = useMemo(() => lastNDayKeys(14), [])
  const byDay = useMemo(() => {
    const map = new Map<string, number>()
    for (const p of ac) map.set(p.date, (map.get(p.date) ?? 0) + 1)
    return dayKeys.map((k) => ({ key: k, count: map.get(k) ?? 0 }))
  }, [ac, dayKeys])

  // AC theo 8 tuần gần nhất
  const byWeek = useMemo(() => {
    const map = new Map<string, number>()
    for (const p of ac) {
      const wk = weekStartKey(p.date)
      map.set(wk, (map.get(wk) ?? 0) + 1)
    }
    const weeks: Array<{ key: string; count: number }> = []
    for (let i = 7; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i * 7)
      const wk = weekStartKey(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`)
      if (!weeks.some((w) => w.key === wk)) weeks.push({ key: wk, count: map.get(wk) ?? 0 })
    }
    return weeks
  }, [ac])

  // phân bố rating
  const byRating = useMemo(() => {
    const map = new Map<number, number>()
    for (const p of ac) map.set(p.rating, (map.get(p.rating) ?? 0) + 1)
    return [...map.entries()].sort((a, b) => a[0] - b[0])
  }, [ac])

  const avgTime = ac.length
    ? Math.round(ac.reduce((s, p) => s + (p.solveTimeMinutes ?? 0), 0) / ac.filter((p) => p.solveTimeMinutes).length || 0)
    : 0
  const reviewCount = problems.filter((p) => p.needsReview).length
  const maxDay = Math.max(1, ...byDay.map((d) => d.count))
  const maxWeek = Math.max(1, ...byWeek.map((w) => w.count))
  const maxRating = Math.max(1, ...byRating.map(([, c]) => c))

  // so sánh tuần này với tuần trước để đưa ra nhận xét
  const thisWeekCount = byWeek[byWeek.length - 1]?.count ?? 0
  const lastWeekCount = byWeek[byWeek.length - 2]?.count ?? 0
  const totalMinutes = ac.reduce((s, p) => s + (p.solveTimeMinutes ?? 0), 0)
  const activeDayCount = new Set(ac.map((p) => p.date)).size

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-1">📈 Thống kê</h1>
      <p className="text-sm text-slate-500 mb-4">Bức tranh toàn cảnh quá trình luyện tập của bạn.</p>

      {/* nhận xét tự động */}
      <div className="glass p-4 mb-4 border-l-4 border-l-teal-400">
        <div className="font-extrabold text-sm mb-1">🤖 Nhận xét tự động</div>
        <p className="text-sm text-slate-600">
          {ac.length === 0 ? (
            'Chưa có dữ liệu — hãy AC bài đầu tiên để nhận phân tích nhé!'
          ) : thisWeekCount >= lastWeekCount ? (
            <>Tuần này bạn đã AC <b className="text-teal-600">{thisWeekCount} bài</b>{lastWeekCount > 0 && <> (tuần trước {lastWeekCount})</>} — đà tiến rất tốt! Thời gian giải trung bình khoảng {avgTime || '—'} phút/bài. Hãy giữ nhịp độ đều đặn để chim bay xa hơn nữa.</>
          ) : (
            <>Tuần này bạn mới AC <b className="text-amber-600">{thisWeekCount} bài</b>, ít hơn tuần trước ({lastWeekCount} bài). Đừng nản — chỉ cần mỗi ngày 1 bài là lấy lại phong độ ngay!</>
          )}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* AC theo ngày */}
        <div className="glass p-5">
          <h2 className="font-extrabold text-sm mb-3">⚡ Số bài AC — 14 ngày gần nhất</h2>
          <div className="flex items-end gap-1 h-32" role="img" aria-label="Biểu đồ số bài AC theo ngày">
            {byDay.map((d) => (
              <div key={d.key} className="flex-1 flex flex-col items-center gap-1" title={`${d.key}: ${d.count} bài`}>
                <span className="text-[9px] font-bold text-slate-500">{d.count > 0 ? d.count : ''}</span>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-sky-500 to-teal-300 transition-all"
                  style={{ height: `${(d.count / maxDay) * 88 + 4}px`, opacity: d.count === 0 ? 0.25 : 1 }}
                />
                <span className="text-[8px] text-slate-400">{d.key.slice(8)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AC theo tuần */}
        <div className="glass p-5">
          <h2 className="font-extrabold text-sm mb-3">📅 Số bài AC — 8 tuần gần nhất</h2>
          <div className="flex items-end gap-2 h-32" role="img" aria-label="Biểu đồ số bài AC theo tuần">
            {byWeek.map((w) => (
              <div key={w.key} className="flex-1 flex flex-col items-center gap-1" title={`Tuần ${w.key}: ${w.count} bài`}>
                <span className="text-[10px] font-bold text-slate-500">{w.count > 0 ? w.count : ''}</span>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-violet-500 to-fuchsia-300"
                  style={{ height: `${(w.count / maxWeek) * 88 + 4}px`, opacity: w.count === 0 ? 0.25 : 1 }}
                />
                <span className="text-[8px] text-slate-400">{w.key.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* phân bố rating */}
        <div className="glass p-5">
          <h2 className="font-extrabold text-sm mb-3">🎨 Phân bố bài theo rating</h2>
          {byRating.length === 0 ? (
            <p className="text-sm text-slate-400">Chưa có dữ liệu.</p>
          ) : (
            <div className="space-y-2">
              {byRating.map(([rating, count]) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="w-12 text-xs font-extrabold" style={{ color: problemRatingColor(rating) }}>{rating}</span>
                  <div className="flex-1 h-3.5 rounded-full bg-slate-200/70 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(count / maxRating) * 100}%`, background: problemRatingColor(rating) }} />
                  </div>
                  <span className="w-8 text-right text-xs font-bold text-slate-500">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* tiến độ milestone */}
        <div className="glass p-5">
          <h2 className="font-extrabold text-sm mb-3">🏰 Tỷ lệ hoàn thành milestone</h2>
          <div className="space-y-2">
            {MILESTONES.slice(0, -1).map((m, i) => {
              const pct = i < milestoneIndex ? 100 : i === milestoneIndex ? Math.round((milestoneProgress / perMilestone) * 100) : 0
              return (
                <div key={m.rating} className="flex items-center gap-2">
                  <span className="w-12 text-xs font-extrabold" style={{ color: m.color }}>{m.rating}</span>
                  <div className="flex-1 h-3.5 rounded-full bg-slate-200/70 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: m.color }} />
                  </div>
                  <span className="w-10 text-right text-xs font-bold text-slate-500">{pct}%</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* các con số khác */}
        <div className="glass p-5">
          <h2 className="font-extrabold text-sm mb-3">🔢 Các chỉ số khác</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-sky-50/80 p-3 text-center">
              <div className="text-2xl font-extrabold text-sky-600">{avgTime || '—'}</div>
              <div className="text-[11px] font-bold text-slate-500">phút giải trung bình</div>
            </div>
            <div className="rounded-xl bg-amber-50/80 p-3 text-center">
              <div className="text-2xl font-extrabold text-amber-600">{reviewCount}</div>
              <div className="text-[11px] font-bold text-slate-500">bài cần làm lại</div>
            </div>
            <div className="rounded-xl bg-teal-50/80 p-3 text-center">
              <div className="text-2xl font-extrabold text-teal-600">{activeDayCount}</div>
              <div className="text-[11px] font-bold text-slate-500">ngày có luyện tập</div>
            </div>
            <div className="rounded-xl bg-violet-50/80 p-3 text-center">
              <div className="text-2xl font-extrabold text-violet-600">{Math.round(totalMinutes / 60 * 10) / 10}h</div>
              <div className="text-[11px] font-bold text-slate-500">tổng giờ luyện tập</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

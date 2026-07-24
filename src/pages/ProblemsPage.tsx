import { useMemo, useState } from 'react'
import SubmitProblemModal from '../components/submit/SubmitProblemModal'
import { problemRatingColor } from '../data/milestones'
import { useAppStore } from '../store/useAppStore'
import type { Problem } from '../types'
import { formatDateVi } from '../utils/dates'

type SortKey = 'date-desc' | 'date-asc' | 'rating-desc' | 'rating-asc'

/** Trang lịch sử bài tập: tìm kiếm, lọc, sắp xếp, sửa, xóa, đánh dấu làm lại */
export default function ProblemsPage() {
  const problems = useAppStore((s) => s.problems)
  const deleteProblem = useAppStore((s) => s.deleteProblem)
  const toggleReview = useAppStore((s) => s.toggleReview)
  const pushToast = useAppStore((s) => s.pushToast)

  const [search, setSearch] = useState('')
  const [ratingFilter, setRatingFilter] = useState<number | 0>(0)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sort, setSort] = useState<SortKey>('date-desc')
  const [editing, setEditing] = useState<Problem | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Problem | null>(null)

  const filtered = useMemo(() => {
    let list = problems.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
      if (ratingFilter && p.rating !== ratingFilter) return false
      if (dateFrom && p.date < dateFrom) return false
      if (dateTo && p.date > dateTo) return false
      return true
    })
    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'date-asc': return a.date.localeCompare(b.date)
        case 'rating-desc': return b.rating - a.rating
        case 'rating-asc': return a.rating - b.rating
        default: return b.date.localeCompare(a.date) || b.createdAt - a.createdAt
      }
    })
    return list
  }, [problems, search, ratingFilter, dateFrom, dateTo, sort])

  const ratings = useMemo(() => [...new Set(problems.map((p) => p.rating))].sort((a, b) => a - b), [problems])
  const inputCls = 'rounded-xl border border-sky-200 bg-white/80 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400'

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-1">📘 Bài tập đã giải</h1>
      <p className="text-sm text-slate-500 mb-4">Toàn bộ lịch sử luyện tập của bạn — {problems.length} bài đã ghi lại.</p>

      {/* bộ lọc */}
      <div className="glass p-4 mb-4 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2">
        <input aria-label="Tìm kiếm bài" className={`${inputCls} col-span-2`} placeholder="🔍 Tìm theo tên bài..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select aria-label="Lọc theo rating" className={inputCls} value={ratingFilter} onChange={(e) => setRatingFilter(Number(e.target.value))}>
          <option value={0}>Mọi rating</option>
          {ratings.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <input aria-label="Từ ngày" type="date" className={inputCls} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        <div className="flex gap-2">
          <input aria-label="Đến ngày" type="date" className={`${inputCls} flex-1 min-w-0`} value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          <select aria-label="Sắp xếp" className={inputCls} value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            <option value="date-desc">Mới nhất</option>
            <option value="date-asc">Cũ nhất</option>
            <option value="rating-desc">Rating ↓</option>
            <option value="rating-asc">Rating ↑</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass p-10 text-center">
          <div className="text-5xl mb-3">🕊️</div>
          <div className="font-extrabold text-slate-600">Chưa có bài nào khớp bộ lọc</div>
          <div className="text-sm text-slate-400 mt-1">Nộp bài đầu tiên bằng nút "Nộp bài" để chim nhận năng lượng nhé!</div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((p) => (
            <div key={p.id} className={`glass p-4 flex flex-col md:flex-row md:items-center gap-3 ${p.needsReview ? 'ring-2 ring-amber-300' : ''}`}>
              <span
                className="shrink-0 w-14 text-center px-2 py-1.5 rounded-xl text-white text-sm font-extrabold"
                style={{ background: problemRatingColor(p.rating) }}
              >
                {p.rating}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noreferrer" className="font-extrabold text-sky-700 hover:underline">
                      {p.name} ↗
                    </a>
                  ) : (
                    <span className="font-extrabold">{p.name}</span>
                  )}
                  <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${p.status === 'AC' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                    {p.status === 'AC' ? '✅ AC' : '🔄 Chưa AC'}
                  </span>
                  {p.needsReview && <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-600">📌 Cần làm lại</span>}
                </div>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                  <span>📅 {formatDateVi(p.date)}</span>
                  {p.contestId && <span>#{p.contestId}{p.problemIndex}</span>}
                  {p.solveTimeMinutes && <span>⏱️ {p.solveTimeMinutes} phút</span>}
                  {p.submissions && <span>📨 {p.submissions} lần nộp</span>}
                </div>
                {p.note && <div className="text-xs text-slate-500 mt-1 italic">📝 {p.note}</div>}
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={() => {
                    toggleReview(p.id)
                    if (p.needsReview) pushToast({ title: 'Đã ôn xong bài! 📖', subtitle: 'Nhiệm vụ "Ôn cố tri tân" +1', tone: 'success' })
                  }}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 transition-colors"
                  title={p.needsReview ? 'Đánh dấu đã ôn xong' : 'Đánh dấu cần làm lại'}
                >
                  {p.needsReview ? '✔️ Ôn xong' : '📌 Làm lại'}
                </button>
                <button
                  onClick={() => setEditing(p)}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-sky-50 text-sky-600 border border-sky-200 hover:bg-sky-100 transition-colors"
                >
                  ✏️ Sửa
                </button>
                <button
                  onClick={() => setConfirmDelete(p)}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-500 border border-rose-200 hover:bg-rose-100 transition-colors"
                >
                  🗑️ Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* modal chỉnh sửa */}
      <SubmitProblemModal open={editing !== null} editing={editing} onClose={() => setEditing(null)} />

      {/* xác nhận xóa */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Xác nhận xóa bài">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative glass-strong p-6 max-w-sm w-full text-center">
            <div className="text-4xl mb-2">🗑️</div>
            <div className="font-extrabold">Xóa bài "{confirmDelete.name}"?</div>
            <p className="text-sm text-slate-500 mt-1">
              {confirmDelete.status === 'AC' ? 'Tiến độ milestone và tổng AC sẽ giảm tương ứng.' : 'Hành động này không thể hoàn tác.'}
            </p>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                Hủy
              </button>
              <button
                onClick={() => {
                  deleteProblem(confirmDelete.id)
                  setConfirmDelete(null)
                  pushToast({ title: 'Đã xóa bài', tone: 'info' })
                }}
                className="flex-1 py-2.5 rounded-xl font-bold text-white bg-rose-500 hover:bg-rose-600 transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { parseProblemUrl } from '../../services/codeforces'
import { useAppStore, type AddProblemResult } from '../../store/useAppStore'
import type { Problem, ProblemStatus } from '../../types'
import { localDateKey } from '../../utils/dates'

interface Props {
  open: boolean
  onClose: () => void
  /** nếu có → chế độ chỉnh sửa bài đã lưu */
  editing?: Problem | null
  onSubmitted?: (result: AddProblemResult) => void
}

interface FormState {
  url: string
  name: string
  contestId: string
  problemIndex: string
  rating: number
  status: ProblemStatus
  note: string
  solveTimeMinutes: string
  difficultyFeel: number
  date: string
}

function emptyForm(defaultRating: number): FormState {
  return {
    url: '',
    name: '',
    contestId: '',
    problemIndex: '',
    rating: defaultRating,
    status: 'AC',
    note: '',
    solveTimeMinutes: '',
    difficultyFeel: 2,
    date: localDateKey(),
  }
}

/** Modal nhập thông tin bài vừa giải */
export default function SubmitProblemModal({ open, onClose, editing, onSubmitted }: Props) {
  const addProblem = useAppStore((s) => s.addProblem)
  const updateProblem = useAppStore((s) => s.updateProblem)
  const pushToast = useAppStore((s) => s.pushToast)
  const milestoneIndex = useAppStore((s) => s.milestoneIndex)
  const defaultRating = 1200 + milestoneIndex * 200

  const [form, setForm] = useState<FormState>(() => emptyForm(defaultRating))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    setErrors({})
    setSubmitting(false)
    if (editing) {
      setForm({
        url: editing.url ?? '',
        name: editing.name,
        contestId: editing.contestId ?? '',
        problemIndex: editing.problemIndex ?? '',
        rating: editing.rating,
        status: editing.status,
        note: editing.note ?? '',
        solveTimeMinutes: editing.solveTimeMinutes ? String(editing.solveTimeMinutes) : '',
        difficultyFeel: editing.difficultyFeel ?? 2,
        date: editing.date,
      })
    } else {
      setForm(emptyForm(defaultRating))
    }
  }, [open, editing, defaultRating])

  const set = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }))

  const parseFromUrl = () => {
    const parsed = parseProblemUrl(form.url)
    if (!parsed) {
      setErrors((e) => ({ ...e, url: 'Không đọc được link. Ví dụ: https://codeforces.com/problemset/problem/1729/A' }))
      return
    }
    setErrors(({ url: _u, ...rest }) => rest)
    set({
      contestId: parsed.contestId,
      problemIndex: parsed.problemIndex,
      name: form.name || `Bài ${parsed.contestId}${parsed.problemIndex}`,
    })
    pushToast({ title: 'Đã đọc thông tin từ URL ✅', subtitle: `Contest ${parsed.contestId} · Bài ${parsed.problemIndex}`, tone: 'info' })
  }

  const validate = (): boolean => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Vui lòng nhập tên bài.'
    if (!form.rating || form.rating < 800 || form.rating > 3500) e.rating = 'Rating hợp lệ từ 800 đến 3500.'
    if (form.solveTimeMinutes && (Number(form.solveTimeMinutes) <= 0 || Number.isNaN(Number(form.solveTimeMinutes))))
      e.solveTimeMinutes = 'Thời gian giải phải là số phút dương.'
    if (!form.date) e.date = 'Vui lòng chọn ngày giải.'
    else if (form.date > localDateKey()) e.date = 'Ngày giải không thể ở tương lai.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = () => {
    if (!validate()) return
    setSubmitting(true)

    const payload = {
      name: form.name.trim(),
      url: form.url.trim() || undefined,
      contestId: form.contestId.trim() || undefined,
      problemIndex: form.problemIndex.trim() || undefined,
      rating: form.rating,
      tags: editing?.tags ?? [],
      status: form.status,
      note: form.note.trim() || undefined,
      solveTimeMinutes: form.solveTimeMinutes ? Number(form.solveTimeMinutes) : undefined,
      difficultyFeel: form.difficultyFeel,
      date: form.date,
      needsReview: editing?.needsReview ?? false,
      submissions: editing?.submissions ?? 1,
    }

    // giả lập trạng thái loading ngắn để tạo cảm giác "đang nộp"
    window.setTimeout(() => {
      if (editing) {
        updateProblem(editing.id, payload)
        pushToast({ title: 'Đã cập nhật bài ✅', tone: 'success' })
        setSubmitting(false)
        onClose()
        return
      }
      const result = addProblem(payload)
      setSubmitting(false)
      onClose()
      if (!result.ac) {
        pushToast({
          title: 'Đã lưu bài chưa AC 📝',
          subtitle: 'Cố lên! Giải lại thành công để chim nhận năng lượng nhé.',
          tone: 'info',
        })
      }
      onSubmitted?.(result)
    }, 600)
  }

  const inputCls =
    'w-full rounded-xl border border-sky-200 bg-white/80 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-400'
  const labelCls = 'block text-xs font-bold text-slate-600 mb-1'
  const errCls = 'text-[11px] text-rose-500 font-semibold mt-1'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={editing ? 'Chỉnh sửa bài' : 'Nộp bài vừa giải'}
            className="relative glass-strong w-full sm:max-w-lg max-h-[92vh] overflow-y-auto p-5 rounded-b-none sm:rounded-b-2xl"
            initial={{ y: 80, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-extrabold">{editing ? '✏️ Chỉnh sửa bài' : '⚡ Nộp bài vừa giải'}</h2>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl px-2" aria-label="Đóng">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className={labelCls} htmlFor="pf-url">Link bài Codeforces</label>
                <div className="flex gap-2">
                  <input
                    id="pf-url"
                    className={inputCls}
                    placeholder="https://codeforces.com/problemset/problem/1729/A"
                    value={form.url}
                    onChange={(e) => set({ url: e.target.value })}
                  />
                  <button
                    onClick={parseFromUrl}
                    className="shrink-0 px-3 py-2 rounded-xl bg-sky-100 text-sky-700 text-xs font-bold hover:bg-sky-200 transition-colors"
                    type="button"
                  >
                    Lấy thông tin từ URL
                  </button>
                </div>
                {errors.url && <div className={errCls}>{errors.url}</div>}
              </div>

              <div>
                <label className={labelCls} htmlFor="pf-name">Tên bài *</label>
                <input
                  id="pf-name"
                  className={inputCls}
                  placeholder="Ví dụ: Watermelon"
                  value={form.name}
                  onChange={(e) => set({ name: e.target.value })}
                />
                {errors.name && <div className={errCls}>{errors.name}</div>}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className={labelCls} htmlFor="pf-contest">Contest ID</label>
                  <input id="pf-contest" className={inputCls} placeholder="1729" value={form.contestId} onChange={(e) => set({ contestId: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="pf-index">Problem index</label>
                  <input id="pf-index" className={inputCls} placeholder="A" value={form.problemIndex} onChange={(e) => set({ problemIndex: e.target.value.toUpperCase() })} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="pf-rating">Rating *</label>
                  <select
                    id="pf-rating"
                    className={inputCls}
                    value={form.rating}
                    onChange={(e) => set({ rating: Number(e.target.value) })}
                  >
                    {Array.from({ length: 24 }, (_, i) => 800 + i * 100).map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  {errors.rating && <div className={errCls}>{errors.rating}</div>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className={labelCls}>Trạng thái</span>
                  <div className="flex gap-2" role="radiogroup" aria-label="Trạng thái bài">
                    {(['AC', 'ATTEMPT'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        role="radio"
                        aria-checked={form.status === st}
                        onClick={() => set({ status: st })}
                        className={`flex-1 py-2 rounded-xl text-sm font-extrabold border-2 transition-colors
                          ${form.status === st
                            ? st === 'AC'
                              ? 'bg-emerald-500 text-white border-emerald-500'
                              : 'bg-amber-400 text-white border-amber-400'
                            : 'bg-white/70 text-slate-500 border-slate-200'}`}
                      >
                        {st === 'AC' ? '✅ AC' : '🔄 Chưa AC'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelCls} htmlFor="pf-date">Ngày giải *</label>
                  <input id="pf-date" type="date" className={inputCls} value={form.date} max={localDateKey()} onChange={(e) => set({ date: e.target.value })} />
                  {errors.date && <div className={errCls}>{errors.date}</div>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={labelCls} htmlFor="pf-time">Thời gian giải (phút)</label>
                  <input
                    id="pf-time"
                    type="number"
                    min={1}
                    className={inputCls}
                    placeholder="30"
                    value={form.solveTimeMinutes}
                    onChange={(e) => set({ solveTimeMinutes: e.target.value })}
                  />
                  {errors.solveTimeMinutes && <div className={errCls}>{errors.solveTimeMinutes}</div>}
                </div>
                <div>
                  <span className={labelCls}>Độ khó cảm nhận</span>
                  <div className="flex gap-1 pt-1.5" role="radiogroup" aria-label="Độ khó cảm nhận">
                    {[1, 2, 3, 4, 5].map((d) => (
                      <button
                        key={d}
                        type="button"
                        role="radio"
                        aria-checked={form.difficultyFeel === d}
                        aria-label={`Độ khó ${d} trên 5`}
                        onClick={() => set({ difficultyFeel: d })}
                        className={`text-xl transition-transform hover:scale-110 ${d <= form.difficultyFeel ? '' : 'grayscale opacity-40'}`}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className={labelCls} htmlFor="pf-note">Ghi chú</label>
                <textarea
                  id="pf-note"
                  className={`${inputCls} resize-none`}
                  rows={2}
                  placeholder="Ý tưởng chính, bẫy cần nhớ..."
                  value={form.note}
                  onChange={(e) => set({ note: e.target.value })}
                />
              </div>

              <button
                onClick={submit}
                disabled={submitting}
                className="w-full py-3 rounded-2xl font-extrabold text-white text-base transition-all
                  bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-600 hover:to-teal-500
                  shadow-lg shadow-sky-300/50 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-wait"
              >
                {submitting ? '🕊️ Đang gửi năng lượng cho chim...' : editing ? 'Lưu thay đổi' : form.status === 'AC' ? '⚡ Nộp bài AC' : 'Lưu bài'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

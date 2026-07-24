import { useEffect, useMemo, useState } from 'react'
import { MILESTONES } from '../data/milestones'
import { supabase } from '../lib/supabase'
import { useAppStore } from '../store/useAppStore'
import { useAuthStore } from '../store/useAuthStore'
import { formatDateVi, weekStartKey } from '../utils/dates'

const MEDALS = ['🥇', '🥈', '🥉', '4.', '5.']

interface BoardRow {
  id: string
  name: string
  avatar_url: string | null
  total_ac: number
  milestone_index: number
  streak_current: number
  score: number
}

/** BXH toàn server (online) + kỷ lục cá nhân */
export default function LeaderboardPage() {
  const problems = useAppStore((s) => s.problems)
  const streak = useAppStore((s) => s.streak)
  const totalAC = useAppStore((s) => s.totalAC)
  const session = useAuthStore((s) => s.session)
  const [board, setBoard] = useState<BoardRow[] | null>(null)
  const [boardError, setBoardError] = useState<string | null>(null)

  useEffect(() => {
    void supabase.rpc('get_leaderboard', { p_limit: 50 }).then(({ data, error }) => {
      if (error) setBoardError(error.message)
      else setBoard((data ?? []) as BoardRow[])
    })
  }, [])

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
      <h1 className="text-2xl font-extrabold mb-1">📊 Bảng xếp hạng</h1>
      <p className="text-sm text-slate-500 mb-4">
        Xếp hạng toàn server theo điểm tổ hợp: <b className="text-violet-600">Rank×1000</b> + <b className="text-sky-600">Số bài AC×10</b> + <b className="text-orange-600">Streak×25</b>
      </p>

      {/* ===== BXH online ===== */}
      <div className="game-panel p-4 mb-6">
        <h2 className="font-extrabold mb-3 text-[#3d3222]">🌍 Toàn server</h2>
        {boardError ? (
          <p className="text-sm text-rose-500 font-semibold">Không tải được BXH: {boardError}</p>
        ) : board === null ? (
          <p className="text-sm text-[#8a7550]">Đang tải bảng xếp hạng...</p>
        ) : board.length === 0 ? (
          <p className="text-sm text-[#8a7550]">Chưa có ai trên bảng — đăng nhập và AC bài đầu tiên để ghi danh!</p>
        ) : (
          <div className="space-y-1.5">
            {board.map((r, i) => {
              const isMe = session?.user.id === r.id
              return (
                <div
                  key={r.id}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl ${isMe ? 'bg-amber-100 border-2 border-amber-400' : i % 2 === 0 ? 'bg-white/60' : ''}`}
                >
                  <span className="w-8 text-center font-extrabold">{MEDALS[i] ?? `${i + 1}.`}</span>
                  {r.avatar_url ? (
                    <img src={r.avatar_url} alt="" className="w-8 h-8 rounded-full border-2 border-amber-200" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sm">🛡️</span>
                  )}
                  <span className="flex-1 min-w-0 truncate font-extrabold text-sm text-[#3d3222]">
                    {r.name}{isMe && ' (bạn)'}
                  </span>
                  <span
                    className="hidden sm:inline px-2 py-0.5 rounded-full text-[10px] font-extrabold text-white"
                    style={{ background: MILESTONES[Math.min(r.milestone_index, MILESTONES.length - 1)].color }}
                  >
                    {MILESTONES[Math.min(r.milestone_index, MILESTONES.length - 1)].rating}
                  </span>
                  <span className="hidden md:inline text-xs font-bold text-[#8a7550] w-16 text-right">⚡ {r.total_ac}</span>
                  <span className="hidden md:inline text-xs font-bold text-[#8a7550] w-14 text-right">🔥 {r.streak_current}</span>
                  <span className="w-20 text-right font-extrabold text-violet-600">{r.score.toLocaleString()} đ</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <h2 className="font-extrabold text-lg mb-3">🏅 Kỷ lục cá nhân</h2>

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

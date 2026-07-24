import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { problemRatingColor } from '../data/milestones'
import { useAppStore } from '../store/useAppStore'
import { useAuthStore } from '../store/useAuthStore'
import type { Problem } from '../types'
import { formatDateVi } from '../utils/dates'

interface GroupRow {
  id: string
  name: string
  invite_code: string
  myRole: 'admin' | 'member'
}

interface MemberRow {
  user_id: string
  role: 'admin' | 'member'
  name: string
  avatar_url: string | null
  total_ac: number
  streak_current: number
}

interface ContestRow {
  id: string
  title: string
  description: string | null
  created_at: string
}

interface ContestProblemRow {
  id: string
  source_url: string
  name: string | null
  position: number
}

interface EntryRow {
  contest_problem_id: string
  user_id: string
  status: 'ac' | 'tried' | 'stuck'
  feeling: string | null
}

const ENTRY_STATUS: Array<{ id: EntryRow['status']; label: string; cls: string }> = [
  { id: 'ac', label: '✅ AC', cls: 'bg-emerald-500 border-emerald-600 text-white' },
  { id: 'tried', label: '🔄 Đã thử', cls: 'bg-amber-400 border-amber-500 text-white' },
  { id: 'stuck', label: '😵 Chưa làm được', cls: 'bg-slate-400 border-slate-500 text-white' },
]

const inputCls =
  'rounded-xl border-2 border-[#d8c9a3] bg-white/90 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400'

/** Trang nhóm: tạo/tham gia nhóm, theo dõi thành viên (admin), contest + cảm nhận */
export default function GroupsPage() {
  const status = useAuthStore((s) => s.status)
  const session = useAuthStore((s) => s.session)
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle)
  const pushToast = useAppStore((s) => s.pushToast)
  const uid = session?.user.id

  const [groups, setGroups] = useState<GroupRow[]>([])
  const [active, setActive] = useState<GroupRow | null>(null)
  const [tab, setTab] = useState<'members' | 'contests' | 'tracking'>('members')
  const [members, setMembers] = useState<MemberRow[]>([])
  const [contests, setContests] = useState<ContestRow[]>([])
  const [newName, setNewName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [loading, setLoading] = useState(false)

  // theo dõi thành viên (admin)
  const [trackedMember, setTrackedMember] = useState<MemberRow | null>(null)
  const [trackedProblems, setTrackedProblems] = useState<Problem[] | null>(null)

  // contest đang mở
  const [activeContest, setActiveContest] = useState<ContestRow | null>(null)
  const [contestProblems, setContestProblems] = useState<ContestProblemRow[]>([])
  const [entries, setEntries] = useState<EntryRow[]>([])
  const [showCreateContest, setShowCreateContest] = useState(false)
  const [contestTitle, setContestTitle] = useState('')
  const [contestSources, setContestSources] = useState('')

  const loadGroups = useCallback(async () => {
    if (!uid) return
    const { data, error } = await supabase
      .from('group_members')
      .select('role, groups(id, name, invite_code)')
      .eq('user_id', uid)
    if (error) {
      pushToast({ title: 'Không tải được nhóm ❌', subtitle: error.message, tone: 'error' })
      return
    }
    const rows: GroupRow[] = (data ?? [])
      .map((r) => {
        const g = r.groups as unknown as { id: string; name: string; invite_code: string } | null
        return g ? { id: g.id, name: g.name, invite_code: g.invite_code, myRole: r.role as GroupRow['myRole'] } : null
      })
      .filter((g): g is GroupRow => g !== null)
    setGroups(rows)
  }, [uid, pushToast])

  useEffect(() => {
    void loadGroups()
  }, [loadGroups])

  const openGroup = async (g: GroupRow) => {
    setActive(g)
    setTab('members')
    setTrackedMember(null)
    setActiveContest(null)
    // thành viên + hồ sơ
    const { data: mems } = await supabase
      .from('group_members')
      .select('user_id, role')
      .eq('group_id', g.id)
    const ids = (mems ?? []).map((m) => m.user_id)
    const { data: profs } = await supabase
      .from('profiles')
      .select('id, name, avatar_url, total_ac, streak_current')
      .in('id', ids)
    const profById = new Map((profs ?? []).map((p) => [p.id, p]))
    setMembers(
      (mems ?? []).map((m) => {
        const p = profById.get(m.user_id)
        return {
          user_id: m.user_id,
          role: m.role as MemberRow['role'],
          name: p?.name ?? 'Ẩn danh',
          avatar_url: p?.avatar_url ?? null,
          total_ac: p?.total_ac ?? 0,
          streak_current: p?.streak_current ?? 0,
        }
      }),
    )
    const { data: cts } = await supabase
      .from('contests')
      .select('id, title, description, created_at')
      .eq('group_id', g.id)
      .order('created_at', { ascending: false })
    setContests(cts ?? [])
  }

  const createGroup = async () => {
    if (!newName.trim()) return
    setLoading(true)
    const { error } = await supabase.rpc('create_group', { p_name: newName.trim() })
    setLoading(false)
    if (error) {
      pushToast({ title: 'Tạo nhóm thất bại ❌', subtitle: error.message, tone: 'error' })
      return
    }
    setNewName('')
    pushToast({ title: 'Đã tạo nhóm! 🎉', subtitle: 'Chia sẻ mã mời để bạn bè tham gia.', tone: 'success' })
    void loadGroups()
  }

  const joinGroup = async () => {
    if (!joinCode.trim()) return
    setLoading(true)
    const { error } = await supabase.rpc('join_group', { p_code: joinCode.trim() })
    setLoading(false)
    if (error) {
      pushToast({
        title: 'Tham gia thất bại ❌',
        subtitle: error.message.includes('invalid_code') ? 'Mã mời không đúng.' : error.message,
        tone: 'error',
      })
      return
    }
    setJoinCode('')
    pushToast({ title: 'Đã vào nhóm! 🫂', tone: 'success' })
    void loadGroups()
  }

  const trackMember = async (m: MemberRow) => {
    setTrackedMember(m)
    setTrackedProblems(null)
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .eq('user_id', m.user_id)
      .order('date', { ascending: false })
    if (error) {
      pushToast({ title: 'Không xem được bài của thành viên ❌', subtitle: error.message, tone: 'error' })
      return
    }
    setTrackedProblems(
      (data ?? []).map((r) => ({
        id: r.id,
        name: r.name,
        url: r.url ?? undefined,
        rating: r.rating,
        tags: [],
        status: r.status,
        note: r.note ?? undefined,
        solveTimeMinutes: r.solve_time_minutes ?? undefined,
        difficultyFeel: r.difficulty_feel ?? undefined,
        date: r.date,
        createdAt: 0,
        needsReview: r.needs_review,
        submissions: r.submissions ?? undefined,
      })),
    )
  }

  const createContest = async () => {
    if (!active || !contestTitle.trim() || !contestSources.trim()) return
    setLoading(true)
    const { data: contest, error } = await supabase
      .from('contests')
      .insert({ group_id: active.id, title: contestTitle.trim(), created_by: uid })
      .select('id, title, description, created_at')
      .single()
    if (error || !contest) {
      setLoading(false)
      pushToast({ title: 'Tạo contest thất bại ❌', subtitle: error?.message, tone: 'error' })
      return
    }
    const sources = contestSources.split('\n').map((s) => s.trim()).filter(Boolean)
    const rows = sources.map((src, i) => ({
      contest_id: contest.id,
      source_url: src,
      name: `Bài ${String.fromCharCode(65 + (i % 26))}`,
      position: i,
    }))
    const { error: cpErr } = await supabase.from('contest_problems').insert(rows)
    setLoading(false)
    if (cpErr) {
      pushToast({ title: 'Lỗi thêm bài vào contest ❌', subtitle: cpErr.message, tone: 'error' })
      return
    }
    setShowCreateContest(false)
    setContestTitle('')
    setContestSources('')
    setContests((c) => [contest, ...c])
    pushToast({ title: `Đã tạo contest "${contest.title}"! 🏁`, subtitle: `${rows.length} bài`, tone: 'success' })
  }

  const openContest = async (c: ContestRow) => {
    setActiveContest(c)
    const { data: cps } = await supabase
      .from('contest_problems')
      .select('id, source_url, name, position')
      .eq('contest_id', c.id)
      .order('position')
    setContestProblems(cps ?? [])
    const cpIds = (cps ?? []).map((p) => p.id)
    if (cpIds.length > 0) {
      const { data: ents } = await supabase
        .from('contest_entries')
        .select('contest_problem_id, user_id, status, feeling')
        .in('contest_problem_id', cpIds)
      setEntries((ents ?? []) as EntryRow[])
    } else {
      setEntries([])
    }
  }

  const saveEntry = async (cpId: string, statusVal: EntryRow['status'], feeling: string) => {
    if (!uid) return
    const { error } = await supabase
      .from('contest_entries')
      .upsert(
        { contest_problem_id: cpId, user_id: uid, status: statusVal, feeling: feeling.trim() || null, updated_at: new Date().toISOString() },
        { onConflict: 'contest_problem_id,user_id' },
      )
    if (error) {
      pushToast({ title: 'Lưu thất bại ❌', subtitle: error.message, tone: 'error' })
      return
    }
    setEntries((prev) => {
      const rest = prev.filter((e) => !(e.contest_problem_id === cpId && e.user_id === uid))
      return [...rest, { contest_problem_id: cpId, user_id: uid, status: statusVal, feeling: feeling.trim() || null }]
    })
    pushToast({ title: 'Đã lưu cảm nhận ✅', tone: 'success' })
  }

  // ---------- chưa đăng nhập ----------
  if (status !== 'signedIn') {
    return (
      <div className="max-w-lg mx-auto mt-10">
        <div className="game-panel p-6 text-center">
          <div className="text-5xl mb-3">🫂</div>
          <h1 className="text-xl font-extrabold text-[#3d3222]">Nhóm luyện tập</h1>
          <p className="text-sm text-[#8a7550] mt-2 mb-5">
            Tính năng nhóm cần tài khoản: cùng bạn bè lập nhóm, admin theo dõi tiến trình cả đội và tổ chức contest riêng.
          </p>
          <button
            onClick={() => void signInWithGoogle()}
            className="game-btn px-6 py-3 font-extrabold text-white bg-gradient-to-b from-sky-400 to-sky-500 border-2 border-sky-700"
          >
            Đăng nhập với Google
          </button>
        </div>
      </div>
    )
  }

  // ---------- danh sách nhóm ----------
  if (!active) {
    return (
      <div>
        <h1 className="text-2xl font-extrabold mb-1">🫂 Nhóm luyện tập</h1>
        <p className="text-sm text-slate-500 mb-4">Lập đội cùng bạn bè — admin theo dõi cả đội, tổ chức contest riêng.</p>

        <div className="grid md:grid-cols-2 gap-4 mb-5">
          <div className="game-panel p-4">
            <div className="font-extrabold text-sm text-[#3d3222] mb-2">➕ Tạo nhóm mới</div>
            <div className="flex gap-2">
              <input className={`${inputCls} flex-1`} placeholder="Tên nhóm (VD: Đội tuyển Tin 12A1)" value={newName} onChange={(e) => setNewName(e.target.value)} />
              <button onClick={() => void createGroup()} disabled={loading || !newName.trim()} className="game-btn px-4 font-extrabold text-white bg-gradient-to-b from-teal-400 to-teal-500 border-2 border-teal-700 disabled:opacity-50">
                Tạo
              </button>
            </div>
            <p className="text-[11px] text-[#8a7550] mt-2">Bạn sẽ là admin của nhóm mình tạo.</p>
          </div>
          <div className="game-panel p-4">
            <div className="font-extrabold text-sm text-[#3d3222] mb-2">🔑 Tham gia bằng mã mời</div>
            <div className="flex gap-2">
              <input className={`${inputCls} flex-1`} placeholder="Nhập mã 8 ký tự" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} />
              <button onClick={() => void joinGroup()} disabled={loading || !joinCode.trim()} className="game-btn px-4 font-extrabold text-white bg-gradient-to-b from-sky-400 to-sky-500 border-2 border-sky-700 disabled:opacity-50">
                Vào
              </button>
            </div>
            <p className="text-[11px] text-[#8a7550] mt-2">Xin mã mời từ admin của nhóm.</p>
          </div>
        </div>

        {groups.length === 0 ? (
          <div className="game-panel p-8 text-center text-sm text-[#8a7550]">
            Bạn chưa ở trong nhóm nào. Tạo nhóm mới hoặc nhập mã mời để bắt đầu!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            {groups.map((g) => (
              <button key={g.id} onClick={() => void openGroup(g)} className="game-panel p-4 text-left hover:brightness-105 transition-all">
                <div className="font-extrabold text-[#3d3222] flex items-center gap-2">
                  🏕️ {g.name}
                  {g.myRole === 'admin' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-600 border border-rose-300 font-extrabold">ADMIN</span>
                  )}
                </div>
                <div className="text-xs text-[#8a7550] mt-1">Mã mời: <b className="font-mono">{g.invite_code}</b></div>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  const isAdmin = active.myRole === 'admin'

  // ---------- chi tiết contest ----------
  if (activeContest) {
    const myEntry = (cpId: string) => entries.find((e) => e.contest_problem_id === cpId && e.user_id === uid)
    return (
      <div>
        <button onClick={() => setActiveContest(null)} className="text-sm font-bold text-sky-600 hover:underline mb-2">← Quay lại {active.name}</button>
        <h1 className="text-2xl font-extrabold mb-1">🏁 {activeContest.title}</h1>
        <p className="text-sm text-slate-500 mb-4">Mở link, làm bài rồi ghi lại cảm nhận — kể cả khi chưa làm được.</p>

        <div className="space-y-4">
          {contestProblems.map((cp) => {
            const mine = myEntry(cp.id)
            return (
              <ContestProblemCard
                key={cp.id}
                cp={cp}
                mine={mine}
                onSave={saveEntry}
                isAdmin={isAdmin}
                allEntries={entries.filter((e) => e.contest_problem_id === cp.id)}
                members={members}
                uid={uid!}
              />
            )
          })}
          {contestProblems.length === 0 && (
            <div className="game-panel p-8 text-center text-sm text-[#8a7550]">Contest chưa có bài nào.</div>
          )}
        </div>
      </div>
    )
  }

  // ---------- chi tiết nhóm ----------
  return (
    <div>
      <button onClick={() => setActive(null)} className="text-sm font-bold text-sky-600 hover:underline mb-2">← Tất cả nhóm</button>
      <div className="flex items-center gap-3 flex-wrap mb-1">
        <h1 className="text-2xl font-extrabold">🏕️ {active.name}</h1>
        {isAdmin && <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 border border-rose-300 font-extrabold">ADMIN</span>}
      </div>
      <p className="text-sm text-slate-500 mb-4">
        Mã mời: <b className="font-mono bg-white/70 px-2 py-0.5 rounded-lg border border-slate-200">{active.invite_code}</b>
        <button
          onClick={() => { void navigator.clipboard.writeText(active.invite_code); pushToast({ title: 'Đã copy mã mời 📋', tone: 'info' }) }}
          className="ml-2 text-sky-600 font-bold hover:underline"
        >
          Copy
        </button>
      </p>

      <div className="flex gap-2 mb-4">
        {([['members', '👥 Thành viên'], ['contests', '🏁 Contest'], ...(isAdmin ? [['tracking', '🔍 Theo dõi']] : [])] as Array<[typeof tab, string]>).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`game-btn px-4 py-2 text-sm font-extrabold border-2
              ${tab === id ? 'bg-gradient-to-b from-sky-400 to-sky-500 border-sky-700 text-white' : 'bg-[#fdf6e3] border-[#d8c9a3] text-[#5c4d33]'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'members' && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {members.map((m) => (
            <div key={m.user_id} className="game-panel p-3 flex items-center gap-3">
              {m.avatar_url ? (
                <img src={m.avatar_url} alt="" className="w-11 h-11 rounded-full border-2 border-amber-300" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-11 h-11 rounded-full bg-sky-100 flex items-center justify-center text-xl">🐦</div>
              )}
              <div className="min-w-0 flex-1">
                <div className="font-extrabold text-sm text-[#3d3222] truncate flex items-center gap-1.5">
                  {m.name}
                  {m.role === 'admin' && <span aria-label="admin">👑</span>}
                </div>
                <div className="text-[11px] text-[#8a7550] font-semibold">⚡ {m.total_ac} AC · 🔥 {m.streak_current} ngày</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'contests' && (
        <div>
          {isAdmin && (
            <div className="mb-4">
              {showCreateContest ? (
                <div className="game-panel p-4">
                  <div className="font-extrabold text-sm text-[#3d3222] mb-2">🏁 Tạo contest mới</div>
                  <input className={`${inputCls} w-full mb-2`} placeholder="Tên contest (VD: Luyện DP tuần 1)" value={contestTitle} onChange={(e) => setContestTitle(e.target.value)} />
                  <textarea
                    className={`${inputCls} w-full resize-none font-mono text-xs`}
                    rows={5}
                    placeholder={'Dán nguồn bài, mỗi dòng một link:\nhttps://codeforces.com/problemset/problem/1729/A\nhttps://codeforces.com/problemset/problem/4/A'}
                    value={contestSources}
                    onChange={(e) => setContestSources(e.target.value)}
                  />
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => void createContest()} disabled={loading} className="game-btn px-4 py-2 font-extrabold text-white bg-gradient-to-b from-amber-400 to-orange-500 border-2 border-amber-700 disabled:opacity-50">
                      Tạo contest
                    </button>
                    <button onClick={() => setShowCreateContest(false)} className="game-btn px-4 py-2 font-extrabold text-[#5c4d33] bg-[#fdf6e3] border-2 border-[#d8c9a3]">
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowCreateContest(true)} className="game-btn px-4 py-2.5 font-extrabold text-white bg-gradient-to-b from-amber-400 to-orange-500 border-2 border-amber-700">
                  ➕ Tạo contest
                </button>
              )}
            </div>
          )}
          {contests.length === 0 ? (
            <div className="game-panel p-8 text-center text-sm text-[#8a7550]">Chưa có contest nào{isAdmin ? ' — tạo contest đầu tiên cho nhóm nhé!' : '.'}</div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
              {contests.map((c) => (
                <button key={c.id} onClick={() => void openContest(c)} className="game-panel p-4 text-left hover:brightness-105 transition-all">
                  <div className="font-extrabold text-[#3d3222]">🏁 {c.title}</div>
                  <div className="text-[11px] text-[#8a7550] mt-1">{formatDateVi(c.created_at.slice(0, 10))}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'tracking' && isAdmin && (
        <div>
          {!trackedMember ? (
            <div>
              <p className="text-sm text-[#8a7550] font-medium mb-3">Chọn thành viên để xem toàn bộ bài đã làm và ghi chú kiến thức của họ:</p>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
                {members.map((m) => (
                  <button key={m.user_id} onClick={() => void trackMember(m)} className="game-panel p-3 flex items-center gap-3 text-left hover:brightness-105">
                    <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-lg">🔍</div>
                    <div>
                      <div className="font-extrabold text-sm text-[#3d3222]">{m.name}</div>
                      <div className="text-[11px] text-[#8a7550]">⚡ {m.total_ac} AC</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <button onClick={() => setTrackedMember(null)} className="text-sm font-bold text-sky-600 hover:underline mb-3">← Chọn thành viên khác</button>
              <h2 className="font-extrabold text-lg mb-3">📖 Bài tập của {trackedMember.name}</h2>
              {trackedProblems === null ? (
                <div className="game-panel p-6 text-center text-sm text-[#8a7550]">Đang tải...</div>
              ) : trackedProblems.length === 0 ? (
                <div className="game-panel p-6 text-center text-sm text-[#8a7550]">Thành viên này chưa ghi lại bài nào.</div>
              ) : (
                <div className="space-y-2">
                  {trackedProblems.map((p) => (
                    <div key={p.id} className="game-panel p-3 flex flex-col md:flex-row md:items-center gap-2">
                      <span className="shrink-0 w-14 text-center px-2 py-1 rounded-xl text-white text-sm font-extrabold" style={{ background: problemRatingColor(p.rating) }}>
                        {p.rating}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {p.url ? (
                            <a href={p.url} target="_blank" rel="noreferrer" className="font-extrabold text-sky-700 hover:underline text-sm">{p.name} ↗</a>
                          ) : (
                            <span className="font-extrabold text-sm">{p.name}</span>
                          )}
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${p.status === 'AC' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                            {p.status === 'AC' ? 'AC' : 'Chưa AC'}
                          </span>
                          <span className="text-[11px] text-[#8a7550]">📅 {formatDateVi(p.date)}</span>
                        </div>
                        {p.note && <div className="text-xs text-[#5c4d33] mt-1 italic bg-white/60 rounded-lg px-2 py-1">📝 {p.note}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/** thẻ một bài trong contest: entry của tôi + (admin) bảng cảm nhận cả nhóm */
function ContestProblemCard({
  cp, mine, onSave, isAdmin, allEntries, members, uid,
}: {
  cp: ContestProblemRow
  mine: EntryRow | undefined
  onSave: (cpId: string, status: EntryRow['status'], feeling: string) => Promise<void>
  isAdmin: boolean
  allEntries: EntryRow[]
  members: MemberRow[]
  uid: string
}) {
  const [statusVal, setStatusVal] = useState<EntryRow['status']>(mine?.status ?? 'stuck')
  const [feeling, setFeeling] = useState(mine?.feeling ?? '')
  const [showAll, setShowAll] = useState(false)
  const nameOf = (id: string) => members.find((m) => m.user_id === id)?.name ?? 'Ẩn danh'

  return (
    <div className="game-panel p-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-extrabold text-[#3d3222]">{cp.name ?? 'Bài tập'}</span>
        <a href={cp.source_url} target="_blank" rel="noreferrer" className="text-sm font-bold text-sky-600 hover:underline break-all">
          {cp.source_url} ↗
        </a>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {ENTRY_STATUS.map((st) => (
          <button
            key={st.id}
            onClick={() => setStatusVal(st.id)}
            className={`game-btn px-3 py-1.5 text-xs font-extrabold border-2 ${statusVal === st.id ? st.cls : 'bg-white/80 border-[#d8c9a3] text-[#5c4d33]'}`}
          >
            {st.label}
          </button>
        ))}
      </div>

      <div className="mt-2 flex gap-2">
        <input
          className={`${inputCls} flex-1`}
          placeholder="Cảm nhận của bạn: ý tưởng, chỗ mắc kẹt, bài học rút ra..."
          value={feeling}
          onChange={(e) => setFeeling(e.target.value)}
        />
        <button
          onClick={() => void onSave(cp.id, statusVal, feeling)}
          className="game-btn px-4 font-extrabold text-white bg-gradient-to-b from-teal-400 to-teal-500 border-2 border-teal-700"
        >
          Lưu
        </button>
      </div>

      {isAdmin && (
        <div className="mt-3">
          <button onClick={() => setShowAll((v) => !v)} className="text-xs font-extrabold text-sky-600 hover:underline">
            {showAll ? '▲ Ẩn cảm nhận cả nhóm' : `▼ Xem cảm nhận cả nhóm (${allEntries.length})`}
          </button>
          {showAll && (
            <div className="mt-2 space-y-1.5">
              {allEntries.length === 0 && <div className="text-xs text-[#8a7550]">Chưa ai ghi cảm nhận.</div>}
              {allEntries.map((e) => (
                <div key={e.user_id} className="game-inset px-3 py-2 text-xs flex items-start gap-2">
                  <span className="font-extrabold text-[#3d3222] whitespace-nowrap">
                    {nameOf(e.user_id)}{e.user_id === uid && ' (bạn)'}:
                  </span>
                  <span className="font-bold">
                    {e.status === 'ac' ? '✅' : e.status === 'tried' ? '🔄' : '😵'}
                  </span>
                  <span className="text-[#5c4d33]">{e.feeling ?? '—'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

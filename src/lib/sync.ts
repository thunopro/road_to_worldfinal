import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { useAppStore } from '../store/useAppStore'
import type { Problem } from '../types'
import type { RemoteProfile } from '../store/useAuthStore'
import { addDays, localDateKey } from '../utils/dates'
import { playChime } from '../utils/sound'

/**
 * Đồng bộ 2 chiều với Supabase:
 * - LocalStorage vẫn là cache tức thời → web mượt như game offline
 * - Mọi thay đổi được đẩy lên cloud (debounce) → mở máy khác là có tiến trình
 */

let unsubscribe: (() => void) | null = null
let pushTimer: number | null = null
let prevProblems: Problem[] = []
let syncUserId: string | null = null

/** phần thưởng điểm danh 7 ngày, lặp lại theo chu kỳ */
export const LOGIN_REWARDS = [20, 30, 40, 60, 80, 100, 150]

interface ProfileRow {
  id: string
  name: string
  avatar_url: string | null
  role: 'user' | 'admin'
  coins: number
  badges: string[]
  total_ac: number
  milestone_index: number
  milestone_progress: number
  streak_current: number
  streak_longest: number
  last_active_date: string | null
  quest_claims: Record<string, boolean>
  reviewed_dates: string[]
  collection: { owned: string[]; equipped: Record<string, string> } | Record<string, never>
  settings: Record<string, unknown>
  login_reward_day: number
  last_reward_date: string | null
  story_progress: number
  inventory: string[]
  equipment: Record<string, string>
}

function stateToProfilePatch() {
  const s = useAppStore.getState()
  return {
    name: s.user.name,
    coins: s.user.coins,
    badges: s.user.badges,
    total_ac: s.totalAC,
    milestone_index: s.milestoneIndex,
    milestone_progress: s.milestoneProgress,
    streak_current: s.streak.current,
    streak_longest: s.streak.longest,
    last_active_date: s.streak.lastActiveDate,
    quest_claims: s.questClaims,
    reviewed_dates: s.reviewedDates,
    collection: s.collection,
    settings: s.settings,
    story_progress: s.storyProgress,
    inventory: s.inventory,
    equipment: s.equipment,
    updated_at: new Date().toISOString(),
  }
}

function problemToRow(p: Problem, userId: string) {
  return {
    id: p.id,
    user_id: userId,
    name: p.name,
    url: p.url ?? null,
    contest_id: p.contestId ?? null,
    problem_index: p.problemIndex ?? null,
    rating: p.rating,
    tags: p.tags,
    status: p.status,
    note: p.note ?? null,
    solve_time_minutes: p.solveTimeMinutes ?? null,
    difficulty_feel: p.difficultyFeel ?? null,
    date: p.date,
    needs_review: p.needsReview ?? false,
    submissions: p.submissions ?? null,
  }
}

function rowToProblem(r: Record<string, unknown>): Problem {
  return {
    id: String(r.id),
    name: String(r.name),
    url: (r.url as string) ?? undefined,
    contestId: (r.contest_id as string) ?? undefined,
    problemIndex: (r.problem_index as string) ?? undefined,
    rating: Number(r.rating),
    tags: (r.tags as string[]) ?? [],
    status: r.status as Problem['status'],
    note: (r.note as string) ?? undefined,
    solveTimeMinutes: (r.solve_time_minutes as number) ?? undefined,
    difficultyFeel: (r.difficulty_feel as number) ?? undefined,
    date: String(r.date),
    createdAt: new Date(String(r.created_at)).getTime(),
    needsReview: Boolean(r.needs_review),
    submissions: (r.submissions as number) ?? undefined,
  }
}

/** đẩy các thay đổi bài tập lên cloud bằng cách so sánh danh sách cũ/mới */
async function pushProblemDiff(userId: string, next: Problem[]) {
  const prevById = new Map(prevProblems.map((p) => [p.id, p]))
  const nextById = new Map(next.map((p) => [p.id, p]))

  const upserts = next.filter((p) => prevById.get(p.id) !== p).map((p) => problemToRow(p, userId))
  const deletedIds = prevProblems.filter((p) => !nextById.has(p.id)).map((p) => p.id)
  prevProblems = next

  if (upserts.length > 0) {
    const { error } = await supabase.from('problems').upsert(upserts)
    if (error) console.error('sync problems upsert:', error.message)
  }
  if (deletedIds.length > 0) {
    const { error } = await supabase.from('problems').delete().in('id', deletedIds)
    if (error) console.error('sync problems delete:', error.message)
  }
}

function schedulePush() {
  if (!syncUserId) return
  if (pushTimer) window.clearTimeout(pushTimer)
  pushTimer = window.setTimeout(async () => {
    const userId = syncUserId
    if (!userId) return
    await pushProblemDiff(userId, useAppStore.getState().problems)
    const { error } = await supabase.from('profiles').update(stateToProfilePatch()).eq('id', userId)
    if (error) console.error('sync profile:', error.message)
  }, 1200)
}

/** quà điểm danh hằng ngày — chuỗi đăng nhập liên tiếp cho quà tăng dần */
async function grantDailyReward(row: ProfileRow): Promise<{ day: number; date: string } | null> {
  const today = localDateKey()
  if (row.last_reward_date === today) return null

  const consecutive = row.last_reward_date === addDays(today, -1)
  const day = consecutive ? (row.login_reward_day % LOGIN_REWARDS.length) + 1 : 1
  const coins = LOGIN_REWARDS[day - 1]

  const s = useAppStore.getState()
  useAppStore.setState({ user: { ...s.user, coins: s.user.coins + coins } })
  s.pushToast({
    title: `Quà điểm danh ngày ${day}: +${coins} xu! 🎁`,
    subtitle: day < LOGIN_REWARDS.length
      ? `Ngày mai quay lại để nhận ${LOGIN_REWARDS[day % LOGIN_REWARDS.length]} xu nhé!`
      : 'Chuỗi điểm danh trọn vẹn! Chu kỳ mới bắt đầu từ ngày mai.',
    tone: 'success',
  })
  playChime(s.settings.soundOn)
  return { day, date: today }
}

/**
 * Nạp dữ liệu từ cloud khi đăng nhập.
 * Lần đầu (chưa có profile) → đẩy dữ liệu local lên cloud (giữ nguyên tiến trình đang chơi).
 * Các lần sau → cloud là nguồn chân lý.
 */
export async function hydrateFromRemote(session: Session): Promise<RemoteProfile | null> {
  const userId = session.user.id
  if (syncUserId === userId) return null // đã đồng bộ rồi (onAuthStateChange bắn nhiều lần)
  stopSync()

  const { data: row, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle<ProfileRow>()

  if (error) {
    useAppStore.getState().pushToast({
      title: 'Không tải được dữ liệu cloud ❌',
      subtitle: error.message,
      tone: 'error',
    })
    return null
  }

  const meta = session.user.user_metadata as Record<string, string | undefined>
  const displayName = meta.full_name || meta.name || useAppStore.getState().user.name

  let profileRow: ProfileRow

  if (!row) {
    // người dùng mới: chuyển toàn bộ tiến trình local lên cloud
    const s = useAppStore.getState()
    const insert = {
      id: userId,
      avatar_url: meta.avatar_url ?? meta.picture ?? null,
      role: 'user' as const,
      login_reward_day: 0,
      last_reward_date: null,
      ...stateToProfilePatch(),
      name: displayName,
    }
    const { data: created, error: insErr } = await supabase
      .from('profiles')
      .insert(insert)
      .select('*')
      .single<ProfileRow>()
    if (insErr || !created) {
      console.error('create profile:', insErr?.message)
      return null
    }
    profileRow = created
    useAppStore.setState({ user: { ...s.user, name: displayName } })
    // đẩy các bài local lên cloud
    const rows = s.problems.map((p) => problemToRow(p, userId))
    if (rows.length > 0) await supabase.from('problems').upsert(rows)
    prevProblems = s.problems
  } else {
    profileRow = row
    // cloud là nguồn chân lý
    const { data: problemRows } = await supabase
      .from('problems')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })

    const problems = (problemRows ?? []).map(rowToProblem)
    prevProblems = problems
    const s = useAppStore.getState()
    useAppStore.setState({
      user: { name: row.name, coins: row.coins, badges: row.badges ?? [] },
      totalAC: row.total_ac,
      milestoneIndex: row.milestone_index,
      milestoneProgress: row.milestone_progress,
      streak: {
        current: row.streak_current,
        longest: row.streak_longest,
        lastActiveDate: row.last_active_date,
      },
      questClaims: row.quest_claims ?? {},
      reviewedDates: row.reviewed_dates ?? [],
      collection:
        row.collection && 'owned' in row.collection
          ? (row.collection as { owned: string[]; equipped: Record<string, string> })
          : s.collection,
      settings: { ...s.settings, ...(row.settings as object) },
      storyProgress: row.story_progress ?? 0,
      inventory: row.inventory ?? [],
      equipment: row.equipment ?? {},
      problems,
    })
    useAppStore.getState().checkStreakOnLoad()
  }

  // quà điểm danh
  const reward = await grantDailyReward(profileRow)
  if (reward) {
    profileRow = { ...profileRow, login_reward_day: reward.day, last_reward_date: reward.date }
    await supabase
      .from('profiles')
      .update({
        login_reward_day: reward.day,
        last_reward_date: reward.date,
        coins: useAppStore.getState().user.coins,
      })
      .eq('id', userId)
  }

  // bắt đầu theo dõi thay đổi để đẩy lên cloud
  syncUserId = userId
  unsubscribe = useAppStore.subscribe(schedulePush)

  return {
    id: profileRow.id,
    name: profileRow.name,
    avatar_url: profileRow.avatar_url,
    role: profileRow.role,
    login_reward_day: profileRow.login_reward_day,
    last_reward_date: profileRow.last_reward_date,
  }
}

export function stopSync() {
  unsubscribe?.()
  unsubscribe = null
  if (pushTimer) window.clearTimeout(pushTimer)
  pushTimer = null
  syncUserId = null
  prevProblems = []
}

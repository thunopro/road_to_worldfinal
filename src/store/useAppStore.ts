import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CelebrationPhase, Problem, ToastItem } from '../types'
import { MILESTONES, FINAL_UNLOCK_COINS, MILESTONE_UNLOCK_COINS } from '../data/milestones'
import { DEFAULT_EQUIPPED, DEFAULT_OWNED, itemById } from '../data/shop'
import { gearById } from '../data/equipment'
import { daysBetween, localDateKey } from '../utils/dates'

export interface StreakState {
  current: number
  longest: number
  lastActiveDate: string | null
}

export interface SettingsState {
  soundOn: boolean
  reducedMotion: boolean
  problemsPerMilestone: number
}

export interface UserState {
  name: string
  coins: number
  badges: string[]
}

export interface AddProblemResult {
  ac: boolean
  unlockedRating: number | null
}

interface AppState {
  user: UserState
  problems: Problem[]
  /** 0 = đang ở tháp 1200, hướng tới 1400 */
  milestoneIndex: number
  /** số bài AC trong milestone hiện tại */
  milestoneProgress: number
  totalAC: number
  streak: StreakState
  questClaims: Record<string, boolean>
  /** các ngày người dùng hoàn thành ôn lại 1 bài (phục vụ nhiệm vụ hằng ngày) */
  reviewedDates: string[]
  collection: { owned: string[]; equipped: Record<string, string> }
  settings: SettingsState
  /** chương hiện tại của kịch bản chính (đã hoàn thành các chương < giá trị này) */
  storyProgress: number
  /** kho đồ: id trang bị + học liệu đã sở hữu */
  inventory: string[]
  /** trang bị đang mặc theo slot */
  equipment: Record<string, string>

  // ---- transient (không persist) ----
  phase: CelebrationPhase
  pendingUnlock: number | null
  toasts: ToastItem[]
  submitOpen: boolean

  // ---- actions ----
  addProblem: (p: Omit<Problem, 'id' | 'createdAt'>) => AddProblemResult
  updateProblem: (id: string, patch: Partial<Problem>) => void
  deleteProblem: (id: string) => void
  toggleReview: (id: string) => void
  claimQuest: (claimKey: string, reward: number) => void
  buyItem: (itemId: string) => boolean
  equipItem: (itemId: string) => void
  setSettings: (patch: Partial<SettingsState>) => void
  setUserName: (name: string) => void
  /** hoàn thành chương kịch bản: nhận xu + có thể rơi đồ */
  advanceStory: (rewardCoins: number, droppedGearId: string | null) => void
  /** mặc trang bị từ kho đồ */
  equipGear: (gearId: string) => void
  /** mua học liệu bằng xu, trả về false nếu không đủ */
  buyMaterial: (materialId: string, price: number) => boolean
  setPhase: (phase: CelebrationPhase) => void
  setSubmitOpen: (open: boolean) => void
  clearPendingUnlock: () => void
  pushToast: (t: Omit<ToastItem, 'id'>) => void
  dismissToast: (id: number) => void
  checkStreakOnLoad: () => void
  resetAll: () => void
}

let toastSeq = 1

/** vật phẩm được tặng kèm khi mở khóa milestone (level up cho chim) */
export const MILESTONE_ITEM_REWARDS: Record<number, string> = {
  1400: 'scarf-teal',
  1800: 'wing-rose',
  2000: 'goggles-gold',
  2200: 'trail-fire',
  2400: 'hat-crown',
}

/**
 * Trải nghiệm như game offline: ai cũng bắt đầu từ con số 0
 * và tự cày lên qua nhiệm vụ, kịch bản, rank.
 */
function seedState() {
  return {
    user: { name: 'Tân Kiếm Sĩ', coins: 0, badges: [] as string[] },
    problems: [],
    milestoneIndex: 0,
    milestoneProgress: 0,
    totalAC: 0,
    streak: { current: 0, longest: 0, lastActiveDate: null as string | null },
    questClaims: {},
    reviewedDates: [],
    collection: { owned: [...DEFAULT_OWNED], equipped: { ...DEFAULT_EQUIPPED } },
    settings: { soundOn: true, reducedMotion: false, problemsPerMilestone: 100 },
    storyProgress: 0,
    inventory: [] as string[],
    equipment: {} as Record<string, string>,
  }
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...seedState(),
      phase: 'none' as CelebrationPhase,
      pendingUnlock: null,
      toasts: [],
      submitOpen: false,

      addProblem: (input) => {
        const p: Problem = {
          ...input,
          id: (globalThis.crypto?.randomUUID?.() ?? `p-${Date.now()}-${Math.floor(Math.random() * 1e6)}`),
          createdAt: Date.now(),
        }
        const s = get()
        let unlockedRating: number | null = null

        if (p.status !== 'AC') {
          set({ problems: [p, ...s.problems] })
          return { ac: false, unlockedRating: null }
        }

        // cập nhật streak nếu bài được giải hôm nay
        const today = localDateKey()
        let streak = { ...s.streak }
        if (p.date === today && streak.lastActiveDate !== today) {
          const gap = streak.lastActiveDate ? daysBetween(streak.lastActiveDate, today) : Infinity
          streak.current = gap === 1 ? streak.current + 1 : 1
          streak.lastActiveDate = today
          streak.longest = Math.max(streak.longest, streak.current)
        }

        // xu thưởng: 10 cơ bản + thưởng theo độ khó cảm nhận
        const coinGain = 10 + (p.difficultyFeel ?? 2) * 2
        let coins = s.user.coins + coinGain
        let badges = s.user.badges
        let milestoneIndex = s.milestoneIndex
        let milestoneProgress = s.milestoneProgress + 1
        let owned = s.collection.owned

        if (
          milestoneProgress >= s.settings.problemsPerMilestone &&
          milestoneIndex < MILESTONES.length - 1
        ) {
          milestoneIndex += 1
          milestoneProgress = 0
          unlockedRating = MILESTONES[milestoneIndex].rating
          const isFinal = milestoneIndex === MILESTONES.length - 1
          coins += isFinal ? FINAL_UNLOCK_COINS : MILESTONE_UNLOCK_COINS
          badges = [...badges, `milestone-${unlockedRating}`]
          const rewardItem = MILESTONE_ITEM_REWARDS[unlockedRating]
          if (rewardItem && !owned.includes(rewardItem)) owned = [...owned, rewardItem]
        }

        set({
          problems: [p, ...s.problems],
          totalAC: s.totalAC + 1,
          streak,
          milestoneIndex,
          milestoneProgress,
          user: { ...s.user, coins, badges },
          collection: { ...s.collection, owned },
          pendingUnlock: unlockedRating,
        })
        return { ac: true, unlockedRating }
      },

      updateProblem: (id, patch) =>
        set((s) => ({
          problems: s.problems.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),

      deleteProblem: (id) => {
        const s = get()
        const target = s.problems.find((p) => p.id === id)
        if (!target) return
        const wasAC = target.status === 'AC'
        set({
          problems: s.problems.filter((p) => p.id !== id),
          totalAC: wasAC ? Math.max(0, s.totalAC - 1) : s.totalAC,
          milestoneProgress: wasAC ? Math.max(0, s.milestoneProgress - 1) : s.milestoneProgress,
        })
      },

      toggleReview: (id) => {
        const s = get()
        const target = s.problems.find((p) => p.id === id)
        if (!target) return
        const finishing = target.needsReview === true
        set({
          problems: s.problems.map((p) => (p.id === id ? { ...p, needsReview: !p.needsReview } : p)),
          // bỏ đánh dấu "làm lại" = đã ôn xong 1 bài hôm nay
          reviewedDates: finishing ? [...s.reviewedDates, localDateKey()] : s.reviewedDates,
        })
      },

      claimQuest: (claimKey, reward) => {
        const s = get()
        if (s.questClaims[claimKey]) return
        set({
          questClaims: { ...s.questClaims, [claimKey]: true },
          user: { ...s.user, coins: s.user.coins + reward },
        })
      },

      buyItem: (itemId) => {
        const s = get()
        const item = itemById(itemId)
        if (!item) return false
        if (s.collection.owned.includes(itemId) || s.user.coins < item.price) return false
        set({
          user: { ...s.user, coins: s.user.coins - item.price },
          collection: { ...s.collection, owned: [...s.collection.owned, itemId] },
        })
        return true
      },

      equipItem: (itemId) => {
        const s = get()
        const item = itemById(itemId)
        if (!item || !s.collection.owned.includes(itemId)) return
        set({
          collection: {
            ...s.collection,
            equipped: { ...s.collection.equipped, [item.slot]: itemId },
          },
        })
      },

      setSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      setUserName: (name) => set((s) => ({ user: { ...s.user, name: name.trim() || 'Tân Kiếm Sĩ' } })),

      advanceStory: (rewardCoins, droppedGearId) =>
        set((s) => ({
          storyProgress: s.storyProgress + 1,
          user: { ...s.user, coins: s.user.coins + rewardCoins },
          inventory:
            droppedGearId && !s.inventory.includes(droppedGearId)
              ? [...s.inventory, droppedGearId]
              : s.inventory,
        })),

      equipGear: (gearId) => {
        const s = get()
        const gear = gearById(gearId)
        if (!gear || !s.inventory.includes(gearId)) return
        set({ equipment: { ...s.equipment, [gear.slot]: gearId } })
      },

      buyMaterial: (materialId, price) => {
        const s = get()
        if (s.inventory.includes(materialId) || s.user.coins < price) return false
        set({
          user: { ...s.user, coins: s.user.coins - price },
          inventory: [...s.inventory, materialId],
        })
        return true
      },
      setPhase: (phase) => set({ phase }),
      setSubmitOpen: (submitOpen) => set({ submitOpen }),
      clearPendingUnlock: () => set({ pendingUnlock: null }),

      pushToast: (t) => {
        const id = toastSeq++
        set((s) => ({ toasts: [...s.toasts, { ...t, id }] }))
        setTimeout(() => get().dismissToast(id), 4500)
      },
      dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      /** kiểm tra streak khi mở app: nghỉ quá 1 ngày là mất chuỗi */
      checkStreakOnLoad: () => {
        const s = get()
        const { lastActiveDate, current } = s.streak
        if (!lastActiveDate || current === 0) return
        const gap = daysBetween(lastActiveDate, localDateKey())
        if (gap <= 1) return
        set({ streak: { ...s.streak, current: 0 } })
        get().pushToast({
          title: 'Chuỗi ngày đã bị mất 💔',
          subtitle: 'Không sao cả! AC một bài hôm nay để nhóm lại ngọn lửa nhé.',
          tone: 'warn',
        })
      },

      resetAll: () => set({ ...seedState(), phase: 'none', pendingUnlock: null }),
    }),
    {
      name: 'hanh-on-tri-vien-code',
      partialize: (s) => ({
        user: s.user,
        problems: s.problems,
        milestoneIndex: s.milestoneIndex,
        milestoneProgress: s.milestoneProgress,
        totalAC: s.totalAC,
        streak: s.streak,
        questClaims: s.questClaims,
        reviewedDates: s.reviewedDates,
        collection: s.collection,
        settings: s.settings,
        storyProgress: s.storyProgress,
        inventory: s.inventory,
        equipment: s.equipment,
      }),
    },
  ),
)

// ---------- selectors / helpers ----------

export function currentRating(milestoneIndex: number): number {
  return MILESTONES[milestoneIndex].rating
}

export function nextRating(milestoneIndex: number): number | null {
  return milestoneIndex < MILESTONES.length - 1 ? MILESTONES[milestoneIndex + 1].rating : null
}

/** vị trí chim trên toàn hành trình: milestoneIndex + tiến độ (0..6) */
export function birdJourneyT(milestoneIndex: number, milestoneProgress: number, perMilestone: number): number {
  if (milestoneIndex >= MILESTONES.length - 1) return MILESTONES.length - 1
  return milestoneIndex + Math.min(1, milestoneProgress / perMilestone)
}

export function todayACCount(problems: Problem[]): number {
  const today = localDateKey()
  return problems.filter((p) => p.status === 'AC' && p.date === today).length
}

export function weekACCount(problems: Problem[]): number {
  const today = localDateKey()
  return problems.filter((p) => p.status === 'AC' && daysBetween(p.date, today) < 7 && daysBetween(p.date, today) >= 0).length
}

/** số ngày chưa luyện tập (0 = hôm nay đã luyện) */
export function inactivityGap(streak: StreakState): number {
  if (!streak.lastActiveDate) return 99
  return Math.max(0, daysBetween(streak.lastActiveDate, localDateKey()))
}

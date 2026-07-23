export type ProblemStatus = 'AC' | 'ATTEMPT'

export interface Problem {
  id: string
  name: string
  url?: string
  contestId?: string
  problemIndex?: string
  rating: number
  tags: string[]
  status: ProblemStatus
  note?: string
  solveTimeMinutes?: number
  /** cảm nhận độ khó 1..5 */
  difficultyFeel?: number
  /** ngày giải, dạng yyyy-mm-dd */
  date: string
  createdAt: number
  needsReview?: boolean
  submissions?: number
}

export type ItemSlot =
  | 'scarf'
  | 'goggles'
  | 'hat'
  | 'wing'
  | 'trail'
  | 'background'
  | 'consumable'

export interface ShopItem {
  id: string
  name: string
  slot: ItemSlot
  price: number
  desc: string
  /** màu chính dùng để render lên chim / preview */
  color?: string
  emoji: string
}

export interface QuestDef {
  id: string
  scope: 'daily' | 'weekly'
  title: string
  desc: string
  target: number
  reward: number
  emoji: string
}

export interface AchievementDef {
  id: string
  title: string
  desc: string
  emoji: string
}

/** các pha hiệu ứng sau khi nộp bài AC */
export type CelebrationPhase =
  | 'none'
  | 'orb'
  | 'eating'
  | 'flying'
  | 'celebrating'
  | 'milestone'

export type BirdVisualState =
  | 'idle'
  | 'eating'
  | 'flying'
  | 'celebrating'
  | 'tired'
  | 'worried'

export interface ToastItem {
  id: number
  title: string
  subtitle?: string
  tone: 'success' | 'info' | 'warn' | 'error'
}

export interface MilestoneDef {
  rating: number
  color: string
  colorSoft: string
  name: string
  rewardDesc: string
}

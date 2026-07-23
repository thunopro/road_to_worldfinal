import type { MilestoneDef } from '../types'

export const MILESTONES: MilestoneDef[] = [
  { rating: 1200, color: '#3b82f6', colorSoft: '#bfdbfe', name: 'Tháp Khởi Hành', rewardDesc: 'Huy hiệu Người Mở Đường + 150 xu' },
  { rating: 1400, color: '#14b8a6', colorSoft: '#99f6e4', name: 'Đảo Gió Teal', rewardDesc: 'Khăn choàng teal + 150 xu' },
  { rating: 1600, color: '#1d4ed8', colorSoft: '#c7d2fe', name: 'Tháp Đại Dương', rewardDesc: 'Huy hiệu Expert-in-training + 150 xu' },
  { rating: 1800, color: '#8b5cf6', colorSoft: '#ddd6fe', name: 'Đỉnh Tím Mộng', rewardDesc: 'Hiệu ứng cánh tím + 150 xu' },
  { rating: 2000, color: '#f59e0b', colorSoft: '#fde68a', name: 'Thành Hoàng Kim', rewardDesc: 'Kính phi công vàng + 150 xu' },
  { rating: 2200, color: '#f97316', colorSoft: '#fed7aa', name: 'Pháo Đài Lửa', rewardDesc: 'Trail lửa cam + 150 xu' },
  { rating: 2400, color: '#7c3aed', colorSoft: '#fde68a', name: 'Ngân Hà Tím Vàng', rewardDesc: 'Vương miện Grandmaster + 500 xu' },
]

export const MILESTONE_UNLOCK_COINS = 150
export const FINAL_UNLOCK_COINS = 500

export function milestoneColor(rating: number): string {
  return MILESTONES.find((m) => m.rating === rating)?.color ?? '#3b82f6'
}

/** màu rating của bài tập (gần với hệ màu Codeforces nhưng vẽ lại) */
export function problemRatingColor(rating: number): string {
  if (rating < 1200) return '#9ca3af'
  if (rating < 1400) return '#22c55e'
  if (rating < 1600) return '#0ea5e9'
  if (rating < 1900) return '#3b82f6'
  if (rating < 2100) return '#8b5cf6'
  if (rating < 2400) return '#f59e0b'
  return '#ef4444'
}

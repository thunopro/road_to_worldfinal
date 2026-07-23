import type { AchievementDef, Problem } from '../types'

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first-ac', title: 'Cất cánh', desc: 'AC bài đầu tiên', emoji: '🛫' },
  { id: 'ac-10', title: 'Mười bước chân', desc: 'Đạt 10 bài AC', emoji: '👣' },
  { id: 'ac-45', title: 'Gần nửa chặng', desc: 'Đạt 45 bài AC', emoji: '🌤️' },
  { id: 'ac-100', title: 'Bách chiến', desc: 'Đạt 100 bài AC', emoji: '💯' },
  { id: 'ac-300', title: 'Tam bách anh hùng', desc: 'Đạt 300 bài AC', emoji: '🦅' },
  { id: 'streak-7', title: 'Tuần lửa', desc: 'Chuỗi 7 ngày luyện tập', emoji: '🔥' },
  { id: 'streak-21', title: 'Ý chí thép', desc: 'Chuỗi 21 ngày luyện tập', emoji: '⚔️' },
  { id: 'coins-500', title: 'Đại gia hạt năng lượng', desc: 'Tích lũy 500 xu', emoji: '💰' },
  { id: 'tags-5', title: 'Đa tài', desc: 'AC bài thuộc 5 tag khác nhau', emoji: '🎨' },
  { id: 'milestone-1400', title: 'Chinh phục 1400', desc: 'Mở khóa milestone 1400', emoji: '🏝️' },
  { id: 'milestone-1600', title: 'Chinh phục 1600', desc: 'Mở khóa milestone 1600', emoji: '🌊' },
  { id: 'milestone-1800', title: 'Chinh phục 1800', desc: 'Mở khóa milestone 1800', emoji: '🔮' },
  { id: 'milestone-2000', title: 'Chinh phục 2000', desc: 'Mở khóa milestone 2000', emoji: '🏆' },
  { id: 'milestone-2200', title: 'Chinh phục 2200', desc: 'Mở khóa milestone 2200', emoji: '🌋' },
  { id: 'milestone-2400', title: 'Huyền thoại 2400', desc: 'Hoàn thành toàn bộ hành trình', emoji: '👑' },
]

interface AchievementContext {
  totalAC: number
  longestStreak: number
  coins: number
  problems: Problem[]
  badges: string[]
}

export function isAchievementUnlocked(def: AchievementDef, ctx: AchievementContext): boolean {
  switch (def.id) {
    case 'first-ac': return ctx.totalAC >= 1
    case 'ac-10': return ctx.totalAC >= 10
    case 'ac-45': return ctx.totalAC >= 45
    case 'ac-100': return ctx.totalAC >= 100
    case 'ac-300': return ctx.totalAC >= 300
    case 'streak-7': return ctx.longestStreak >= 7
    case 'streak-21': return ctx.longestStreak >= 21
    case 'coins-500': return ctx.coins >= 500
    case 'tags-5': return new Set(ctx.problems.filter((p) => p.status === 'AC').flatMap((p) => p.tags)).size >= 5
    default:
      if (def.id.startsWith('milestone-')) return ctx.badges.includes(def.id)
      return false
  }
}

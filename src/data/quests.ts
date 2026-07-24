import type { Problem, QuestDef } from '../types'
import { localDateKey, weekStartKey } from '../utils/dates'

export const DAILY_QUESTS: QuestDef[] = [
  { id: 'd-ac1', scope: 'daily', title: 'Khởi động ngày mới', desc: 'AC 1 bài bất kỳ hôm nay', target: 1, reward: 20, emoji: '🌅' },
  { id: 'd-ac2', scope: 'daily', title: 'Đà tiến công', desc: 'AC 2 bài trong hôm nay', target: 2, reward: 40, emoji: '⚡' },
  { id: 'd-review', scope: 'daily', title: 'Ôn cố tri tân', desc: 'Hoàn thành ôn lại 1 bài được đánh dấu "làm lại"', target: 1, reward: 30, emoji: '📖' },
  { id: 'd-30min', scope: 'daily', title: 'Bền bỉ 30 phút', desc: 'Tổng thời gian giải hôm nay đạt 30 phút', target: 30, reward: 30, emoji: '⏱️' },
]

export const WEEKLY_QUESTS: QuestDef[] = [
  { id: 'w-ac10', scope: 'weekly', title: 'Thập toàn thập mỹ', desc: 'AC 10 bài trong tuần này', target: 10, reward: 120, emoji: '🔟' },
  { id: 'w-active4', scope: 'weekly', title: 'Không bỏ cuộc', desc: 'Luyện tập ít nhất 4 ngày trong tuần (không nghỉ quá 2 ngày)', target: 4, reward: 130, emoji: '🔥' },
  { id: 'w-virtual', scope: 'weekly', title: 'Virtual Contest', desc: 'AC 3 bài trong cùng một ngày (mô phỏng virtual contest)', target: 3, reward: 150, emoji: '🏁' },
]

interface QuestContext {
  problems: Problem[]
  reviewedDates: string[]
}

/** tiến độ hiện tại của một nhiệm vụ, tính từ dữ liệu thật */
export function questProgress(def: QuestDef, ctx: QuestContext): number {
  const today = localDateKey()
  const thisWeek = weekStartKey(today)
  const ac = ctx.problems.filter((p) => p.status === 'AC')
  const todayAC = ac.filter((p) => p.date === today)
  const weekAC = ac.filter((p) => weekStartKey(p.date) === thisWeek)

  switch (def.id) {
    case 'd-ac1':
    case 'd-ac2':
      return todayAC.length
    case 'd-review':
      return ctx.reviewedDates.filter((d) => d === today).length
    case 'd-30min':
      return todayAC.reduce((s, p) => s + (p.solveTimeMinutes ?? 0), 0)
    case 'w-ac10':
      return weekAC.length
    case 'w-active4':
      return new Set(weekAC.map((p) => p.date)).size
    case 'w-virtual': {
      const byDay = new Map<string, number>()
      for (const p of weekAC) byDay.set(p.date, (byDay.get(p.date) ?? 0) + 1)
      return Math.max(0, ...byDay.values())
    }
    default:
      return 0
  }
}

/** khóa dùng để lưu trạng thái đã nhận thưởng (đổi theo ngày / tuần) */
export function questClaimKey(def: QuestDef): string {
  const today = localDateKey()
  return def.scope === 'daily' ? `${def.id}:${today}` : `${def.id}:${weekStartKey(today)}`
}

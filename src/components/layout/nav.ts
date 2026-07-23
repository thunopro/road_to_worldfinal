export type PageId =
  | 'home'
  | 'problems'
  | 'calendar'
  | 'quests'
  | 'achievements'
  | 'leaderboard'
  | 'collection'
  | 'stats'
  | 'settings'

export interface NavItem {
  id: PageId
  label: string
  emoji: string
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Trang chủ', emoji: '🏠' },
  { id: 'problems', label: 'Bài tập', emoji: '📘' },
  { id: 'calendar', label: 'Lịch luyện tập', emoji: '📅' },
  { id: 'quests', label: 'Nhiệm vụ', emoji: '🎯' },
  { id: 'achievements', label: 'Thành tích', emoji: '🏅' },
  { id: 'leaderboard', label: 'BXH cá nhân', emoji: '📊' },
  { id: 'collection', label: 'Bộ sưu tập', emoji: '🎁' },
  { id: 'stats', label: 'Thống kê', emoji: '📈' },
  { id: 'settings', label: 'Cài đặt', emoji: '⚙️' },
]

/** các mục hiển thị trên bottom navigation mobile */
export const MOBILE_NAV: PageId[] = ['home', 'problems', 'quests', 'stats', 'settings']

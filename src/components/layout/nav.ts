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

/**
 * Chỉ giữ các tính năng cốt lõi trên thanh điều hướng.
 * Các trang Thành tích / BXH cá nhân / Bộ sưu tập vẫn tồn tại trong code,
 * sẽ bật lại khi phát triển thêm (thêm entry vào đây là xong).
 */
export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Trang chủ', emoji: '🏠' },
  { id: 'problems', label: 'Bài tập', emoji: '📘' },
  { id: 'calendar', label: 'Lịch luyện tập', emoji: '📅' },
  { id: 'quests', label: 'Nhiệm vụ', emoji: '🎯' },
  { id: 'stats', label: 'Thống kê', emoji: '📈' },
  { id: 'settings', label: 'Cài đặt', emoji: '⚙️' },
]

/** các mục hiển thị trên bottom navigation mobile */
export const MOBILE_NAV: PageId[] = ['home', 'problems', 'quests', 'stats', 'settings']

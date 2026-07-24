import type { Problem } from '../types'
import type { Rarity } from './equipment'

export interface StoryState {
  totalAC: number
  streakCurrent: number
  streakLongest: number
  coins: number
  milestoneIndex: number
  problems: Problem[]
}

export interface StoryChapter {
  id: string
  title: string
  desc: string
  target: number
  progress: (s: StoryState) => number
  rewardCoins: number
  /** rơi đồ khi hoàn thành: none / chance (40%) / đảm bảo theo độ hiếm tối thiểu */
  drop: 'none' | 'chance' | Rarity
  emoji: string
}

/**
 * Kịch bản chính — mỗi người chơi đi qua cùng một hành trình như game offline:
 * chuỗi nhiệm vụ nối tiếp, hoàn thành nhận xu và có cơ hội rơi trang bị.
 */
export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'ch1', emoji: '🗡️', title: 'Nhập môn kiếm sĩ',
    desc: 'Một tân binh vừa đặt chân đến Làng Khởi Hành. Hãy AC bài đầu tiên để chứng minh bản lĩnh!',
    target: 1, progress: (s) => s.totalAC, rewardCoins: 50, drop: 'common',
  },
  {
    id: 'ch2', emoji: '🐛', title: 'Diệt 5 con quái bug',
    desc: 'Lũ bug đang quấy phá dân làng. Tiêu diệt chúng bằng 5 bài AC!',
    target: 5, progress: (s) => s.totalAC, rewardCoins: 80, drop: 'chance',
  },
  {
    id: 'ch3', emoji: '🔥', title: 'Thắp lửa 3 ngày',
    desc: 'Ngọn lửa ý chí phải cháy liên tục. Giữ chuỗi luyện tập 3 ngày liên tiếp.',
    target: 3, progress: (s) => Math.max(s.streakCurrent, s.streakLongest >= 3 ? 3 : s.streakCurrent), rewardCoins: 100, drop: 'chance',
  },
  {
    id: 'ch4', emoji: '⚔️', title: 'Thập kiếm trảm',
    desc: 'Sư phụ giao thử thách: 10 bài AC để được công nhận là kiếm sĩ thực thụ.',
    target: 10, progress: (s) => s.totalAC, rewardCoins: 120, drop: 'common',
  },
  {
    id: 'ch5', emoji: '🎯', title: 'Tuần lửa bất diệt',
    desc: 'Bảy ngày liên tục không rời thanh kiếm. Chuỗi 7 ngày đang chờ!',
    target: 7, progress: (s) => Math.max(s.streakCurrent, s.streakLongest >= 7 ? 7 : s.streakCurrent), rewardCoins: 150, drop: 'rare',
  },
  {
    id: 'ch6', emoji: '🏹', title: 'Nhị thập ngũ trảm',
    desc: 'Cánh cổng rừng thiêng chỉ mở cho ai đã hạ 25 bài. Tiến lên!',
    target: 25, progress: (s) => s.totalAC, rewardCoins: 200, drop: 'chance',
  },
  {
    id: 'ch7', emoji: '💰', title: 'Kho báu 500 xu',
    desc: 'Thương nhân bí ẩn chỉ giao dịch với người sở hữu 500 xu trong túi.',
    target: 500, progress: (s) => s.coins, rewardCoins: 100, drop: 'rare',
  },
  {
    id: 'ch8', emoji: '🛡️', title: 'Ngũ thập hùng binh',
    desc: '50 bài AC — con số của một chiến binh dày dạn trận mạc.',
    target: 50, progress: (s) => s.totalAC, rewardCoins: 300, drop: 'rare',
  },
  {
    id: 'ch9', emoji: '🏰', title: 'Chinh phục Tháp Gió Teal',
    desc: 'Mở khóa cột mốc 1400 — vùng đất mới đang vẫy gọi.',
    target: 1, progress: (s) => s.milestoneIndex, rewardCoins: 400, drop: 'epic',
  },
  {
    id: 'ch10', emoji: '💯', title: 'Bách chiến bách thắng',
    desc: '100 bài AC. Tên tuổi của bạn bắt đầu được khắc vào bia đá anh hùng.',
    target: 100, progress: (s) => s.totalAC, rewardCoins: 500, drop: 'epic',
  },
  {
    id: 'ch11', emoji: '🌊', title: 'Vượt Tháp Đại Dương',
    desc: 'Mở khóa cột mốc 1600 — nơi sóng cả thử thách lòng người.',
    target: 2, progress: (s) => s.milestoneIndex, rewardCoins: 700, drop: 'epic',
  },
  {
    id: 'ch12', emoji: '👑', title: 'Truyền thuyết bắt đầu',
    desc: '200 bài AC — từ đây, mọi bảng xếp hạng đều phải nhắc tên bạn.',
    target: 200, progress: (s) => s.totalAC, rewardCoins: 1000, drop: 'legendary',
  },
]

import type { ShopItem } from '../types'

export const SHOP_ITEMS: ShopItem[] = [
  // khăn choàng
  { id: 'scarf-red', name: 'Khăn Đỏ Phi Công', slot: 'scarf', price: 0, desc: 'Trang bị khởi đầu của mọi phi công.', color: '#ef4444', emoji: '🧣' },
  { id: 'scarf-orange', name: 'Khăn Cam Hoàng Hôn', slot: 'scarf', price: 60, desc: 'Ấm áp như nắng chiều.', color: '#f97316', emoji: '🧣' },
  { id: 'scarf-teal', name: 'Khăn Teal Đảo Gió', slot: 'scarf', price: 90, desc: 'Phần thưởng tinh thần của Đảo Gió.', color: '#14b8a6', emoji: '🧣' },
  { id: 'scarf-purple', name: 'Khăn Tím Mộng', slot: 'scarf', price: 140, desc: 'Dành cho ai mơ tới rating 1800+.', color: '#8b5cf6', emoji: '🧣' },
  // kính
  { id: 'goggles-classic', name: 'Kính Phi Công Cổ Điển', slot: 'goggles', price: 0, desc: 'Bền bỉ, đáng tin cậy.', color: '#7dd3fc', emoji: '🥽' },
  { id: 'goggles-gold', name: 'Kính Hoàng Kim', slot: 'goggles', price: 180, desc: 'Lấp lánh như thành Hoàng Kim.', color: '#fbbf24', emoji: '🥽' },
  { id: 'goggles-rose', name: 'Kính Hồng Mây', slot: 'goggles', price: 120, desc: 'Nhìn đời qua lăng kính màu hồng.', color: '#fda4af', emoji: '🥽' },
  // mũ
  { id: 'hat-cap', name: 'Mũ Lưỡi Trai Xanh', slot: 'hat', price: 120, desc: 'Phong cách coder chính hiệu.', color: '#0ea5e9', emoji: '🧢' },
  { id: 'hat-wizard', name: 'Mũ Phù Thủy Thuật Toán', slot: 'hat', price: 260, desc: '+10 trí tuệ khi giải DP.', color: '#7c3aed', emoji: '🧙' },
  { id: 'hat-crown', name: 'Vương Miện Grandmaster', slot: 'hat', price: 450, desc: 'Chỉ dành cho huyền thoại.', color: '#f59e0b', emoji: '👑' },
  // màu cánh
  { id: 'wing-sky', name: 'Cánh Xanh Trời', slot: 'wing', price: 0, desc: 'Màu cánh nguyên bản.', color: '#93c5fd', emoji: '🪽' },
  { id: 'wing-mint', name: 'Cánh Bạc Hà', slot: 'wing', price: 130, desc: 'Mát lành như gió sớm.', color: '#6ee7b7', emoji: '🪽' },
  { id: 'wing-rose', name: 'Cánh Hồng Phấn', slot: 'wing', price: 130, desc: 'Dịu dàng giữa trời xanh.', color: '#fda4af', emoji: '🪽' },
  { id: 'wing-gold', name: 'Cánh Hoàng Kim', slot: 'wing', price: 220, desc: 'Vỗ cánh là thấy giàu sang.', color: '#fcd34d', emoji: '🪽' },
  // trail ánh sáng
  { id: 'trail-none', name: 'Không Trail', slot: 'trail', price: 0, desc: 'Bay nhẹ nhàng không dấu vết.', color: 'transparent', emoji: '💨' },
  { id: 'trail-gold', name: 'Trail Ánh Kim', slot: 'trail', price: 200, desc: 'Vệt sáng vàng lấp lánh sau đuôi.', color: '#fbbf24', emoji: '✨' },
  { id: 'trail-star', name: 'Trail Sao Băng', slot: 'trail', price: 260, desc: 'Mỗi cú vỗ cánh là một cơn mưa sao.', color: '#a5b4fc', emoji: '🌠' },
  { id: 'trail-fire', name: 'Trail Lửa Cam', slot: 'trail', price: 320, desc: 'Tốc độ bốc cháy đường bay.', color: '#f97316', emoji: '🔥' },
  // background
  { id: 'bg-day', name: 'Bầu Trời Ban Ngày', slot: 'background', price: 0, desc: 'Trời xanh mây trắng nắng vàng.', color: '#7dd3fc', emoji: '☀️' },
  { id: 'bg-sunset', name: 'Hoàng Hôn Cam Đào', slot: 'background', price: 280, desc: 'Luyện đề lúc chiều tà.', color: '#fb923c', emoji: '🌇' },
  { id: 'bg-night', name: 'Đêm Ngân Hà', slot: 'background', price: 340, desc: 'Code xuyên đêm cùng dải ngân hà.', color: '#4c1d95', emoji: '🌌' },
  // vật phẩm tiêu hao
  { id: 'streak-freeze', name: 'Streak Freeze ❄️', slot: 'consumable', price: 100, desc: 'Bảo vệ chuỗi ngày nếu lỡ nghỉ 1 ngày. Tự động kích hoạt.', color: '#67e8f9', emoji: '🧊' },
]

export const DEFAULT_OWNED = ['scarf-red', 'goggles-classic', 'wing-sky', 'trail-none', 'bg-day']

export const DEFAULT_EQUIPPED: Record<string, string> = {
  scarf: 'scarf-red',
  goggles: 'goggles-classic',
  wing: 'wing-sky',
  trail: 'trail-none',
  background: 'bg-day',
}

export function itemById(id: string | undefined): ShopItem | undefined {
  return SHOP_ITEMS.find((i) => i.id === id)
}

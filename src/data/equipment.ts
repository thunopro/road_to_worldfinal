export type GearSlot = 'weapon' | 'shield' | 'helmet' | 'armor' | 'boots' | 'ring'
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface GearStats {
  atk?: number
  def?: number
  hp?: number
  luck?: number
}

export interface GearItem {
  id: string
  name: string
  slot: GearSlot
  rarity: Rarity
  emoji: string
  desc: string
  stats: GearStats
}

export const RARITY_META: Record<Rarity, { label: string; color: string; weight: number }> = {
  common: { label: 'Thường', color: '#94a3b8', weight: 60 },
  rare: { label: 'Hiếm', color: '#38bdf8', weight: 27 },
  epic: { label: 'Sử thi', color: '#a78bfa', weight: 10 },
  legendary: { label: 'Huyền thoại', color: '#f59e0b', weight: 3 },
}

export const SLOT_LABELS: Record<GearSlot, string> = {
  weapon: 'Vũ khí',
  shield: 'Khiên',
  helmet: 'Mũ giáp',
  armor: 'Áo giáp',
  boots: 'Giày',
  ring: 'Nhẫn',
}

/** Bộ trang bị thời đại hiệp sĩ — mỗi món có thông số riêng */
export const GEAR_ITEMS: GearItem[] = [
  // vũ khí
  { id: 'sword-wood', name: 'Kiếm Gỗ Tân Binh', slot: 'weapon', rarity: 'common', emoji: '🗡️', desc: 'Ai cũng bắt đầu từ đây.', stats: { atk: 2 } },
  { id: 'sword-iron', name: 'Kiếm Sắt Chiến Trường', slot: 'weapon', rarity: 'common', emoji: '⚔️', desc: 'Bền bỉ qua trăm trận.', stats: { atk: 5 } },
  { id: 'sword-moon', name: 'Kiếm Bạc Ánh Trăng', slot: 'weapon', rarity: 'rare', emoji: '🌙', desc: 'Sắc lạnh như đêm rằm.', stats: { atk: 9, luck: 1 } },
  { id: 'sword-gold', name: 'Đại Kiếm Hoàng Kim', slot: 'weapon', rarity: 'epic', emoji: '⚜️', desc: 'Chém một nhát, bug tan biến.', stats: { atk: 14, def: 2 } },
  { id: 'sword-ac', name: 'Thánh Kiếm AC', slot: 'weapon', rarity: 'legendary', emoji: '🌟', desc: 'Truyền thuyết kể rằng chủ nhân của nó chưa từng WA.', stats: { atk: 20, luck: 3 } },
  // khiên
  { id: 'shield-wood', name: 'Khiên Gỗ Sồi', slot: 'shield', rarity: 'common', emoji: '🛡️', desc: 'Chặn được vài cú TLE.', stats: { def: 3 } },
  { id: 'shield-steel', name: 'Khiên Thép Tinh Luyện', slot: 'shield', rarity: 'rare', emoji: '🛡️', desc: 'WA nảy ngược trở lại.', stats: { def: 7, hp: 3 } },
  { id: 'shield-dragon', name: 'Khiên Vảy Rồng', slot: 'shield', rarity: 'epic', emoji: '🐉', desc: 'Rèn từ vảy rồng đỏ 2200.', stats: { def: 12, hp: 6 } },
  // mũ giáp
  { id: 'helm-leather', name: 'Mũ Da Cũ', slot: 'helmet', rarity: 'common', emoji: '🪖', desc: 'Ấm đầu khi debug xuyên đêm.', stats: { hp: 5 } },
  { id: 'helm-knight', name: 'Mũ Giáp Kỵ Sĩ', slot: 'helmet', rarity: 'rare', emoji: '⛑️', desc: 'Có chùm lông xanh oai vệ.', stats: { hp: 10, def: 3 } },
  { id: 'helm-crown', name: 'Vương Miện Trí Tuệ', slot: 'helmet', rarity: 'epic', emoji: '👑', desc: 'Đội vào là nghĩ ra lời giải.', stats: { hp: 15, luck: 3 } },
  // áo giáp
  { id: 'armor-cloth', name: 'Giáp Vải Học Đồ', slot: 'armor', rarity: 'common', emoji: '🥋', desc: 'Nhẹ nhàng linh hoạt.', stats: { hp: 8 } },
  { id: 'armor-chain', name: 'Giáp Xích Song Sắt', slot: 'armor', rarity: 'rare', emoji: '🦺', desc: 'Kín kẽ như code không lỗi.', stats: { hp: 16, def: 4 } },
  { id: 'armor-dragon', name: 'Chiến Giáp Long Thần', slot: 'armor', rarity: 'legendary', emoji: '🐲', desc: 'Bộ giáp của Grandmaster huyền thoại.', stats: { hp: 30, def: 10 } },
  // giày
  { id: 'boots-cloth', name: 'Giày Vải Nhẹ', slot: 'boots', rarity: 'common', emoji: '👟', desc: 'Chạy deadline êm ái.', stats: { luck: 1, hp: 2 } },
  { id: 'boots-swift', name: 'Giày Thần Tốc', slot: 'boots', rarity: 'rare', emoji: '👢', desc: 'Submit nhanh hơn 0.5 giây.', stats: { luck: 3, atk: 2 } },
  // nhẫn
  { id: 'ring-focus', name: 'Nhẫn Tập Trung', slot: 'ring', rarity: 'rare', emoji: '💍', desc: 'Đeo vào là quên cả TikTok.', stats: { luck: 2, atk: 2 } },
  { id: 'ring-infinity', name: 'Nhẫn Vô Cực', slot: 'ring', rarity: 'legendary', emoji: '💎', desc: 'Sức mạnh của cả bảy viên rating.', stats: { atk: 5, def: 5, hp: 10, luck: 5 } },
]

export function gearById(id: string): GearItem | undefined {
  return GEAR_ITEMS.find((g) => g.id === id)
}

/** tổng sức mạnh chiến đấu từ trang bị đang mặc */
export function totalPower(equipment: Record<string, string>): { atk: number; def: number; hp: number; luck: number; power: number } {
  let atk = 0, def = 0, hp = 0, luck = 0
  for (const id of Object.values(equipment)) {
    const g = gearById(id)
    if (!g) continue
    atk += g.stats.atk ?? 0
    def += g.stats.def ?? 0
    hp += g.stats.hp ?? 0
    luck += g.stats.luck ?? 0
  }
  return { atk, def, hp, luck, power: atk * 3 + def * 2 + hp + luck * 4 }
}

/** quay ngẫu nhiên một món đồ theo độ hiếm (loại trừ đồ đã có nếu có thể) */
export function rollGearDrop(owned: string[], minRarity?: Rarity): GearItem {
  const order: Rarity[] = ['common', 'rare', 'epic', 'legendary']
  const minIdx = minRarity ? order.indexOf(minRarity) : 0
  const pool = GEAR_ITEMS.filter((g) => order.indexOf(g.rarity) >= minIdx)
  const fresh = pool.filter((g) => !owned.includes(g.id))
  const candidates = fresh.length > 0 ? fresh : pool

  const totalWeight = candidates.reduce((s, g) => s + RARITY_META[g.rarity].weight, 0)
  let roll = Math.random() * totalWeight
  for (const g of candidates) {
    roll -= RARITY_META[g.rarity].weight
    if (roll <= 0) return g
  }
  return candidates[candidates.length - 1]
}

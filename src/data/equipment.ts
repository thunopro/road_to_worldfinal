export type GearSlot = 'weapon' | 'shield' | 'helmet' | 'armor' | 'boots' | 'ring'
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface GearStats {
  atk?: number
  def?: number
  hp?: number
  mp?: number
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

/** Vật phẩm tiêu hao (bình máu/mana/buff) — dùng trong chiến đấu PvP/NPC sau này */
export interface ConsumableItem {
  id: string
  name: string
  rarity: Rarity
  desc: string
  effect: { hp?: number; mp?: number; atk?: number }
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

export const SLOT_ICONS: Record<GearSlot, string> = {
  weapon: '⚔️',
  shield: '🛡️',
  helmet: '🪖',
  armor: '🥋',
  boots: '👢',
  ring: '💍',
}

// icon pixel-art 32×32 lấy từ game Dungeon Crawl Stone Soup (CC0), file đặt tên theo id vật phẩm
const ICONS = import.meta.glob('../assets/items/*.png', { eager: true, import: 'default' }) as Record<string, string>

export function itemIcon(id: string): string | undefined {
  return ICONS[`../assets/items/${id}.png`]
}

/** Bộ trang bị thời đại hiệp sĩ — mỗi món có thông số riêng */
export const GEAR_ITEMS: GearItem[] = [
  // vũ khí
  { id: 'sword-wood', name: 'Kiếm Gỗ Tân Binh', slot: 'weapon', rarity: 'common', emoji: '🗡️', desc: 'Ai cũng bắt đầu từ đây.', stats: { atk: 2 } },
  { id: 'sword-iron', name: 'Kiếm Sắt Chiến Trường', slot: 'weapon', rarity: 'common', emoji: '⚔️', desc: 'Bền bỉ qua trăm trận.', stats: { atk: 5 } },
  { id: 'axe-battle', name: 'Rìu Chiến Sơn Tặc', slot: 'weapon', rarity: 'rare', emoji: '🪓', desc: 'Một nhát bổ đôi cả testcase.', stats: { atk: 8, def: 1 } },
  { id: 'sword-moon', name: 'Kiếm Bạc Ánh Trăng', slot: 'weapon', rarity: 'rare', emoji: '🌙', desc: 'Sắc lạnh như đêm rằm.', stats: { atk: 9, luck: 1 } },
  { id: 'sword-gold', name: 'Đại Kiếm Hoàng Kim', slot: 'weapon', rarity: 'epic', emoji: '⚜️', desc: 'Chém một nhát, bug tan biến.', stats: { atk: 14, def: 2 } },
  { id: 'sword-ac', name: 'Thánh Kiếm AC', slot: 'weapon', rarity: 'legendary', emoji: '🌟', desc: 'Truyền thuyết kể rằng chủ nhân của nó chưa từng WA.', stats: { atk: 20, luck: 3 } },
  // khiên
  { id: 'shield-wood', name: 'Khiên Gỗ Sồi', slot: 'shield', rarity: 'common', emoji: '🛡️', desc: 'Chặn được vài cú TLE.', stats: { def: 3 } },
  { id: 'shield-steel', name: 'Khiên Thép Tinh Luyện', slot: 'shield', rarity: 'rare', emoji: '🛡️', desc: 'WA nảy ngược trở lại.', stats: { def: 7, hp: 3 } },
  { id: 'shield-dragon', name: 'Khiên Vảy Rồng', slot: 'shield', rarity: 'epic', emoji: '🐉', desc: 'Rèn từ vảy rồng đỏ 2200.', stats: { def: 12, hp: 6 } },
  { id: 'shield-aegis', name: 'Thánh Khiên Aegis', slot: 'shield', rarity: 'legendary', emoji: '✨', desc: 'Bức tường thành không kẻ địch nào xuyên thủng.', stats: { def: 16, hp: 10, mp: 5 } },
  // mũ giáp
  { id: 'helm-leather', name: 'Mũ Da Cũ', slot: 'helmet', rarity: 'common', emoji: '🪖', desc: 'Ấm đầu khi debug xuyên đêm.', stats: { hp: 5 } },
  { id: 'helm-knight', name: 'Mũ Giáp Kỵ Sĩ', slot: 'helmet', rarity: 'rare', emoji: '⛑️', desc: 'Có chùm lông xanh oai vệ.', stats: { hp: 10, def: 3 } },
  { id: 'helm-crown', name: 'Vương Miện Trí Tuệ', slot: 'helmet', rarity: 'epic', emoji: '👑', desc: 'Đội vào là nghĩ ra lời giải.', stats: { hp: 15, luck: 3 } },
  { id: 'helm-wizard', name: 'Mũ Đại Pháp Sư', slot: 'helmet', rarity: 'legendary', emoji: '🧙', desc: 'Chứa cả đại dương mana của pháp sư cổ đại.', stats: { mp: 25, luck: 4, hp: 5 } },
  // áo giáp
  { id: 'armor-cloth', name: 'Giáp Vải Học Đồ', slot: 'armor', rarity: 'common', emoji: '🥋', desc: 'Nhẹ nhàng linh hoạt.', stats: { hp: 8 } },
  { id: 'armor-chain', name: 'Giáp Xích Song Sắt', slot: 'armor', rarity: 'rare', emoji: '🦺', desc: 'Kín kẽ như code không lỗi.', stats: { hp: 16, def: 4 } },
  { id: 'armor-crystal', name: 'Giáp Pha Lê', slot: 'armor', rarity: 'epic', emoji: '💠', desc: 'Trong suốt nhưng cứng hơn thép.', stats: { hp: 20, def: 7, mp: 8 } },
  { id: 'armor-dragon', name: 'Chiến Giáp Long Thần', slot: 'armor', rarity: 'legendary', emoji: '🐲', desc: 'Bộ giáp của Grandmaster huyền thoại.', stats: { hp: 30, def: 10 } },
  // giày
  { id: 'boots-cloth', name: 'Giày Vải Nhẹ', slot: 'boots', rarity: 'common', emoji: '👟', desc: 'Chạy deadline êm ái.', stats: { luck: 1, hp: 2 } },
  { id: 'boots-swift', name: 'Giày Thần Tốc', slot: 'boots', rarity: 'rare', emoji: '👢', desc: 'Submit nhanh hơn 0.5 giây.', stats: { luck: 3, atk: 2 } },
  { id: 'boots-wind', name: 'Giày Cánh Gió', slot: 'boots', rarity: 'epic', emoji: '🌪️', desc: 'Bước một bước, qua ba testcase.', stats: { luck: 4, atk: 3, def: 2 } },
  // nhẫn
  { id: 'ring-focus', name: 'Nhẫn Tập Trung', slot: 'ring', rarity: 'rare', emoji: '💍', desc: 'Đeo vào là quên cả TikTok.', stats: { luck: 2, atk: 2 } },
  { id: 'ring-fire', name: 'Nhẫn Hỏa Ngọc', slot: 'ring', rarity: 'epic', emoji: '🔥', desc: 'Ngọn lửa chiến ý không bao giờ tắt.', stats: { atk: 6, mp: 5, luck: 2 } },
  { id: 'ring-infinity', name: 'Nhẫn Vô Cực', slot: 'ring', rarity: 'legendary', emoji: '💎', desc: 'Sức mạnh của cả bảy viên rating.', stats: { atk: 5, def: 5, hp: 10, luck: 5 } },
]

/** Bình thuốc & vật phẩm hỗ trợ — tích trữ để dùng khi hệ thống chiến đấu ra mắt */
export const CONSUMABLES: ConsumableItem[] = [
  { id: 'potion-hp-s', name: 'Bình Máu Nhỏ', rarity: 'common', desc: 'Hồi 40 HP trong trận đấu.', effect: { hp: 40 } },
  { id: 'potion-mp-s', name: 'Bình Mana Nhỏ', rarity: 'common', desc: 'Hồi 30 MP trong trận đấu.', effect: { mp: 30 } },
  { id: 'potion-hp-l', name: 'Bình Máu Lớn', rarity: 'rare', desc: 'Hồi 120 HP trong trận đấu.', effect: { hp: 120 } },
  { id: 'potion-mp-l', name: 'Bình Mana Lớn', rarity: 'rare', desc: 'Hồi 80 MP trong trận đấu.', effect: { mp: 80 } },
  { id: 'potion-might', name: 'Thuốc Cuồng Lực', rarity: 'epic', desc: 'Tăng 15 ATK trong một trận đấu.', effect: { atk: 15 } },
]

export function gearById(id: string): GearItem | undefined {
  return GEAR_ITEMS.find((g) => g.id === id)
}

export function consumableById(id: string): ConsumableItem | undefined {
  return CONSUMABLES.find((c) => c.id === id)
}

/** chỉ số gốc của mọi hiệp sĩ — trang bị cộng thêm vào đây (nền tảng cho PvP/NPC) */
export const BASE_STATS = { hp: 100, mp: 50, atk: 10, def: 5, luck: 0 }

export interface CharacterStats {
  hp: number
  mp: number
  atk: number
  def: number
  luck: number
  power: number
}

/** tổng chỉ số cộng thêm từ trang bị đang mặc */
export function totalPower(equipment: Record<string, string>): CharacterStats {
  let atk = 0, def = 0, hp = 0, mp = 0, luck = 0
  for (const id of Object.values(equipment)) {
    const g = gearById(id)
    if (!g) continue
    atk += g.stats.atk ?? 0
    def += g.stats.def ?? 0
    hp += g.stats.hp ?? 0
    mp += g.stats.mp ?? 0
    luck += g.stats.luck ?? 0
  }
  return { atk, def, hp, mp, luck, power: atk * 3 + def * 2 + hp + mp + luck * 4 }
}

/** chỉ số hoàn chỉnh của nhân vật = gốc + trang bị (dùng cho màn hình nhân vật & chiến đấu) */
export function characterStats(equipment: Record<string, string>): CharacterStats {
  const bonus = totalPower(equipment)
  return {
    hp: BASE_STATS.hp + bonus.hp,
    mp: BASE_STATS.mp + bonus.mp,
    atk: BASE_STATS.atk + bonus.atk,
    def: BASE_STATS.def + bonus.def,
    luck: BASE_STATS.luck + bonus.luck,
    power: bonus.power,
  }
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

/** quay ngẫu nhiên một bình thuốc theo độ hiếm */
export function rollConsumableDrop(): ConsumableItem {
  const totalWeight = CONSUMABLES.reduce((s, c) => s + RARITY_META[c.rarity].weight, 0)
  let roll = Math.random() * totalWeight
  for (const c of CONSUMABLES) {
    roll -= RARITY_META[c.rarity].weight
    if (roll <= 0) return c
  }
  return CONSUMABLES[0]
}

export type AcDrop =
  | { kind: 'gear'; gear: GearItem }
  | { kind: 'potion'; potion: ConsumableItem }
  | null

/**
 * Thỉnh thoảng rơi vật phẩm khi AC một bài: bình thuốc thường gặp hơn trang bị.
 * Chỉ số LUCK của trang bị đang mặc làm tăng tỉ lệ rơi.
 */
export function rollAcDrop(owned: string[], luck: number): AcDrop {
  const r = Math.random() * 100
  if (r < 12 + luck) return { kind: 'potion', potion: rollConsumableDrop() }
  if (r < 17 + luck * 1.5) return { kind: 'gear', gear: rollGearDrop(owned) }
  return null
}

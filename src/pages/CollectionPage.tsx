import { useState } from 'react'
import BirdCharacter from '../components/journey/BirdCharacter'
import KnightCharacter from '../components/journey/KnightCharacter'
import { gearById, RARITY_META, totalPower, SLOT_LABELS as GEAR_SLOT_LABELS } from '../data/equipment'
import { MATERIALS } from '../data/materials'
import { SHOP_ITEMS } from '../data/shop'
import { useAppStore } from '../store/useAppStore'
import type { ItemSlot } from '../types'

const SLOT_LABELS: Array<{ slot: ItemSlot; label: string }> = [
  { slot: 'scarf', label: '🧣 Khăn choàng' },
  { slot: 'goggles', label: '🥽 Kính phi công' },
  { slot: 'hat', label: '🎩 Mũ' },
  { slot: 'wing', label: '🪽 Màu cánh' },
  { slot: 'trail', label: '✨ Trail ánh sáng' },
  { slot: 'background', label: '🌇 Bầu trời' },
]

/** Cửa hàng & kho đồ: học liệu thuật toán, trang bị hiệp sĩ, trang phục thú cưng */
export default function CollectionPage() {
  const user = useAppStore((s) => s.user)
  const collection = useAppStore((s) => s.collection)
  const inventory = useAppStore((s) => s.inventory)
  const equipment = useAppStore((s) => s.equipment)
  const buyItem = useAppStore((s) => s.buyItem)
  const equipItem = useAppStore((s) => s.equipItem)
  const equipGear = useAppStore((s) => s.equipGear)
  const buyMaterial = useAppStore((s) => s.buyMaterial)
  const pushToast = useAppStore((s) => s.pushToast)
  const [openMaterial, setOpenMaterial] = useState<string | null>(null)

  const power = totalPower(equipment)
  const ownedGear = inventory.map((id) => gearById(id)).filter((g) => g !== undefined)

  const buy = (id: string, name: string, price: number) => {
    if (buyItem(id)) {
      pushToast({ title: `Đã mua ${name}! 🎁`, subtitle: `-${price} xu`, tone: 'success' })
    } else {
      pushToast({ title: 'Không đủ xu 🪙', subtitle: 'AC thêm bài hoặc hoàn thành nhiệm vụ để kiếm xu nhé!', tone: 'warn' })
    }
  }

  const buyMat = (id: string, name: string, price: number) => {
    if (buyMaterial(id, price)) {
      pushToast({ title: `Đã mở khóa ${name}! 📚`, subtitle: `-${price} xu · Bấm vào thẻ để xem nội dung.`, tone: 'success' })
    } else {
      pushToast({ title: 'Không đủ xu 🪙', subtitle: 'Cày thêm bài và nhiệm vụ để kiếm xu nhé!', tone: 'warn' })
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-1">🛒 Cửa hàng & Kho đồ</h1>
      <p className="text-sm text-slate-500 mb-4">Dùng xu cày được để mở khóa học liệu thuật toán, sắm trang bị và trang phục.</p>

      {/* hồ sơ hiệp sĩ + sức mạnh */}
      <div className="game-panel p-4 mb-5">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <KnightCharacter state="idle" size={110} />
          <div className="flex-1 text-center sm:text-left">
            <div className="font-extrabold text-lg text-[#3d3222]">{user.name}</div>
            <div className="text-sm text-[#8a7550]">Hiệp sĩ đồng hành của bạn</div>
            <div className="mt-1 font-extrabold text-amber-600">🪙 {user.coins} xu</div>
          </div>
          <div className="grid grid-cols-5 gap-2 text-center">
            {([['⚔️', 'ATK', power.atk], ['🛡️', 'DEF', power.def], ['❤️', 'HP', power.hp], ['🍀', 'LUCK', power.luck], ['💪', 'Lực chiến', power.power]] as const).map(([e, l, v]) => (
              <div key={l} className="game-inset px-2.5 py-1.5">
                <div aria-hidden="true">{e}</div>
                <div className="text-sm font-extrabold text-[#3d3222]">{v}</div>
                <div className="text-[9px] font-bold text-[#8a7550]">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== học liệu thuật toán ===== */}
      <h2 className="font-extrabold mb-2.5">📚 Tài liệu & bài tập thuật toán nâng cao</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mb-6">
        {MATERIALS.map((m) => {
          const owned = inventory.includes(m.id)
          const open = openMaterial === m.id
          return (
            <div key={m.id} className={`game-panel p-4 ${owned ? '' : 'opacity-95'}`}>
              <button
                className="w-full text-left"
                onClick={() => owned && setOpenMaterial(open ? null : m.id)}
                aria-expanded={owned ? open : undefined}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl" aria-hidden="true">{m.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-sm text-[#3d3222]">{m.name}</div>
                    <div className="text-[11px] text-[#8a7550]">{m.desc}</div>
                  </div>
                </div>
              </button>
              <div className="mt-2.5 flex items-center justify-between">
                <span className="text-sm font-extrabold text-amber-600">{owned ? '✅ Đã sở hữu' : `🪙 ${m.price}`}</span>
                {owned ? (
                  <button onClick={() => setOpenMaterial(open ? null : m.id)} className="text-xs font-extrabold text-sky-600 hover:underline">
                    {open ? '▲ Thu gọn' : '▼ Xem nội dung'}
                  </button>
                ) : (
                  <button
                    onClick={() => buyMat(m.id, m.name, m.price)}
                    className="game-btn px-3 py-1.5 text-xs font-extrabold text-white bg-gradient-to-b from-sky-400 to-sky-500 border-2 border-sky-700"
                  >
                    Mở khóa
                  </button>
                )}
              </div>
              {owned && open && (
                <div className="mt-2 space-y-1.5">
                  {m.links.map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="game-inset block px-3 py-2 text-xs font-bold text-sky-700 hover:underline"
                    >
                      🔗 {l.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ===== kho trang bị ===== */}
      <h2 className="font-extrabold mb-2.5">🎒 Kho trang bị hiệp sĩ</h2>
      {ownedGear.length === 0 ? (
        <div className="game-panel p-6 text-center text-sm text-[#8a7550] mb-6">
          Chưa có trang bị nào — hoàn thành các chương <b>Kịch bản chính</b> trong mục Nhiệm vụ để nhận đồ rơi! 🎁
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mb-6">
          {ownedGear.map((g) => {
            const equipped = equipment[g.slot] === g.id
            const meta = RARITY_META[g.rarity]
            return (
              <div key={g.id} className="game-panel p-4" style={{ boxShadow: equipped ? `0 0 0 3px ${meta.color}` : undefined }}>
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl" aria-hidden="true">{g.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-sm" style={{ color: meta.color }}>{g.name}</div>
                    <div className="text-[10px] font-extrabold" style={{ color: meta.color }}>
                      {meta.label} · {GEAR_SLOT_LABELS[g.slot]}
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-[#8a7550] italic mt-1.5">{g.desc}</div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#5c4d33]">
                    {Object.entries(g.stats).map(([k, v]) => `${k.toUpperCase()} +${v}`).join(' · ')}
                  </span>
                  {equipped ? (
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-600 border border-amber-300">Đang mặc ⭐</span>
                  ) : (
                    <button
                      onClick={() => {
                        equipGear(g.id)
                        pushToast({ title: `Đã mặc ${g.name} ${g.emoji}`, tone: 'success' })
                      }}
                      className="game-btn px-3 py-1 text-xs font-extrabold text-white bg-gradient-to-b from-teal-400 to-teal-500 border-2 border-teal-700"
                    >
                      Mặc vào
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ===== trang phục thú cưng (chim) ===== */}
      <div className="glass p-4 mb-4 flex items-center gap-4">
        <BirdCharacter state="idle" size={72} />
        <div>
          <h2 className="font-extrabold">🐦 Thú cưng đồng hành</h2>
          <p className="text-xs text-slate-500">Trang phục làm đẹp cho chú chim may mắn của bạn.</p>
        </div>
      </div>

      {SLOT_LABELS.map(({ slot, label }) => {
        const items = SHOP_ITEMS.filter((i) => i.slot === slot)
        if (items.length === 0) return null
        return (
          <div key={slot} className="mb-6">
            <h2 className="font-extrabold mb-2.5">{label}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {items.map((item) => {
                const owned = collection.owned.includes(item.id)
                const equipped = collection.equipped[item.slot] === item.id
                return (
                  <div key={item.id} className={`glass p-4 flex flex-col ${equipped ? 'ring-2 ring-amber-400' : ''}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center text-lg shrink-0"
                        style={{ background: item.color && item.color !== 'transparent' ? `${item.color}33` : '#f1f5f9' }}
                      >
                        {item.emoji}
                      </span>
                      <div className="font-extrabold text-sm leading-tight">{item.name}</div>
                    </div>
                    <div className="text-xs text-slate-500 flex-1">{item.desc}</div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-extrabold text-amber-600">{item.price === 0 ? 'Miễn phí' : `🪙 ${item.price}`}</span>
                      {equipped ? (
                        <span className="px-3 py-1.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-600">Đang dùng ⭐</span>
                      ) : owned ? (
                        <button
                          onClick={() => {
                            equipItem(item.id)
                            pushToast({ title: `Đã trang bị ${item.name} ✨`, tone: 'success' })
                          }}
                          className="px-3 py-1.5 rounded-full text-xs font-extrabold text-white bg-teal-500 hover:bg-teal-600 transition-colors"
                        >
                          Trang bị
                        </button>
                      ) : (
                        <button
                          onClick={() => buy(item.id, item.name, item.price)}
                          className="px-3 py-1.5 rounded-full text-xs font-extrabold text-white bg-sky-500 hover:bg-sky-600 transition-colors"
                        >
                          Mua
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

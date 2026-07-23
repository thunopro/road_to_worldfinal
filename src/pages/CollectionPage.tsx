import BirdCharacter from '../components/journey/BirdCharacter'
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
  { slot: 'consumable', label: '🧊 Vật phẩm' },
]

/** Bộ sưu tập & cửa hàng: dùng xu mở khóa trang phục cho chim */
export default function CollectionPage() {
  const user = useAppStore((s) => s.user)
  const collection = useAppStore((s) => s.collection)
  const streak = useAppStore((s) => s.streak)
  const buyItem = useAppStore((s) => s.buyItem)
  const equipItem = useAppStore((s) => s.equipItem)
  const pushToast = useAppStore((s) => s.pushToast)

  const buy = (id: string, name: string, price: number) => {
    if (buyItem(id)) {
      pushToast({ title: `Đã mua ${name}! 🎁`, subtitle: `-${price} xu`, tone: 'success' })
    } else {
      pushToast({ title: 'Không đủ xu 🪙', subtitle: 'AC thêm bài hoặc hoàn thành nhiệm vụ để kiếm xu nhé!', tone: 'warn' })
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-1">🎁 Bộ sưu tập</h1>
      <p className="text-sm text-slate-500 mb-4">Dùng xu kiếm được từ mỗi bài AC để làm đẹp cho chú chim.</p>

      <div className="glass p-5 mb-5 flex flex-col sm:flex-row items-center gap-5">
        <BirdCharacter state="idle" size={130} />
        <div>
          <div className="font-extrabold text-lg">{user.name}</div>
          <div className="text-sm text-slate-500">Diện mạo hiện tại của chú chim đồng hành</div>
          <div className="mt-2 flex items-center gap-3 font-extrabold">
            <span className="text-amber-600">🪙 {user.coins} xu</span>
            <span className="text-sky-600">🧊 {streak.freezes} freeze</span>
          </div>
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
                      {item.slot === 'consumable' ? (
                        <button
                          onClick={() => buy(item.id, item.name, item.price)}
                          className="px-3 py-1.5 rounded-full text-xs font-extrabold text-white bg-sky-500 hover:bg-sky-600 transition-colors"
                        >
                          Mua
                        </button>
                      ) : equipped ? (
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

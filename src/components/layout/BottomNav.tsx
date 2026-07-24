import { MOBILE_NAV, NAV_ITEMS, type PageId } from './nav'

interface Props {
  page: PageId
  onNavigate: (p: PageId) => void
}

/** Thanh điều hướng dưới cùng cho mobile / tablet */
export default function BottomNav({ page, onNavigate }: Props) {
  const items = NAV_ITEMS.filter((n) => MOBILE_NAV.includes(n.id))
  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#f7eed9]/95 border-t-[3px] border-[#d8c9a3] rounded-t-2xl flex justify-around px-2 py-1.5 shadow-[0_-4px_12px_rgba(60,80,120,0.15)]"
      aria-label="Điều hướng mobile"
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          aria-current={page === item.id ? 'page' : undefined}
          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-bold transition-colors
            ${page === item.id ? 'text-sky-600 bg-sky-100/80' : 'text-slate-500'}`}
        >
          <span className="text-xl" aria-hidden="true">{item.emoji}</span>
          {item.label}
        </button>
      ))}
    </nav>
  )
}

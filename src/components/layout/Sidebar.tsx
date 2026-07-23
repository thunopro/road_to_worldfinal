import { MILESTONES } from '../../data/milestones'
import { useAppStore } from '../../store/useAppStore'
import BirdCharacter from '../journey/BirdCharacter'
import { NAV_ITEMS, type PageId } from './nav'

const RANK_TITLES = [
  'Tân Binh Bầu Trời',
  'Phi Công Gió Teal',
  'Thuyền Trưởng Đại Dương',
  'Hiệp Sĩ Tím Mộng',
  'Chiến Binh Hoàng Kim',
  'Bậc Thầy Lửa Cam',
  'Huyền Thoại Ngân Hà',
]

interface Props {
  page: PageId
  onNavigate: (p: PageId) => void
}

export default function Sidebar({ page, onNavigate }: Props) {
  const user = useAppStore((s) => s.user)
  const totalAC = useAppStore((s) => s.totalAC)
  const milestoneIndex = useAppStore((s) => s.milestoneIndex)

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 p-4 gap-2">
      <div className="glass-strong flex-1 flex flex-col p-4 overflow-y-auto">
        <div className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-sky-600 to-amber-500 bg-clip-text text-transparent">
          Hành ổn trí viễn
        </div>
        <div className="text-[11px] font-bold text-amber-500 mb-4">[CODE]</div>

        <nav className="flex flex-col gap-1" aria-label="Điều hướng chính">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              aria-current={page === item.id ? 'page' : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left
                ${page === item.id
                  ? 'bg-gradient-to-r from-sky-500 to-sky-400 text-white shadow-md shadow-sky-300/50'
                  : 'text-slate-600 hover:bg-sky-100/70 hover:translate-x-1'
                }`}
            >
              <span aria-hidden="true">{item.emoji}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* hồ sơ người dùng */}
        <div className="mt-auto pt-4">
          <div className="rounded-2xl bg-gradient-to-br from-sky-100 to-amber-50 border border-white p-3 flex items-center gap-3">
            <div className="w-14 h-14 shrink-0 -ml-1">
              <BirdCharacter state="idle" size={56} />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm truncate">{user.name}</div>
              <div className="text-[11px] text-sky-600 font-semibold truncate">
                {RANK_TITLES[milestoneIndex]} · {MILESTONES[milestoneIndex].rating}
              </div>
              <div className="text-[11px] text-slate-500">⚡ {totalAC} AC · 🪙 {user.coins}</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

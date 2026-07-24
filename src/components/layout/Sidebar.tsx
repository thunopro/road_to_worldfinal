import { MILESTONES } from '../../data/milestones'
import { useAppStore } from '../../store/useAppStore'
import BirdCharacter from '../journey/BirdCharacter'
import ribbon from '../../assets/ui/ribbon.png'
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
  const milestoneIndex = useAppStore((s) => s.milestoneIndex)

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 p-4 gap-2">
      <div className="game-panel flex-1 flex flex-col overflow-y-auto">
        {/* banner ruy băng tựa game */}
        <div className="relative -mt-2 mb-3 select-none">
          <img src={ribbon} alt="" className="w-full" style={{ imageRendering: 'pixelated' }} draggable={false} />
          <div className="absolute inset-0 flex flex-col items-center justify-center pb-3">
            <span className="text-[13px] font-extrabold text-amber-50 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] leading-tight">
              roadtoworld
            </span>
            <span className="text-[11px] font-extrabold text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
              FINAL
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5 px-1" aria-label="Điều hướng chính">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              aria-current={page === item.id ? 'page' : undefined}
              className={`game-btn flex items-center gap-3 px-3 py-2.5 text-sm font-extrabold text-left
                ${page === item.id
                  ? 'bg-gradient-to-b from-sky-400 to-sky-500 border-sky-700 text-white shadow-md'
                  : 'bg-[#fdf6e3] border-[#d8c9a3] text-[#5c4d33] hover:bg-amber-50 hover:translate-x-0.5'
                }`}
              style={{ borderWidth: '2px', borderBottomWidth: '4px', borderStyle: 'solid' }}
            >
              <span aria-hidden="true">{item.emoji}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* hồ sơ người dùng */}
        <div className="mt-auto pt-4 px-1 pb-1">
          <div className="game-inset p-3 flex items-center gap-3">
            <div className="w-14 h-14 shrink-0 -ml-1">
              <BirdCharacter state="idle" size={56} />
            </div>
            <div className="min-w-0">
              <div className="font-extrabold text-sm truncate text-[#3d3222]">{user.name}</div>
              <div className="text-[11px] text-sky-700 font-bold truncate">
                {RANK_TITLES[milestoneIndex]} · {MILESTONES[milestoneIndex].rating}
              </div>
              <div className="text-[11px] font-bold text-amber-600">🪙 {user.coins} xu</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

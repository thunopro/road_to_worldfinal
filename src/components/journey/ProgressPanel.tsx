import { motion } from 'framer-motion'
import { FINAL_UNLOCK_COINS, MILESTONE_UNLOCK_COINS, MILESTONES } from '../../data/milestones'
import { itemById } from '../../data/shop'
import { MILESTONE_ITEM_REWARDS, nextRating, useAppStore } from '../../store/useAppStore'

/** khiên rating nhỏ dùng trong bảng tiến độ */
function MiniShield({ rating, color }: { rating: number; color: string }) {
  return (
    <svg width={86} height={92} viewBox="0 0 86 92" aria-hidden="true">
      <defs>
        <linearGradient id={`mini-shield-${rating}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={color} stopOpacity={0.72} />
        </linearGradient>
      </defs>
      <path
        d="M43 4 L80 12 L80 46 Q80 74 43 88 Q6 74 6 46 L6 12 Z"
        fill={`url(#mini-shield-${rating})`}
        stroke="#d9a92c"
        strokeWidth={3}
      />
      <path
        d="M43 10 L74 17 L74 45 Q74 68 43 81 Q12 68 12 45 L12 17 Z"
        fill="none"
        stroke="#ffffff"
        strokeOpacity={0.4}
        strokeWidth={1.5}
      />
      <text x={43} y={53} textAnchor="middle" fontSize={20} fontWeight={800} fill="#fff">
        {rating}
      </text>
    </svg>
  )
}

/** Bảng tiến độ cột mốc hiện tại theo phong cách game */
export default function ProgressPanel() {
  const milestoneIndex = useAppStore((s) => s.milestoneIndex)
  const milestoneProgress = useAppStore((s) => s.milestoneProgress)
  const perMilestone = useAppStore((s) => s.settings.problemsPerMilestone)

  const current = MILESTONES[milestoneIndex]
  const next = nextRating(milestoneIndex)
  const pct = Math.round((milestoneProgress / perMilestone) * 100)
  const remaining = perMilestone - milestoneProgress

  const journeyTotal = (MILESTONES.length - 1) * perMilestone
  const journeyDone = milestoneIndex * perMilestone + milestoneProgress
  const journeyPct = Math.min(100, Math.round((journeyDone / journeyTotal) * 100))

  const rewardCoins = next === 2400 ? FINAL_UNLOCK_COINS : MILESTONE_UNLOCK_COINS
  const rewardSkin = next ? itemById(MILESTONE_ITEM_REWARDS[next]) : undefined

  return (
    <div className="game-panel relative p-2 pt-4">
      {/* nhãn nổi trên viền */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#2f3b5c] border-2 border-[#4a5a85] shadow-md text-[11px] font-extrabold tracking-widest text-amber-200 whitespace-nowrap">
        ✦ CỘT MỐC HIỆN TẠI ✦
      </div>

      <div className="grid md:grid-cols-[auto_1.7fr_1fr] gap-5 items-center">
        {/* khiên rating */}
        <div className="flex md:flex-col items-center gap-2 justify-center">
          <MiniShield rating={current.rating} color={current.color} />
          <div className="text-xs font-extrabold text-[#8a7550]">Rating</div>
        </div>

        {/* tiến độ */}
        <div>
          <h3 className="font-extrabold text-lg" style={{ color: current.color }}>
            Tiến độ cột mốc {current.rating}
          </h3>
          <div className="mt-2.5 flex items-center gap-3">
            <div
              className="flex-1 h-5 rounded-full bg-[#e6d9b8] border-2 border-[#c9b78d] overflow-hidden shadow-inner"
              role="progressbar"
              aria-valuenow={milestoneProgress}
              aria-valuemin={0}
              aria-valuemax={perMilestone}
              aria-label={`Tiến độ cột mốc: ${milestoneProgress} trên ${perMilestone} bài`}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${current.color}, #60a5fa)` }}
                initial={false}
                animate={{ width: `${pct}%` }}
                transition={{ type: 'spring', stiffness: 60, damping: 15 }}
              />
            </div>
            <div className="text-sm font-extrabold whitespace-nowrap">
              {milestoneProgress} <span className="text-slate-400">/ {perMilestone}</span>{' '}
              <span className="text-xs font-bold text-slate-500">đã giải</span>
            </div>
          </div>

          <div className="mt-3 game-inset px-3.5 py-2 text-sm font-semibold text-slate-600 inline-block">
            {next ? (
              <>Giải thêm <b className="text-sky-600">{remaining} bài</b> để mở khóa cột mốc <b style={{ color: MILESTONES[milestoneIndex + 1].color }}>{next}</b> 🍃</>
            ) : (
              <>👑 Bạn đã chinh phục toàn bộ hành trình!</>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-[#8a7550]">
            <span className="font-bold whitespace-nowrap">Toàn hành trình</span>
            <div className="flex-1 h-2 rounded-full bg-[#e6d9b8] overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-sky-400 via-violet-400 to-amber-400" style={{ width: `${journeyPct}%` }} />
            </div>
            <span className="font-extrabold text-slate-600">{journeyPct}%</span>
          </div>
        </div>

        {/* phần thưởng cột mốc */}
        <div className="md:border-l-2 md:border-[#d8c9a3] md:pl-5">
          <div className="text-sm font-extrabold text-[#5c4d33] mb-2.5 text-center md:text-left">Phần thưởng cột mốc</div>
          <div className="grid grid-cols-3 gap-2">
            <div className="game-inset p-2.5 text-center">
              <div className="text-2xl" aria-hidden="true">💎</div>
              <div className="text-sm font-extrabold text-sky-600">{rewardCoins}</div>
              <div className="text-[10px] font-bold text-[#8a7550]">Xu</div>
            </div>
            <div className="game-inset p-2.5 text-center">
              <div className="text-2xl" aria-hidden="true">🏅</div>
              <div className="text-sm font-extrabold text-amber-600">1</div>
              <div className="text-[10px] font-bold text-[#8a7550]">Huy hiệu</div>
            </div>
            <div className="game-inset p-2.5 text-center">
              <div className="text-2xl" aria-hidden="true">{rewardSkin ? rewardSkin.emoji : '🐦'}</div>
              <div className="text-sm font-extrabold text-teal-600">{rewardSkin ? 1 : '—'}</div>
              <div className="text-[10px] font-bold text-[#8a7550]">Skin</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

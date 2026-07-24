import { memo } from 'react'
import type { MilestoneDef } from '../../types'
import towerBlue from '../../assets/towers/tower-blue.png'
import archeryBlue from '../../assets/towers/archery-blue.png'
import barracksBlue from '../../assets/towers/barracks-blue.png'
import monasteryBlue from '../../assets/towers/monastery-blue.png'
import barracksRed from '../../assets/towers/barracks-red.png'
import castleRed from '../../assets/towers/castle-red.png'

interface Props {
  milestone: MilestoneDef
  status: 'done' | 'current' | 'locked'
  solvedCount: number
  /** tiến độ 0..1, chỉ dùng cho tháp hiện tại */
  progress?: number
  requirement?: number
  glowing?: boolean
}

interface TierSprite {
  src: string
  /** chiều rộng hiển thị (px) — chiều cao tự theo tỷ lệ gốc */
  width: number
  aspect: number // height / width của file gốc
  /** CSS filter đổi tông màu theo tier */
  filter?: string
}

/**
 * Mỗi tier là một công trình khác nhau từ bộ asset Tiny Swords (Pixel Frog, CC0),
 * tăng dần độ hoành tráng như hệ rank: tháp → trại cung → doanh trại → tu viện
 * → tháp hoàng kim → pháo đài lửa → lâu đài huyền thoại.
 */
const TIER_SPRITES: TierSprite[] = [
  { src: towerBlue, width: 100, aspect: 2 },                                                              // 1200 — xanh dương
  { src: archeryBlue, width: 124, aspect: 256 / 192, filter: 'hue-rotate(-45deg) saturate(1.2)' },        // 1400 — teal
  { src: barracksBlue, width: 130, aspect: 256 / 192, filter: 'saturate(1.35) brightness(0.9)' },         // 1600 — xanh đậm
  { src: monasteryBlue, width: 112, aspect: 320 / 192, filter: 'hue-rotate(55deg)' },                     // 1800 — tím
  { src: towerBlue, width: 104, aspect: 2, filter: 'sepia(1) saturate(2.4) hue-rotate(-15deg) brightness(1.08)' }, // 2000 — hoàng kim
  { src: barracksRed, width: 130, aspect: 256 / 192 },                                                    // 2200 — đỏ lửa
  { src: castleRed, width: 172, aspect: 256 / 320, filter: 'hue-rotate(260deg) saturate(1.05)' },         // 2400 — tím huyền thoại
]

function MilestoneTower({ milestone, status, progress = 0, requirement = 100, glowing = false }: Props) {
  const locked = status === 'locked'
  const c = milestone.color
  const uid = milestone.rating
  const tier = Math.round((milestone.rating - 1200) / 200)
  const sprite = TIER_SPRITES[tier]
  const spriteH = Math.round(sprite.width * sprite.aspect)

  return (
    <div
      className={`flex flex-col items-center transition-all duration-500 ${locked ? 'opacity-90 saturate-[.65]' : ''}`}
      style={{ width: 200 }}
    >
      <div
        className="relative"
        style={{ width: 200, height: 280, ...(glowing ? { animation: 'pulse-scale 0.8s ease-in-out 3' } : {}) }}
      >
        {/* hào quang */}
        {(glowing || status !== 'locked') && (
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              left: 10,
              top: 50,
              width: 180,
              height: 180,
              background: `radial-gradient(circle, ${milestone.colorSoft} 0%, transparent 70%)`,
              opacity: glowing ? 0.95 : status === 'current' ? 0.5 : 0.3,
            }}
          />
        )}

        {/* đảo đá lơ lửng */}
        <svg className="absolute bottom-0 left-0" width={200} height={84} viewBox="0 0 200 84" aria-hidden="true">
          <defs>
            <linearGradient id={`rock-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a8b8cb" />
              <stop offset="100%" stopColor="#657891" />
            </linearGradient>
          </defs>
          <path
            d="M28 26 L172 26 L154 52 L132 44 L112 74 L88 50 L64 62 L44 42 Z"
            fill={`url(#rock-${uid})`}
            stroke="#546b85"
            strokeWidth={1.5}
          />
          <ellipse cx={100} cy={26} rx={78} ry={15} fill="#dceafa" stroke="#b9d0e8" strokeWidth={1.5} />
          <path d="M22 24 Q100 8 178 24 L178 30 Q100 16 22 30 Z" fill="#8fd3a0" opacity={0.9} />
          {/* mây ôm chân đảo */}
          <g fill="#ffffff">
            <ellipse cx={36} cy={36} rx={30} ry={12} opacity={0.95} />
            <ellipse cx={162} cy={40} rx={32} ry={13} opacity={0.95} />
            <ellipse cx={100} cy={62} rx={38} ry={13} opacity={0.9} />
            <ellipse cx={68} cy={50} rx={22} ry={10} opacity={0.85} />
            <ellipse cx={134} cy={54} rx={20} ry={9} opacity={0.85} />
          </g>
        </svg>

        {/* công trình của tier (Tiny Swords, CC0) */}
        <img
          src={sprite.src}
          alt=""
          draggable={false}
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none select-none"
          style={{
            bottom: 54,
            width: sprite.width,
            height: spriteH,
            imageRendering: 'pixelated',
            filter: sprite.filter,
          }}
        />

        {/* khiên rating viền vàng */}
        <svg
          className="absolute left-1/2 -translate-x-1/2"
          style={{ bottom: 8 }}
          width={78}
          height={86}
          viewBox="0 0 86 92"
          aria-hidden="true"
        >
          <defs>
            {tier === 6 ? (
              <linearGradient id={`shield-${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="60%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            ) : (
              <linearGradient id={`shield-${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c} />
                <stop offset="100%" stopColor={c} stopOpacity={0.75} />
              </linearGradient>
            )}
          </defs>
          <path
            d="M43 4 L80 12 L80 46 Q80 74 43 88 Q6 74 6 46 L6 12 Z"
            fill={`url(#shield-${uid})`}
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
          <text x={43} y={54} textAnchor="middle" fontSize={19} fontWeight={800} fill="#ffffff" style={{ textShadow: '0 2px 3px rgba(0,0,0,0.35)' }}>
            {uid}
          </text>

          {/* điểm nhấn theo tier trên khiên */}
          {tier === 1 && <circle cx={43} cy={5} r={5} fill="#2dd4bf" stroke="#d9a92c" strokeWidth={1.8} />}
          {tier === 2 && <path d="M43 -2 L49 6 L43 14 L37 6 Z" fill="#3b82f6" stroke="#d9a92c" strokeWidth={1.6} />}
          {tier === 3 && <path d="M43 -2 L48 5 L43 12 L38 5 Z" fill="#c4b5fd" stroke="#8b5cf6" strokeWidth={1.6} />}
          {(tier === 4 || tier === 6) && (
            <path
              d="M30 6 L34 -6 L40 3 L43 -9 L46 3 L52 -6 L56 6 Z"
              fill="#fbbf24"
              stroke="#d97706"
              strokeWidth={1.4}
            />
          )}
          {tier === 5 && <path d="M39 8 Q41 -4 44 5 Q46 -1 48 8 Z" fill="#fb923c" stroke="#d97706" strokeWidth={1} />}
        </svg>

        {/* ổ khóa khi chưa mở */}
        {locked && (
          <div
            className="absolute left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-slate-700/90 border-2 border-white flex items-center justify-center text-base shadow-lg"
            style={{ bottom: 0 }}
            aria-label="Milestone đang khóa"
          >
            🔒
          </div>
        )}

        {/* dấu hoàn thành */}
        {status === 'done' && (
          <div
            className="absolute right-6 w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-sm font-extrabold shadow-md"
            style={{ top: 44 }}
            aria-label="Đã hoàn thành"
          >
            ✓
          </div>
        )}

        {/* nhãn tiến độ cho tháp hiện tại */}
        {status === 'current' && (
          <div
            className="absolute top-3 left-1/2 -translate-x-1/2 bg-white/95 rounded-full px-3 py-1 text-xs font-extrabold shadow-md whitespace-nowrap"
            style={{ color: c, animation: 'float-y 1.6s ease-in-out infinite' }}
          >
            {Math.round(progress * requirement)}/{requirement} bài
          </div>
        )}
      </div>

      <div className="-mt-1 text-center">
        <div className="text-sm font-extrabold drop-shadow-sm" style={{ color: locked ? '#64748b' : c }}>{milestone.name}</div>
      </div>
    </div>
  )
}

export default memo(MilestoneTower)

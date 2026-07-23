import { motion } from 'framer-motion'
import type { MilestoneDef } from '../../types'

interface Props {
  milestone: MilestoneDef
  status: 'done' | 'current' | 'locked'
  solvedCount: number
  /** tiến độ 0..1, chỉ dùng cho tháp hiện tại */
  progress?: number
  requirement?: number
  glowing?: boolean
}

/** Tòa tháp milestone nằm trên đảo mây */
export default function MilestoneTower({ milestone, status, solvedCount, progress = 0, requirement = 100, glowing = false }: Props) {
  const locked = status === 'locked'
  const c = milestone.color

  return (
    <div
      className={`flex flex-col items-center transition-all duration-500 ${locked ? 'opacity-60 grayscale blur-[0.6px]' : ''}`}
      style={{ width: 190 }}
    >
      <div className="relative">
        <motion.svg
          width={170}
          height={225}
          viewBox="0 0 170 225"
          animate={glowing ? { scale: [1, 1.06, 1] } : {}}
          transition={{ duration: 0.8, repeat: glowing ? 3 : 0 }}
        >
          <defs>
            <linearGradient id={`tower-${milestone.rating}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c} stopOpacity={0.95} />
              <stop offset="100%" stopColor={c} stopOpacity={0.65} />
            </linearGradient>
            <radialGradient id={`halo-${milestone.rating}`}>
              <stop offset="0%" stopColor={milestone.colorSoft} stopOpacity={0.9} />
              <stop offset="100%" stopColor={milestone.colorSoft} stopOpacity={0} />
            </radialGradient>
          </defs>

          {(glowing || status === 'done') && (
            <circle cx={85} cy={110} r={80} fill={`url(#halo-${milestone.rating})`} opacity={glowing ? 0.9 : 0.35} />
          )}

          {/* đảo mây */}
          <ellipse cx={85} cy={196} rx={72} ry={20} fill="#eef7ff" stroke="#cde4f5" strokeWidth={2} />
          <ellipse cx={85} cy={202} rx={50} ry={13} fill="#dcedfb" />
          <ellipse cx={40} cy={190} rx={16} ry={7} fill="#ffffff" opacity={0.9} />
          <ellipse cx={132} cy={192} rx={14} ry={6} fill="#ffffff" opacity={0.9} />

          {/* thân tháp 3 tầng */}
          <rect x={55} y={118} width={60} height={78} rx={8} fill={`url(#tower-${milestone.rating})`} stroke={c} strokeWidth={1.5} />
          <rect x={62} y={82} width={46} height={44} rx={7} fill={c} opacity={0.85} />
          <rect x={68} y={52} width={34} height={36} rx={6} fill={c} />

          {/* cửa sổ vàng */}
          <circle cx={75} cy={140} r={5} fill="#fde68a" />
          <circle cx={95} cy={140} r={5} fill="#fde68a" />
          <circle cx={85} cy={165} r={6} fill="#fde68a" />
          <circle cx={85} cy={100} r={5} fill="#fff7d6" />
          <rect x={80} y={62} width={10} height={12} rx={3} fill="#fff7d6" />

          {/* mái + cờ */}
          <path d="M64 52 L85 30 L106 52 Z" fill={c} stroke="#ffffff" strokeOpacity={0.4} />
          <line x1={85} y1={30} x2={85} y2={12} stroke="#475569" strokeWidth={2.5} />
          <motion.path
            d="M85 12 L110 19 L85 26 Z"
            fill={status === 'done' ? '#fbbf24' : c}
            animate={{ skewY: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* huy hiệu rating */}
          <rect x={49} y={205} width={72} height={20} rx={10} fill={locked ? '#94a3b8' : c} />
          <text x={85} y={219} textAnchor="middle" fontSize={13} fontWeight={800} fill="#ffffff">
            {milestone.rating}
          </text>

          {/* dấu hoàn thành */}
          {status === 'done' && (
            <g>
              <circle cx={130} cy={60} r={13} fill="#22c55e" stroke="#fff" strokeWidth={2.5} />
              <path d="M124 60 L128.5 65 L136.5 55" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" />
            </g>
          )}
        </motion.svg>

        {/* ổ khóa cho milestone chưa mở */}
        {locked && (
          <div className="absolute inset-0 flex items-center justify-center" aria-label="Milestone đang khóa">
            <div className="bg-slate-700/70 backdrop-blur-[2px] rounded-2xl px-3 py-2 text-3xl shadow-lg">🔒</div>
          </div>
        )}

        {/* vòng tiến độ cho tháp hiện tại */}
        {status === 'current' && (
          <motion.div
            className="absolute -top-1 left-1/2 -translate-x-1/2 bg-white/90 rounded-full px-3 py-1 text-xs font-bold shadow-md"
            style={{ color: c }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            {Math.round(progress * requirement)}/{requirement} bài
          </motion.div>
        )}
      </div>

      <div className="mt-1 text-center">
        <div className="text-sm font-bold" style={{ color: locked ? '#64748b' : c }}>{milestone.name}</div>
        <div className="text-xs text-slate-500">{solvedCount} bài đã giải tại mức này</div>
      </div>
    </div>
  )
}

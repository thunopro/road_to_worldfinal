import { memo, type CSSProperties } from 'react'
import type { BirdVisualState } from '../../types'
import { itemById } from '../../data/shop'
import { useAppStore } from '../../store/useAppStore'

interface Props {
  state: BirdVisualState
  size?: number
}

/** cấu hình animation CSS cho từng trạng thái của chim */
const BODY_ANIM: Record<BirdVisualState, string> = {
  idle: 'bob 2.4s ease-in-out infinite',
  flying: 'bob-fast 0.7s ease-in-out infinite',
  eating: 'pulse-scale 0.9s ease-in-out infinite',
  celebrating: 'spin-celebrate 1.7s ease-in-out infinite',
  tired: 'bob 3.2s ease-in-out infinite',
  worried: 'shake-x 1.6s ease-in-out infinite',
}

/**
 * Linh vật: chú chim phi công đáng yêu, vẽ hoàn toàn bằng SVG.
 * Mọi chuyển động lặp dùng CSS keyframes (chạy trên compositor) để không gây giật lag.
 */
function BirdCharacter({ state, size = 120 }: Props) {
  const equipped = useAppStore((s) => s.collection.equipped)
  const reducedMotion = useAppStore((s) => s.settings.reducedMotion)

  const scarfColor = itemById(equipped.scarf)?.color ?? '#ef4444'
  const goggleColor = itemById(equipped.goggles)?.color ?? '#7dd3fc'
  const wingColor = itemById(equipped.wing)?.color ?? '#93c5fd'
  const hatId = equipped.hat

  const flap =
    state === 'flying' ? 0.3 : state === 'celebrating' ? 0.45 : state === 'tired' ? 2.4 : 1.1

  /** helper: trả về style animation, tôn trọng chế độ giảm chuyển động */
  const anim = (value: string): CSSProperties =>
    reducedMotion ? {} : { animation: value }

  const glowing = state === 'eating' || state === 'celebrating'

  return (
    <div
      style={{ width: size, height: size, ...anim(BODY_ANIM[state]) }}
      aria-label={`Chú chim đang ở trạng thái ${state}`}
      role="img"
    >
      <svg
        viewBox="0 0 140 140"
        width="100%"
        height="100%"
        style={state === 'flying' ? { transform: 'rotate(7deg)' } : undefined}
      >
        {/* hào quang khi ăn năng lượng / chúc mừng */}
        {glowing && (
          <circle cx={70} cy={78} r={52} fill="url(#birdGlow)" style={anim('glow-pulse 0.9s ease-in-out infinite')} />
        )}
        <defs>
          <radialGradient id="birdGlow">
            <stop offset="0%" stopColor="#fde68a" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* cánh trái */}
        <ellipse
          cx={34}
          cy={80}
          rx={17}
          ry={9}
          fill={wingColor}
          stroke="#7aa8d8"
          strokeWidth={1.5}
          style={{ transformOrigin: '48px 76px', ...anim(`wing-flap-l ${flap}s ease-in-out infinite`) }}
        />
        {/* cánh phải */}
        <ellipse
          cx={106}
          cy={80}
          rx={17}
          ry={9}
          fill={wingColor}
          stroke="#7aa8d8"
          strokeWidth={1.5}
          style={{ transformOrigin: '92px 76px', ...anim(`wing-flap-r ${flap}s ease-in-out infinite`) }}
        />

        {/* thân */}
        <ellipse cx={70} cy={78} rx={33} ry={31} fill="#ffffff" stroke="#a8cbe8" strokeWidth={2} />
        {/* bụng xanh nhạt */}
        <ellipse cx={70} cy={90} rx={21} ry={15} fill="#dbeeff" />
        {/* chỏm lông đầu */}
        <path d="M62 48 Q70 38 78 48 Q74 44 70 46 Q66 44 62 48Z" fill="#bfdcf5" />

        {/* mũ (nếu trang bị) */}
        {hatId === 'hat-cap' && (
          <g>
            <path d="M50 46 Q70 28 90 46 L90 50 L50 50 Z" fill="#0ea5e9" />
            <rect x={86} y={44} width={20} height={6} rx={3} fill="#0284c7" />
          </g>
        )}
        {hatId === 'hat-wizard' && (
          <g>
            <path d="M70 12 L88 48 L52 48 Z" fill="#7c3aed" />
            <circle cx={70} cy={14} r={4} fill="#fde68a" />
            <rect x={48} y={45} width={44} height={6} rx={3} fill="#6d28d9" />
          </g>
        )}
        {hatId === 'hat-crown' && (
          <path d="M54 46 L58 32 L66 42 L70 28 L74 42 L82 32 L86 46 Z" fill="#f59e0b" stroke="#d97706" strokeWidth={1.5} />
        )}

        {/* kính phi công (gọng trên trán, viền vàng) */}
        <rect x={40} y={50} width={60} height={5} rx={2.5} fill="#8b6d3f" opacity={0.85} />
        <circle cx={56} cy={52} r={9} fill={goggleColor} opacity={0.5} stroke="#d4af37" strokeWidth={2.5} />
        <circle cx={84} cy={52} r={9} fill={goggleColor} opacity={0.5} stroke="#d4af37" strokeWidth={2.5} />

        {/* má hồng */}
        <ellipse cx={46} cy={77} rx={5} ry={3.2} fill="#fda4af" opacity={0.7} />
        <ellipse cx={94} cy={77} rx={5} ry={3.2} fill="#fda4af" opacity={0.7} />

        {/* mắt to biểu cảm */}
        {state === 'eating' || state === 'celebrating' ? (
          <g stroke="#0f2b46" strokeWidth={3} strokeLinecap="round" fill="none">
            <path d="M50 68 Q56 62 62 68" />
            <path d="M78 68 Q84 62 90 68" />
          </g>
        ) : state === 'tired' ? (
          <g>
            <circle cx={56} cy={69} r={7.5} fill="#fff" stroke="#94a3b8" strokeWidth={1.5} />
            <circle cx={84} cy={69} r={7.5} fill="#fff" stroke="#94a3b8" strokeWidth={1.5} />
            <circle cx={56} cy={71} r={3.4} fill="#0f2b46" />
            <circle cx={84} cy={71} r={3.4} fill="#0f2b46" />
            <rect x={47} y={60} width={18} height={8} rx={4} fill="#e9f3fc" />
            <rect x={75} y={60} width={18} height={8} rx={4} fill="#e9f3fc" />
          </g>
        ) : (
          <g>
            <circle cx={56} cy={68} r={8.5} fill="#fff" stroke="#94a3b8" strokeWidth={1.5} />
            <circle cx={84} cy={68} r={8.5} fill="#fff" stroke="#94a3b8" strokeWidth={1.5} />
            <circle cx={57.5} cy={68} r={4} fill="#0f2b46" />
            <circle cx={85.5} cy={68} r={4} fill="#0f2b46" />
            <circle cx={59} cy={66.4} r={1.4} fill="#fff" />
            <circle cx={87} cy={66.4} r={1.4} fill="#fff" />
            {state === 'worried' && (
              <g stroke="#64748b" strokeWidth={2.4} strokeLinecap="round">
                <path d="M49 58 L63 61" fill="none" />
                <path d="M91 58 L77 61" fill="none" />
              </g>
            )}
          </g>
        )}

        {/* mỏ */}
        {state === 'eating' ? (
          <g>
            <path d="M62 78 Q70 74 78 78 L70 84 Z" fill="#fb923c" />
            <path d="M62 80 Q70 90 78 80 L70 85 Z" fill="#f97316" />
            {/* hạt năng lượng đang ăn */}
            <circle
              cx={70}
              cy={83}
              r={4}
              fill="#fde047"
              style={{ transformOrigin: '70px 83px', ...anim('seed-fade 0.6s ease-in-out infinite') }}
            />
          </g>
        ) : (
          <path d="M63 76 Q70 72 77 76 Q70 84 63 76Z" fill="#fb923c" stroke="#ea8324" strokeWidth={1} />
        )}

        {/* khăn choàng */}
        <path d="M46 92 Q70 102 94 92 L92 100 Q70 110 48 100 Z" fill={scarfColor} />
        <path
          d="M88 96 Q100 100 104 110 Q96 108 90 102 Z"
          fill={scarfColor}
          style={{ transformOrigin: '88px 96px', ...anim('flag-wave 1.4s ease-in-out infinite') }}
        />

        {/* chân */}
        <g stroke="#f59e0b" strokeWidth={3} strokeLinecap="round">
          <path d="M62 108 L60 118" fill="none" />
          <path d="M78 108 L80 118" fill="none" />
        </g>

        {/* mồ hôi khi lo lắng */}
        {state === 'worried' && (
          <path
            d="M98 56 Q102 62 98 66 Q94 62 98 56Z"
            fill="#7dd3fc"
            style={anim('drift-fade 1.2s ease-in infinite')}
          />
        )}

        {/* Zzz khi mệt mỏi */}
        {state === 'tired' && (
          <text
            x={104}
            y={48}
            fontSize={16}
            fontWeight={700}
            fill="#64748b"
            style={anim('drift-fade 1.8s ease-in infinite')}
          >
            Zz
          </text>
        )}

        {/* sao lấp lánh khi chúc mừng */}
        {state === 'celebrating' && (
          <g>
            {[
              [24, 40], [116, 44], [30, 110], [112, 108], [70, 20],
            ].map(([x, y], i) => (
              <path
                key={i}
                d={`M${x} ${y - 6} L${x + 1.8} ${y - 1.8} L${x + 6} ${y} L${x + 1.8} ${y + 1.8} L${x} ${y + 6} L${x - 1.8} ${y + 1.8} L${x - 6} ${y} L${x - 1.8} ${y - 1.8} Z`}
                fill="#fbbf24"
                style={{
                  transformOrigin: `${x}px ${y}px`,
                  ...anim(`star-twinkle 0.8s ease-in-out ${i * 0.15}s infinite`),
                }}
              />
            ))}
          </g>
        )}
      </svg>
    </div>
  )
}

export default memo(BirdCharacter)

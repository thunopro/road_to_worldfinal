import { motion } from 'framer-motion'
import type { BirdVisualState } from '../../types'
import { itemById } from '../../data/shop'
import { useAppStore } from '../../store/useAppStore'

interface Props {
  state: BirdVisualState
  size?: number
}

/**
 * Linh vật: chú chim phi công đáng yêu, vẽ hoàn toàn bằng SVG.
 * Trang phục (khăn, kính, mũ, màu cánh) lấy từ bộ sưu tập đã trang bị.
 */
export default function BirdCharacter({ state, size = 120 }: Props) {
  const equipped = useAppStore((s) => s.collection.equipped)
  const reducedMotion = useAppStore((s) => s.settings.reducedMotion)

  const scarfColor = itemById(equipped.scarf)?.color ?? '#ef4444'
  const goggleColor = itemById(equipped.goggles)?.color ?? '#7dd3fc'
  const wingColor = itemById(equipped.wing)?.color ?? '#93c5fd'
  const hatId = equipped.hat

  const flap =
    state === 'flying' ? 0.3 : state === 'celebrating' ? 0.45 : state === 'tired' ? 2.4 : 1.1

  const bodyAnim = reducedMotion
    ? {}
    : state === 'flying'
      ? { y: [0, -4, 0], rotate: [6, 8, 6] }
      : state === 'celebrating'
        ? { rotate: [0, 360], scale: [1, 1.12, 1] }
        : state === 'eating'
          ? { scale: [1, 1.12, 1], y: [0, 2, 0] }
          : state === 'tired'
            ? { y: [0, 3, 0], rotate: [4, 5, 4] }
            : state === 'worried'
              ? { x: [0, -2, 2, 0], y: [0, -2, 0] }
              : { y: [0, -7, 0] } // idle: lơ lửng đập cánh nhẹ

  const bodyTransition =
    state === 'celebrating'
      ? { duration: 1.1, repeat: Infinity, repeatDelay: 0.6, ease: 'easeInOut' as const }
      : { duration: state === 'flying' ? 0.7 : 2.4, repeat: Infinity, ease: 'easeInOut' as const }

  const glowing = state === 'eating' || state === 'celebrating'

  return (
    <motion.div
      style={{ width: size, height: size }}
      animate={bodyAnim}
      transition={bodyTransition}
      aria-label={`Chú chim đang ở trạng thái ${state}`}
      role="img"
    >
      <svg viewBox="0 0 140 140" width="100%" height="100%">
        {/* hào quang khi ăn năng lượng / chúc mừng */}
        {glowing && (
          <motion.circle
            cx={70}
            cy={78}
            r={52}
            fill="url(#birdGlow)"
            animate={reducedMotion ? {} : { opacity: [0.4, 0.9, 0.4], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 0.9, repeat: Infinity }}
          />
        )}
        <defs>
          <radialGradient id="birdGlow">
            <stop offset="0%" stopColor="#fde68a" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* cánh trái */}
        <motion.ellipse
          cx={34}
          cy={80}
          rx={17}
          ry={9}
          fill={wingColor}
          stroke="#7aa8d8"
          strokeWidth={1.5}
          style={{ originX: '48px', originY: '76px' }}
          animate={reducedMotion ? {} : { rotate: [18, -26, 18] }}
          transition={{ duration: flap, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* cánh phải */}
        <motion.ellipse
          cx={106}
          cy={80}
          rx={17}
          ry={9}
          fill={wingColor}
          stroke="#7aa8d8"
          strokeWidth={1.5}
          style={{ originX: '92px', originY: '76px' }}
          animate={reducedMotion ? {} : { rotate: [-18, 26, -18] }}
          transition={{ duration: flap, repeat: Infinity, ease: 'easeInOut' }}
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

        {/* kính phi công (gọng trên trán) */}
        <rect x={40} y={50} width={60} height={5} rx={2.5} fill="#64748b" opacity={0.8} />
        <circle cx={56} cy={52} r={9} fill={goggleColor} opacity={0.45} stroke="#475569" strokeWidth={2.5} />
        <circle cx={84} cy={52} r={9} fill={goggleColor} opacity={0.45} stroke="#475569" strokeWidth={2.5} />

        {/* mắt to biểu cảm */}
        {state === 'eating' || state === 'celebrating' ? (
          // mắt cười khép cong
          <g stroke="#0f2b46" strokeWidth={3} strokeLinecap="round" fill="none">
            <path d="M50 68 Q56 62 62 68" />
            <path d="M78 68 Q84 62 90 68" />
          </g>
        ) : state === 'tired' ? (
          // mắt lim dim
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
            <motion.circle
              cx={70}
              cy={83}
              r={4}
              fill="#fde047"
              animate={reducedMotion ? {} : { scale: [1, 0.4, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          </g>
        ) : (
          <path d="M63 76 Q70 72 77 76 Q70 84 63 76Z" fill="#fb923c" stroke="#ea8324" strokeWidth={1} />
        )}

        {/* khăn choàng */}
        <path
          d={`M46 92 Q70 102 94 92 L92 100 Q70 110 48 100 Z`}
          fill={scarfColor}
        />
        <motion.path
          d="M88 96 Q100 100 104 110 Q96 108 90 102 Z"
          fill={scarfColor}
          animate={reducedMotion ? {} : { rotate: [0, 8, 0], x: [0, 2, 0] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          style={{ originX: '88px', originY: '96px' }}
        />

        {/* chân */}
        <g stroke="#f59e0b" strokeWidth={3} strokeLinecap="round">
          <path d="M62 108 L60 118" fill="none" />
          <path d="M78 108 L80 118" fill="none" />
        </g>

        {/* mồ hôi khi lo lắng */}
        {state === 'worried' && (
          <motion.path
            d="M98 56 Q102 62 98 66 Q94 62 98 56Z"
            fill="#7dd3fc"
            animate={reducedMotion ? {} : { y: [0, 6], opacity: [1, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        )}

        {/* Zzz khi mệt mỏi */}
        {state === 'tired' && (
          <motion.text
            x={104}
            y={48}
            fontSize={16}
            fontWeight={700}
            fill="#64748b"
            animate={reducedMotion ? {} : { y: [-4, -14], opacity: [1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            Zz
          </motion.text>
        )}

        {/* sao lấp lánh khi chúc mừng */}
        {state === 'celebrating' && (
          <g>
            {[
              [24, 40], [116, 44], [30, 110], [112, 108], [70, 20],
            ].map(([x, y], i) => (
              <motion.path
                key={i}
                d={`M${x} ${y - 6} L${x + 1.8} ${y - 1.8} L${x + 6} ${y} L${x + 1.8} ${y + 1.8} L${x} ${y + 6} L${x - 1.8} ${y + 1.8} L${x - 6} ${y} L${x - 1.8} ${y - 1.8} Z`}
                fill="#fbbf24"
                animate={reducedMotion ? {} : { scale: [0.4, 1.2, 0.4], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </g>
        )}
      </svg>
    </motion.div>
  )
}

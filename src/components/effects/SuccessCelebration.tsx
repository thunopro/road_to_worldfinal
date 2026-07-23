import { motion } from 'framer-motion'
import { useAppStore } from '../../store/useAppStore'

const COLORS = ['#fbbf24', '#38bdf8', '#f97316', '#14b8a6', '#a78bfa', '#f472b6', '#facc15']

/** Mưa confetti toàn màn hình khi AC bài / mở khóa milestone */
export default function SuccessCelebration() {
  const phase = useAppStore((s) => s.phase)
  const reducedMotion = useAppStore((s) => s.settings.reducedMotion)

  if (reducedMotion || (phase !== 'celebrating' && phase !== 'milestone')) return null

  const count = phase === 'milestone' ? 60 : 36
  const pieces = Array.from({ length: count }, (_, i) => ({
    left: `${(i * 61) % 100}%`,
    color: COLORS[i % COLORS.length],
    delay: (i % 12) * 0.08,
    duration: 2.2 + ((i * 13) % 10) / 8,
    size: 7 + ((i * 5) % 7),
    round: i % 3 === 0,
  }))

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none overflow-hidden" aria-hidden="true">
      {pieces.map((p, i) => (
        <motion.span
          key={`${phase}-${i}`}
          className="absolute"
          style={{
            left: p.left,
            top: -20,
            width: p.size,
            height: p.round ? p.size : p.size * 1.6,
            background: p.color,
            borderRadius: p.round ? 999 : 2,
          }}
          initial={{ y: -30, rotate: 0, opacity: 1 }}
          animate={{ y: '110vh', rotate: 360 + (i % 4) * 180, opacity: [1, 1, 0.6] }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  )
}

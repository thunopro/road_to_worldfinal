import { AnimatePresence, motion } from 'framer-motion'
import { MILESTONES } from '../../data/milestones'
import { itemById } from '../../data/shop'
import { MILESTONE_ITEM_REWARDS, useAppStore } from '../../store/useAppStore'
import BirdCharacter from '../journey/BirdCharacter'

/** Màn hình mở khóa milestone: pháo hoa, ánh sáng vàng, phần thưởng */
export default function MilestoneUnlockAnimation() {
  const phase = useAppStore((s) => s.phase)
  const pendingUnlock = useAppStore((s) => s.pendingUnlock)
  const reducedMotion = useAppStore((s) => s.settings.reducedMotion)
  const setPhase = useAppStore((s) => s.setPhase)
  const clearPendingUnlock = useAppStore((s) => s.clearPendingUnlock)

  const show = phase === 'milestone' && pendingUnlock !== null
  const milestone = MILESTONES.find((m) => m.rating === pendingUnlock)
  const rewardItem = pendingUnlock ? itemById(MILESTONE_ITEM_REWARDS[pendingUnlock]) : undefined

  const close = () => {
    clearPendingUnlock()
    setPhase('none')
  }

  return (
    <AnimatePresence>
      {show && milestone && (
        <motion.div
          className="fixed inset-0 z-[65] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={`Milestone ${milestone.rating} đã được mở khóa`}
        >
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={close} />

          {/* tia sáng vàng tỏa tròn */}
          {!reducedMotion && (
            <motion.div
              className="absolute w-[520px] h-[520px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.5) 0%, rgba(251,191,36,0) 65%)' }}
              animate={{ scale: [0.8, 1.15, 0.95], opacity: [0.6, 1, 0.8] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
          )}

          {/* pháo hoa */}
          {!reducedMotion &&
            [0, 1, 2].map((burst) => (
              <div
                key={burst}
                className="absolute pointer-events-none"
                style={{ left: `${25 + burst * 25}%`, top: `${22 + (burst % 2) * 18}%` }}
              >
                {Array.from({ length: 10 }, (_, i) => {
                  const angle = (i / 10) * Math.PI * 2
                  return (
                    <motion.span
                      key={i}
                      className="absolute w-2 h-2 rounded-full"
                      style={{ background: ['#fbbf24', '#38bdf8', '#f472b6'][burst] }}
                      animate={{
                        x: [0, Math.cos(angle) * 70],
                        y: [0, Math.sin(angle) * 70],
                        opacity: [1, 0],
                        scale: [1, 0.4],
                      }}
                      transition={{ duration: 1.1, repeat: Infinity, delay: burst * 0.35 }}
                    />
                  )
                })}
              </div>
            ))}

          <motion.div
            className="relative glass-strong max-w-md w-full p-6 text-center"
            initial={{ scale: 0.7, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 16 }}
          >
            <div className="flex justify-center -mt-16 mb-2">
              <BirdCharacter state="celebrating" size={110} />
            </div>
            <div className="text-4xl mb-1" aria-hidden="true">🏰✨</div>
            <h2 className="text-2xl font-extrabold" style={{ color: milestone.color }}>
              Milestone {milestone.rating} đã được mở khóa!
            </h2>
            <p className="text-slate-500 mt-1 font-medium">Một chặng đường mới đã bắt đầu.</p>
            <p className="text-sm text-slate-600 mt-1">
              Chào mừng đến <b>{milestone.name}</b>
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm font-bold">
              <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 border border-amber-300">
                🏅 Huy hiệu {milestone.rating}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-300">
                🪙 +{milestone.rating === 2400 ? 500 : 150} xu
              </span>
              {rewardItem && (
                <span className="px-3 py-1.5 rounded-full bg-sky-100 text-sky-700 border border-sky-300">
                  {rewardItem.emoji} {rewardItem.name}
                </span>
              )}
            </div>

            <button
              onClick={close}
              autoFocus
              className="mt-6 w-full py-3 rounded-2xl font-extrabold text-white bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 shadow-lg shadow-amber-300/50 transition-all hover:scale-[1.02]"
            >
              Tiếp tục hành trình 🚀
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

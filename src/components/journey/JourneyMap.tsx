import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MILESTONES } from '../../data/milestones'
import { birdJourneyT, inactivityGap, useAppStore } from '../../store/useAppStore'
import type { BirdVisualState } from '../../types'
import ParallaxBackdrop from '../sky/ParallaxBackdrop'
import SkyBackground from '../sky/SkyBackground'
import BirdCharacter from './BirdCharacter'
import FlightPath from './FlightPath'
import MilestoneTower from './MilestoneTower'
import { ANCHOR_Y, anchorX, journeyWidth, JOURNEY_HEIGHT, pointAt } from './geometry'
import { itemById } from '../../data/shop'

/** Khu vực hành trình: bầu trời + tháp milestone + đường bay + chú chim */
export default function JourneyMap() {
  const problems = useAppStore((s) => s.problems)
  const milestoneIndex = useAppStore((s) => s.milestoneIndex)
  const milestoneProgress = useAppStore((s) => s.milestoneProgress)
  const perMilestone = useAppStore((s) => s.settings.problemsPerMilestone)
  const reducedMotion = useAppStore((s) => s.settings.reducedMotion)
  const phase = useAppStore((s) => s.phase)
  const streak = useAppStore((s) => s.streak)
  const equippedTrail = useAppStore((s) => s.collection.equipped.trail)

  const scrollRef = useRef<HTMLDivElement>(null)

  const targetT = birdJourneyT(milestoneIndex, milestoneProgress, perMilestone)
  // giữ chim đứng yên trong pha "ăn năng lượng", chỉ bay khi tới pha flying
  const [displayedT, setDisplayedT] = useState(targetT)
  useEffect(() => {
    if (phase === 'none' || phase === 'flying' || phase === 'celebrating' || phase === 'milestone') {
      setDisplayedT(targetT)
    }
  }, [phase, targetT])

  const birdPos = pointAt(displayedT)

  const birdState: BirdVisualState = useMemo(() => {
    if (phase === 'eating' || phase === 'orb') return 'eating'
    if (phase === 'flying') return 'flying'
    if (phase === 'celebrating' || phase === 'milestone') return 'celebrating'
    const gap = inactivityGap(streak)
    if (gap >= 3) return 'tired'
    if (gap >= 1 && streak.current > 0) return 'worried'
    return 'idle'
  }, [phase, streak])

  // số bài AC theo từng bucket rating của milestone
  const solvedPerMilestone = useMemo(() => {
    return MILESTONES.map((m) =>
      problems.filter((p) => p.status === 'AC' && p.rating >= m.rating && p.rating < m.rating + 200).length,
    )
  }, [problems])

  // tự cuộn tới vị trí chim
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const target = birdPos.x - el.clientWidth / 2
    el.scrollTo({ left: Math.max(0, target), behavior: reducedMotion ? 'auto' : 'smooth' })
  }, [birdPos.x, reducedMotion])

  const trailColor = itemById(equippedTrail)?.color
  const showTrail = trailColor && trailColor !== 'transparent' && (birdState === 'flying' || birdState === 'celebrating')

  return (
    <div
      ref={scrollRef}
      className="journey-scroll relative overflow-x-auto overflow-y-hidden rounded-3xl border border-white/70 bg-gradient-to-b from-sky-400/50 via-sky-200/50 to-sky-50/80 shadow-inner"
      style={{ height: JOURNEY_HEIGHT }}
      aria-label="Bản đồ hành trình từ rating 1200 đến 2400. Kéo ngang để xem toàn bộ."
      tabIndex={0}
    >
      <div className="relative" style={{ width: journeyWidth(), height: JOURNEY_HEIGHT }}>
        <SkyBackground width={journeyWidth()} />
        <ParallaxBackdrop width={journeyWidth()} />
        <FlightPath birdT={displayedT} unlockedIndex={milestoneIndex} />

        {/* các tòa tháp milestone */}
        {MILESTONES.map((m, i) => (
          <div
            key={m.rating}
            className="absolute"
            style={{ left: anchorX(i) - 100, top: ANCHOR_Y[i] - 76 }}
          >
            <MilestoneTower
              milestone={m}
              status={i < milestoneIndex ? 'done' : i === milestoneIndex ? 'current' : 'locked'}
              solvedCount={solvedPerMilestone[i]}
              progress={i === milestoneIndex ? milestoneProgress / perMilestone : 0}
              requirement={perMilestone}
              glowing={phase === 'milestone' && i === milestoneIndex}
            />
          </div>
        ))}

        {/* trail ánh sáng sau đuôi chim */}
        {showTrail && !reducedMotion && (
          <div
            className="absolute rounded-full"
            style={{
              left: birdPos.x - 90,
              top: birdPos.y - 46,
              width: 70,
              height: 12,
              background: `linear-gradient(90deg, transparent, ${trailColor})`,
              filter: 'blur(3px)',
              animation: 'glow-pulse 0.6s ease-in-out infinite',
            }}
          />
        )}

        {/* bong bóng thoại của chim */}
        <AnimatePresence>
          {phase === 'none' && (birdState === 'idle' || birdState === 'worried' || birdState === 'tired') && (
            <motion.div
              key={`bubble-${birdState}`}
              className="absolute z-20 glass-strong px-3.5 py-2.5 text-xs font-semibold text-slate-600 max-w-[200px]"
              style={{ left: birdPos.x + 34, top: birdPos.y - 168 }}
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.6 }}
            >
              {birdState === 'idle' && 'AC thêm bài nữa để bay đến cột mốc tiếp theo nhé! ❤️'}
              {birdState === 'worried' && 'Hôm nay mình chưa được cho ăn... Đừng để mất chuỗi nhé! 🔥'}
              {birdState === 'tired' && 'Zzz... lâu rồi không gặp bạn. Quay lại bầu trời thôi! 😴'}
              <span
                className="absolute -bottom-1.5 left-4 w-3 h-3 rotate-45 bg-white/80 border-b border-r border-white/80"
                aria-hidden="true"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* chú chim tại vị trí tiến độ hiện tại */}
        <motion.div
          className="absolute z-10"
          initial={false}
          animate={{ left: birdPos.x - 60, top: birdPos.y - 100 }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { type: 'spring', stiffness: 45, damping: 16 }
          }
        >
          <BirdCharacter state={birdState} size={120} />
        </motion.div>

        {/* hạt năng lượng bay tới chim */}
        <AnimatePresence>
          {phase === 'orb' && (
            <motion.div
              key="energy-orb"
              className="absolute z-20 rounded-full"
              style={{
                width: 22,
                height: 22,
                background: 'radial-gradient(circle, #fff7cc 15%, #fbbf24 60%, rgba(251,191,36,0.2))',
                boxShadow: '0 0 18px 6px rgba(251, 191, 36, 0.65)',
              }}
              initial={{ left: birdPos.x - 11, top: JOURNEY_HEIGHT + 10, scale: 0.5, opacity: 0 }}
              animate={{ left: birdPos.x - 11, top: birdPos.y - 46, scale: 1, opacity: 1 }}
              exit={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.65, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

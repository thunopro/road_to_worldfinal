import { motion } from 'framer-motion'
import { inactivityGap, useAppStore } from '../../store/useAppStore'

/** Thẻ chuỗi ngày luyện tập với ngọn lửa */
export default function StreakCard() {
  const streak = useAppStore((s) => s.streak)
  const reducedMotion = useAppStore((s) => s.settings.reducedMotion)
  const gap = inactivityGap(streak)
  const inDanger = gap >= 1 && streak.current > 0

  return (
    <div className="glass p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <motion.span
          className="text-4xl"
          animate={reducedMotion ? {} : { scale: [1, 1.15, 1], rotate: [-3, 3, -3] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          aria-hidden="true"
        >
          🔥
        </motion.span>
        <div>
          <div className="text-xl font-extrabold">
            {streak.current} ngày <span className="text-sm font-semibold text-slate-500">chuỗi hiện tại</span>
          </div>
          <div className="text-xs text-slate-500 font-semibold">🏆 Kỷ lục: {streak.longest} ngày · 🧊 Freeze: {streak.freezes}</div>
        </div>
      </div>

      {inDanger && (
        <div className="rounded-xl bg-amber-50 border border-amber-300 px-3 py-2 text-xs font-semibold text-amber-700">
          ⚠️ Hôm nay chúng ta vẫn chưa luyện tập. Đừng để ngọn lửa tắt nhé!
        </div>
      )}
      {gap >= 3 && (
        <div className="rounded-xl bg-slate-100 border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600">
          😴 Chim đã chờ bạn {gap} ngày rồi. Quay lại bầu trời thôi!
        </div>
      )}
    </div>
  )
}

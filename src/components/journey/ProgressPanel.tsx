import { motion } from 'framer-motion'
import { ACHIEVEMENTS, isAchievementUnlocked } from '../../data/achievements'
import { MILESTONES } from '../../data/milestones'
import { nextRating, useAppStore } from '../../store/useAppStore'

/** Bảng tiến độ phía dưới khu vực hành trình */
export default function ProgressPanel() {
  const milestoneIndex = useAppStore((s) => s.milestoneIndex)
  const milestoneProgress = useAppStore((s) => s.milestoneProgress)
  const perMilestone = useAppStore((s) => s.settings.problemsPerMilestone)
  const totalAC = useAppStore((s) => s.totalAC)
  const user = useAppStore((s) => s.user)
  const problems = useAppStore((s) => s.problems)
  const streak = useAppStore((s) => s.streak)

  const current = MILESTONES[milestoneIndex]
  const next = nextRating(milestoneIndex)
  const pct = Math.round((milestoneProgress / perMilestone) * 100)
  const remaining = perMilestone - milestoneProgress

  const journeyTotal = (MILESTONES.length - 1) * perMilestone
  const journeyDone = milestoneIndex * perMilestone + milestoneProgress
  const journeyPct = Math.min(100, Math.round((journeyDone / journeyTotal) * 100))

  const unlockedAchievements = ACHIEVEMENTS.filter((a) =>
    isAchievementUnlocked(a, { totalAC, longestStreak: streak.longest, coins: user.coins, problems, badges: user.badges }),
  )
  const latest = unlockedAchievements[unlockedAchievements.length - 1]

  return (
    <div className="glass p-5 grid md:grid-cols-[1.6fr_1fr] gap-5">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="px-3 py-1 rounded-full text-white text-sm font-extrabold shadow-sm"
            style={{ background: current.color }}
          >
            {current.rating}
          </span>
          <h3 className="font-extrabold">{current.name}</h3>
          <span className="text-xs text-slate-500 font-semibold">— cột mốc hiện tại</span>
        </div>

        <div className="mt-3">
          <div className="flex justify-between text-sm font-bold mb-1.5">
            <span>{milestoneProgress}/{perMilestone} bài</span>
            <span style={{ color: current.color }}>{pct}%</span>
          </div>
          <div
            className="h-4 rounded-full bg-slate-200/80 overflow-hidden"
            role="progressbar"
            aria-valuenow={milestoneProgress}
            aria-valuemin={0}
            aria-valuemax={perMilestone}
            aria-label={`Tiến độ milestone: ${milestoneProgress} trên ${perMilestone} bài`}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${current.color}, #fbbf24)` }}
              initial={false}
              animate={{ width: `${pct}%` }}
              transition={{ type: 'spring', stiffness: 60, damping: 15 }}
            />
          </div>
          {next ? (
            <p className="text-sm text-slate-600 mt-2 font-medium">
              Còn <b className="text-sky-600">{remaining} bài</b> để mở khóa rating <b style={{ color: MILESTONES[milestoneIndex + 1].color }}>{next}</b> 🔓
            </p>
          ) : (
            <p className="text-sm text-amber-600 mt-2 font-bold">👑 Bạn đã chinh phục toàn bộ hành trình!</p>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <span className="font-bold">Toàn hành trình:</span>
          <div className="flex-1 h-2 rounded-full bg-slate-200/80 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-sky-400 via-violet-400 to-amber-400" style={{ width: `${journeyPct}%` }} />
          </div>
          <span className="font-extrabold text-slate-600">{journeyPct}%</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:border-l md:border-white/70 md:pl-5">
        {next && (
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">🎁 Phần thưởng milestone {next}</div>
            <div className="text-sm font-semibold text-slate-700 mt-0.5">{MILESTONES[milestoneIndex + 1].rewardDesc}</div>
          </div>
        )}
        <div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">🏅 Thành tích gần nhất</div>
          {latest ? (
            <div className="text-sm font-semibold text-slate-700 mt-0.5">
              {latest.emoji} {latest.title} — <span className="text-slate-500 font-medium">{latest.desc}</span>
            </div>
          ) : (
            <div className="text-sm text-slate-400 mt-0.5">Chưa có thành tích nào. AC bài đầu tiên nhé!</div>
          )}
        </div>
        <div className="text-sm text-slate-600 font-medium">
          🪙 <b>{user.coins}</b> xu · 🏅 <b>{user.badges.length}</b> huy hiệu
        </div>
      </div>
    </div>
  )
}

import { ACHIEVEMENTS, isAchievementUnlocked } from '../data/achievements'
import { useAppStore } from '../store/useAppStore'

/** Trang thành tích: huy hiệu đã mở và đang khóa */
export default function AchievementsPage() {
  const totalAC = useAppStore((s) => s.totalAC)
  const streak = useAppStore((s) => s.streak)
  const user = useAppStore((s) => s.user)
  const problems = useAppStore((s) => s.problems)

  const ctx = { totalAC, longestStreak: streak.longest, coins: user.coins, problems, badges: user.badges }
  const unlockedCount = ACHIEVEMENTS.filter((a) => isAchievementUnlocked(a, ctx)).length

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-1">🏅 Thành tích</h1>
      <p className="text-sm text-slate-500 mb-4">
        Đã mở khóa <b className="text-amber-600">{unlockedCount}/{ACHIEVEMENTS.length}</b> thành tích.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {ACHIEVEMENTS.map((a) => {
          const unlocked = isAchievementUnlocked(a, ctx)
          return (
            <div
              key={a.id}
              className={`glass p-4 text-center transition-all ${unlocked ? 'hover:scale-[1.03]' : 'opacity-55 grayscale'}`}
            >
              <div className="text-4xl mb-2" aria-hidden="true">{unlocked ? a.emoji : '🔒'}</div>
              <div className="font-extrabold text-sm">{a.title}</div>
              <div className="text-xs text-slate-500 mt-0.5">{a.desc}</div>
              {unlocked && <div className="mt-2 text-[10px] font-extrabold text-emerald-500 uppercase tracking-wide">Đã mở khóa</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

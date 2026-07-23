import { motion } from 'framer-motion'
import { questClaimKey, questProgress } from '../../data/quests'
import { useAppStore } from '../../store/useAppStore'
import type { QuestDef } from '../../types'

interface Props {
  quest: QuestDef
}

/** Thẻ nhiệm vụ (hằng ngày / hằng tuần) với thanh tiến độ và nút nhận thưởng */
export default function DailyQuestCard({ quest }: Props) {
  const problems = useAppStore((s) => s.problems)
  const reviewedDates = useAppStore((s) => s.reviewedDates)
  const questClaims = useAppStore((s) => s.questClaims)
  const claimQuest = useAppStore((s) => s.claimQuest)
  const pushToast = useAppStore((s) => s.pushToast)

  const progress = Math.min(quest.target, questProgress(quest, { problems, reviewedDates }))
  const pct = Math.round((progress / quest.target) * 100)
  const claimKey = questClaimKey(quest)
  const claimed = !!questClaims[claimKey]
  const done = progress >= quest.target

  const claim = () => {
    claimQuest(claimKey, quest.reward)
    pushToast({
      title: `Nhận thưởng nhiệm vụ! +${quest.reward} xu 🪙`,
      subtitle: quest.title,
      tone: 'success',
    })
  }

  return (
    <div className={`glass p-4 flex flex-col gap-2.5 ${claimed ? 'opacity-70' : ''}`}>
      <div className="flex items-start gap-2.5">
        <span className="text-2xl" aria-hidden="true">{quest.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="font-extrabold text-sm flex items-center gap-2">
            {quest.title}
            {claimed && <span className="text-emerald-500 text-xs">✅ Đã nhận</span>}
          </div>
          <div className="text-xs text-slate-500">{quest.desc}</div>
        </div>
        <span className="text-xs font-extrabold text-amber-600 whitespace-nowrap">+{quest.reward} 🪙</span>
      </div>

      <div className="flex items-center gap-2">
        <div
          className="flex-1 h-2.5 rounded-full bg-slate-200/80 overflow-hidden"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={quest.target}
          aria-label={`${quest.title}: ${progress} trên ${quest.target}`}
        >
          <motion.div
            className={`h-full rounded-full ${done ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : 'bg-gradient-to-r from-sky-400 to-teal-300'}`}
            initial={false}
            animate={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs font-bold text-slate-500 w-12 text-right">{progress}/{quest.target}</span>
      </div>

      {done && !claimed && (
        <button
          onClick={claim}
          className="self-end px-4 py-1.5 rounded-full text-xs font-extrabold text-white bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-200 transition-all hover:scale-105"
        >
          Nhận thưởng 🎁
        </button>
      )}
    </div>
  )
}

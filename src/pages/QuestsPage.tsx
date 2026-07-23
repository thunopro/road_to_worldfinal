import DailyQuestCard from '../components/quests/DailyQuestCard'
import { DAILY_QUESTS, WEEKLY_QUESTS } from '../data/quests'

/** Trang nhiệm vụ hằng ngày và hằng tuần */
export default function QuestsPage() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-1">🎯 Nhiệm vụ</h1>
      <p className="text-sm text-slate-500 mb-4">Hoàn thành nhiệm vụ để nhận xu và giữ động lực mỗi ngày.</p>

      <h2 className="font-extrabold text-lg mb-2.5">🌅 Hằng ngày</h2>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3 mb-6">
        {DAILY_QUESTS.map((q) => (
          <DailyQuestCard key={q.id} quest={q} />
        ))}
      </div>

      <h2 className="font-extrabold text-lg mb-2.5">🗓️ Hằng tuần</h2>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
        {WEEKLY_QUESTS.map((q) => (
          <DailyQuestCard key={q.id} quest={q} />
        ))}
      </div>
    </div>
  )
}

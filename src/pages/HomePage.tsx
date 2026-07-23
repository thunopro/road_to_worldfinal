import HeaderStats from '../components/layout/HeaderStats'
import JourneyMap from '../components/journey/JourneyMap'
import ProgressPanel from '../components/journey/ProgressPanel'
import DailyQuestCard from '../components/quests/DailyQuestCard'
import StreakCard from '../components/streak/StreakCard'
import { DAILY_QUESTS } from '../data/quests'

/** Trang chủ: header, hành trình, bảng tiến độ, streak và nhiệm vụ nhanh */
export default function HomePage() {
  return (
    <div>
      <HeaderStats />
      <JourneyMap />
      <p className="text-center text-[11px] text-slate-400 mt-1.5 mb-4">
        ↔️ Kéo ngang để xem toàn bộ hành trình từ 1200 đến 2400
      </p>
      <div className="space-y-4">
        <ProgressPanel />
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          <StreakCard />
          {DAILY_QUESTS.slice(0, 2).map((q) => (
            <DailyQuestCard key={q.id} quest={q} />
          ))}
        </div>
      </div>
    </div>
  )
}

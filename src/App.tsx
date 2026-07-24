import { useCallback, useEffect, useState } from 'react'
import BottomNav from './components/layout/BottomNav'
import Sidebar from './components/layout/Sidebar'
import { NAV_ITEMS, type PageId } from './components/layout/nav'
import MilestoneUnlockAnimation from './components/effects/MilestoneUnlockAnimation'
import SuccessCelebration from './components/effects/SuccessCelebration'
import ToastStack from './components/effects/ToastStack'
import SubmitProblemButton from './components/submit/SubmitProblemButton'
import SubmitProblemModal from './components/submit/SubmitProblemModal'
import { useCelebration } from './hooks/useCelebration'
import { useAppStore, type AddProblemResult } from './store/useAppStore'
import HomePage from './pages/HomePage'
import ProblemsPage from './pages/ProblemsPage'
import CalendarPage from './pages/CalendarPage'
import QuestsPage from './pages/QuestsPage'
import AchievementsPage from './pages/AchievementsPage'
import LeaderboardPage from './pages/LeaderboardPage'
import CollectionPage from './pages/CollectionPage'
import StatsPage from './pages/StatsPage'
import SettingsPage from './pages/SettingsPage'

const PAGES: Record<PageId, () => React.JSX.Element> = {
  home: HomePage,
  problems: ProblemsPage,
  calendar: CalendarPage,
  quests: QuestsPage,
  achievements: AchievementsPage,
  leaderboard: LeaderboardPage,
  collection: CollectionPage,
  stats: StatsPage,
  settings: SettingsPage,
}

function pageFromHash(): PageId {
  const id = window.location.hash.replace('#/', '') as PageId
  return NAV_ITEMS.some((n) => n.id === id) ? id : 'home'
}

export default function App() {
  const [page, setPage] = useState<PageId>(pageFromHash)
  const submitOpen = useAppStore((s) => s.submitOpen)
  const setSubmitOpen = useAppStore((s) => s.setSubmitOpen)

  const phase = useAppStore((s) => s.phase)
  const settings = useAppStore((s) => s.settings)
  const equippedBg = useAppStore((s) => s.collection.equipped.background)
  const checkStreakOnLoad = useAppStore((s) => s.checkStreakOnLoad)
  const { run, skip } = useCelebration()

  // điều hướng bằng hash để giữ trang khi tải lại
  useEffect(() => {
    const onHash = () => setPage(pageFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = useCallback((p: PageId) => {
    window.location.hash = `#/${p}`
    setPage(p)
  }, [])

  // kiểm tra streak freeze khi mở app
  useEffect(() => {
    checkStreakOnLoad()
  }, [checkStreakOnLoad])

  // đổi nền bầu trời theo item đang trang bị + cờ giảm chuyển động
  useEffect(() => {
    document.body.dataset.sky = equippedBg === 'bg-sunset' ? 'sunset' : equippedBg === 'bg-night' ? 'night' : 'day'
    document.documentElement.dataset.reducedMotion = String(settings.reducedMotion)
  }, [equippedBg, settings.reducedMotion])

  const handleSubmitted = useCallback(
    (result: AddProblemResult) => {
      if (!result.ac) return
      // về trang chủ để xem chim nhận năng lượng
      navigate('home')
      run(result.unlockedRating)
    },
    [navigate, run],
  )

  const Page = PAGES[page]
  const celebrating = phase !== 'none' && phase !== 'milestone'

  return (
    <div className="flex min-h-screen">
      <Sidebar page={page} onNavigate={navigate} />

      <main className="flex-1 min-w-0 px-4 lg:px-6 py-5 pb-28 lg:pb-10 w-full">
        <Page />
      </main>

      {page !== 'home' && <SubmitProblemButton onClick={() => setSubmitOpen(true)} />}
      <SubmitProblemModal open={submitOpen} onClose={() => setSubmitOpen(false)} onSubmitted={handleSubmitted} />

      {/* nút bỏ qua hiệu ứng */}
      {celebrating && (
        <button
          onClick={skip}
          className="fixed bottom-20 lg:bottom-8 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-full text-xs font-bold bg-slate-800/70 text-white backdrop-blur hover:bg-slate-800/90 transition-colors"
        >
          Bỏ qua hiệu ứng ⏭️
        </button>
      )}

      <SuccessCelebration />
      <MilestoneUnlockAnimation />
      <ToastStack />
      <BottomNav page={page} onNavigate={navigate} />
    </div>
  )
}

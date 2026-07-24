import HeaderStats from '../components/layout/HeaderStats'
import QuoteBar from '../components/layout/QuoteBar'
import JourneyMap from '../components/journey/JourneyMap'
import ProgressPanel from '../components/journey/ProgressPanel'
import { useAppStore } from '../store/useAppStore'

/** Thẻ vàng "AC là thức ăn của chim" chứa nút nộp bài chính */
function SubmitCard() {
  const setSubmitOpen = useAppStore((s) => s.setSubmitOpen)
  const phase = useAppStore((s) => s.phase)
  const reducedMotion = useAppStore((s) => s.settings.reducedMotion)
  const busy = phase !== 'none'

  return (
    <div
      className="relative rounded-2xl p-5 flex flex-col gap-3 bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100 overflow-hidden"
      style={{ border: '3px solid #d9a92c', borderBottomWidth: 6, boxShadow: '0 6px 14px rgba(180, 120, 30, 0.3)' }}
    >
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-amber-300/30 blur-xl" aria-hidden="true" />
      <div>
        <div className="font-extrabold text-amber-800">AC là thức ăn của chim!</div>
        <div className="text-xs font-semibold text-amber-700/80 mt-0.5">Nộp bài để nuôi chim và tiến xa hơn nhé!</div>
      </div>
      <div className="flex items-center gap-3 text-2xl" aria-hidden="true">
        {['🌰', '🌱', '⭐'].map((seed, i) => (
          <span
            key={seed}
            className="inline-block"
            style={reducedMotion ? undefined : { animation: `float-y 1.4s ease-in-out ${i * 0.2}s infinite` }}
          >
            {seed}
          </span>
        ))}
      </div>
      <button
        onClick={() => setSubmitOpen(true)}
        disabled={busy}
        className="game-btn w-full py-3.5 font-extrabold text-white text-lg flex items-center justify-center gap-2
          bg-gradient-to-b from-amber-400 to-orange-500 border-2 border-amber-700 shadow-lg shadow-amber-400/50
          hover:brightness-105 disabled:opacity-60 disabled:cursor-wait"
        style={reducedMotion || busy ? undefined : { animation: 'pulse-soft 1.8s ease-in-out infinite' }}
        aria-label="Nộp bài vừa giải"
      >
        <span aria-hidden="true">{busy ? '⏳' : '✈️'}</span>
        {busy ? 'Đang bay...' : 'Nộp bài'}
      </button>
    </div>
  )
}

/** Trang chủ tối giản: danh ngôn nổi bật, header, hành trình, tiến độ + nộp bài */
export default function HomePage() {
  return (
    <div>
      <QuoteBar hero className="mb-4" />
      <HeaderStats />
      <JourneyMap />

      <div className="grid lg:grid-cols-[1fr_290px] gap-4 mt-5">
        <ProgressPanel />
        <SubmitCard />
      </div>
    </div>
  )
}

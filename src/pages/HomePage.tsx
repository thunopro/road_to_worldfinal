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
    <div className="relative rounded-3xl p-5 flex flex-col gap-3 border border-amber-200/80 shadow-xl shadow-amber-200/40 bg-gradient-to-br from-amber-100/95 via-amber-50/95 to-orange-100/95 overflow-hidden">
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
        className="w-full py-3.5 rounded-2xl font-extrabold text-white text-lg flex items-center justify-center gap-2
          bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 shadow-lg shadow-amber-400/50
          hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all
          disabled:opacity-60 disabled:cursor-wait"
        style={reducedMotion || busy ? undefined : { animation: 'pulse-soft 1.8s ease-in-out infinite' }}
        aria-label="Nộp bài vừa giải"
      >
        <span aria-hidden="true">{busy ? '⏳' : '✈️'}</span>
        {busy ? 'Đang bay...' : 'Nộp bài'}
      </button>
    </div>
  )
}

/** Trang chủ tối giản: header, hành trình, tiến độ + nộp bài, danh ngôn */
export default function HomePage() {
  return (
    <div>
      <HeaderStats />
      <JourneyMap />

      <div className="grid lg:grid-cols-[1fr_290px] gap-4 mt-5">
        <ProgressPanel />
        <SubmitCard />
      </div>

      <QuoteBar className="mt-4" />
    </div>
  )
}

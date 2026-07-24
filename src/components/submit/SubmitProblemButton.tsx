import { useAppStore } from '../../store/useAppStore'

interface Props {
  onClick: () => void
}

/** Nút nộp bài nổi bật, luôn dễ truy cập */
export default function SubmitProblemButton({ onClick }: Props) {
  const phase = useAppStore((s) => s.phase)
  const reducedMotion = useAppStore((s) => s.settings.reducedMotion)
  const busy = phase !== 'none'

  return (
    <button
      onClick={onClick}
      disabled={busy}
      className="fixed bottom-20 lg:bottom-8 right-4 lg:right-8 z-40 flex items-center gap-2 px-6 py-3.5 rounded-full font-extrabold text-white text-lg
        bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 shadow-xl shadow-amber-400/50
        hover:shadow-2xl hover:shadow-amber-400/60 hover:scale-105 active:scale-95 transition-all
        disabled:opacity-60 disabled:cursor-wait"
      style={reducedMotion || busy ? undefined : { animation: 'pulse-soft 1.8s ease-in-out infinite' }}
      aria-label="Nộp bài vừa giải"
    >
      <span aria-hidden="true">{busy ? '⏳' : '⚡'}</span>
      {busy ? 'Đang bay...' : 'Nộp bài'}
    </button>
  )
}

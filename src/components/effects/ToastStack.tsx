import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '../../store/useAppStore'

const TONE_STYLES: Record<string, string> = {
  success: 'border-emerald-300 bg-emerald-50/95',
  info: 'border-sky-300 bg-sky-50/95',
  warn: 'border-amber-300 bg-amber-50/95',
  error: 'border-rose-300 bg-rose-50/95',
}

const TONE_ICONS: Record<string, string> = {
  success: '🎉',
  info: 'ℹ️',
  warn: '⚠️',
  error: '❌',
}

/** Chồng thông báo toast góc trên bên phải */
export default function ToastStack() {
  const toasts = useAppStore((s) => s.toasts)
  const dismiss = useAppStore((s) => s.dismissToast)

  return (
    <div className="fixed top-4 right-4 z-[70] flex flex-col gap-2 w-[min(92vw,360px)]" role="status" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            className={`rounded-2xl border-2 shadow-xl backdrop-blur px-4 py-3 flex gap-3 items-start text-slate-800 ${TONE_STYLES[t.tone]}`}
          >
            <span className="text-2xl" aria-hidden="true">{TONE_ICONS[t.tone]}</span>
            <div className="flex-1 min-w-0">
              <div className="font-extrabold text-sm">{t.title}</div>
              {t.subtitle && <div className="text-xs text-slate-600 mt-0.5">{t.subtitle}</div>}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="text-slate-400 hover:text-slate-600 font-bold px-1"
              aria-label="Đóng thông báo"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { QUOTES } from '../../data/quotes'
import { useAppStore } from '../../store/useAppStore'

interface Props {
  className?: string
  /** kích thước lớn nổi bật (dùng ở đầu trang chủ) */
  hero?: boolean
}

/** Thanh danh ngôn truyền cảm hứng — tự xoay vòng, bắt đầu theo ngày */
export default function QuoteBar({ className = '', hero = false }: Props) {
  const reducedMotion = useAppStore((s) => s.settings.reducedMotion)
  // mỗi ngày bắt đầu từ một câu khác nhau
  const [index, setIndex] = useState(() => new Date().getDate() % QUOTES.length)

  useEffect(() => {
    if (reducedMotion) return
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % QUOTES.length), 12000)
    return () => window.clearInterval(timer)
  }, [reducedMotion])

  const quote = QUOTES[index]

  if (hero) {
    return (
      <div className={`game-panel relative px-6 py-4 text-center overflow-hidden ${className}`}>
        {/* dấu ngoặc kép trang trí lớn */}
        <span className="absolute left-3 -top-2 text-7xl text-amber-300/60 font-serif select-none" aria-hidden="true">
          “
        </span>
        <span className="absolute right-3 -bottom-8 text-7xl text-amber-300/60 font-serif select-none" aria-hidden="true">
          ”
        </span>
        <div key={index} style={reducedMotion ? undefined : { animation: 'fade-in 0.7s ease-out' }}>
          <p className="text-lg md:text-2xl font-extrabold leading-snug tracking-tight"
             style={{ color: '#3d3222', textShadow: '0 1px 0 rgba(255,255,255,0.6)' }}>
            {quote.text}
          </p>
          <p className="mt-1.5 text-sm md:text-base font-extrabold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
            — {quote.author} —
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`game-panel px-4 py-1.5 text-center ${className}`}>
      <div key={index} style={reducedMotion ? undefined : { animation: 'fade-in 0.7s ease-out' }}>
        <span className="text-base mr-1.5" aria-hidden="true">📜</span>
        <span className="text-sm font-bold text-[#3d3222] italic">“{quote.text}”</span>
        <span className="text-xs font-extrabold text-amber-700 ml-2 whitespace-nowrap">— {quote.author}</span>
      </div>
    </div>
  )
}

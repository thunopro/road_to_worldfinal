import { useEffect, useState } from 'react'
import { QUOTES } from '../../data/quotes'
import { useAppStore } from '../../store/useAppStore'

interface Props {
  className?: string
}

/** Thanh danh ngôn truyền cảm hứng — tự xoay vòng, bắt đầu theo ngày */
export default function QuoteBar({ className = '' }: Props) {
  const reducedMotion = useAppStore((s) => s.settings.reducedMotion)
  // mỗi ngày bắt đầu từ một câu khác nhau
  const [index, setIndex] = useState(() => new Date().getDate() % QUOTES.length)

  useEffect(() => {
    if (reducedMotion) return
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % QUOTES.length), 12000)
    return () => window.clearInterval(timer)
  }, [reducedMotion])

  const quote = QUOTES[index]

  return (
    <div className={`glass px-5 py-3 text-center ${className}`}>
      <div key={index} style={reducedMotion ? undefined : { animation: 'fade-in 0.7s ease-out' }}>
        <span className="text-sm text-slate-600 italic">“{quote.text}”</span>
        <span className="text-xs font-extrabold text-amber-600 ml-2 whitespace-nowrap">— {quote.author}</span>
      </div>
    </div>
  )
}

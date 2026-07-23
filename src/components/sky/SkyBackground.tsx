import { memo } from 'react'
import CloudLayer from './CloudLayer'

interface Props {
  /** chiều rộng nội dung (px) để rải mây & hạt sáng, mặc định phủ 100% */
  width?: number
  showSun?: boolean
}

/** Nền bầu trời: mặt trời, mây trôi chậm, hạt sáng lơ lửng */
function SkyBackground({ width, showSun = true }: Props) {
  const particles = Array.from({ length: 14 }, (_, i) => ({
    left: `${(i * 137) % 100}%`,
    top: `${12 + ((i * 53) % 70)}%`,
    size: 4 + ((i * 7) % 8),
    duration: 4 + ((i * 3) % 5),
    delay: (i * 0.7) % 4,
  }))

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={width ? { width } : undefined}
      aria-hidden="true"
    >
      {showSun && <div className="sun-glow" style={{ width: 260, height: 260, top: -70, left: 40 }} />}
      <CloudLayer />
      {particles.map((p, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

export default memo(SkyBackground)

import { memo } from 'react'

interface Props {
  /** chiều rộng nội dung (px) để rải mây & hạt sáng, mặc định phủ 100% */
  width?: number
  showSun?: boolean
}

/** Nền bầu trời: mặt trời, tia nắng, hạt sáng và sao lấp lánh (mây do ParallaxBackdrop đảm nhận) */
function SkyBackground({ width, showSun = true }: Props) {
  const particles = Array.from({ length: 14 }, (_, i) => ({
    left: `${(i * 137) % 100}%`,
    top: `${12 + ((i * 53) % 60)}%`,
    size: 4 + ((i * 7) % 8),
    duration: 4 + ((i * 3) % 5),
    delay: (i * 0.7) % 4,
  }))

  const sparkles = Array.from({ length: 10 }, (_, i) => ({
    left: `${(i * 83 + 20) % 100}%`,
    top: `${6 + ((i * 37) % 50)}%`,
    delay: (i * 0.9) % 5,
  }))

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={width ? { width } : undefined}
      aria-hidden="true"
    >
      {showSun && (
        <>
          <div className="sun-glow" style={{ width: 280, height: 280, top: -80, left: 30 }} />
          {/* tia nắng chéo */}
          <div
            className="absolute"
            style={{
              top: -60, left: -40, width: 420, height: 500,
              background: 'linear-gradient(115deg, rgba(255,244,200,0.35) 0%, rgba(255,244,200,0) 55%)',
              transform: 'rotate(-8deg)',
            }}
          />
        </>
      )}
      {/* hạt sáng lơ lửng */}
      {particles.map((p, i) => (
        <span
          key={`p-${i}`}
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

      {/* sao lấp lánh */}
      {sparkles.map((s, i) => (
        <span
          key={`s-${i}`}
          className="sparkle"
          style={{ left: s.left, top: s.top, animationDelay: `${s.delay}s` }}
        >
          ✦
        </span>
      ))}

    </div>
  )
}

export default memo(SkyBackground)

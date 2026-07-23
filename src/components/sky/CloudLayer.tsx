import { memo } from 'react'

const CLOUDS = [
  { top: '8%', w: 150, h: 42, dur: 95, delay: 0, opacity: 0.9 },
  { top: '20%', w: 110, h: 32, dur: 120, delay: -30, opacity: 0.7 },
  { top: '34%', w: 190, h: 50, dur: 150, delay: -70, opacity: 0.8 },
  { top: '52%', w: 130, h: 36, dur: 110, delay: -50, opacity: 0.6 },
  { top: '66%', w: 170, h: 44, dur: 135, delay: -90, opacity: 0.75 },
  { top: '14%', w: 90, h: 26, dur: 100, delay: -55, opacity: 0.5 },
]

/** Lớp mây trôi chậm ngang màn hình */
function CloudLayer() {
  return (
    <>
      {CLOUDS.map((c, i) => (
        <span
          key={i}
          className="cloud"
          style={{
            top: c.top,
            width: c.w,
            height: c.h,
            opacity: c.opacity,
            animationDuration: `${c.dur}s`,
            animationDelay: `${c.delay}s`,
          }}
        />
      ))}
    </>
  )
}

export default memo(CloudLayer)

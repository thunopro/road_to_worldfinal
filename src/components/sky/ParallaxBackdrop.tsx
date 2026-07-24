import { memo } from 'react'
import cloudsBg from '../../assets/backgrounds/clouds-bg.png'
import mountains from '../../assets/backgrounds/mountains.png'
import cloudsMid from '../../assets/backgrounds/clouds-mid.png'
import cloudsFront from '../../assets/backgrounds/clouds-front.png'
import { useAppStore } from '../../store/useAppStore'

interface LayerDef {
  img: string
  /** kích thước gốc của file để tính bề ngang một tile khi scale */
  origW: number
  origH: number
  /** chiều cao hiển thị (px) */
  height: number
  bottom: number
  /** thời gian trôi hết một tile (giây) — càng gần càng nhanh */
  duration: number
  opacity: number
}

/** các layer từ pack "Glacial Mountains" của vnitti (CC-BY 4.0), xa → gần */
const LAYERS: LayerDef[] = [
  { img: cloudsBg, origW: 384, origH: 169, height: 230, bottom: 200, duration: 300, opacity: 0.8 },
  { img: mountains, origW: 384, origH: 164, height: 280, bottom: 0, duration: 380, opacity: 0.95 },
  { img: cloudsMid, origW: 384, origH: 61, height: 120, bottom: 26, duration: 190, opacity: 0.95 },
  { img: cloudsFront, origW: 384, origH: 51, height: 108, bottom: -6, duration: 120, opacity: 1 },
]

interface Props {
  width: number
}

/** Nền parallax pixel-art: mây xa, núi băng, các dải mây trôi với tốc độ khác nhau */
function ParallaxBackdrop({ width }: Props) {
  const reducedMotion = useAppStore((s) => s.settings.reducedMotion)

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ width }} aria-hidden="true">
      {LAYERS.map((l, i) => {
        const tileW = (l.origW * l.height) / l.origH
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              bottom: l.bottom,
              height: l.height,
              width: width + tileW,
              backgroundImage: `url(${l.img})`,
              backgroundRepeat: 'repeat-x',
              backgroundSize: 'auto 100%',
              imageRendering: 'pixelated',
              opacity: l.opacity,
              willChange: reducedMotion ? undefined : 'transform',
              ...(reducedMotion
                ? {}
                : ({
                    '--drift': `-${tileW}px`,
                    animation: `parallax-drift ${l.duration}s linear infinite`,
                  } as React.CSSProperties)),
            }}
          />
        )
      })}
    </div>
  )
}

export default memo(ParallaxBackdrop)

import { memo } from 'react'
import idleSheet from '../../assets/knight/idle.png'
import runSheet from '../../assets/knight/run.png'
import attackSheet from '../../assets/knight/attack.png'
import { useAppStore } from '../../store/useAppStore'
import type { BirdVisualState } from '../../types'

interface Props {
  state: BirdVisualState
  size?: number
}

/** cấu hình spritesheet Tiny Swords Warrior: mỗi frame 192×192 */
const SHEETS: Record<string, { src: string; frames: number; duration: number }> = {
  idle: { src: idleSheet, frames: 8, duration: 0.9 },
  run: { src: runSheet, frames: 6, duration: 0.6 },
  attack: { src: attackSheet, frames: 4, duration: 0.55 },
}

function sheetFor(state: BirdVisualState) {
  switch (state) {
    case 'flying':
      return SHEETS.run
    case 'eating':
    case 'celebrating':
      return SHEETS.attack
    default:
      return SHEETS.idle
  }
}

/** Hiệp sĩ đồng hành (Tiny Swords, CC0) — animation bằng CSS steps trên spritesheet */
function KnightCharacter({ state, size = 128 }: Props) {
  const reducedMotion = useAppStore((s) => s.settings.reducedMotion)
  const sheet = sheetFor(state)
  const sheetW = sheet.frames * size
  const dim = state === 'tired' || state === 'worried'

  return (
    <div
      role="img"
      aria-label={`Hiệp sĩ đang ở trạng thái ${state}`}
      className="relative"
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${sheet.src})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${sheetW}px ${size}px`,
        imageRendering: 'pixelated',
        filter: dim ? 'grayscale(0.5) brightness(0.9)' : undefined,
        ...(reducedMotion
          ? {}
          : ({
              '--sheet-w': `-${sheetW}px`,
              animation: `sprite-play ${sheet.duration}s steps(${sheet.frames}) infinite`,
            } as React.CSSProperties)),
      }}
    >
      {/* Zzz khi lâu không luyện tập */}
      {state === 'tired' && (
        <span
          className="absolute -top-1 right-0 text-base font-extrabold text-slate-500"
          style={reducedMotion ? undefined : { animation: 'drift-fade 1.8s ease-in infinite' }}
        >
          Zz
        </span>
      )}
      {state === 'worried' && (
        <span className="absolute -top-1 right-0 text-base" aria-hidden="true">
          💧
        </span>
      )}
    </div>
  )
}

export default memo(KnightCharacter)

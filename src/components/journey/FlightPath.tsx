import { MILESTONES } from '../../data/milestones'
import { journeyWidth, JOURNEY_HEIGHT, segmentPath, starPositions } from './geometry'

interface Props {
  /** vị trí chim trên toàn hành trình (0..6) */
  birdT: number
  unlockedIndex: number
}

/** Đường hành trình phát sáng + các ngôi sao nhỏ nối các milestone */
export default function FlightPath({ birdT, unlockedIndex }: Props) {
  const stars = starPositions()

  return (
    <svg
      className="absolute inset-0"
      width={journeyWidth()}
      height={JOURNEY_HEIGHT}
      aria-hidden="true"
    >
      {Array.from({ length: MILESTONES.length - 1 }, (_, i) => {
        const done = i < unlockedIndex
        const active = i === Math.min(unlockedIndex, MILESTONES.length - 2)
        return (
          <g key={i}>
            {/* nền mờ của đường bay */}
            <path d={segmentPath(i)} fill="none" stroke="#ffffff" strokeOpacity={0.5} strokeWidth={7} strokeLinecap="round" />
            {done ? (
              <path
                d={segmentPath(i)}
                className="flight-path"
                fill="none"
                stroke="#fbbf24"
                strokeWidth={4.5}
                strokeLinecap="round"
              />
            ) : (
              <path
                d={segmentPath(i)}
                className={active ? 'flight-path flight-path-dash' : ''}
                fill="none"
                stroke={active ? '#fcd34d' : '#cbd5e1'}
                strokeWidth={active ? 4 : 3}
                strokeDasharray="4 12"
                strokeLinecap="round"
              />
            )}
          </g>
        )
      })}

      {/* các ngôi sao trên đường hành trình */}
      {stars.map((s, i) => {
        const passed = s.t <= birdT
        return (
          <path
            key={i}
            d={`M${s.x} ${s.y - 7} L${s.x + 2} ${s.y - 2} L${s.x + 7} ${s.y} L${s.x + 2} ${s.y + 2} L${s.x} ${s.y + 7} L${s.x - 2} ${s.y + 2} L${s.x - 7} ${s.y} L${s.x - 2} ${s.y - 2} Z`}
            fill={passed ? '#fbbf24' : '#ffffff'}
            opacity={passed ? 1 : 0.55}
            stroke={passed ? '#f59e0b' : '#cbd5e1'}
            strokeWidth={0.8}
          />
        )
      })}
    </svg>
  )
}

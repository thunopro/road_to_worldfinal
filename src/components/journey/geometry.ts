import { MILESTONES } from '../../data/milestones'

/** Hình học của bản đồ hành trình (đơn vị px trong khung cuộn ngang) */
export const TOWER_SPACING = 300
export const LEFT_PAD = 170
export const JOURNEY_HEIGHT = 470

/** cao độ đường bay tại mỗi tháp (đỉnh tháp) — lượn sóng cho sinh động */
export const ANCHOR_Y = [318, 276, 306, 258, 294, 246, 278]

export function anchorX(i: number): number {
  return LEFT_PAD + i * TOWER_SPACING
}

export function journeyWidth(): number {
  return anchorX(MILESTONES.length - 1) + LEFT_PAD
}

interface Point {
  x: number
  y: number
}

function controlPoint(i: number): Point {
  const x = (anchorX(i) + anchorX(i + 1)) / 2
  const y = Math.min(ANCHOR_Y[i], ANCHOR_Y[i + 1]) - 52
  return { x, y }
}

/** vị trí trên đường bay với t ∈ [0, số tháp - 1] */
export function pointAt(t: number): Point {
  const last = MILESTONES.length - 1
  const clamped = Math.max(0, Math.min(last, t))
  const seg = Math.min(last - 1, Math.floor(clamped))
  const f = clamped - seg
  const p0 = { x: anchorX(seg), y: ANCHOR_Y[seg] }
  const p1 = { x: anchorX(seg + 1), y: ANCHOR_Y[seg + 1] }
  const c = controlPoint(seg)
  const u = 1 - f
  return {
    x: u * u * p0.x + 2 * u * f * c.x + f * f * p1.x,
    y: u * u * p0.y + 2 * u * f * c.y + f * f * p1.y,
  }
}

/** path SVG của một đoạn giữa hai tháp */
export function segmentPath(i: number): string {
  const p0 = { x: anchorX(i), y: ANCHOR_Y[i] }
  const p1 = { x: anchorX(i + 1), y: ANCHOR_Y[i + 1] }
  const c = controlPoint(i)
  return `M ${p0.x} ${p0.y} Q ${c.x} ${c.y} ${p1.x} ${p1.y}`
}

/** các ngôi sao nhỏ nằm dọc đường bay */
export function starPositions(): Array<Point & { t: number }> {
  const stars: Array<Point & { t: number }> = []
  for (let seg = 0; seg < MILESTONES.length - 1; seg++) {
    for (const f of [0.25, 0.5, 0.75]) {
      const t = seg + f
      stars.push({ ...pointAt(t), t })
    }
  }
  return stars
}

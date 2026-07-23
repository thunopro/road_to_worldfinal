/**
 * Âm thanh tổng hợp bằng WebAudio — không cần file asset.
 * Mọi hàm đều bỏ qua nếu người dùng tắt âm thanh.
 */

let ctx: AudioContext | null = null

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    try {
      ctx = new AudioContext()
    } catch {
      return null
    }
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', gain = 0.08) {
  const ac = audio()
  if (!ac) return
  const osc = ac.createOscillator()
  const g = ac.createGain()
  osc.type = type
  osc.frequency.value = freq
  g.gain.setValueAtTime(0, ac.currentTime + start)
  g.gain.linearRampToValueAtTime(gain, ac.currentTime + start + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + dur)
  osc.connect(g).connect(ac.destination)
  osc.start(ac.currentTime + start)
  osc.stop(ac.currentTime + start + dur + 0.05)
}

/** tiếng "pop" nhỏ khi chim ăn năng lượng */
export function playPop(enabled: boolean) {
  if (!enabled) return
  tone(520, 0, 0.12, 'triangle', 0.1)
  tone(780, 0.06, 0.1, 'triangle', 0.08)
}

/** chuông chúc mừng khi AC */
export function playChime(enabled: boolean) {
  if (!enabled) return
  tone(659, 0, 0.18, 'sine', 0.09)
  tone(784, 0.12, 0.18, 'sine', 0.09)
  tone(1047, 0.24, 0.3, 'sine', 0.1)
}

/** fanfare khi mở khóa milestone */
export function playFanfare(enabled: boolean) {
  if (!enabled) return
  const notes = [523, 659, 784, 1047, 784, 1047, 1319]
  notes.forEach((f, i) => tone(f, i * 0.12, 0.25, i < 4 ? 'triangle' : 'sine', 0.09))
}

/** tiếng cảnh báo nhẹ */
export function playWarn(enabled: boolean) {
  if (!enabled) return
  tone(330, 0, 0.2, 'sine', 0.07)
  tone(262, 0.15, 0.25, 'sine', 0.07)
}

import { useCallback, useEffect, useRef } from 'react'
import { nextRating, useAppStore } from '../store/useAppStore'
import { playChime, playFanfare, playPop } from '../utils/sound'

/**
 * Điều phối chuỗi hiệu ứng sau khi AC:
 * orb (hạt năng lượng bay tới chim) → eating → flying → celebrating → [milestone]
 */
export function useCelebration() {
  const timers = useRef<number[]>([])
  const toastShown = useRef(false)

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }, [])

  useEffect(() => clearTimers, [clearTimers])

  const schedule = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  const showAcToast = useCallback(() => {
    if (toastShown.current) return
    toastShown.current = true
    const s = useAppStore.getState()
    const next = nextRating(s.milestoneIndex)
    s.pushToast({
      title: 'Chúc mừng! +1 bài AC 🎉',
      subtitle: next
        ? `Chim đã nhận thêm năng lượng và bay gần hơn tới rating ${next}.`
        : 'Bạn đã ở đỉnh cao của hành trình. Quá tuyệt vời!',
      tone: 'success',
    })
  }, [])

  /** chạy chuỗi hiệu ứng; unlockedRating khác null nếu vừa mở khóa milestone */
  const run = useCallback(
    (unlockedRating: number | null) => {
      clearTimers()
      toastShown.current = false
      const { setPhase, settings } = useAppStore.getState()
      const sound = settings.soundOn

      if (settings.reducedMotion) {
        showAcToast()
        playChime(sound)
        setPhase(unlockedRating ? 'milestone' : 'none')
        if (unlockedRating) playFanfare(sound)
        return
      }

      setPhase('orb')
      schedule(() => {
        useAppStore.getState().setPhase('eating')
        playPop(sound)
      }, 700)
      schedule(() => useAppStore.getState().setPhase('flying'), 1700)
      schedule(() => {
        useAppStore.getState().setPhase('celebrating')
        playChime(sound)
        showAcToast()
      }, 3100)
      schedule(() => {
        if (unlockedRating) {
          useAppStore.getState().setPhase('milestone')
          playFanfare(sound)
        } else {
          useAppStore.getState().setPhase('none')
        }
      }, 5200)
    },
    [clearTimers, showAcToast],
  )

  /** bỏ qua hiệu ứng, nhảy thẳng tới kết quả */
  const skip = useCallback(() => {
    clearTimers()
    const s = useAppStore.getState()
    showAcToast()
    if (s.pendingUnlock) {
      s.setPhase('milestone')
      playFanfare(s.settings.soundOn)
    } else {
      s.setPhase('none')
    }
  }, [clearTimers, showAcToast])

  return { run, skip }
}

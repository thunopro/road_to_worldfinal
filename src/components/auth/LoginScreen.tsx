import { useState } from 'react'
import BirdCharacter from '../journey/BirdCharacter'
import SkyBackground from '../sky/SkyBackground'
import { useAppStore } from '../../store/useAppStore'
import { useAuthStore } from '../../store/useAuthStore'

/** Màn hình đăng nhập: Google hoặc chơi khách (offline) */
export default function LoginScreen() {
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle)
  const continueAsGuest = useAuthStore((s) => s.continueAsGuest)
  const pushToast = useAppStore((s) => s.pushToast)
  const [busy, setBusy] = useState(false)

  const google = async () => {
    setBusy(true)
    const err = await signInWithGoogle()
    if (err) {
      setBusy(false)
      pushToast({
        title: 'Chưa đăng nhập được ❌',
        subtitle: err.includes('provider')
          ? 'Google chưa được bật trong Supabase. Bạn có thể chơi chế độ khách trước!'
          : err,
        tone: 'error',
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <SkyBackground />
      <div className="game-panel relative w-full max-w-md p-6 text-center">
        <div className="flex justify-center -mt-14 mb-1">
          <BirdCharacter state="celebrating" size={120} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-sky-600 to-amber-500 bg-clip-text text-transparent">
          roadtoworldfinal
        </h1>
        <p className="text-sm text-[#5c4d33] font-medium mt-1 mb-6">
          Mỗi AC là một hạt năng lượng, giúp chim bay xa hơn ✨
        </p>

        <button
          onClick={google}
          disabled={busy}
          className="game-btn w-full py-3 font-extrabold text-white text-base flex items-center justify-center gap-2.5
            bg-gradient-to-b from-sky-400 to-sky-500 border-2 border-sky-700 shadow-lg
            hover:brightness-105 disabled:opacity-60"
        >
          <span
            className="w-6 h-6 rounded-full bg-white text-sm font-black flex items-center justify-center"
            style={{ color: '#4285F4' }}
            aria-hidden="true"
          >
            G
          </span>
          {busy ? 'Đang chuyển hướng...' : 'Đăng nhập với Google'}
        </button>

        <div className="my-3 flex items-center gap-3 text-[11px] font-bold text-[#8a7550]">
          <span className="flex-1 h-px bg-[#d8c9a3]" /> hoặc <span className="flex-1 h-px bg-[#d8c9a3]" />
        </div>

        <button
          onClick={continueAsGuest}
          className="game-btn w-full py-2.5 font-extrabold text-[#5c4d33] text-sm
            bg-[#fdf6e3] border-2 border-[#d8c9a3] hover:bg-amber-50"
        >
          🐣 Chơi chế độ khách (lưu trên máy này)
        </button>

        <p className="text-[11px] text-[#8a7550] mt-4">
          Đăng nhập để đồng bộ tiến trình mọi thiết bị, nhận quà điểm danh mỗi ngày và tham gia nhóm luyện tập cùng bạn bè.
        </p>
      </div>
    </div>
  )
}

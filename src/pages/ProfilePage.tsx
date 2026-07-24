import { useState } from 'react'
import BirdCharacter from '../components/journey/BirdCharacter'
import { MILESTONES } from '../data/milestones'
import { LOGIN_REWARDS } from '../lib/sync'
import { todayACCount, useAppStore } from '../store/useAppStore'
import { useAuthStore } from '../store/useAuthStore'
import { localDateKey } from '../utils/dates'

/** Trang hồ sơ cá nhân: thông tin tài khoản, chỉ số, quà điểm danh, đăng xuất */
export default function ProfilePage() {
  const user = useAppStore((s) => s.user)
  const totalAC = useAppStore((s) => s.totalAC)
  const streak = useAppStore((s) => s.streak)
  const problems = useAppStore((s) => s.problems)
  const milestoneIndex = useAppStore((s) => s.milestoneIndex)
  const setUserName = useAppStore((s) => s.setUserName)
  const pushToast = useAppStore((s) => s.pushToast)

  const status = useAuthStore((s) => s.status)
  const session = useAuthStore((s) => s.session)
  const profile = useAuthStore((s) => s.profile)
  const signOut = useAuthStore((s) => s.signOut)
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle)

  const [name, setName] = useState(user.name)

  const rewardDay = profile?.last_reward_date === localDateKey() ? profile.login_reward_day : 0

  const stats = [
    { label: 'Tổng AC', value: totalAC, emoji: '⚡' },
    { label: 'Chuỗi hiện tại', value: `${streak.current} ngày`, emoji: '🔥' },
    { label: 'Kỷ lục chuỗi', value: `${streak.longest} ngày`, emoji: '🏆' },
    { label: 'Xu', value: user.coins, emoji: '🪙' },
    { label: 'Huy hiệu', value: user.badges.length, emoji: '🏅' },
    { label: 'Hôm nay', value: `${todayACCount(problems)} bài`, emoji: '📅' },
  ]

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-extrabold mb-1">👤 Hồ sơ cá nhân</h1>
      <p className="text-sm text-slate-500 mb-4">Thông tin tài khoản và hành trình của bạn.</p>

      <div className="game-panel p-4 mb-4">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Ảnh đại diện"
              className="w-24 h-24 rounded-full border-4 border-amber-300 shadow-lg"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-24 h-24 flex items-center justify-center">
              <BirdCharacter state="idle" size={96} />
            </div>
          )}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
              <span className="text-xl font-extrabold text-[#3d3222]">{user.name}</span>
              {profile?.role === 'admin' && (
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 border border-rose-300 text-[11px] font-extrabold">
                  👑 ADMIN
                </span>
              )}
              <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 border border-sky-300 text-[11px] font-extrabold">
                {MILESTONES[milestoneIndex].rating} · {MILESTONES[milestoneIndex].name}
              </span>
            </div>
            <div className="text-sm text-[#8a7550] font-medium mt-1">
              {status === 'signedIn'
                ? session?.user.email ?? 'Tài khoản Google'
                : 'Chế độ khách — dữ liệu chỉ lưu trên máy này'}
            </div>
            <div className="mt-3 flex gap-2 justify-center sm:justify-start">
              {status === 'signedIn' ? (
                <button
                  onClick={() => void signOut()}
                  className="game-btn px-4 py-2 text-sm font-extrabold text-rose-600 bg-rose-50 border-2 border-rose-300 hover:bg-rose-100"
                >
                  Đăng xuất
                </button>
              ) : (
                <button
                  onClick={() => void signInWithGoogle()}
                  className="game-btn px-4 py-2 text-sm font-extrabold text-white bg-gradient-to-b from-sky-400 to-sky-500 border-2 border-sky-700"
                >
                  Đăng nhập Google để đồng bộ
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* đổi tên hiển thị */}
      <div className="game-panel p-4 mb-4">
        <div className="font-extrabold text-sm text-[#3d3222] mb-2">✏️ Tên hiển thị</div>
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-xl border-2 border-[#d8c9a3] bg-white/90 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Tên hiển thị"
          />
          <button
            onClick={() => {
              setUserName(name)
              pushToast({ title: 'Đã đổi tên ✅', tone: 'success' })
            }}
            className="game-btn px-4 py-2 font-extrabold text-white bg-gradient-to-b from-teal-400 to-teal-500 border-2 border-teal-700"
          >
            Lưu
          </button>
        </div>
      </div>

      {/* quà điểm danh */}
      {status === 'signedIn' && (
        <div className="game-panel p-4 mb-4">
          <div className="font-extrabold text-sm text-[#3d3222] mb-1">🎁 Điểm danh hằng ngày</div>
          <p className="text-xs text-[#8a7550] mb-3">Đăng nhập mỗi ngày để nhận xu — chuỗi càng dài quà càng lớn!</p>
          <div className="grid grid-cols-7 gap-1.5">
            {LOGIN_REWARDS.map((coins, i) => {
              const day = i + 1
              const claimed = day <= rewardDay
              const isNext = day === rewardDay + 1
              return (
                <div
                  key={day}
                  className={`rounded-xl p-2 text-center border-2 transition-all
                    ${claimed
                      ? 'bg-emerald-100 border-emerald-400'
                      : isNext
                        ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300'
                        : 'bg-white/70 border-[#d8c9a3] opacity-70'}`}
                >
                  <div className="text-[10px] font-extrabold text-[#8a7550]">Ngày {day}</div>
                  <div className="text-lg" aria-hidden="true">{claimed ? '✅' : '🪙'}</div>
                  <div className="text-[11px] font-extrabold text-amber-700">+{coins}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* chỉ số */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {stats.map((st) => (
          <div key={st.label} className="game-panel p-3 text-center">
            <div className="text-2xl" aria-hidden="true">{st.emoji}</div>
            <div className="text-lg font-extrabold text-[#3d3222]">{st.value}</div>
            <div className="text-[11px] font-bold text-[#8a7550]">{st.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { useRef, useState } from 'react'
import { useAppStore } from '../store/useAppStore'

/** Trang cài đặt: hồ sơ, âm thanh, chuyển động, mục tiêu, dữ liệu */
export default function SettingsPage() {
  const user = useAppStore((s) => s.user)
  const settings = useAppStore((s) => s.settings)
  const setSettings = useAppStore((s) => s.setSettings)
  const setUserName = useAppStore((s) => s.setUserName)
  const resetAll = useAppStore((s) => s.resetAll)
  const pushToast = useAppStore((s) => s.pushToast)

  const [name, setName] = useState(user.name)
  const [confirmReset, setConfirmReset] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const exportData = () => {
    const raw = localStorage.getItem('hanh-on-tri-vien-code') ?? '{}'
    const blob = new Blob([raw], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'hanh-on-tri-vien-code-backup.json'
    a.click()
    URL.revokeObjectURL(url)
    pushToast({ title: 'Đã xuất dữ liệu 📦', subtitle: 'File JSON đã được tải về.', tone: 'success' })
  }

  const importData = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        JSON.parse(String(reader.result))
        localStorage.setItem('hanh-on-tri-vien-code', String(reader.result))
        pushToast({ title: 'Đã nhập dữ liệu ✅', subtitle: 'Đang tải lại trang...', tone: 'success' })
        setTimeout(() => window.location.reload(), 800)
      } catch {
        pushToast({ title: 'File không hợp lệ ❌', subtitle: 'Vui lòng chọn file backup JSON đúng định dạng.', tone: 'error' })
      }
    }
    reader.readAsText(file)
  }

  const rowCls = 'glass p-5'
  const labelCls = 'font-extrabold text-sm'
  const hintCls = 'text-xs text-slate-500 mt-0.5'

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-extrabold mb-1">⚙️ Cài đặt</h1>
      <p className="text-sm text-slate-500 mb-4">Tùy chỉnh trải nghiệm hành trình của bạn.</p>

      <div className="space-y-4">
        <div className={rowCls}>
          <div className={labelCls}>👤 Tên hiển thị</div>
          <div className="flex gap-2 mt-2">
            <input
              className="flex-1 rounded-xl border border-sky-200 bg-white/80 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label="Tên hiển thị"
            />
            <button
              onClick={() => {
                setUserName(name)
                pushToast({ title: 'Đã đổi tên ✅', tone: 'success' })
              }}
              className="px-4 py-2 rounded-xl font-bold text-white bg-sky-500 hover:bg-sky-600 transition-colors"
            >
              Lưu
            </button>
          </div>
        </div>

        <div className={rowCls}>
          <div className="flex items-center justify-between">
            <div>
              <div className={labelCls}>🔊 Âm thanh</div>
              <div className={hintCls}>Âm chúc mừng khi AC bài và mở khóa milestone.</div>
            </div>
            <button
              role="switch"
              aria-checked={settings.soundOn}
              onClick={() => setSettings({ soundOn: !settings.soundOn })}
              className={`w-14 h-8 rounded-full transition-colors relative ${settings.soundOn ? 'bg-teal-400' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${settings.soundOn ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>

        <div className={rowCls}>
          <div className="flex items-center justify-between">
            <div>
              <div className={labelCls}>🐢 Giảm chuyển động</div>
              <div className={hintCls}>Tắt animation cho máy yếu hoặc khi bạn muốn tập trung.</div>
            </div>
            <button
              role="switch"
              aria-checked={settings.reducedMotion}
              onClick={() => setSettings({ reducedMotion: !settings.reducedMotion })}
              className={`w-14 h-8 rounded-full transition-colors relative ${settings.reducedMotion ? 'bg-teal-400' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${settings.reducedMotion ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>

        <div className={rowCls}>
          <div className={labelCls}>🏰 Số bài mỗi milestone</div>
          <div className={hintCls}>Mặc định 100 bài. Giảm xuống nếu bạn muốn hành trình ngắn hơn.</div>
          <div className="flex items-center gap-3 mt-2">
            <input
              type="range"
              min={10}
              max={200}
              step={5}
              value={settings.problemsPerMilestone}
              onChange={(e) => setSettings({ problemsPerMilestone: Number(e.target.value) })}
              className="flex-1 accent-sky-500"
              aria-label="Số bài yêu cầu mỗi milestone"
            />
            <span className="w-16 text-center font-extrabold text-sky-600">{settings.problemsPerMilestone} bài</span>
          </div>
        </div>

        <div className={rowCls}>
          <div className={labelCls}>💾 Dữ liệu</div>
          <div className={hintCls}>Dữ liệu được lưu trong LocalStorage của trình duyệt. Kiến trúc đã sẵn sàng để đồng bộ Supabase/Firebase trong tương lai.</div>
          <div className="flex flex-wrap gap-2 mt-3">
            <button onClick={exportData} className="px-4 py-2 rounded-xl font-bold text-sky-600 bg-sky-50 border border-sky-200 hover:bg-sky-100 transition-colors">
              📦 Xuất JSON
            </button>
            <button onClick={() => fileRef.current?.click()} className="px-4 py-2 rounded-xl font-bold text-teal-600 bg-teal-50 border border-teal-200 hover:bg-teal-100 transition-colors">
              📥 Nhập JSON
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && importData(e.target.files[0])}
            />
            <button onClick={() => setConfirmReset(true)} className="px-4 py-2 rounded-xl font-bold text-rose-500 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors">
              🔄 Reset về dữ liệu mẫu
            </button>
          </div>
        </div>
      </div>

      {confirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Xác nhận reset dữ liệu">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setConfirmReset(false)} />
          <div className="relative glass-strong p-6 max-w-sm w-full text-center">
            <div className="text-4xl mb-2">⚠️</div>
            <div className="font-extrabold">Reset toàn bộ dữ liệu?</div>
            <p className="text-sm text-slate-500 mt-1">Mọi bài đã lưu, tiến độ, xu và vật phẩm sẽ quay về dữ liệu demo ban đầu.</p>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setConfirmReset(false)} className="flex-1 py-2.5 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                Hủy
              </button>
              <button
                onClick={() => {
                  resetAll()
                  setConfirmReset(false)
                  pushToast({ title: 'Đã reset dữ liệu 🔄', tone: 'info' })
                }}
                className="flex-1 py-2.5 rounded-xl font-bold text-white bg-rose-500 hover:bg-rose-600 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

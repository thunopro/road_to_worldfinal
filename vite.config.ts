import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // dùng polling để tránh lỗi ENOSPC khi hệ thống hết inotify watcher
    watch: { usePolling: true, interval: 300 },
  },
})

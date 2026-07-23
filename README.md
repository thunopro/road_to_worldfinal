# 🐦 Hành ổn trí viễn [CODE]

> **Mỗi bài AC là một đơn vị năng lượng giúp chú chim bay xa hơn trên hành trình chinh phục Codeforces.**

Website game hóa theo dõi quá trình luyện tập Codeforces. Thay vì một bảng thống kê khô khan, bạn có một **hành trình trên bầu trời**: mỗi bài AC "cho chim ăn" một hạt năng lượng, chim bay tiến dần qua các tòa tháp milestone từ rating **1200 → 2400**.

![Tech](https://img.shields.io/badge/React_18-TypeScript-blue) ![Style](https://img.shields.io/badge/Tailwind_CSS_4-Framer_Motion-teal)

## ✨ Tính năng

- **Bản đồ hành trình**: bầu trời với mây trôi, hạt sáng, 7 tòa tháp milestone trên đảo mây, đường bay phát sáng, cuộn ngang xem toàn bộ hành trình.
- **Linh vật chim phi công** vẽ bằng SVG với 7 trạng thái: idle, bay, ăn năng lượng, chúc mừng, lo lắng (sắp mất streak), mệt mỏi (nghỉ lâu), lên đồ khi mở milestone.
- **Trải nghiệm cốt lõi**: Nộp bài AC → hạt năng lượng bay tới chim → chim ăn & phát sáng → chim bay tiến lên → thanh tiến độ tăng → confetti + toast + âm thanh (có thể tắt/bỏ qua hiệu ứng).
- **Mở khóa milestone**: pháo hoa, ánh sáng vàng, huy hiệu, xu thưởng và trang phục mới cho chim.
- **Nhiệm vụ** hằng ngày & hằng tuần với tiến độ tính từ dữ liệu thật và nút nhận thưởng.
- **Hệ thống streak** với ngọn lửa, kỷ lục, lời nhắc và vật phẩm **Streak Freeze 🧊**.
- **Bộ sưu tập / cửa hàng**: dùng xu mở khóa khăn, kính, mũ, màu cánh, trail ánh sáng và cả **bầu trời hoàng hôn / đêm ngân hà** (đổi theme thật).
- **Trang bài tập**: tìm kiếm, lọc theo rating/tag/ngày, sắp xếp, sửa, xóa, đánh dấu "cần làm lại".
- **Lịch luyện tập** dạng heatmap theo tháng.
- **Thống kê**: AC theo ngày/tuần, phân bố rating/tag, tỷ lệ milestone, nhận xét tự động điểm mạnh/yếu.
- **Thành tích + BXH cá nhân** (tự đua với chính mình theo ngày/tuần).
- **Responsive**: sidebar trên desktop, bottom navigation trên mobile.
- **Accessibility**: aria-label/role đầy đủ, tùy chọn giảm chuyển động, tắt âm thanh, keyboard focus.
- Dữ liệu lưu **LocalStorage** (kèm xuất/nhập JSON) — kiến trúc service đã chuẩn bị sẵn để nối Codeforces API / Supabase / Firebase sau này.

## 🚀 Cài đặt & chạy

Yêu cầu: **Node.js 18+**

```bash
# 1. Cài dependencies
npm install

# 2. Chạy dev server
npm run dev
# → mở http://localhost:5173

# 3. Build production
npm run build

# 4. Xem thử bản build
npm run preview
# → mở http://localhost:4173
```

> 💡 Nếu `npm run dev` báo lỗi `ENOSPC` (hết inotify watcher trên Linux), dự án đã bật sẵn chế độ polling trong `vite.config.ts`. Cách khác là tăng giới hạn hệ thống:
> `sudo sysctl fs.inotify.max_user_watches=524288`

## 🎮 Dùng thử nhanh

App khởi tạo sẵn dữ liệu demo: người dùng **SkyCoder**, 45 AC, tiến độ 45/100 tại tháp 1200, chuỗi 7 ngày, 320 xu và 10 bài trong lịch sử.

1. Bấm nút **⚡ Nộp bài** (góc dưới phải).
2. Dán link bài Codeforces rồi bấm **Lấy thông tin từ URL** (hoặc nhập tay), chọn trạng thái **AC**.
3. Ngắm chim ăn năng lượng, bay tiến lên và nhận thưởng 🎉
4. Vào **Cài đặt** để giảm "Số bài mỗi milestone" xuống thấp nếu muốn xem hiệu ứng **mở khóa milestone** ngay.

## 🗂️ Cấu trúc thư mục

```
src/
├── components/
│   ├── layout/      # Sidebar, HeaderStats, BottomNav, cấu hình điều hướng
│   ├── sky/         # SkyBackground, CloudLayer (mây, mặt trời, particle)
│   ├── journey/     # JourneyMap, MilestoneTower, BirdCharacter, FlightPath,
│   │                # ProgressPanel, geometry (toán học đường bay)
│   ├── submit/      # SubmitProblemButton, SubmitProblemModal
│   ├── effects/     # SuccessCelebration (confetti), MilestoneUnlockAnimation, ToastStack
│   ├── quests/      # DailyQuestCard
│   └── streak/      # StreakCard
├── pages/           # Home, Problems, Calendar, Quests, Achievements,
│                    # Leaderboard, Collection, Stats, Settings
├── store/           # Zustand store + persist LocalStorage (useAppStore)
├── data/            # milestones, shop, quests, achievements, dữ liệu mẫu
├── hooks/           # useCelebration (điều phối chuỗi hiệu ứng AC)
├── services/        # codeforces.ts (parse URL, chuẩn bị sẵn cho CF API)
└── utils/           # dates, sound (WebAudio — không cần file âm thanh)
```

## 🛠️ Công nghệ

| Thành phần | Lựa chọn |
|---|---|
| Framework | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS 4, glassmorphism |
| Animation | Framer Motion + CSS keyframes |
| State | Zustand (persist → LocalStorage) |
| Đồ họa | SVG tự vẽ 100% (chim, tháp, đường bay) — không dùng asset có bản quyền |
| Âm thanh | WebAudio API tổng hợp (không cần file mp3) |

## 🔮 Hướng phát triển

- Đồng bộ tự động với **Codeforces API** (`services/codeforces.ts` đã có sẵn `fetchProblemInfo`).
- Đăng nhập + lưu cloud qua **Supabase/Firebase** (store đã tách riêng, chỉ cần thay lớp persist).
- Virtual contest thật, bảng xếp hạng bạn bè, thêm skin theo mùa.

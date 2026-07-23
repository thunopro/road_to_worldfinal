Hãy thiết kế và lập trình một website hoàn chỉnh theo phong cách game hóa để theo dõi quá trình luyện tập Codeforces. Website không được giống một bảng thống kê đơn giản mà phải tạo cảm giác như một trò chơi hành trình, giúp người dùng có động lực giải bài lâu dài.

# 1. Ý tưởng tổng thể

Tên dự án:

**Hành ổn trí viễn [CODE]**

Thông điệp chính:

**Mỗi bài AC là một đơn vị năng lượng giúp chú chim bay xa hơn trên hành trình chinh phục Codeforces.**

Người dùng bắt đầu luyện tập từ mức rating 1200. Mỗi khi giải thành công một bài, chú chim sẽ được “cho ăn”, nhận thêm năng lượng và bay tiến thêm một đoạn về phía cột mốc tiếp theo.

Website phải tạo được cảm giác:

* Có mục tiêu rõ ràng.
* Có tiến trình dài hạn.
* Có phần thưởng khi hoàn thành bài.
* Có hiệu ứng vui vẻ sau mỗi lần AC.
* Khi mở website, người dùng muốn tiếp tục luyện tập thay vì bỏ cuộc.

# 2. Công nghệ đề xuất

Sử dụng:

* React hoặc Next.js.
* TypeScript.
* Tailwind CSS.
* Framer Motion cho animation.
* LocalStorage để lưu dữ liệu phiên bản đầu tiên.
* Có thể chuẩn bị kiến trúc để kết nối Supabase hoặc Firebase sau này.
* Sử dụng SVG, CSS animation hoặc canvas cho các hiệu ứng chim bay, mây, ánh sáng và particle.
* Không sử dụng logo chính thức của Codeforces.

Code cần được tổ chức rõ ràng, chia component hợp lý, dễ bảo trì và dễ mở rộng.

# 3. Phong cách đồ họa

Thiết kế theo phong cách game UI hiện đại, kết hợp giữa hoạt hình 2D, soft 3D và glassmorphism.

Bối cảnh chính là bầu trời rộng lớn với:

* Mây chuyển động chậm.
* Ánh sáng mặt trời.
* Các hạt sáng nhỏ bay trong không khí.
* Những hòn đảo nổi.
* Các tòa tháp milestone nằm trên mây.
* Một đường hành trình phát sáng kết nối các milestone.

Màu sắc chủ đạo:

* Xanh bầu trời.
* Trắng.
* Vàng kim.
* Cam nhạt.
* Xanh teal.
* Một số màu riêng cho từng mức rating.

Giao diện phải đẹp, hiện đại, giàu chiều sâu nhưng không rối mắt. Các thành phần UI cần có bo góc, bóng đổ mềm, hiệu ứng kính mờ và animation tinh tế.

# 4. Nhân vật chính

Tạo một linh vật là chú chim nhỏ đáng yêu, có phong cách phi công.

Đặc điểm:

* Thân màu trắng và xanh nhạt.
* Mắt lớn, biểu cảm rõ ràng.
* Đeo kính phi công.
* Quàng khăn đỏ hoặc cam.
* Có nhiều trạng thái animation khác nhau.

Các trạng thái cần có:

1. Idle: chim đập cánh nhẹ, lơ lửng tại vị trí hiện tại.
2. Flying: chim bay tiến về phía trước sau khi người dùng AC bài.
3. Eating: chim ăn hạt năng lượng khi người dùng nộp một bài AC.
4. Celebrating: chim xoay một vòng, phát sáng hoặc tung cánh chúc mừng.
5. Tired: xuất hiện khi người dùng nhiều ngày không luyện tập.
6. Milestone unlocked: chim bay quanh cột mốc mới và đáp xuống tháp.
7. Level up: chim nhận trang phục hoặc phụ kiện mới.

Chuyển động phải mềm mại, vui nhộn và tạo cảm giác chú chim thực sự đang đồng hành với người dùng.

# 5. Hệ thống milestone

Hiển thị các cột mốc rating theo chiều ngang:

* 1200
* 1400
* 1600
* 1800
* 2000
* 2200
* 2400

Mỗi rating là một tòa tháp hoặc hòn đảo riêng.

Mỗi cột mốc có:

* Màu sắc riêng.
* Biểu tượng rating.
* Trạng thái đã mở khóa hoặc đang khóa.
* Thanh tiến độ.
* Phần thưởng khi hoàn thành.
* Số bài đã giải tại mức rating đó.

Màu milestone đề xuất:

* 1200: xanh dương.
* 1400: xanh teal.
* 1600: xanh đậm.
* 1800: tím.
* 2000: vàng.
* 2200: đỏ cam.
* 2400: tím đậm kết hợp vàng.

Các milestone chưa mở khóa cần có biểu tượng ổ khóa và hiệu ứng mờ nhẹ.

Chim phải nằm trên đường bay giữa các milestone. Vị trí của chim được tính dựa trên tiến độ hiện tại.

Ví dụ:

* Người dùng đang ở mức 1200.
* Đã hoàn thành 45 trong tổng số 100 bài.
* Chim nằm ở khoảng 45% quãng đường từ tháp 1200 đến tháp 1400.

# 6. Quy tắc tiến trình

Mặc định mỗi milestone yêu cầu hoàn thành 100 bài.

Ví dụ:

* 100 bài rating 1200 để mở milestone 1400.
* 100 bài rating 1400 để mở milestone 1600.
* 100 bài rating 1600 để mở milestone 1800.
* Tiếp tục tương tự cho đến 2400.

Cho phép người dùng chỉnh số lượng bài yêu cầu cho mỗi milestone trong phần cài đặt.

Tổng hành trình mặc định có 700 bài, tương ứng với 7 nhóm rating.

Ngoài tiến trình milestone, hiển thị thêm:

* Tổng số bài AC.
* Chuỗi ngày luyện tập hiện tại.
* Chuỗi ngày dài nhất.
* Số bài giải hôm nay.
* Số bài giải trong tuần.
* Rating mục tiêu tiếp theo.
* Số bài còn lại để mở khóa milestone.
* Tỷ lệ hoàn thành toàn bộ hành trình.

# 7. Khu vực chính của trang chủ

## Thanh điều hướng bên trái

Bao gồm:

* Trang chủ.
* Bài tập.
* Lịch luyện tập.
* Nhiệm vụ.
* Thành tích.
* Bảng xếp hạng cá nhân.
* Bộ sưu tập.
* Cài đặt.

Phía dưới sidebar hiển thị:

* Avatar chú chim.
* Tên người dùng.
* Rank hiện tại.
* Tổng AC.

## Header

Hiển thị:

**Hành ổn trí viễn [CODE]**

Subtitle:

**Mỗi AC là một hạt năng lượng giúp chim bay xa hơn.**

Phía bên phải hiển thị các thẻ thống kê:

* Chuỗi hiện tại.
* Tổng AC.
* Mục tiêu tiếp theo.
* Số bài hôm nay.

## Khu vực hành trình

Đây là phần nổi bật nhất của website.

Hiển thị:

* Bầu trời.
* Các milestone tower.
* Đường bay phát sáng.
* Chú chim tại vị trí tiến độ hiện tại.
* Các ngôi sao nhỏ nằm trên đường hành trình.
* Mây di chuyển chậm.
* Particle và ánh sáng nền.

Cho phép kéo ngang hoặc cuộn ngang để xem toàn bộ hành trình từ 1200 đến 2400.

## Bảng tiến độ phía dưới

Hiển thị:

* Cột mốc hiện tại.
* Rating hiện tại.
* Thanh tiến độ.
* Ví dụ: `45/100 bài`.
* Phần trăm hoàn thành.
* Dòng chữ: `Còn 55 bài để mở khóa rating 1400`.
* Phần thưởng milestone.
* Thành tích gần nhất.

# 8. Nút nộp bài

Tạo một nút nổi bật:

**Nộp bài**

Khi nhấn nút, mở modal nhập thông tin bài vừa giải.

Các trường bao gồm:

* Link bài Codeforces.
* Tên bài.
* Contest ID.
* Problem index.
* Rating của bài.
* Tag thuật toán.
* Trạng thái: AC hoặc chưa AC.
* Ghi chú.
* Thời gian giải.
* Mức độ khó cảm nhận.

Có thể thêm nút:

**Lấy thông tin từ URL**

Trong phiên bản mockup, chức năng này có thể tự động đọc contest ID và problem index từ đường dẫn. Chuẩn bị sẵn service để sau này kết nối Codeforces API.

Chỉ khi trạng thái là AC thì tiến độ mới tăng thêm một bài.

# 9. Hiệu ứng khi nộp bài AC

Đây là trải nghiệm quan trọng nhất của website.

Khi người dùng nộp một bài AC:

1. Nút “Nộp bài” chuyển sang trạng thái loading.
2. Một hạt năng lượng hoặc ngôi sao xuất hiện từ nút.
3. Hạt năng lượng bay về phía chú chim.
4. Chim chuyển sang animation ăn năng lượng.
5. Chim phát sáng.
6. Chim bay tiến thêm một đoạn nhỏ trên đường milestone.
7. Thanh tiến độ tăng từ `45/100` lên `46/100`.
8. Tổng AC tăng thêm 1.
9. Xuất hiện confetti và particle.
10. Hiển thị toast:

**Chúc mừng! +1 bài AC**

Dòng phụ:

**Chim đã nhận thêm năng lượng và bay gần hơn tới rating 1400.**

11. Có âm thanh chúc mừng nhẹ, nhưng phải có nút tắt âm thanh.
12. Sau khoảng vài giây, giao diện trở lại trạng thái idle.

Animation phải rõ ràng nhưng không quá dài. Người dùng có thể nhấn nút bỏ qua hiệu ứng.

# 10. Hiệu ứng mở khóa milestone

Khi tiến độ đạt `100/100`:

* Tòa tháp hiện tại phát sáng.
* Ổ khóa của milestone tiếp theo bị phá vỡ.
* Một cây cầu ánh sáng xuất hiện.
* Chim bay nhanh tới cột mốc mới.
* Camera hoặc viewport dịch chuyển theo chim.
* Xuất hiện pháo hoa, confetti và ánh sáng vàng.
* Hiển thị thông báo:

**Milestone 1400 đã được mở khóa!**

Dòng phụ:

**Một chặng đường mới đã bắt đầu.**

Người dùng nhận được:

* Huy hiệu.
* Xu hoặc điểm thưởng.
* Một skin hoặc phụ kiện mới cho chim.
* Thành tích mới.

Sau đó tiến độ của milestone mới bắt đầu từ `0/100`.

# 11. Hệ thống nhiệm vụ

Thêm các nhiệm vụ hằng ngày và hằng tuần.

Ví dụ nhiệm vụ hằng ngày:

* AC 1 bài.
* AC 2 bài liên tiếp.
* Giải một bài thuộc tag chưa luyện gần đây.
* Học lại một bài đã từng sai.
* Duy trì luyện tập ít nhất 30 phút.

Nhiệm vụ hằng tuần:

* AC 10 bài.
* Hoàn thành 3 tag thuật toán khác nhau.
* Không bỏ luyện tập quá hai ngày.
* Hoàn thành một virtual contest.

Mỗi nhiệm vụ có:

* Thanh tiến độ.
* Phần thưởng.
* Trạng thái hoàn thành.
* Nút nhận thưởng.

# 12. Hệ thống streak

Hiển thị chuỗi ngày luyện tập bằng biểu tượng ngọn lửa.

Ví dụ:

* Chuỗi hiện tại: 7 ngày.
* Kỷ lục: 21 ngày.

Khi người dùng gần mất streak, chim hiển thị trạng thái lo lắng và đưa ra lời nhắc:

**Hôm nay chúng ta vẫn chưa luyện tập. Đừng để ngọn lửa tắt nhé!**

Có thể thêm vật phẩm “Streak Freeze” để bảo vệ chuỗi ngày.

# 13. Trang bài tập

Tạo bảng lịch sử bài đã giải, bao gồm:

* Ngày giải.
* Tên bài.
* Link bài.
* Rating.
* Tag.
* Trạng thái.
* Thời gian giải.
* Số lần submit.
* Ghi chú.

Có chức năng:

* Tìm kiếm.
* Lọc theo rating.
* Lọc theo tag.
* Lọc theo ngày.
* Sắp xếp.
* Chỉnh sửa.
* Xóa.
* Đánh dấu bài cần làm lại.

Không dùng bảng khô cứng hoàn toàn. Có thể kết hợp card, icon và màu rating để đồng bộ với giao diện game.

# 14. Trang thống kê

Hiển thị các biểu đồ:

* Số bài AC theo ngày.
* Số bài AC theo tuần.
* Phân bố bài theo rating.
* Phân bố theo tag.
* Thời gian giải trung bình.
* Streak calendar dạng heatmap.
* Tỷ lệ hoàn thành từng milestone.
* Số bài đã làm lại.
* Các tag mạnh và tag yếu.

Thêm phần nhận xét tự động, ví dụ:

**Bạn đang tiến bộ tốt ở Dynamic Programming nhưng cần luyện thêm Graph và Number Theory.**

# 15. Hệ thống phần thưởng

Người dùng nhận xu hoặc tinh thể sau mỗi bài AC.

Có thể sử dụng phần thưởng để mở khóa:

* Kính cho chim.
* Khăn choàng.
* Mũ.
* Hiệu ứng bay.
* Màu cánh.
* Trail ánh sáng.
* Background bầu trời.
* Skin theo từng rating.
* Huy hiệu.

Không cần xây dựng hệ thống thanh toán thật. Đây chỉ là hệ thống phần thưởng nội bộ.

# 16. Dữ liệu mặc định để demo

Khởi tạo dữ liệu mẫu:

* Tên người dùng: SkyCoder.
* Rating hiện tại: 1200.
* Tổng AC: 45.
* Tiến độ hiện tại: 45/100.
* Chuỗi hiện tại: 7 ngày.
* Mục tiêu tiếp theo: 1400.
* Bài còn lại: 55.
* Xu hiện tại: 320.
* Huy hiệu: 3.

Tạo sẵn khoảng 10 bài trong lịch sử để giao diện có dữ liệu minh họa.

# 17. Trạng thái giao diện cần thiết

Thiết kế đầy đủ các trạng thái:

* Trang chủ idle.
* Modal nộp bài.
* Loading khi nộp bài.
* Nộp bài AC thành công.
* Nộp bài chưa AC.
* Chim bay tiến lên.
* Mở khóa milestone.
* Nhận phần thưởng.
* Không có dữ liệu.
* Lỗi nhập liệu.
* Xác nhận xóa bài.
* Chế độ âm thanh bật và tắt.
* Giao diện desktop, tablet và mobile.

# 18. Responsive

Trên desktop:

* Hiển thị toàn bộ hành trình theo chiều ngang.
* Sidebar cố định.
* Các bảng thống kê hiển thị đầy đủ.

Trên tablet:

* Sidebar thu gọn.
* Hành trình có thể kéo ngang.

Trên mobile:

* Dùng bottom navigation.
* Milestone hiển thị theo dạng cuộn ngang.
* Thanh tiến độ và nút nộp bài luôn dễ truy cập.
* Animation được tối ưu để không gây giật lag.

# 19. Yêu cầu trải nghiệm

* Animation phải mượt.
* Không để hiệu ứng làm giảm khả năng sử dụng.
* Có tùy chọn giảm chuyển động.
* Có chế độ tắt âm thanh.
* Dữ liệu không bị mất khi tải lại trang.
* Form phải có validation.
* Có thông báo rõ ràng khi thao tác thành công hoặc thất bại.
* Chú trọng accessibility, keyboard navigation và độ tương phản.
* Tốc độ tải trang nhanh.
* Không sử dụng hình ảnh có bản quyền không rõ nguồn gốc.
* Có thể dùng SVG tự thiết kế hoặc placeholder để sau này thay asset.

# 20. Kiến trúc component đề xuất

Tách thành các component:

* AppShell
* Sidebar
* HeaderStats
* SkyBackground
* CloudLayer
* JourneyMap
* MilestoneTower
* BirdCharacter
* FlightPath
* ProgressPanel
* SubmitProblemButton
* SubmitProblemModal
* SuccessCelebration
* MilestoneUnlockAnimation
* DailyQuestCard
* StreakCard
* RewardPanel
* ProblemHistory
* StatisticsDashboard
* SettingsPanel

Tạo state management rõ ràng cho:

* Người dùng.
* Danh sách bài.
* Milestone hiện tại.
* Tiến độ.
* Trạng thái animation.
* Streak.
* Phần thưởng.
* Cài đặt âm thanh.
* Reduced motion.

# 21. Kết quả cần bàn giao

Hãy tạo một website chạy được hoàn chỉnh, không chỉ tạo ảnh mockup.

Kết quả cần bao gồm:

1. Toàn bộ source code.
2. Giao diện trang chủ hoàn chỉnh.
3. Animation idle của chim.
4. Animation sau khi AC bài.
5. Hệ thống milestone từ 1200 đến 2400.
6. Thanh tiến độ hoạt động thực tế.
7. Modal nộp bài.
8. Lưu dữ liệu bằng LocalStorage.
9. Trang lịch sử bài tập.
10. Trang thống kê cơ bản.
11. Responsive cho desktop và mobile.
12. README hướng dẫn cài đặt và chạy dự án.

Ưu tiên hoàn thiện trải nghiệm cốt lõi trước:

**Nộp bài AC → chim nhận năng lượng → chim bay tiến lên → tiến độ tăng → hiệu ứng chúc mừng.**

Website phải tạo cảm giác đây là một sản phẩm game hóa thực sự, không phải spreadsheet được trang trí lại. Hãy tự phát triển thêm các chi tiết sáng tạo, animation và phần thưởng phù hợp, nhưng vẫn giữ giao diện rõ ràng, dễ sử dụng và có khả năng phát triển thành sản phẩm thật.

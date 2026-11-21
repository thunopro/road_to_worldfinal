# worldfinal — CP Editor kiểu VS Code (Portable Neovim 0.9.5)

Chạy thẳng trong Terminal trên **Linux** và **Windows**, đã đóng gói sẵn Neovim 0.9.5, cấu hình CP tối ưu và bộ snippet VS Code. Bộ cài sẽ tự động cài thêm `g++` (và clipboard tool trên Linux) nếu máy chưa có.

---

## Tải & Cài đặt nhanh

### Cách 1: Tải file `worldfinal.zip` (khuyên dùng)
Tải bản mới nhất tại:
`https://github.com/thunopro/road_to_worldfinal/releases/latest/download/worldfinal.zip`

- **Linux**:
  ```bash
  curl -LO https://github.com/thunopro/road_to_worldfinal/releases/latest/download/worldfinal.zip
  unzip worldfinal.zip && cd worldfinal
  bash install.sh
  ```
  Mở terminal mới và gõ: `worldfinal A.cpp`

- **Windows**:
  1. Tải và giải nén `worldfinal.zip`
  2. Double-click `install.bat` (tự cài `worldfinal`, thêm PATH, cấu hình Windows Terminal, và tự tải `g++` MinGW-w64 nếu chưa có)
  3. Mở terminal mới (Windows Terminal / PowerShell / cmd) và gõ: `worldfinal A.cpp`

### Cách 2: Clone từ GitHub
```bash
git clone https://github.com/thunopro/road_to_worldfinal.git
cd road_to_worldfinal/worldfinal
```
- Linux: `bash install.sh` (hoặc chạy trực tiếp `./worldfinal A.cpp`)
- Windows: chạy `install.bat` (hoặc chạy trực tiếp `worldfinal.cmd A.cpp`)

---

## Phím tắt chính

| Phím | Chức năng |
| :--- | :--- |
| `Ctrl+S` / `F5` | Lưu + Compile (`-std=c++17 -O2 -Wall -Wextra -Wshadow`) + Chạy (`input.txt` -> `output`) |
| `Ctrl+Q` | Thoát (tự lưu) |
| `Alt+1` / `Alt+2` / `Alt+3` | Chuyển nhanh giữa `code` / `input.txt` / `output` |
| `Ctrl+N` | Tạo file mới |
| `Ctrl+Tab`, `Alt+.` / `Alt+,` | Chuyển file |
| `Ctrl+\`` / `F4` | Bật/tắt terminal |
| `Ctrl+A` / `C` / `X` / `V` / `Z` / `Y` | Chọn hết / Copy / Cut / Paste / Undo / Redo |
| `Ctrl+/` | Comment / Uncomment |
| `Tab` | Mở rộng snippet (gõ `cp` + `Tab`) |
| `Shift+Mũi tên` | Bôi đen văn bản |

- Mở file trống tự chèn template `cp`.
- Precompiled header `bits/stdc++.h` giúp compile chỉ ~0.3s; nếu code không đổi sẽ chạy lại ngay.
- Thêm snippet mới: bỏ file `*.code-snippets` (định dạng VS Code) vào `config/snippets/`.

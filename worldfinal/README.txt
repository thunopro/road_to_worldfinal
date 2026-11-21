worldfinal - editor CP kieu VS Code (Neovim 0.9.5 portable, cau hinh + snippet di kem)
=====================================================================================
Tu dong cai trinh bien dich g++ (va xclip/wl-clipboard tren Linux) neu may chua co.

WINDOWS
  1. Giai nen zip.
  2. Double-click install.bat   (hoac chay: install.bat)
     (Tu cai worldfinal, them PATH, free Ctrl+Tab tren Windows Terminal, tu tai g++ MinGW-w64 neu thieu)
  3. Mo terminal MOI (Windows Terminal / PowerShell / cmd):   worldfinal A.cpp
  Khong muon cai: chay thang worldfinal.cmd trong thu muc giai nen.

LINUX
  1. unzip worldfinal.zip && cd worldfinal
  2. bash install.sh
  3. Mo terminal moi:   worldfinal A.cpp
  Khong muon cai: ./worldfinal A.cpp

PHIM
  Ctrl+S / F5   luu + compile + chay (input.txt -> output)     Ctrl+Q  thoat (tu luu)
  Alt+1/2/3     code / input.txt / output                       Ctrl+N  file moi
  Ctrl+Tab, Alt+. / Alt+,  chuyen file                          Ctrl+` / F4  terminal
  Ctrl+A/C/X/V/Z/Y, Ctrl+/ comment, Tab: snippet (go "cp" + Tab), Shift+mui ten: chon
  File trong -> tu chen template "cp".

TOI UU
  - Precompiled header bits/stdc++.h build san / ngam -> compile ~0.3s
  - Source khong doi -> bo qua compile, chay lai ngay
  - Tat moi plugin/provider khong dung, cache bytecode lua: khoi dong ~13ms
  - Flags: -std=c++17 -O2 -Wall -Wextra -Wshadow, time limit 10s (sua o dau config/init.lua)
  - Them snippet: bo file *.code-snippets (dinh dang VS Code) vao config/snippets/

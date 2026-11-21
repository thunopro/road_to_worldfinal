@echo off
rem worldfinal installer (Windows). Double-click it, or run: install.bat
setlocal EnableExtensions
set "SRC=%~dp0"
set "DST=%LOCALAPPDATA%\worldfinal"
echo ==^> installing worldfinal to %DST%
if exist "%DST%\app" rmdir /s /q "%DST%\app"
mkdir "%DST%\app" >nul 2>&1
robocopy "%SRC%config" "%DST%\app\config" /e /nfl /ndl /njh /njs /np >nul
robocopy "%SRC%nvim-win" "%DST%\app\nvim-win" /e /nfl /ndl /njh /njs /np >nul
copy /y "%SRC%worldfinal.cmd" "%DST%\app\worldfinal.cmd" >nul
if not exist "%DST%\app\nvim-win\bin\nvim.exe" (echo !! copy failed & pause & exit /b 1)

rem add to the user PATH (no admin, no 1024-char setx truncation)
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$d='%DST%\app'; $p=[Environment]::GetEnvironmentVariable('Path','User'); if(-not $p){$p=''}; if(($p -split ';') -notcontains $d){[Environment]::SetEnvironmentVariable('Path',($d+';'+$p).TrimEnd(';'),'User'); '    added worldfinal to User PATH (open a NEW terminal)'}"

rem Windows Terminal: free Ctrl+Tab / Ctrl+Shift+Tab for the editor (else use Alt+. / Alt+,)
if exist "%SRC%wt-keys.ps1" powershell -NoProfile -ExecutionPolicy Bypass -File "%SRC%wt-keys.ps1"

rem Auto-install g++ (MinGW-w64) if missing
if exist "%SRC%install-gpp.ps1" powershell -NoProfile -ExecutionPolicy Bypass -File "%SRC%install-gpp.ps1"

rem warm the lua bytecode cache once
"%DST%\app\nvim-win\bin\nvim.exe" --headless --noplugin -u "%DST%\app\config\init.lua" -i NONE +qa >nul 2>&1

echo.
echo ==^> done. Open a NEW terminal and run:  worldfinal A.cpp
pause

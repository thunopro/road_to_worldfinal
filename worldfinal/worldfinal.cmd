@echo off
rem worldfinal [file.cpp] -> CP editor (code | input.txt | output). No arg: first *.cpp in the current folder (A.cpp if none)
setlocal EnableExtensions
set "WF=%~dp0"

rem Ensure g++ is on PATH if installed via worldfinal or common MinGW locations
where g++ >nul 2>&1
if errorlevel 1 (
  if exist "%LOCALAPPDATA%\worldfinal\mingw64\bin\g++.exe" (
    set "PATH=%LOCALAPPDATA%\worldfinal\mingw64\bin;%PATH%"
  ) else if exist "C:\msys64\ucrt64\bin\g++.exe" (
    set "PATH=C:\msys64\ucrt64\bin;%PATH%"
  ) else if exist "C:\msys64\mingw64\bin\g++.exe" (
    set "PATH=C:\msys64\mingw64\bin;%PATH%"
  ) else if exist "C:\mingw64\bin\g++.exe" (
    set "PATH=C:\mingw64\bin;%PATH%"
  )
)

set "F=%~1"
if not "%F%"=="" goto ext
for /f "delims=" %%f in ('dir /b /a-d /on *.cpp 2^>nul') do if not defined F set "F=%%f"
if not defined F set "F=A.cpp"
goto go
:ext
if "%~x1"=="" set "F=%~1.cpp"
:go
"%WF%nvim-win\bin\nvim.exe" --noplugin -u "%WF%config\init.lua" -i NONE "%F%"

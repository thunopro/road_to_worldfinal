# Installs portable MinGW-w64 (g++) into %LOCALAPPDATA%\worldfinal\mingw64 if g++ is not already available.
$ErrorActionPreference = 'Stop'

function Add-UserPath([string]$dir) {
  $p = [Environment]::GetEnvironmentVariable('Path', 'User')
  if (-not $p) { $p = '' }
  $parts = $p -split ';' | Where-Object { $_ -ne '' }
  if ($parts -notcontains $dir) {
    [Environment]::SetEnvironmentVariable('Path', (($dir + ';' + $p).TrimEnd(';')), 'User')
    Write-Host "    added $dir to User PATH"
  }
  if (($env:Path -split ';') -notcontains $dir) {
    $env:Path = "$dir;$env:Path"
  }
}

if (Get-Command g++ -ErrorAction SilentlyContinue) {
  Write-Host "    g++ found: $((Get-Command g++).Source)"
  exit 0
}

$wfMingw = "$env:LOCALAPPDATA\worldfinal\mingw64\bin"
$candidates = @(
  $wfMingw,
  "C:\msys64\ucrt64\bin",
  "C:\msys64\mingw64\bin",
  "C:\mingw64\bin"
)
foreach ($c in $candidates) {
  if (Test-Path "$c\g++.exe") {
    Write-Host "    g++ found at $c"
    Add-UserPath $c
    exit 0
  }
}

Write-Host "==> g++ not found, downloading portable MinGW-w64 (WinLibs)..."
$wfRoot = "$env:LOCALAPPDATA\worldfinal"
New-Item -ItemType Directory -Force -Path $wfRoot | Out-Null
$zipPath = "$env:TEMP\worldfinal-winlibs.zip"

try {
  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
  $headers = @{ 'User-Agent' = 'worldfinal-installer' }
  $rel = Invoke-RestMethod -Uri 'https://api.github.com/repos/brechtsanders/winlibs_mingw/releases/latest' -Headers $headers
  $asset = $rel.assets | Where-Object { $_.name -match '^winlibs-x86_64-posix-seh-gcc-.*-mingw-w64ucrt-.*\.zip$' } | Select-Object -First 1
  if (-not $asset) {
    $asset = $rel.assets | Where-Object { $_.name -match '^winlibs-x86_64-posix-seh-gcc-.*\.zip$' } | Select-Object -First 1
  }
  if (-not $asset) { throw "No matching WinLibs zip asset found in latest release." }

  Write-Host "    downloading $($asset.name)..."
  $ProgressPreference = 'SilentlyContinue'
  Invoke-WebRequest -Uri $asset.browser_download_url -OutFile $zipPath -Headers $headers

  Write-Host "    extracting to $wfRoot (this may take a moment)..."
  if (Test-Path "$wfRoot\mingw64") { Remove-Item -Recurse -Force "$wfRoot\mingw64" }
  Expand-Archive -Path $zipPath -DestinationPath $wfRoot -Force
  Remove-Item -Force $zipPath -ErrorAction SilentlyContinue

  if (Test-Path "$wfMingw\g++.exe") {
    Add-UserPath $wfMingw
    Write-Host "    g++ installed successfully!"
    exit 0
  } else {
    throw "g++.exe not found after extraction."
  }
} catch {
  Write-Host "!!  Direct download failed: $_"
  if (Get-Command winget -ErrorAction SilentlyContinue) {
    Write-Host "==> trying winget install BrechtSanders.WinLibs.POSIX.UCRT..."
    winget install -e --id BrechtSanders.WinLibs.POSIX.UCRT --accept-package-agreements --accept-source-agreements
  } else {
    Write-Host "!!  Please install MinGW-w64 manually from https://winlibs.com and add its bin folder to PATH."
    exit 1
  }
}

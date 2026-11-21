# Windows Terminal: unbind Ctrl+Tab / Ctrl+Shift+Tab so they reach worldfinal (tab cycling). Keeps a backup.
$paths = @(
  "$env:LOCALAPPDATA\Packages\Microsoft.WindowsTerminal_8wekyb3d8bbwe\LocalState\settings.json",
  "$env:LOCALAPPDATA\Packages\Microsoft.WindowsTerminalPreview_8wekyb3d8bbwe\LocalState\settings.json",
  "$env:LOCALAPPDATA\Microsoft\Windows Terminal\settings.json")
foreach ($f in $paths) {
  if (-not (Test-Path $f)) { continue }
  $raw = Get-Content $f -Raw
  if (Test-Path "$f.worldfinal.bak") { continue }
  try { $j = $raw | ConvertFrom-Json } catch { Write-Host "    WT settings has comments, skipped (Alt+. / Alt+, still switch files)"; continue }
  Copy-Item $f "$f.worldfinal.bak" -Force
  $list = 'keybindings'; if ($j.PSObject.Properties.Name -contains 'actions' -and -not ($j.PSObject.Properties.Name -contains 'keybindings')) { $list = 'actions' }
  if (-not ($j.PSObject.Properties.Name -contains $list)) { $j | Add-Member -NotePropertyName $list -NotePropertyValue @() }
  $k = 'command'; if ($list -eq 'keybindings') { $k = 'id' }
  $j.$list = @($j.$list) + @(
    [pscustomobject]@{ $k = $null; keys = 'ctrl+tab' },
    [pscustomobject]@{ $k = $null; keys = 'ctrl+shift+tab' })
  $j | ConvertTo-Json -Depth 64 | Set-Content $f -Encoding UTF8
  Write-Host "    Windows Terminal: Ctrl+Tab now goes to the editor (backup: settings.json.worldfinal.bak)"
}

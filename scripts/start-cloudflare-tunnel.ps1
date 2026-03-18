$ErrorActionPreference = 'Stop'

$configPath = 'C:\Users\dev\.cloudflared\config.yml'

if (-not (Get-Command cloudflared -ErrorAction SilentlyContinue)) {
  Write-Host 'cloudflared not found on PATH; skipping tunnel startup.'
  exit 0
}

$existing = Get-CimInstance Win32_Process | Where-Object {
  $_.Name -eq 'cloudflared.exe' -and $_.CommandLine -match 'tunnel'
}
if ($existing) {
  Write-Host 'cloudflared tunnel already running.'
  exit 0
}

if (Test-Path $configPath) {
  Start-Process -FilePath 'cloudflared.exe' -ArgumentList @('tunnel', 'run') -WindowStyle Hidden
  Write-Host 'Started named Cloudflare tunnel from config.yml.'
  exit 0
}

Write-Host 'No named Cloudflare tunnel config found; skipping auto-start to avoid rotating the Vercel API URL.'
exit 0

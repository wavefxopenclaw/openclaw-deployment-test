$ErrorActionPreference = 'Continue'

$root = 'C:\Users\dev\openclaw-deployment-test\scripts'

try {
  & "$root\start-mission-control-api.ps1"
} catch {
  Write-Host "Mission Control API bootstrap error: $($_.Exception.Message)"
}

try {
  & "$root\start-cloudflare-tunnel.ps1"
} catch {
  Write-Host "Cloudflare tunnel bootstrap error: $($_.Exception.Message)"
}

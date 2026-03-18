$ErrorActionPreference = 'Stop'

$projectRoot = 'C:\Users\dev\openclaw-deployment-test'
$allowedOrigins = @(
  'https://openclaw-deployment-test.vercel.app',
  'https://openclaw-deployment-test-28n3culno.vercel.app',
  'https://openclaw-deployment-test-gs9kdg7ub.vercel.app',
  'https://openclaw-deployment-test-dyy7p2d05.vercel.app',
  'https://openclaw-deployment-test-rkhx4mlio.vercel.app',
  'https://openclaw-deployment-test-9s2ser2mw.vercel.app'
) -join ','

$apiListening = Get-NetTCPConnection -LocalPort 8787 -State Listen -ErrorAction SilentlyContinue
if ($apiListening) {
  Write-Host 'Mission Control API already listening on 8787.'
  exit 0
}

$env:ALLOWED_ORIGINS = $allowedOrigins
Start-Process -FilePath 'powershell.exe' -ArgumentList @(
  '-NoProfile',
  '-ExecutionPolicy', 'Bypass',
  '-Command',
  "Set-Location '$projectRoot'; `$env:ALLOWED_ORIGINS='$allowedOrigins'; npm run dev:api"
) -WindowStyle Hidden

Start-Sleep -Seconds 2
$apiListening = Get-NetTCPConnection -LocalPort 8787 -State Listen -ErrorAction SilentlyContinue
if ($apiListening) {
  Write-Host 'Mission Control API started.'
  exit 0
}

Write-Host 'Mission Control API launch requested, but port 8787 is not listening yet.'
exit 1

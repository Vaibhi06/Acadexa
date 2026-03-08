# Startup Servers Script for PowerShell

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "PORTAL PROJECT - POWERSHELL STARTUP" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Step 0: Cleanup
Write-Host "`n[STEP 0] Cleaning up ports 5000 and 5173..." -ForegroundColor Yellow
$ports = @(5000, 5173)
foreach ($port in $ports) {
    $process = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "Killing process on port $port (PID: $($process.OwningProcess))..."
        Stop-Process -Id $process.OwningProcess -Force -ErrorAction SilentlyContinue
    }
}

# Step 1: XAMPP Check
Write-Host "`n[STEP 1] Database Check..." -ForegroundColor Yellow
if (Test-Path "C:\xampp\xampp-control.exe") {
    Write-Host "Launching XAMPP Control Panel..."
    Start-Process "C:\xampp\xampp-control.exe"
    Write-Host "⚠️  Please ensure Apache and MySQL are STARTED in XAMPP." -ForegroundColor Red
} else {
    Write-Host "⚠️  XAMPP not found at default location. Ensure MySQL is running manually." -ForegroundColor Red
}

Read-Host "`nPress ENTER once MySQL is running to start the servers..."

# Step 2: Start Backend
Write-Host "`n[STEP 2] Starting Backend (Port 5000)..." -ForegroundColor Yellow
Start-Process cmd -ArgumentList "/k cd /d $PSScriptRoot\server && npm run dev" -WindowStyle Normal

# Step 3: Start Frontend
Write-Host "`n[STEP 3] Starting Frontend (Port 5173)..." -ForegroundColor Yellow
Start-Process cmd -ArgumentList "/k cd /d $PSScriptRoot\client && npm run dev" -WindowStyle Normal

Write-Host "`n⏳ Waiting for initialization..." -ForegroundColor Cyan
for ($i=10; $i -gt 0; $i--) {
    Write-Progress -Activity "Initializing Servers" -Status "$i seconds remaining..." -PercentComplete (($10-$i)*10)
    Start-Sleep -Seconds 1
}

# Step 4: Health Check
Write-Host "`n[STEP 4] Final Verification..." -ForegroundColor Yellow
try {
    $res = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get -TimeoutSec 5
    if ($res.success) {
        Write-Host "✅ Backend is ONLINE!" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Backend is not responding yet. Check the backend terminal for errors." -ForegroundColor Red
}

Write-Host "`n🚀 System started! URL: http://localhost:5173" -ForegroundColor Green
Start-Process "http://localhost:5173"

$ErrorActionPreference = "Stop"

Write-Host "`n=== Applying Mobile Padding Fix to All Pages ===" -ForegroundColor Cyan
Write-Host "This will add proper mobile spacing to prevent hamburger menu overlap`n" -ForegroundColor Gray

$mobileFix = @'

        @media (max-width: 1024px) {
          .admin-content {
            padding-top: 6rem;
            padding-left: 1rem;
            padding-right: 1rem;
          }
          .new-admin-content {
            padding-top: 6rem;
            padding-left: 1rem;
            padding-right: 1rem;
          }
          .id-generator-page {
            padding-top: 6rem;
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
'@

$componentsBase = "d:\portal1\client\src\components"
$fixed = 0
$skipped = 0
$errors = 0

# Admin pages
$adminPages = @(
    "AttendanceManagement.jsx", "Birthdays.jsx", "FacultyManagement.jsx",
    "FacultyProfile.jsx", "FeesManagement.jsx", "FinanceManagement.jsx",
    "InquiriesManagement.jsx", "MarksEntry.jsx", "QuickAccess.jsx",
    "Reports.jsx", "Settings.jsx", "StudentProfile.jsx",
    "StudyMaterials.jsx", "SyllabusManagement.jsx", "TasksManagement.jsx",
    "TimetableManagement.jsx", "AdminProfile.jsx", "ExpenseSheet.jsx",
    "IncomeSheet.jsx", "IncomeDashboard.jsx"
)

# Student pages
$studentPages = @(
    "Dashboard.jsx", "Timetable.jsx", "MyAttendance.jsx", "Exams.jsx",
    "Materials.jsx", "IdCard.jsx", "Reports.jsx", "Fees.jsx",
    "ClassInfo.jsx", "Birthdays.jsx", "NoticeBoard.jsx",
    "Profile.jsx", "Settings.jsx"
)

# Faculty pages
$facultyPages = @(
    "Dashboard.jsx", "Timetable.jsx", "MyAttendance.jsx",
    "MarkAttendance.jsx", "Exams.jsx", "StudyMaterials.jsx",
    "Birthdays.jsx", "Profile.jsx"
)

function Add-MobileFix {
    param($filePath, $pageName)
    
    try {
        if (-not (Test-Path $filePath)) {
            Write-Host "  ✗ Not found: $pageName" -ForegroundColor Red
            return $false
        }

        $content = Get-Content $filePath -Raw -Encoding UTF8
        
        if ($content -match "@media \(max-width: 1024px\)") {
            Write-Host "  - Already has fix: $pageName" -ForegroundColor DarkGray
            $script:skipped++
            return $true
        }

        $updated = $false
        
        # Try to insert before @media (max-width: 768px)
        if ($content -match "(\s+)@media \(max-width: 768px\)") {
            $content = $content -replace "(\s+)@media \(max-width: 768px\)", "$mobileFix`r`n`$1@media (max-width: 768px)"
            $updated = $true
        }
        # Or insert before closing style tag
        elseif ($content -match "(\s+)\}\s*`\}\`<\/style\>") {
            $content = $content -replace "(\s+)\}\s*`\}\`<\/style\>", "$mobileFix`r`n`$1}``}</style>"
            $updated = $true
        }
        
        if ($updated) {
            Set-Content -Path $filePath -Value $content -NoNewline -Encoding UTF8
            Write-Host "  ✓ Fixed: $pageName" -ForegroundColor Green
            $script:fixed++
            return $true
        } else {
            Write-Host "  ⚠ No suitable position found: $pageName" -ForegroundColor Yellow
            $script:errors++
            return $false
        }
    }
    catch {
        Write-Host "  ✗ Error processing $pageName : $_" -ForegroundColor Red
        $script:errors++
        return $false
    }
}

Write-Host "Processing Admin Pages..." -ForegroundColor Cyan
foreach ($page in $adminPages) {
    Add-MobileFix -filePath (Join-Path "$componentsBase\admin" $page) -pageName "admin\$page"
}

Write-Host "`nProcessing Student Pages..." -ForegroundColor Cyan
foreach ($page in $studentPages) {
    Add-MobileFix -filePath (Join-Path "$componentsBase\student" $page) -pageName "student\$page"
}

Write-Host "`nProcessing Faculty Pages..." -ForegroundColor Cyan
foreach ($page in $facultyPages) {
    Add-MobileFix -filePath (Join-Path "$componentsBase\faculty" $page) -pageName "faculty\$page"
}

Write-Host "`n=== Summary ===" -ForegroundColor Cyan
Write-Host "  Fixed: $fixed pages" -ForegroundColor Green
Write-Host "  Skipped (already fixed): $skipped pages" -ForegroundColor DarkGray
Write-Host "  Errors: $errors pages" -ForegroundColor $(if($errors -gt 0){"Red"}else{"Green"})
Write-Host "`nMobile padding fix complete!" -ForegroundColor Cyan

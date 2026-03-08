# Add mobile CSS fix to all component pages
# This script adds @media (max-width: 1024px) with proper padding

$files = @(
    # Admin pages
    "d:\portal1\client\src\components\admin\AttendanceManagement.jsx",
    "d:\portal1\client\src\components\admin\Birthdays.jsx",
    "d:\portal1\client\src\components\admin\FacultyManagement.jsx",
    "d:\portal1\client\src\components\admin\FacultyProfile.jsx",
    "d:\portal1\client\src\components\admin\FeesManagement.jsx",
    "d:\portal1\client\src\components\admin\FinanceManagement.jsx",
    "d:\portal1\client\src\components\admin\InquiriesManagement.jsx",
    "d:\portal1\client\src\components\admin\MarksEntry.jsx",
    "d:\portal1\client\src\components\admin\QuickAccess.jsx",
    "d:\portal1\client\src\components\admin\Reports.jsx",
    "d:\portal1\client\src\components\admin\Settings.jsx",
    "d:\portal1\client\src\components\admin\StudentProfile.jsx",
    "d:\portal1\client\src\components\admin\StudyMaterials.jsx",
    "d:\portal1\client\src\components\admin\SyllabusManagement.jsx",
    "d:\portal1\client\src\components\admin\TasksManagement.jsx",
    "d:\portal1\client\src\components\admin\TimetableManagement.jsx",
    "d:\portal1\client\src\components\admin\AdminProfile.jsx"
)

$mobileCss = @"

        @media (max-width: 1024px) {
          .admin-content {
            padding-top: 5rem;
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
"@

$fixed = 0
$skipped = 0

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Skip if already has 1024px media query
        if ($content -match '@media \(max-width: 1024px\)') {
            Write-Host "Skip: $(Split-Path $file -Leaf)" -ForegroundColor Gray
            $skipped++
            continue
        }
        
        # Add before closing style tag
        if ($content -match '      `}`<\/style>') {
            $content = $content -replace '(      `}`<\/style>)', "$mobileCss`r`n`$1"
            Set-Content $file -Value $content -NoNewline
            Write-Host "Fixed: $(Split-Path $file -Leaf)" -ForegroundColor Green
            $fixed++
        }
    }
}

Write-Host "`nFixed: $fixed | Skipped: $skipped" -ForegroundColor Cyan

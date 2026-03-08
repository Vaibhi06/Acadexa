# Universal Mobile CSS Fix Script
# Applies padding-top: 6.5rem to all pages

Write-Host "Applying universal mobile fix..." -ForegroundColor Cyan

$mobileCss = @'

        @media (max-width: 1024px) {
          .admin-content {
            padding-top: 6.5rem;
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
'@

# All remaining admin pages
$pages = @(
    "d:\portal1\client\src\components\admin\AttendanceManagement.jsx",
    "d:\portal1\client\src\components\admin\Birthdays.jsx",
    "d:\portal1\client\src\components\admin\FacultyManagement.jsx",
    "d:\portal1\client\src\components\admin\FacultyProfile.jsx",
    "d:\portal1\client\src\components\admin\FeesManagement.jsx",
    "d:\portal1\client\src\components\admin\InquiriesManagement.jsx",
    "d:\portal1\client\src\components\admin\StudentProfile.jsx",
    "d:\portal1\client\src\components\admin\TasksManagement.jsx",
    "d:\portal1\client\src\components\admin\TimetableManagement.jsx"
)

foreach ($file in $pages) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Update existing 1024px to 6.5rem
        if ($content -match 'padding-top:\s*\d+\.?\d*rem;') {
            $content = $content -replace '(padding-top:\s*)\d+\.?\d*rem;', '${1}6.5rem;'
            Set-Content $file -Value $content -NoNewline
            Write-Host "Updated: $(Split-Path $file -Leaf)" -ForegroundColor Green
        }
        # Add if missing
        elseif ($content -notmatch '@media \(max-width: 1024px\)') {
            if ($content -match '      `}`<\/style>') {
                $content = $content -replace '(      `}`<\/style>)', "$mobileCss`r`n`$1"
                Set-Content $file -Value $content -NoNewline
                Write-Host "Added to: $(Split-Path $file -Leaf)" -ForegroundColor Yellow
            }
        }
    }
}

Write-Host "Complete!" -ForegroundColor Cyan

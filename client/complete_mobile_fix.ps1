# Complete Mobile CSS Fix - Apply to ALL pages
Write-Host "Applying complete mobile design to all pages..." -ForegroundColor Cyan

$mobileCSS = @'

        @media (max-width: 1024px) {
          .admin-content, .new-admin-content, .id-generator-page {
            padding-top: 6.5rem;
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
'@

# Get all JSX files
$adminFiles = Get-ChildItem "d:\portal1\client\src\components\admin\*.jsx"
$studentFiles = Get-ChildItem "d:\portal1\client\src\components\student\*.jsx"
$facultyFiles = Get-ChildItem "d:\portal1\client\src\components\faculty\*.jsx"

$allFiles = $adminFiles + $studentFiles + $facultyFiles
$updated = 0
$skipped = 0

foreach ($file in $allFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Check if already has proper 6.5rem padding
    if ($content -match 'padding-top:\s*6\.5rem') {
        Write-Host "  ✓ Already optimized: $($file.Name)" -ForegroundColor Gray
        $skipped++
        continue
    }
    
    # Update existing mobile queries to 6.5rem
    if ($content -match '@media \(max-width: 1024px\)') {
        $content = $content -replace '(padding-top:\s*)\d+\.?\d*rem;', '${1}6.5rem;'
        Set-Content $file.FullName -Value $content -NoNewline
        Write-Host "  ✓ Updated: $($file.Name)" -ForegroundColor Green
        $updated++
    }
    # Add mobile CSS if missing
    elseif ($content -match '`}</style>') {
        $content = $content -replace '(      `}`<\/style>)', "$mobileCSS`r`n`$1"
        Set-Content $file.FullName -Value $content -NoNewline
        Write-Host "  ✓ Added mobile CSS: $($file.Name)" -ForegroundColor Yellow
        $updated++
    }
}

Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "  Updated: $updated pages" -ForegroundColor Green
Write-Host "  Already optimized: $skipped pages" -ForegroundColor Gray
Write-Host "  Total processed: $($allFiles.Count) pages" -ForegroundColor White
Write-Host "`nMobile design complete!" -ForegroundColor Cyan

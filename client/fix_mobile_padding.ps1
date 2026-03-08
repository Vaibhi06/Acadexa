# PowerShell script to add mobile padding fix to all component pages
$componentsPath = "d:\portal1\client\src\components"

# List of admin pages that need fixing
$adminPages = @(
    "AddStudent.jsx",
    "AdminProfile.jsx",
    "AttendanceManagement.jsx",
    "Birthdays.jsx",
    "ExamsManagement.jsx",
    "FacultyManagement.jsx",
    "FacultyProfile.jsx",
    "FeesManagement.jsx",
    "FinanceManagement.jsx",
    "InquiriesManagement.jsx",
    "MarksEntry.jsx",
    "QuickAccess.jsx",
    "Reports.jsx",
    "Settings.jsx",
    "StudentProfile.jsx",
    "StudyMaterials.jsx",
    "SyllabusManagement.jsx",
    "TasksManagement.jsx",
    "TimetableManagement.jsx"
)

# Mobile padding CSS to add
$mobilePaddingCSS = @"

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
        }
"@

# Process each admin page
foreach ($page in $adminPages) {
    $filePath = Join-Path "$componentsPath\admin" $page
    
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        
        # Check if already has 1024px media query
        if ($content -notmatch "@media \(max-width: 1024px\)") {
            # Find the position before @media (max-width: 768px) and insert
            if ($content -match "@media \(max-width: 768px\)") {
                $content = $content -replace "(@media \(max-width: 768px\))", "$mobilePaddingCSS`r`n`$1"
                Set-Content -Path $filePath -Value $content -NoNew line
                Write-Host "Fixed: $page"
            } else {
                # If no 768px query, add before closing style tag
                $content = $content -replace "(\s+)\`\}\`<\/style\>", "$mobilePaddingCSS`r`n`$1}`</style>"
                Set-Content -Path $filePath -Value $content -NoNewline
                Write-Host "Fixed (no 768px query): $page"
            }
        } else {
            Write-Host "Skipped (already has fix): $page"
        }
    } else {
        Write-Host "Not found: $page"
    }
}

Write-Host "`nMobile padding fix applied to all admin pages!"

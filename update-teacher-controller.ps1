# PowerShell script to update teacherDashboardController.ts

$filePath = "src\controllers\teacherDashboardController.ts"
$content = Get-Content $filePath -Raw

# Update the createTestInitHandler function to include new fields
$oldDestructure = "const { title, description, subject, duration, scheduled_date, start_time, end_time } = req.body;"
$newDestructure = "const { title, description, subject, duration, scheduled_date, start_time, end_time, testType, maxMarks } = req.body;"

# Update the createTest call
$oldCreateTest = @"
            const testResult = await createTest({
                title,
                description: description || '',
                subject,
                duration: parseInt(duration),
                scheduled_date: scheduled_date || null,
                start_time: start_time || null,
                end_time: end_time || null,
                created_by: 1 // TODO: Get actual user ID from session
            });
"@

$newCreateTest = @"
            const testResult = await createTest({
                title,
                description: description || '',
                subject,
                duration: parseInt(duration),
                scheduled_date: scheduled_date || null,
                start_time: start_time || null,
                end_time: end_time || null,
                test_type: testType || 'Other',
                max_marks: parseInt(maxMarks) || 0,
                created_by: 1 // TODO: Get actual user ID from session
            });
"@

# Apply replacements
$newContent = $content -replace [regex]::Escape($oldDestructure), $newDestructure
$newContent = $newContent -replace [regex]::Escape($oldCreateTest), $newCreateTest

# Save the file
Set-Content -Path $filePath -Value $newContent -NoNewline

Write-Host "✅ Updated teacherDashboardController.ts to handle test_type and max_marks"

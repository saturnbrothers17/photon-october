# PowerShell script to update create-test.ejs JavaScript

$filePath = "src\views\create-test.ejs"
$content = Get-Content $filePath -Raw

# Update the testData object to include new fields
$oldTestData = @"
                const testData = {
                    title: document.getElementById('testTitle').value,
                    description: document.getElementById('testDescription').value,
                    subject: document.getElementById('testSubject').value,
                    duration: document.getElementById('testDuration').value,
                    scheduled_date: document.getElementById('testDate').value,
                    start_time: document.getElementById('startTime')?.value || null,
                    end_time: document.getElementById('endTime')?.value || null
                };
"@

$newTestData = @"
                const testData = {
                    title: document.getElementById('testTitle').value,
                    description: document.getElementById('testDescription').value,
                    subject: document.getElementById('testSubject').value,
                    duration: document.getElementById('testDuration').value,
                    scheduled_date: document.getElementById('testDate').value,
                    start_time: document.getElementById('startTime')?.value || null,
                    end_time: document.getElementById('endTime')?.value || null,
                    testType: document.getElementById('testType').value,
                    maxMarks: document.getElementById('maxMarks').value
                };
"@

# Apply replacement
$newContent = $content -replace [regex]::Escape($oldTestData), $newTestData

# Save the file
Set-Content -Path $filePath -Value $newContent -NoNewline

Write-Host "✅ Updated create-test.ejs JavaScript to include testType and maxMarks"

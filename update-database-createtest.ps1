# PowerShell script to update createTest function in database.ts

$filePath = "src\database.ts"
$content = Get-Content $filePath -Raw

# Update the createTest function interface
$oldInterface = @"
export async function createTest(testData: { 
    title: string; 
    description: string; 
    subject: string; 
    duration: number; 
    scheduled_date?: string;
    start_time?: string;
    end_time?: string;
    created_by: number 
}) {
"@

$newInterface = @"
export async function createTest(testData: { 
    title: string; 
    description: string; 
    subject: string; 
    duration: number; 
    scheduled_date?: string;
    start_time?: string;
    end_time?: string;
    test_type?: string;
    max_marks?: number;
    created_by: number 
}) {
"@

# Update the SQL query
$oldSQL = "sql: 'INSERT INTO tests (title, description, subject, duration, scheduled_date, start_time, end_time, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',"
$newSQL = "sql: 'INSERT INTO tests (title, description, subject, duration, scheduled_date, start_time, end_time, test_type, max_marks, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',"

# Update the args array
$oldArgs = "args: [testData.title, testData.description, testData.subject, testData.duration, testData.scheduled_date || null, testData.start_time || null, testData.end_time || null, testData.created_by]"
$newArgs = "args: [testData.title, testData.description, testData.subject, testData.duration, testData.scheduled_date || null, testData.start_time || null, testData.end_time || null, testData.test_type || 'Other', testData.max_marks || 0, testData.created_by]"

# Apply replacements
$newContent = $content -replace [regex]::Escape($oldInterface), $newInterface
$newContent = $newContent -replace [regex]::Escape($oldSQL), $newSQL
$newContent = $newContent -replace [regex]::Escape($oldArgs), $newArgs

# Save the file
Set-Content -Path $filePath -Value $newContent -NoNewline

Write-Host "✅ Updated createTest function in database.ts to include test_type and max_marks"

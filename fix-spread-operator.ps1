# PowerShell script to fix spread operator in database.ts

$filePath = "src\database.ts"
$content = Get-Content $filePath -Raw

# Replace spread operator with Object.assign
$oldCode = @"
            return {
                ...test,
                status: status
            };
"@

$newCode = @"
            return Object.assign({}, test, {
                status: status
            });
"@

# Apply replacement
$newContent = $content -replace [regex]::Escape($oldCode), $newCode

# Save the file
Set-Content -Path $filePath -Value $newContent -NoNewline

Write-Host "✅ Fixed spread operator in database.ts"

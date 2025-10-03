# Fix the countdown syntax error in student-tests.ejs

$filePath = "src\views\student-tests.ejs"
$content = Get-Content $filePath -Raw

# The broken code
$brokenCode = @"
                        const countdownText = hours > 0 
                            ? Starts in h m
                            : minutes > 0
                            ? Starts in m s
                            : Starts in s;
"@

# The fixed code with proper template literals
$fixedCode = @"
                        const countdownText = hours > 0 
                            ? `Starts in `${hours}`h `${minutes}`m`
                            : minutes > 0
                            ? `Starts in `${minutes}`m `${seconds}`s`
                            : `Starts in `${seconds}`s`;
"@

# Apply replacement
$newContent = $content -replace [regex]::Escape($brokenCode), $fixedCode

# Save the file
Set-Content -Path $filePath -Value $newContent -NoNewline

Write-Host "✅ Fixed countdown syntax error in student-tests.ejs"

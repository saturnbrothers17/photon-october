# PowerShell script to update student-tests.ejs with better auto-refresh

$filePath = "src\views\student-tests.ejs"
$content = Get-Content $filePath -Raw

# Old script with 60 second refresh
$oldScript = @"
        // Update test status every minute
        setInterval(function() {
            // Reload page to get updated test statuses
            // In a production app, you'd use AJAX to update just the status
            if (document.visibilityState === 'visible') {
                location.reload();
            }
        }, 60000); // Check every minute
"@

# New script with 10 second refresh and countdown
$newScript = @"
        // Update test status every 10 seconds for real-time updates
        setInterval(function() {
            // Reload page to get updated test statuses
            if (document.visibilityState === 'visible') {
                location.reload();
            }
        }, 10000); // Check every 10 seconds
        
        // Show countdown for scheduled tests
        function updateCountdowns() {
            const now = new Date();
            document.querySelectorAll('[data-start-time]').forEach(element => {
                const startTime = new Date(element.dataset.startTime);
                const diff = startTime - now;
                
                if (diff > 0) {
                    const hours = Math.floor(diff / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                    
                    const countdownText = hours > 0 
                        ? `Starts in ${hours}h ${minutes}m`
                        : minutes > 0
                        ? `Starts in ${minutes}m ${seconds}s`
                        : `Starts in ${seconds}s`;
                    
                    element.textContent = countdownText;
                } else {
                    // Time has passed, reload to update status
                    location.reload();
                }
            });
        }
        
        // Update countdowns every second
        setInterval(updateCountdowns, 1000);
        updateCountdowns();
"@

# Apply replacement
$newContent = $content -replace [regex]::Escape($oldScript), $newScript

# Save the file
Set-Content -Path $filePath -Value $newContent -NoNewline

Write-Host "✅ Updated student-tests.ejs with 10-second refresh and countdown timer"

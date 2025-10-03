# PowerShell script to fix student-tests.ejs blank page issue

$filePath = "src\views\student-tests.ejs"
$content = Get-Content $filePath -Raw

# Find and replace the countdown function to handle missing elements
$oldCountdown = @"
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

$newCountdown = @"
        // Show countdown for scheduled tests (only if elements exist)
        function updateCountdowns() {
            try {
                const now = new Date();
                const countdownElements = document.querySelectorAll('[data-start-time]');
                
                if (countdownElements.length === 0) return; // No scheduled tests
                
                countdownElements.forEach(element => {
                    if (!element.dataset.startTime) return;
                    
                    const startTime = new Date(element.dataset.startTime);
                    if (isNaN(startTime.getTime())) return; // Invalid date
                    
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
            } catch (error) {
                console.error('Countdown error:', error);
            }
        }
        
        // Update countdowns every second (only if there are tests)
        if (document.querySelectorAll('[data-start-time]').length > 0) {
            setInterval(updateCountdowns, 1000);
            updateCountdowns();
        }
"@

# Apply replacement
$newContent = $content -replace [regex]::Escape($oldCountdown), $newCountdown

# Save the file
Set-Content -Path $filePath -Value $newContent -NoNewline

Write-Host "✅ Fixed student-tests.ejs to handle missing elements gracefully"

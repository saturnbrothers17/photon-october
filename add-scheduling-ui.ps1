# PowerShell script to add scheduling UI to create-test.ejs

$filePath = "src\views\create-test.ejs"
$content = Get-Content $filePath -Raw

# The HTML to insert
$schedulingHTML = @"
                    
                    <!-- Test Scheduling Section -->
                    <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div class="flex items-center mb-3">
                            <i class="fas fa-clock text-blue-600 mr-2"></i>
                            <h3 class="text-lg font-semibold text-blue-900">Test Scheduling (Optional)</h3>
                        </div>
                        <p class="text-sm text-blue-700 mb-4">Set specific start and end times to control when students can take this test</p>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label for="startTime" class="block text-sm font-medium text-blue-900 mb-2">
                                    <i class="fas fa-play-circle mr-1"></i>Start Time
                                </label>
                                <input type="datetime-local" id="startTime" name="startTime" class="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white">
                                <p class="text-xs text-blue-600 mt-1">When students can start taking the test</p>
                            </div>
                            
                            <div>
                                <label for="endTime" class="block text-sm font-medium text-blue-900 mb-2">
                                    <i class="fas fa-stop-circle mr-1"></i>End Time
                                </label>
                                <input type="datetime-local" id="endTime" name="endTime" class="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white">
                                <p class="text-xs text-blue-600 mt-1">When the test becomes unavailable</p>
                            </div>
                        </div>
                        
                        <div class="mt-3 p-3 bg-blue-100 rounded-lg">
                            <p class="text-sm text-blue-800">
                                <i class="fas fa-info-circle mr-1"></i>
                                <strong>Note:</strong> If no times are set, the test will be immediately available to students after creation.
                            </p>
                        </div>
                    </div>
"@

# Find the location to insert (before "Test Description")
$searchPattern = '                    <div class="mb-6">\s+<label for="testDescription"'
$replacement = $schedulingHTML + "`r`n                    <div class=`"mb-6`">`r`n                        <label for=`"testDescription`""

$newContent = $content -replace $searchPattern, $replacement

# Save the file
Set-Content -Path $filePath -Value $newContent -NoNewline

Write-Host "✅ Scheduling UI added successfully to create-test.ejs"

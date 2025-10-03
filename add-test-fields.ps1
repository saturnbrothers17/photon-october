# PowerShell script to add test type and maximum marks fields to create-test.ejs

$filePath = "src\views\create-test.ejs"
$content = Get-Content $filePath -Raw

# The HTML to insert for test type and maximum marks
$newFieldsHTML = @"
                    
                    <!-- Test Type and Maximum Marks -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label for="testType" class="block text-sm font-medium text-gray-700 mb-2">
                                <i class="fas fa-graduation-cap mr-1 text-indigo-500"></i>Test Type
                            </label>
                            <select id="testType" name="testType" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                                <option value="">Select Test Type</option>
                                <option value="JEE Mains">JEE Mains</option>
                                <option value="JEE Advanced">JEE Advanced</option>
                                <option value="NEET">NEET</option>
                                <option value="Other">Other</option>
                            </select>
                            <p class="text-xs text-gray-500 mt-1">Choose the exam type for this test</p>
                        </div>
                        
                        <div>
                            <label for="maxMarks" class="block text-sm font-medium text-gray-700 mb-2">
                                <i class="fas fa-trophy mr-1 text-yellow-500"></i>Maximum Marks
                            </label>
                            <input type="number" id="maxMarks" name="maxMarks" min="1" max="1000" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" placeholder="e.g., 100">
                            <p class="text-xs text-gray-500 mt-1">Total marks for this test (auto-calculated: questions × 4)</p>
                        </div>
                    </div>
"@

# Find the location to insert (before "Test Scheduling Section")
$searchPattern = '                    <!-- Test Scheduling Section -->'
$replacement = $newFieldsHTML + "`r`n                    <!-- Test Scheduling Section -->"

$newContent = $content -replace [regex]::Escape($searchPattern), $replacement

# Save the file
Set-Content -Path $filePath -Value $newContent -NoNewline

Write-Host "✅ Test type and maximum marks fields added successfully to create-test.ejs"

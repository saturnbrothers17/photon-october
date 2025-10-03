# Create a simple backup of student-tests.ejs to test if routing works

$filePath = "src\views\student-tests-backup.ejs"

$simpleContent = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tests - Debug</title>
</head>
<body style="background: #0f172a; color: white; padding: 40px; font-family: Arial;">
    <h1>Student Tests Page - Debug Mode</h1>
    <p>If you can see this, the route is working.</p>
    <p>Tests count: <%= tests ? tests.length : 0 %></p>
    <% if (tests && tests.length > 0) { %>
        <h2>Tests:</h2>
        <% tests.forEach(test => { %>
            <div style="border: 1px solid white; padding: 20px; margin: 10px 0;">
                <h3><%= test.title %></h3>
                <p>Subject: <%= test.subject %></p>
                <p>Status: <%= test.status %></p>
            </div>
        <% }); %>
    <% } else { %>
        <p>No tests found</p>
    <% } %>
</body>
</html>
"@

Set-Content -Path $filePath -Value $simpleContent -NoNewline

Write-Host "✅ Created simple test page at $filePath"
Write-Host "Now temporarily rename student-tests.ejs to test"

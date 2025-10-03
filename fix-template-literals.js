const fs = require('fs');

const filePath = 'src/views/student-tests.ejs';
let content = fs.readFileSync(filePath, 'utf8');

// Replace the broken countdown text lines
const brokenPattern = /const countdownText = hours > 0[\s\S]*?Starts in \$\{seconds\}s;/;

const fixedCode = `const countdownText = hours > 0 
                            ? \`Starts in \${hours}h \${minutes}m\`
                            : minutes > 0
                            ? \`Starts in \${minutes}m \${seconds}s\`
                            : \`Starts in \${seconds}s\`;`;

content = content.replace(brokenPattern, fixedCode);

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Fixed template literals in student-tests.ejs');

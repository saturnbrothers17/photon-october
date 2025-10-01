const fs = require('fs');
const path = require('path');

// Function to update favicon in a file
function updateFavicon(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if file has the old favicon format
        if (content.includes('favicon.ico') && !content.includes('favicon.svg')) {
            // Replace the old favicon line with new SVG + fallback
            content = content.replace(
                /<link rel="icon" type="image\/x-icon" href="\/images\/favicon\.ico">/g,
                '<link rel="icon" type="image/svg+xml" href="/images/favicon.svg">\n    <link rel="alternate icon" type="image/x-icon" href="/images/favicon.ico">'
            );
            
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Updated: ${filePath}`);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`❌ Error updating ${filePath}:`, error.message);
        return false;
    }
}

// Function to recursively find all .ejs files
function findEjsFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            findEjsFiles(filePath, fileList);
        } else if (file.endsWith('.ejs')) {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

console.log('🔍 Finding all EJS files...\n');
const ejsFiles = findEjsFiles('src/views');

console.log(`Found ${ejsFiles.length} EJS files\n`);
console.log('🔧 Updating favicon references...\n');

let updatedCount = 0;
ejsFiles.forEach(file => {
    if (updateFavicon(file)) {
        updatedCount++;
    }
});

console.log(`\n✅ Updated ${updatedCount} files with new favicon!`);
console.log('🎉 All done!');

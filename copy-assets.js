const fs = require('fs');
const path = require('path');

// Function to copy directory recursively
function copyDir(src, dest) {
    // Create destination directory if it doesn't exist
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    // Read source directory
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

console.log('Copying views folder...');
copyDir('src/views', 'dist/views');
console.log('✅ Views copied successfully');

console.log('Copying public folder...');
copyDir('src/public', 'dist/public');
console.log('✅ Public copied successfully');

console.log('\n✅ All assets copied successfully!');

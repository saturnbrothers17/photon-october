const fs = require('fs');
const path = require('path');

// Function to copy directory recursively
function copyDir(src, dest) {
    try {
        // Create destination directory if it doesn't exist
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }

        // Check if source exists
        if (!fs.existsSync(src)) {
            console.error(`❌ Source directory not found: ${src}`);
            return;
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
    } catch (error) {
        console.error(`❌ Error copying ${src} to ${dest}:`, error.message);
        process.exit(1);
    }
}

console.log('📦 Starting asset copy...');
console.log('Current directory:', process.cwd());
console.log('Checking if dist exists...');

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
    console.log('Creating dist directory...');
    fs.mkdirSync('dist', { recursive: true });
}

console.log('Copying views folder...');
copyDir('src/views', 'dist/views');
console.log('✅ Views copied successfully');

console.log('Copying public folder...');
copyDir('src/public', 'dist/public');
console.log('✅ Public copied successfully');

// Create uploads directory
console.log('Creating uploads directory...');
if (!fs.existsSync('dist/uploads')) {
    fs.mkdirSync('dist/uploads', { recursive: true });
    console.log('✅ Uploads directory created');
}

console.log('\n✅ All assets copied successfully!');

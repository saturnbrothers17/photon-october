const fs = require('fs');
const path = require('path');

// Test if the image file exists and can be read
const imagePath = path.join(__dirname, 'WhatsApp Image 2025-09-24 at 10.19.06 PM.jpeg');

console.log('Testing image processing...');

// Check if file exists
if (!fs.existsSync(imagePath)) {
  console.log('❌ Image file not found:', imagePath);
  return;
}

console.log('✅ Image file found');

// Get file stats
const stats = fs.statSync(imagePath);
console.log('File size:', stats.size, 'bytes');

// Read the file
const imageBuffer = fs.readFileSync(imagePath);
console.log('Buffer size:', imageBuffer.length, 'bytes');

// Convert to base64
const base64Image = imageBuffer.toString('base64');
console.log('Base64 size:', base64Image.length, 'characters');

// Show first 100 characters of base64
console.log('First 100 characters of base64:');
console.log(base64Image.substring(0, 100));

console.log('✅ Image processing test completed successfully');
const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');

async function testOCR() {
    try {
        console.log('Testing Tesseract OCR...\n');
        
        const imagePath = path.join(__dirname, 'WhatsApp Image 2025-09-23 at 9.33.40 PM.jpeg');
        const imageBuffer = fs.readFileSync(imagePath);
        
        console.log('Image loaded:', imageBuffer.length, 'bytes\n');
        console.log('Running OCR... (this may take a minute)\n');
        
        const { data: { text } } = await Tesseract.recognize(
            imageBuffer,
            'eng',
            {
                logger: (m) => {
                    if (m.status === 'recognizing text') {
                        process.stdout.write(`\rOCR Progress: ${Math.round(m.progress * 100)}%`);
                    }
                }
            }
        );
        
        console.log('\n\n✅ OCR Completed!\n');
        console.log('Extracted Text:');
        console.log('='.repeat(80));
        console.log(text);
        console.log('='.repeat(80));
        console.log(`\nTotal characters extracted: ${text.length}`);
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }
}

testOCR();

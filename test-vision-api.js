const fs = require('fs');
const path = require('path');

const VISION_API_KEY = 'AIzaSyAVxdBPUmipUnIImfEnlJVAjGD9q1l_zMo';

async function testVisionAPI() {
    try {
        console.log('Testing Google Cloud Vision API...\n');
        
        const imagePath = path.join(__dirname, 'WhatsApp Image 2025-09-23 at 9.33.40 PM.jpeg');
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        
        console.log('Image loaded:', imageBuffer.length, 'bytes\n');
        console.log('Calling Vision API...\n');
        
        const response = await fetch(
            `https://vision.googleapis.com/v1/images:annotate?key=${VISION_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requests: [{
                        image: {
                            content: base64Image
                        },
                        features: [{
                            type: 'TEXT_DETECTION',
                            maxResults: 1
                        }]
                    }]
                })
            }
        );
        
        console.log('Response status:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('\n❌ API Error:');
            console.error(errorText);
            return;
        }
        
        const data = await response.json();
        const text = data.responses?.[0]?.fullTextAnnotation?.text || '';
        
        console.log('\n✅ SUCCESS!\n');
        console.log('Extracted Text:');
        console.log('='.repeat(80));
        console.log(text);
        console.log('='.repeat(80));
        console.log(`\nTotal characters: ${text.length}`);
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }
}

testVisionAPI();

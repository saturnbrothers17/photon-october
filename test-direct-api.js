const fs = require('fs');
const path = require('path');

const GEMINI_API_KEY = 'AIzaSyBKc9-jMWxp5Q8mSW0CoikFm53N47T9scE';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro-vision:generateContent';

async function testDirectAPI() {
    try {
        console.log('Testing Direct Gemini API Call...\n');
        
        // Read the WhatsApp image
        const imagePath = path.join(__dirname, 'WhatsApp Image 2025-09-23 at 9.33.40 PM.jpeg');
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        
        console.log('Image loaded:', imageBuffer.length, 'bytes\n');
        
        const prompt = "Extract all MCQ questions from this image and return them as a JSON array.";
        
        const requestBody = {
            contents: [{
                parts: [
                    { text: prompt },
                    {
                        inline_data: {
                            mime_type: "image/jpeg",
                            data: base64Image
                        }
                    }
                ]
            }]
        };
        
        console.log('Sending request to:', GEMINI_API_URL);
        console.log('Request size:', JSON.stringify(requestBody).length, 'bytes\n');
        
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        
        console.log('Response status:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('\n❌ API Error Response:');
            console.error(errorText);
            return;
        }
        
        const data = await response.json();
        
        console.log('\n✅ SUCCESS! API Response received\n');
        console.log('Full Response:');
        console.log(JSON.stringify(data, null, 2));
        
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        if (text) {
            console.log('\n📝 Extracted Text:');
            console.log('='.repeat(80));
            console.log(text);
            console.log('='.repeat(80));
        }
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.stack) {
            console.error('\nStack:', error.stack);
        }
    }
}

testDirectAPI();

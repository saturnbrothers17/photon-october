const fs = require('fs');
const path = require('path');

const GEMINI_API_KEY = 'AIzaSyAVxdBPUmipUnIImfEnlJVAjGD9q1l_zMo';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent';

async function testGeminiAPI() {
    try {
        console.log('Testing Google Gemini API...\n');
        
        const imagePath = path.join(__dirname, 'WhatsApp Image 2025-09-23 at 9.33.40 PM.jpeg');
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        
        console.log('Image loaded:', imageBuffer.length, 'bytes\n');
        
        const prompt = `Extract all MCQ questions from this image. For each question, identify:
1. The question text
2. All options (A, B, C, D)
3. Return in JSON format as an array of objects with: text, options (array of 4 strings), correctOption (0-3), explanation, difficulty

Return ONLY valid JSON array, no markdown or extra text.`;
        
        console.log('Calling Gemini API...\n');
        
        const response = await fetch(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
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
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        console.log('\n✅ SUCCESS!\n');
        console.log('Gemini Response:');
        console.log('='.repeat(80));
        console.log(text);
        console.log('='.repeat(80));
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }
}

testGeminiAPI();

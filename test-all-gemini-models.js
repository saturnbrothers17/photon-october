const fs = require('fs');
const path = require('path');

const GEMINI_API_KEY = 'AIzaSyAVxdBPUmipUnIImfEnlJVAjGD9q1l_zMo';

const modelsToTest = [
    'gemini-1.5-flash',
    'gemini-2.0-flash-exp',
    'gemini-exp-1206'
];

async function testModel(modelName) {
    try {
        console.log(`\n${'='.repeat(80)}`);
        console.log(`Testing: ${modelName}`);
        console.log('='.repeat(80));
        
        const imagePath = path.join(__dirname, 'WhatsApp Image 2025-09-23 at 9.33.40 PM.jpeg');
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        
        const prompt = `Extract all MCQ questions from this image. Return in JSON format with: text, options (array of 4), correctOption (0-3), explanation, difficulty. Return ONLY JSON array.`;
        
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        { inline_data: { mime_type: "image/jpeg", data: base64Image } }
                    ]
                }]
            })
        });
        
        console.log(`Status: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
            const error = await response.text();
            console.log(`❌ FAILED: ${error.substring(0, 200)}`);
            return { model: modelName, success: false };
        }
        
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        console.log(`✅ SUCCESS!`);
        console.log(`Response length: ${text.length} characters`);
        console.log(`Preview: ${text.substring(0, 150)}...`);
        
        return { model: modelName, success: true, response: text };
        
    } catch (error) {
        console.log(`❌ ERROR: ${error.message}`);
        return { model: modelName, success: false };
    }
}

async function testAllModels() {
    console.log('\n🧪 TESTING ALL GEMINI MODELS\n');
    
    const results = [];
    for (const model of modelsToTest) {
        const result = await testModel(model);
        results.push(result);
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log('\n\n' + '='.repeat(80));
    console.log('📊 SUMMARY');
    console.log('='.repeat(80));
    
    const successful = results.filter(r => r.success);
    console.log(`\n✅ Working models (${successful.length}):`);
    successful.forEach(r => console.log(`  - ${r.model}`));
    
    const failed = results.filter(r => !r.success);
    console.log(`\n❌ Failed models (${failed.length}):`);
    failed.forEach(r => console.log(`  - ${r.model}`));
    
    if (successful.length > 0) {
        console.log(`\n🎯 RECOMMENDED: ${successful[0].model}`);
    }
}

testAllModels();

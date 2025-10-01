const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyDwJ81ZeGz2R88atStyncEKz1PymJl1XIo');

// List of models to test
const modelsToTest = [
    'gemini-pro',
    'gemini-pro-vision',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro-latest',
    'models/gemini-pro',
    'models/gemini-pro-vision',
    'models/gemini-1.5-pro',
    'models/gemini-1.5-flash'
];

async function testModel(modelName) {
    try {
        console.log(`\n${'='.repeat(80)}`);
        console.log(`Testing model: ${modelName}`);
        console.log('='.repeat(80));
        
        const model = genAI.getGenerativeModel({ model: modelName });
        
        // Read the WhatsApp image
        const imagePath = path.join(__dirname, 'WhatsApp Image 2025-09-23 at 9.33.40 PM.jpeg');
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        
        const prompt = "Extract all MCQ questions from this image. Return only a JSON array.";
        
        console.log('Sending request...');
        
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: "image/jpeg"
                }
            }
        ]);
        
        const response = await result.response;
        const text = response.text();
        
        console.log(`✅ SUCCESS with model: ${modelName}`);
        console.log('Response preview:', text.substring(0, 200) + '...');
        
        return { model: modelName, success: true, response: text };
        
    } catch (error) {
        console.log(`❌ FAILED with model: ${modelName}`);
        console.log('Error:', error.message);
        return { model: modelName, success: false, error: error.message };
    }
}

async function testAllModels() {
    console.log('Testing all available Gemini models...\n');
    console.log('Image: WhatsApp Image 2025-09-23 at 9.33.40 PM.jpeg\n');
    
    const results = [];
    
    for (const modelName of modelsToTest) {
        const result = await testModel(modelName);
        results.push(result);
        
        // Wait a bit between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Summary
    console.log('\n\n' + '='.repeat(80));
    console.log('SUMMARY');
    console.log('='.repeat(80));
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`\n✅ Successful models (${successful.length}):`);
    successful.forEach(r => console.log(`  - ${r.model}`));
    
    console.log(`\n❌ Failed models (${failed.length}):`);
    failed.forEach(r => console.log(`  - ${r.model}: ${r.error}`));
    
    if (successful.length > 0) {
        console.log(`\n🎯 RECOMMENDED MODEL: ${successful[0].model}`);
    }
}

testAllModels();

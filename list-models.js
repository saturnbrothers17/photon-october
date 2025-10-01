const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('AIzaSyDwJ81ZeGz2R88atStyncEKz1PymJl1XIo');

async function listModels() {
    try {
        console.log('Fetching available models from Google Gemini API...\n');
        
        const models = await genAI.listModels();
        
        console.log(`Found ${models.length} available models:\n`);
        
        models.forEach((model, index) => {
            console.log(`${index + 1}. ${model.name}`);
            console.log(`   Display Name: ${model.displayName}`);
            console.log(`   Description: ${model.description}`);
            console.log(`   Supported Methods: ${model.supportedGenerationMethods?.join(', ')}`);
            console.log('');
        });
        
    } catch (error) {
        console.error('Error listing models:');
        console.error(error.message);
    }
}

listModels();

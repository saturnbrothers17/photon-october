const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testModels() {
  try {
    // Initialize Google Gemini AI with the API key
    const genAI = new GoogleGenerativeAI('AIzaSyB2TRBXqCPOTFS0kK6e8IIfLoiQE8FGEnc');
    
    console.log('Testing various models...\n');
    
    // Test a few models that support generateContent and are likely to work with images
    const modelsToTry = [
      'gemini-2.5-flash',  // This is likely to work well with images
      'gemini-2.0-flash',  // This is also likely to work well with images
      'gemini-2.5-pro',    // This is a more powerful model
      'gemini-2.0-flash-001', // This is a stable version
      'gemini-pro-vision'  // This is specifically for vision tasks
    ];
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        // Test with a simple text prompt
        const prompt = "Say 'Hello, World!' in JSON format";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log(`✅ Model ${modelName} works! Response:`, text);
        return modelName; // Return the first working model
      } catch (error) {
        console.log(`❌ Model ${modelName} failed:`, error.message);
      }
    }
    
    console.log('\nNo models worked. You may need to:');
    console.log('1. Check if your API key is valid');
    console.log('2. Check if your API key has the correct permissions');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testModels();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiAPI() {
  try {
    // Initialize Google Gemini AI with the new API key
    const genAI = new GoogleGenerativeAI('AIzaSyB2TRBXqCPOTFS0kK6e8IIfLoiQE8FGEnc');
    
    // Try the gemini-2.5-flash model which we confirmed works
    console.log('\nTrying model: gemini-2.5-flash');
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Test with a simple text prompt
    const prompt = "List 3 JEE physics questions with options and answers in JSON format";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Model gemini-2.5-flash works! Response:', text);
  } catch (error) {
    console.error('Gemini API Error:', error);
  }
}

testGeminiAPI();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

async function testNewWhatsAppImage() {
  try {
    // Initialize Google Gemini AI with the API key
    const genAI = new GoogleGenerativeAI('AIzaSyB2TRBXqCPOTFS0kK6e8IIfLoiQE8FGEnc');
    
    // Use the working model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    console.log('Testing AI directly with new WhatsApp image...');
    
    // Read the new image file
    const imagePath = path.join(__dirname, 'WhatsApp Image 2025-09-23 at 9.33.40 PM.jpeg');
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    
    console.log('Image loaded successfully');
    console.log('Image size:', imageBuffer.length, 'bytes');
    console.log('Base64 size:', base64Image.length, 'characters');
    
    // Create a more specific prompt
    const prompt = `You are an expert at extracting educational multiple choice questions from images.
    
    Please carefully analyze this image and extract ALL multiple choice questions you can find.
    These are competitive exam questions for JEE (Joint Entrance Examination) or NEET (National Eligibility cum Entrance Test).
    Subjects include Physics, Chemistry, Mathematics, and Biology.
    
    Look for questions with options labeled A), B), C), D) or (A), (B), (C), (D).
    
    For each question, provide the following information in EXACT JSON format:
    - "text": The complete question text (without options)
    - "options": An array of exactly 4 answer options (A, B, C, D)
    - "correctOption": The index of the correct option (0 for A, 1 for B, 2 for C, 3 for D)
    - "explanation": A brief explanation of why the answer is correct (1-2 sentences)
    - "difficulty": The difficulty level ("easy", "medium", or "hard")
    
    CRITICAL INSTRUCTIONS:
    1. Return ONLY a valid JSON array of questions
    2. No markdown, no extra text, just the JSON array
    3. Each question MUST have exactly 4 options
    4. The correctOption MUST be an integer between 0-3
    5. If you cannot determine the correct answer, make your best guess
    6. If you cannot extract any questions, return an empty array []
    7. Be thorough and extract ALL questions you can find
    
    Begin your response with [ and end with ]. Do not include any other text.`;
    
    console.log('Sending request to Gemini API...');
    
    // Call Gemini API
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
    
    console.log('Raw Gemini API response:');
    console.log(text);
    
    // Try to parse the response
    try {
      // Clean the response text to extract valid JSON
      let jsonString = text.trim();
      
      // Remove markdown code block markers if present
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.substring(7);
      }
      if (jsonString.startsWith('```')) {
        jsonString = jsonString.substring(3);
      }
      if (jsonString.endsWith('```')) {
        jsonString = jsonString.substring(0, jsonString.length - 3);
      }
      
      // Remove any leading/trailing whitespace
      jsonString = jsonString.trim();
      
      console.log('Cleaned JSON string:');
      console.log(jsonString);
      
      // Parse JSON
      const questions = JSON.parse(jsonString);
      console.log('✅ Successfully parsed JSON response');
      console.log('Number of questions extracted:', questions.length);
      
      if (questions.length > 0) {
        console.log('Questions:', JSON.stringify(questions, null, 2));
      } else {
        console.log('No questions were extracted from the image.');
      }
      
      return questions;
    } catch (parseError) {
      console.log('❌ Failed to parse JSON response:');
      console.log('Error:', parseError.message);
      console.log('Response text:', text);
      return [];
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    return [];
  }
}

// Run the test
testNewWhatsAppImage();
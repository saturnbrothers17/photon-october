const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyBKc9-jMWxp5Q8mSW0CoikFm53N47T9scE');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function testExtraction() {
    try {
        console.log('Testing AI Question Extraction...\n');
        
        // Read the WhatsApp image
        const imagePath = path.join(__dirname, 'WhatsApp Image 2025-09-23 at 9.33.40 PM.jpeg');
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        
        console.log('Image loaded successfully');
        console.log('Image size:', imageBuffer.length, 'bytes\n');
        
        // Create the prompt
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
        
        console.log('Sending request to Gemini API...\n');
        
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
        
        console.log('✅ Received response from Gemini API\n');
        console.log('Raw Response:');
        console.log('='.repeat(80));
        console.log(text);
        console.log('='.repeat(80));
        console.log('\n');
        
        // Clean the response
        let jsonString = text.trim();
        
        if (jsonString.startsWith('```json')) {
            jsonString = jsonString.substring(7);
        }
        if (jsonString.startsWith('```')) {
            jsonString = jsonString.substring(3);
        }
        if (jsonString.endsWith('```')) {
            jsonString = jsonString.substring(0, jsonString.length - 3);
        }
        
        jsonString = jsonString.trim();
        
        // Parse JSON
        const questions = JSON.parse(jsonString);
        
        console.log('✅ Successfully parsed JSON\n');
        console.log(`Found ${questions.length} questions:\n`);
        
        questions.forEach((q, index) => {
            console.log(`Question ${index + 1}:`);
            console.log(`  Text: ${q.text.substring(0, 100)}...`);
            console.log(`  Options: ${q.options.length}`);
            console.log(`  Correct: ${q.correctOption} (${q.options[q.correctOption]})`);
            console.log(`  Difficulty: ${q.difficulty}`);
            console.log('');
        });
        
        console.log('✅ AI Extraction Test Successful!');
        
    } catch (error) {
        console.error('❌ Error during extraction:');
        console.error(error.message);
        if (error.stack) {
            console.error('\nStack trace:');
            console.error(error.stack);
        }
    }
}

testExtraction();

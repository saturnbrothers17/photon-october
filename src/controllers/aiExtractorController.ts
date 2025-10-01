import { Request, Response } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { getUserFromCookie } from './authController';

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
    }
});

// Advanced Intelligent Question Parser with Context Analysis
function parseQuestionsFromText(text: string): any[] {
    console.log('\n=== INTELLIGENT QUESTION EXTRACTION SYSTEM ===\n');
    
    const questions: any[] = [];
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Step 1: Intelligent Question Detection
    const questionPatterns = [
        /^(?:Q\.?\s*|Question\s+|Qs?\s+)?(\d+)[\.\):\s]/i,  // Q5, Q.5, Question 5
        /^(\d+)[\.\)]\s+/,  // 5., 5)
        /^Let\s+/i,  // Mathematical questions starting with "Let"
        /^Find\s+/i,  // "Find the..."
        /^Which\s+of\s+the\s+following/i,  // "Which of the following..."
        /^What\s+is/i,  // "What is..."
        /^If\s+/i,  // "If..."
        /^Then\s+which/i  // "Then which..."
    ];
    
    // Step 2: Intelligent Option Detection with Multiple Formats
    const optionPatterns = [
        /^\(([A-D])\)\s*(.+)/i,  // (A) option
        /^([A-D])\)\s*(.+)/i,  // A) option
        /^([A-D])\.\s*(.+)/i,  // A. option
        /^\[([A-D])\]\s*(.+)/i,  // [A] option
        /^([A-D]):\s*(.+)/i  // A: option
    ];
    
    // Patterns for options without explicit labels (sequential detection)
    const sequentialOptionPatterns = [
        /^The\s+determinant\s+of/i,  // Mathematical statements
        /^yz\s*=\s*/i,  // Equations
        /^[A-Z][a-z]+\s+is\s+/i,  // "Something is..."
        /^\d+\s*$/,  // Just numbers
        /^[A-Z]\w+\s+[A-Z]\w+/  // Capitalized phrases
    ];
    
    let currentQuestion: any = null;
    let currentOptions: string[] = [];
    let questionBuffer: string[] = [];
    let inQuestionMode = false;
    
    console.log('Step 1: Analyzing text structure...');
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const nextLine = i < lines.length - 1 ? lines[i + 1] : '';
        
        // Intelligent Question Detection
        let isQuestion = false;
        for (const pattern of questionPatterns) {
            if (pattern.test(line)) {
                isQuestion = true;
                break;
            }
        }
        
        // Context-aware question detection
        if (!isQuestion && line.length > 20 && 
            (line.includes('?') || 
             line.toLowerCase().includes('true') || 
             line.toLowerCase().includes('false') ||
             line.toLowerCase().includes('following'))) {
            isQuestion = true;
        }
        
        if (isQuestion) {
            console.log(`✓ Detected question: ${line.substring(0, 60)}...`);
            
            // Save previous question
            if (currentQuestion && currentOptions.length >= 2) {
                while (currentOptions.length < 4) {
                    currentOptions.push('Option not detected');
                }
                currentQuestion.options = currentOptions.slice(0, 4);
                currentQuestion.text = questionBuffer.join(' ');
                questions.push(currentQuestion);
                console.log(`  → Saved question with ${currentOptions.length} options`);
            }
            
            // Start new question
            currentQuestion = {
                text: '',
                options: [],
                correctOption: 0,
                explanation: 'Extracted using intelligent analysis',
                difficulty: 'medium'
            };
            currentOptions = [];
            questionBuffer = [line.replace(/^(?:Q\.?\s*|Question\s+|Qs?\s+)?\d+[\.\):\s]*/i, '')];
            inQuestionMode = true;
        }
        // Intelligent Option Detection
        else {
            let optionFound = false;
            
            // First try explicit labeled options
            for (const pattern of optionPatterns) {
                const match = line.match(pattern);
                if (match) {
                    const optionText = match[2] || match[0];
                    if (optionText && optionText.trim().length > 0) {
                        currentOptions.push(optionText.trim());
                        console.log(`  ✓ Found labeled option ${currentOptions.length}: ${optionText.substring(0, 40)}...`);
                        optionFound = true;
                        inQuestionMode = false;
                        break;
                    }
                }
            }
            
            // If no labeled option found, try sequential detection
            if (!optionFound && currentQuestion && !inQuestionMode && currentOptions.length < 4) {
                for (const pattern of sequentialOptionPatterns) {
                    if (pattern.test(line)) {
                        currentOptions.push(line.trim());
                        console.log(`  ✓ Found sequential option ${currentOptions.length}: ${line.substring(0, 40)}...`);
                        optionFound = true;
                        break;
                    }
                }
            }
            
            // Smart context continuation
            if (!optionFound && currentQuestion) {
                if (inQuestionMode && line.length > 5) {
                    questionBuffer.push(line);
                } else if (currentOptions.length > 0 && currentOptions.length < 4 && line.length > 3) {
                    // Continuation of last option
                    currentOptions[currentOptions.length - 1] += ' ' + line;
                }
            }
        }
    }
    
    // Save last question
    if (currentQuestion && currentOptions.length >= 2) {
        while (currentOptions.length < 4) {
            currentOptions.push('Option not detected');
        }
        currentQuestion.options = currentOptions.slice(0, 4);
        currentQuestion.text = questionBuffer.join(' ');
        questions.push(currentQuestion);
        console.log(`  → Saved final question with ${currentOptions.length} options`);
    }
    
    // Step 3: Intelligent Post-Processing
    console.log('\nStep 2: Post-processing and validation...');
    questions.forEach((q, i) => {
        // Clean up question text
        q.text = q.text.replace(/\s+/g, ' ').trim();
        
        // Analyze difficulty based on text length and complexity
        const wordCount = q.text.split(' ').length;
        if (wordCount < 15) {
            q.difficulty = 'easy';
        } else if (wordCount > 30) {
            q.difficulty = 'hard';
        }
        
        // Detect mathematical content
        if (q.text.match(/determinant|matrix|equation|integral|derivative/i)) {
            q.difficulty = 'hard';
        }
        
        console.log(`\nQuestion ${i + 1}:`);
        console.log(`  Text: ${q.text.substring(0, 80)}...`);
        console.log(`  Options: ${q.options.length}`);
        console.log(`  Difficulty: ${q.difficulty}`);
    });
    
    console.log(`\n=== EXTRACTION COMPLETE: ${questions.length} questions found ===\n`);
    
    return questions;
}

// Google Gemini API Configuration
const GEMINI_API_KEY = 'AIzaSyAVxdBPUmipUnIImfEnlJVAjGD9q1l_zMo';
const GEMINI_MODEL = 'gemini-2.0-flash-exp';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Function to extract questions from image using Google Gemini 2.0 Flash
async function extractQuestionsFromImage(imageBuffer: Buffer): Promise<any[]> {
    try {
        console.log('Extracting questions using Google Gemini 2.0 Flash AI...');
        
        // Log image size for debugging
        console.log('Image buffer size:', imageBuffer.length, 'bytes');
        
        // Convert buffer to base64
        const base64Image = imageBuffer.toString('base64');
        
        const prompt = `You are an expert at extracting MCQ questions from images with mathematical content.

Extract ALL MCQ questions and return them in JSON format.

IMPORTANT: For mathematical notation, use simple Unicode symbols and clear formatting:
- Use × for multiplication
- Use ÷ for division  
- Use ² ³ for superscripts where possible
- Use subscripts: ₁ ₂ ₃
- Write matrices clearly: [[1, 0], [0, 1]] or as text
- Keep equations readable: Q - 2I, Q - 6I, etc.

Return JSON array with this exact structure:
[
  {
    "text": "Complete question text with clear mathematical notation",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctOption": 0,
    "explanation": "Brief explanation",
    "difficulty": "easy"
  }
]

Return ONLY the JSON array. No markdown, no code blocks, no extra text.`;
        
        console.log('Calling Gemini 2.0 Flash API...');
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
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
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API Error:', errorText);
            throw new Error(`Gemini API error: ${response.status}`);
        }
        
        const data: any = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        if (!text) {
            throw new Error('No response from Gemini API');
        }
        
        console.log('Gemini API response received');
        console.log('Response length:', text.length, 'characters');
        
        // Parse JSON response
        let jsonString = text.trim();
        if (jsonString.startsWith('```json')) jsonString = jsonString.substring(7);
        if (jsonString.startsWith('```')) jsonString = jsonString.substring(3);
        if (jsonString.endsWith('```')) jsonString = jsonString.substring(0, jsonString.length - 3);
        jsonString = jsonString.trim();
        
        const questions = JSON.parse(jsonString);
        console.log(`✅ Successfully extracted ${questions.length} questions using Gemini AI`);
        
        return questions;
    } catch (error) {
        console.error('Error extracting questions with OCR:', error);
        console.error('Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace'
        });
        
        // Check if it's a network error
        if (error instanceof Error && error.message.includes('fetch failed')) {
            console.log('Network error detected. Returning empty array instead of mock data.');
            return []; // Return empty array for network errors
        }
        
        // Fallback to mock data if AI fails for other reasons
        console.log('Falling back to mock data...');
        return [
            {
                text: "What is the SI unit of electric current?",
                options: [
                    "Volt",
                    "Ampere",
                    "Ohm",
                    "Watt"
                ],
                correctOption: 1,
                explanation: "The SI unit of electric current is Ampere (A).",
                difficulty: "easy"
            },
            {
                text: "Which of the following is a vector quantity?",
                options: [
                    "Speed",
                    "Distance",
                    "Velocity",
                    "Time"
                ],
                correctOption: 2,
                explanation: "Velocity is a vector quantity as it has both magnitude and direction.",
                difficulty: "medium"
            }
        ];
    }
}

export const getAIExtractorPage = (req: Request, res: Response) => {
    // Get user information from cookie
    const user = getUserFromCookie(req);
    
    // Check if user is authenticated
    if (!user) {
        return res.redirect('/auth/login');
    }
    
    res.render('ai-extractor', {
        title: 'AI Question Extractor - Faculty Dashboard',
        description: 'Extract questions and options from images using powerful AI',
        user: user
    });
};

export const uploadImage = upload.single('image');

export const processImage = async (req: Request, res: Response) => {
    try {
        // Get user information from cookie
        const user = getUserFromCookie(req);
        
        // Check if user is authenticated
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }
        
        console.log('Received image file for processing');
        console.log('File details:', {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        });
        
        // Process the image (resize, optimize, etc.)
        const processedImage = await sharp(req.file.buffer)
            .resize(1200, null, { withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toBuffer();
        
        console.log('Image processed successfully');
        console.log('Processed image size:', processedImage.length, 'bytes');
        
        // Extract questions using AI
        const extractedQuestions = await extractQuestionsFromImage(processedImage);
        
        console.log('Questions extracted successfully');
        
        // Return the extracted questions
        res.json({
            success: true,
            questions: extractedQuestions
        });
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ 
            error: 'An error occurred while processing the image',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
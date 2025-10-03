"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResultsPage = exports.getAISolution = exports.getResultPage = exports.submitTestHandler = exports.getTakeTestPage = exports.getTestsPage = exports.getMaterialsPage = exports.getStudentCornerPage = void 0;
const authController_1 = require("./authController");
const database_1 = require("../database");
// Gemini API Configuration
const GEMINI_API_KEY = 'AIzaSyAVxdBPUmipUnIImfEnlJVAjGD9q1l_zMo';
const GEMINI_MODEL = 'gemini-2.0-flash-exp';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const getStudentCornerPage = (req, res) => {
    const user = (0, authController_1.getUser)(req);
    // If user is not logged in, redirect to login page with redirect parameter
    if (!user) {
        return res.redirect('/auth/login?redirect=/student-corner');
    }
    // Allow all logged-in users to access student corner
    // Teachers can also view student resources
    res.render('student-corner', {
        title: 'Student Corner - Photon Coaching',
        description: 'Access study materials, test results, and other resources for your preparation.',
        showLoginPopup: false,
        user: user
    });
};
exports.getStudentCornerPage = getStudentCornerPage;
const getMaterialsPage = async (req, res) => {
    const user = (0, authController_1.getUser)(req);
    if (!user) {
        return res.redirect('/auth/login?redirect=/student-corner/materials');
    }
    // Fetch all materials from database
    const materials = await (0, database_1.getStudyMaterials)();
    res.render('student-materials', {
        title: 'Study Materials - Photon Coaching',
        user: user,
        materials: materials
    });
};
exports.getMaterialsPage = getMaterialsPage;
const getTestsPage = async (req, res) => {
    const user = (0, authController_1.getUser)(req);
    if (!user) {
        return res.redirect('/auth/login?redirect=/student-corner/tests');
    }
    try {
        // Fetch all tests with scheduling status
        const tests = await (0, database_1.getTestsWithStatus)();
        res.render('student-tests', {
            title: 'Tests - Photon Coaching',
            user: user,
            tests: tests
        });
    }
    catch (error) {
        console.error('Error fetching tests:', error);
        res.render('student-tests', {
            title: 'Tests - Photon Coaching',
            user: user,
            tests: [],
            error: 'Failed to load tests'
        });
    }
};
exports.getTestsPage = getTestsPage;
const getTakeTestPage = async (req, res) => {
    const user = (0, authController_1.getUser)(req);
    if (!user) {
        return res.redirect('/auth/login?redirect=/student-corner/tests');
    }
    try {
        const testId = parseInt(req.params.id);
        const test = await (0, database_1.getTestWithQuestions)(testId);
        if (!test) {
            return res.redirect('/student-corner/tests?error=Test not found');
        }
        res.render('take-test', {
            title: `${test.title} - Photon Coaching`,
            user: user,
            test: test
        });
    }
    catch (error) {
        console.error('Error loading test:', error);
        res.redirect('/student-corner/tests?error=Failed to load test');
    }
};
exports.getTakeTestPage = getTakeTestPage;
const submitTestHandler = async (req, res) => {
    const user = (0, authController_1.getUser)(req);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const { testId, answers, timeTaken, score, correctAnswers, totalQuestions, wrongAnswers } = req.body;
        // Calculate numerical score: +4 for correct, -1 for wrong
        const correctCount = parseInt(correctAnswers);
        const wrongCount = parseInt(wrongAnswers || 0);
        const numericalScore = (correctCount * 4) - (wrongCount * 1);
        const maxMarks = parseInt(totalQuestions) * 4; // Maximum possible marks
        const result = await (0, database_1.saveTestResult)({
            test_id: parseInt(testId),
            student_id: user.id || 1,
            student_name: user.name || 'Student',
            score: parseFloat(score),
            correct_answers: correctCount,
            total_questions: parseInt(totalQuestions),
            time_taken: parseInt(timeTaken),
            answers: JSON.stringify(answers),
            numerical_score: numericalScore,
            wrong_answers: wrongCount,
            max_marks: maxMarks
        });
        const resultId = Number(result.lastInsertRowid);
        res.json({
            success: true,
            resultId: resultId,
            redirectUrl: `/student-corner/results/${resultId}`
        });
    }
    catch (error) {
        console.error('Error submitting test:', error);
        res.status(500).json({ error: 'Failed to submit test' });
    }
};
exports.submitTestHandler = submitTestHandler;
const getResultPage = async (req, res) => {
    const user = (0, authController_1.getUser)(req);
    if (!user) {
        return res.redirect('/auth/login?redirect=/student-corner/results');
    }
    try {
        const resultId = parseInt(req.params.id);
        const result = await (0, database_1.getTestResult)(resultId);
        if (!result) {
            return res.redirect('/student-corner/tests?error=Result not found');
        }
        // Get test details with questions
        const test = await (0, database_1.getTestWithQuestions)(result.test_id);
        // Get rank
        const rankInfo = await (0, database_1.getStudentRank)(result.test_id, resultId);
        // Parse answers
        const answers = JSON.parse(result.answers);
        res.render('test-result', {
            title: `${test.title} - Result`,
            user: user,
            result: result,
            test: test,
            answers: answers,
            rank: rankInfo.rank,
            totalStudents: rankInfo.totalStudents
        });
    }
    catch (error) {
        console.error('Error loading result:', error);
        res.redirect('/student-corner/tests?error=Failed to load result');
    }
};
exports.getResultPage = getResultPage;
const getAISolution = async (req, res) => {
    const user = (0, authController_1.getUser)(req);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const { questionText, options, correctAnswer, userAnswer } = req.body;
        const prompt = `You are an expert JEE/NEET tutor. Provide a CLEAR, DIRECT solution. NO trial-and-error, NO confusion, NO "I'm frustrated" comments.

QUESTION: ${questionText}

OPTIONS:
${options.map((opt, i) => `${String.fromCharCode(65 + i)}) ${opt}`).join('\n')}

CORRECT ANSWER: ${String.fromCharCode(65 + correctAnswer)}
STUDENT'S ANSWER: ${userAnswer !== null ? String.fromCharCode(65 + userAnswer) : 'Not Attempted'}

Provide a CLEAN, ORGANIZED explanation:

═══════════════════════════════════════
1. CONCEPT & FORMULA
═══════════════════════════════════════
State the key concept and main formula needed.
Keep it brief (2-3 sentences max).

═══════════════════════════════════════
2. SOLUTION STEPS
═══════════════════════════════════════
Provide ONLY the correct approach. NO failed attempts.

Step 1: [First step with calculation]
Step 2: [Second step with calculation]
Step 3: [Final step with answer]

Use clean notation:
- Exponents: x^2, x^3
- Fractions: a/b
- Square root: √x or sqrt(x)
- Multiplication: × or *
- Division: ÷ or /

═══════════════════════════════════════
3. WHY OPTION ${String.fromCharCode(65 + correctAnswer)} IS CORRECT
═══════════════════════════════════════
Brief explanation (2-3 sentences).

═══════════════════════════════════════
4. COMMON MISTAKES
═══════════════════════════════════════
List 2-3 common errors students make.

═══════════════════════════════════════
5. KEY POINTS TO REMEMBER
═══════════════════════════════════════
List 2-3 important takeaways.

CRITICAL RULES:
✓ Be DIRECT and CONFIDENT
✓ Show ONLY the correct method
✓ NO rambling or confusion
✓ NO "I'm frustrated" or "this is tough"
✓ Maximum 400 words total
✓ Clean mathematical notation`;
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                        parts: [{ text: prompt }]
                    }]
            })
        });
        if (!response.ok) {
            throw new Error('Failed to get AI solution');
        }
        const data = await response.json();
        const solution = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate solution';
        res.json({
            success: true,
            solution: solution
        });
    }
    catch (error) {
        console.error('Error generating AI solution:', error);
        res.status(500).json({
            error: 'Failed to generate solution',
            solution: 'Unable to generate AI solution at this time. Please try again later.'
        });
    }
};
exports.getAISolution = getAISolution;
const getResultsPage = async (req, res) => {
    const user = (0, authController_1.getUser)(req);
    if (!user) {
        return res.redirect('/auth/login?redirect=/student-corner/results');
    }
    try {
        // Get all results for this student
        const allResults = await database_1.client.execute({
            sql: 'SELECT tr.*, t.title, t.subject FROM test_results tr JOIN tests t ON tr.test_id = t.id WHERE tr.student_id = ? ORDER BY tr.submitted_at DESC',
            args: [user.id || 1]
        });
        res.render('student-results', {
            title: 'Results - Photon Coaching',
            user: user,
            results: allResults.rows
        });
    }
    catch (error) {
        console.error('Error fetching results:', error);
        res.render('student-results', {
            title: 'Results - Photon Coaching',
            user: user,
            results: []
        });
    }
};
exports.getResultsPage = getResultsPage;

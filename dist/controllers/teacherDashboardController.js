"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.finalizeTestHandler = exports.addQuestionHandler = exports.createTestInitHandler = exports.getTestPerformanceData = exports.getPerformanceAnalyticsPage = exports.getStudentManagementPage = exports.uploadMaterialHandler = exports.getMaterialsPage = exports.uploadMiddleware = exports.createTestHandler = exports.getCreateTestPage = exports.getTeacherDashboardPage = void 0;
const authController_1 = require("./authController");
const database_1 = require("../database");
const cloudinary_1 = require("../config/cloudinary");
const path_1 = __importDefault(require("path"));
const getTeacherDashboardPage = (req, res) => {
    // Get user information from cookie
    const user = (0, authController_1.getUserFromCookie)(req);
    // If user is not logged in, redirect to faculty login page
    if (!user) {
        return res.redirect('/auth/faculty-login?redirect=/teacher-dashboard');
    }
    // Check if user is faculty
    if (user.role && user.role !== 'faculty') {
        return res.redirect('/student-corner');
    }
    // User is logged in, show the teacher dashboard
    res.render('teacher-dashboard', {
        title: 'Faculty Dashboard - Photon Coaching',
        description: 'Access the advanced teacher dashboard to create mock tests, manage students, and track performance analytics.',
        showLoginPopup: false,
        user: user
    });
};
exports.getTeacherDashboardPage = getTeacherDashboardPage;
const getCreateTestPage = (req, res) => {
    // Get user information from cookie
    const user = (0, authController_1.getUserFromCookie)(req);
    // Check if user is authenticated
    if (!user) {
        return res.redirect('/auth/faculty-login?redirect=/teacher-dashboard/create-test');
    }
    res.render('create-test', {
        title: 'Create Test - Faculty Dashboard',
        description: 'Create a new MCQ test for your students',
        user: user
    });
};
exports.getCreateTestPage = getCreateTestPage;
const createTestHandler = async (req, res) => {
    // Get user information from cookie
    const user = (0, authController_1.getUserFromCookie)(req);
    // Check if user is authenticated
    if (!user) {
        return res.redirect('/auth/login');
    }
    try {
        // Get form data
        const { testTitle, testDescription, testDuration, testSubject, testDate, questions } = req.body;
        // Create the test in the database
        const testResult = await (0, database_1.createTest)({
            title: testTitle,
            description: testDescription,
            subject: testSubject,
            duration: parseInt(testDuration),
            scheduled_date: testDate,
            created_by: 1 // In a real app, you would get the user ID from the session
        });
        const testId = Number(testResult.lastInsertRowid);
        // Add questions and options
        if (questions && Array.isArray(questions)) {
            for (let i = 0; i < questions.length; i++) {
                const question = questions[i];
                // Add question
                const questionResult = await (0, database_1.addQuestion)({
                    test_id: testId,
                    question_text: question.text,
                    explanation: question.explanation || '',
                    difficulty: question.difficulty || 'medium',
                    diagram: question.diagram || null
                });
                const questionId = Number(questionResult.lastInsertRowid);
                // Add options
                if (question.options && Array.isArray(question.options)) {
                    for (let j = 0; j < question.options.length; j++) {
                        const optionText = question.options[j];
                        const isCorrect = parseInt(question.correctOption) === j;
                        await (0, database_1.addOption)({
                            question_id: questionId,
                            option_text: optionText,
                            is_correct: isCorrect
                        });
                    }
                }
            }
        }
        // Redirect back to the dashboard with a success message
        res.redirect('/teacher-dashboard?testCreated=true');
    }
    catch (error) {
        console.error('Error creating test:', error);
        res.status(500).render('create-test', {
            title: 'Create Test - Faculty Dashboard',
            description: 'Create a new MCQ test for your students',
            user: user,
            error: 'An error occurred while creating the test. Please try again.'
        });
    }
};
exports.createTestHandler = createTestHandler;
// Use Cloudinary storage (configured in cloudinary.ts)
exports.uploadMiddleware = cloudinary_1.uploadMaterial.single('material');
const getMaterialsPage = async (req, res) => {
    const user = (0, authController_1.getUserFromCookie)(req);
    if (!user) {
        return res.redirect('/auth/faculty-login?redirect=/teacher-dashboard/materials');
    }
    // Fetch all materials from database
    const materials = await (0, database_1.getStudyMaterials)();
    res.render('teacher-materials', {
        title: 'Study Materials - Faculty Dashboard',
        user: user,
        materials: materials,
        success: req.query.uploaded === 'true' ? 'Material uploaded successfully!' : null
    });
};
exports.getMaterialsPage = getMaterialsPage;
const uploadMaterialHandler = async (req, res) => {
    const user = (0, authController_1.getUserFromCookie)(req);
    if (!user) {
        return res.redirect('/auth/faculty-login');
    }
    try {
        if (!req.file) {
            return res.redirect('/teacher-dashboard/materials?error=nofile');
        }
        const { title, description, subject } = req.body;
        // Save to database with Cloudinary URL
        await (0, database_1.uploadStudyMaterial)({
            title: title,
            description: description || '',
            subject: subject,
            file_name: req.file.originalname,
            file_path: req.file.path, // Cloudinary URL
            file_type: path_1.default.extname(req.file.originalname),
            file_size: req.file.size,
            uploaded_by: 1 // In production, use actual user ID
        });
        res.redirect('/teacher-dashboard/materials?uploaded=true');
    }
    catch (error) {
        console.error('Error uploading material:', error);
        res.redirect('/teacher-dashboard/materials?error=upload');
    }
};
exports.uploadMaterialHandler = uploadMaterialHandler;
const getStudentManagementPage = async (req, res) => {
    const user = (0, authController_1.getUserFromCookie)(req);
    if (!user) {
        return res.redirect('/auth/faculty-login?redirect=/teacher-dashboard/students');
    }
    try {
        // Fetch only students (not faculty) from database
        const result = await database_1.client.execute("SELECT * FROM users WHERE role = 'student' OR role IS NULL ORDER BY created_at DESC");
        const students = result.rows;
        res.render('teacher-students', {
            title: 'Student Management - Faculty Dashboard',
            user: user,
            students: students
        });
    }
    catch (error) {
        console.error('Error fetching students:', error);
        res.render('teacher-students', {
            title: 'Student Management - Faculty Dashboard',
            user: user,
            students: [],
            error: 'Failed to load students'
        });
    }
};
exports.getStudentManagementPage = getStudentManagementPage;
const getPerformanceAnalyticsPage = async (req, res) => {
    const user = (0, authController_1.getUserFromCookie)(req);
    if (!user) {
        return res.redirect('/auth/faculty-login?redirect=/teacher-dashboard/performance');
    }
    try {
        const analytics = await (0, database_1.getPerformanceAnalytics)();
        const tests = await (0, database_1.getAllTests)();
        res.render('teacher-performance', {
            title: 'Performance Analytics - Faculty Dashboard',
            user: user,
            analytics: analytics,
            tests: tests
        });
    }
    catch (error) {
        console.error('Error fetching performance analytics:', error);
        res.render('teacher-performance', {
            title: 'Performance Analytics - Faculty Dashboard',
            user: user,
            analytics: [],
            tests: [],
            error: 'Failed to load analytics'
        });
    }
};
exports.getPerformanceAnalyticsPage = getPerformanceAnalyticsPage;
const getTestPerformanceData = async (req, res) => {
    const user = (0, authController_1.getUserFromCookie)(req);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const testId = parseInt(req.params.testId);
        const performance = await (0, database_1.getTestPerformanceDetails)(testId);
        res.json({
            success: true,
            data: performance
        });
    }
    catch (error) {
        console.error('Error fetching test performance:', error);
        res.status(500).json({ error: 'Failed to load performance data' });
    }
};
exports.getTestPerformanceData = getTestPerformanceData;
// Chunked Upload Handlers
// Step 1: Initialize test and return test_id
const createTestInitHandler = async (req, res) => {
    const user = (0, authController_1.getUserFromCookie)(req);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const { title, description, subject, duration, scheduled_date, start_time, end_time } = req.body;
        // Validate required fields
        if (!title || !subject || !duration) {
            return res.status(400).json({
                error: 'Missing required fields: title, subject, duration'
            });
        }
        // Create the test in the database
        const testResult = await (0, database_1.createTest)({
            title,
            description: description || '',
            subject,
            duration: parseInt(duration),
            scheduled_date: scheduled_date || null,
            start_time: start_time || null,
            end_time: end_time || null,
            created_by: 1 // TODO: Get actual user ID from session
        });
        const testId = Number(testResult.lastInsertRowid);
        res.json({
            success: true,
            test_id: testId,
            message: 'Test initialized successfully'
        });
    }
    catch (error) {
        console.error('Error initializing test:', error);
        res.status(500).json({
            error: 'Failed to initialize test',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.createTestInitHandler = createTestInitHandler;
// Step 2: Add a single question with options
const addQuestionHandler = async (req, res) => {
    const user = (0, authController_1.getUserFromCookie)(req);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const { test_id, question_text, diagram, explanation, difficulty, options } = req.body;
        // Validate required fields
        if (!test_id || !question_text || !options || !Array.isArray(options)) {
            return res.status(400).json({
                error: 'Missing required fields: test_id, question_text, options'
            });
        }
        // Add question to database
        const questionResult = await (0, database_1.addQuestion)({
            test_id: parseInt(test_id),
            question_text,
            explanation: explanation || '',
            difficulty: difficulty || 'medium',
            diagram: diagram || null
        });
        const questionId = Number(questionResult.lastInsertRowid);
        // Add options
        for (const option of options) {
            await (0, database_1.addOption)({
                question_id: questionId,
                option_text: option.text,
                is_correct: option.is_correct
            });
        }
        res.json({
            success: true,
            question_id: questionId,
            message: 'Question added successfully'
        });
    }
    catch (error) {
        console.error('Error adding question:', error);
        res.status(500).json({
            error: 'Failed to add question',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.addQuestionHandler = addQuestionHandler;
// Step 3: Finalize test (optional - for validation)
const finalizeTestHandler = async (req, res) => {
    const user = (0, authController_1.getUserFromCookie)(req);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const { test_id } = req.body;
        if (!test_id) {
            return res.status(400).json({ error: 'Missing test_id' });
        }
        // Optional: Add validation logic here
        // For example, check if test has at least one question
        res.json({
            success: true,
            message: 'Test finalized successfully',
            test_id: parseInt(test_id)
        });
    }
    catch (error) {
        console.error('Error finalizing test:', error);
        res.status(500).json({
            error: 'Failed to finalize test',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.finalizeTestHandler = finalizeTestHandler;

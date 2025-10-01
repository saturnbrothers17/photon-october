import { Request, Response } from 'express';
import { getUser, getUserFromCookie } from './authController';
import { createTest, addQuestion, addOption, getPerformanceAnalytics, getAllTests, getTestPerformanceDetails, getStudyMaterials, uploadStudyMaterial, client } from '../database';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

export const getTeacherDashboardPage = (req: Request, res: Response) => {
    // Get user information from cookie
    const user = getUserFromCookie(req);
    
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

export const getCreateTestPage = (req: Request, res: Response) => {
    // Get user information from cookie
    const user = getUserFromCookie(req);
    
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

export const createTestHandler = async (req: Request, res: Response) => {
    // Get user information from cookie
    const user = getUserFromCookie(req);
    
    // Check if user is authenticated
    if (!user) {
        return res.redirect('/auth/login');
    }
    
    try {
        // Get form data
        const { testTitle, testDescription, testDuration, testSubject, testDate, questions } = req.body;
        
        // Create the test in the database
        const testResult = await createTest({
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
                const questionResult = await addQuestion({
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
                        
                        await addOption({
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
    } catch (error) {
        console.error('Error creating test:', error);
        res.status(500).render('create-test', {
            title: 'Create Test - Faculty Dashboard',
            description: 'Create a new MCQ test for your students',
            user: user,
            error: 'An error occurred while creating the test. Please try again.'
        });
    }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads/materials');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|doc|docx|ppt|pptx|jpg|jpeg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF, Word, PowerPoint, and Image files are allowed!'));
        }
    }
});

export const uploadMiddleware = upload.single('material');

export const getMaterialsPage = async (req: Request, res: Response) => {
    const user = getUserFromCookie(req);
    
    if (!user) {
        return res.redirect('/auth/faculty-login?redirect=/teacher-dashboard/materials');
    }
    
    // Fetch all materials from database
    const materials = await getStudyMaterials();
    
    res.render('teacher-materials', {
        title: 'Study Materials - Faculty Dashboard',
        user: user,
        materials: materials,
        success: req.query.uploaded === 'true' ? 'Material uploaded successfully!' : null
    });
};

export const uploadMaterialHandler = async (req: Request, res: Response) => {
    const user = getUserFromCookie(req);
    
    if (!user) {
        return res.redirect('/auth/faculty-login');
    }
    
    try {
        if (!req.file) {
            return res.redirect('/teacher-dashboard/materials?error=nofile');
        }
        
        const { title, description, subject } = req.body;
        
        // Save to database
        await uploadStudyMaterial({
            title: title,
            description: description || '',
            subject: subject,
            file_name: req.file.originalname,
            file_path: `/uploads/materials/${req.file.filename}`,
            file_type: path.extname(req.file.originalname),
            file_size: req.file.size,
            uploaded_by: 1 // In production, use actual user ID
        });
        
        res.redirect('/teacher-dashboard/materials?uploaded=true');
    } catch (error) {
        console.error('Error uploading material:', error);
        res.redirect('/teacher-dashboard/materials?error=upload');
    }
};

export const getStudentManagementPage = async (req: Request, res: Response) => {
    const user = getUserFromCookie(req);
    
    if (!user) {
        return res.redirect('/auth/faculty-login?redirect=/teacher-dashboard/students');
    }
    
    try {
        // Fetch only students (not faculty) from database
        const result = await client.execute("SELECT * FROM users WHERE role = 'student' OR role IS NULL ORDER BY created_at DESC");
        const students = result.rows;
        
        res.render('teacher-students', {
            title: 'Student Management - Faculty Dashboard',
            user: user,
            students: students
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.render('teacher-students', {
            title: 'Student Management - Faculty Dashboard',
            user: user,
            students: [],
            error: 'Failed to load students'
        });
    }
};

export const getPerformanceAnalyticsPage = async (req: Request, res: Response) => {
    const user = getUserFromCookie(req);
    
    if (!user) {
        return res.redirect('/auth/faculty-login?redirect=/teacher-dashboard/performance');
    }
    
    try {
        const analytics = await getPerformanceAnalytics();
        const tests = await getAllTests();
        
        res.render('teacher-performance', {
            title: 'Performance Analytics - Faculty Dashboard',
            user: user,
            analytics: analytics,
            tests: tests
        });
    } catch (error) {
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

export const getTestPerformanceData = async (req: Request, res: Response) => {
    const user = getUserFromCookie(req);
    
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
        const testId = parseInt(req.params.testId);
        const performance = await getTestPerformanceDetails(testId);
        
        res.json({
            success: true,
            data: performance
        });
    } catch (error) {
        console.error('Error fetching test performance:', error);
        res.status(500).json({ error: 'Failed to load performance data' });
    }
};
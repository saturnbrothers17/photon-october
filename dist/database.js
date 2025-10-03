"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
exports.initializeDatabase = initializeDatabase;
exports.getCourses = getCourses;
exports.getTestimonials = getTestimonials;
exports.addStudent = addStudent;
exports.registerUser = registerUser;
exports.authenticateUser = authenticateUser;
exports.addFaculty = addFaculty;
exports.getFaculty = getFaculty;
exports.addFacultyUser = addFacultyUser;
exports.clearAllUsers = clearAllUsers;
exports.createTest = createTest;
exports.addQuestion = addQuestion;
exports.addOption = addOption;
exports.getAllTests = getAllTests;
exports.getTestWithQuestions = getTestWithQuestions;
exports.saveTestResult = saveTestResult;
exports.getTestResult = getTestResult;
exports.getTestResults = getTestResults;
exports.getStudentTestResults = getStudentTestResults;
exports.getStudentRank = getStudentRank;
exports.getPerformanceAnalytics = getPerformanceAnalytics;
exports.getTestPerformanceDetails = getTestPerformanceDetails;
exports.uploadStudyMaterial = uploadStudyMaterial;
exports.getStudyMaterials = getStudyMaterials;
exports.deleteStudyMaterial = deleteStudyMaterial;
exports.getTestsWithStatus = getTestsWithStatus;
const client_1 = require("@libsql/client");
// Initialize Turso client with your actual database credentials
// Note: Using libsql:// protocol directly
const client = (0, client_1.createClient)({
    url: 'libsql://photon-photon7.turso.io', // Simplified URL
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTkxNjI3NTYsImlkIjoiNTYzZGE0NTQtNTA2NC00MjViLWFlMDktZjhhZDBlMGEyODI1IiwicmlkIjoiZGE2OGMwNjUtMWU4OC00MDE0LWEyNTYtMjhlZTJhYWIyMDRhIn0.J5_dnmOumr0DmOWwzkqG-bEUg5ZngUB-i-c6rnL6vikvv6kMOryKLCiODEC3iQiz0XxDEpQeZRt0seqSu3f1DA'
});
exports.client = client;
// Function to initialize the database
async function initializeDatabase() {
    try {
        console.log('Attempting to connect to database...');
        // Test basic connectivity first
        const testResult = await client.execute('SELECT 1');
        console.log('Database connection test successful:', testResult);
        // Create tables if they don't exist
        await client.execute(`
            CREATE TABLE IF NOT EXISTS students (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                phone TEXT,
                course TEXT,
                message TEXT,
                enrollment_date DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await client.execute(`
            CREATE TABLE IF NOT EXISTS courses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                duration TEXT,
                fee REAL
            )
        `);
        await client.execute(`
            CREATE TABLE IF NOT EXISTS faculty (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                qualification TEXT,
                subject TEXT,
                experience INTEGER
            )
        `);
        await client.execute(`
            CREATE TABLE IF NOT EXISTS testimonials (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_name TEXT NOT NULL,
                message TEXT,
                course TEXT,
                date DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        // Create users table if it doesn't exist (without dropping existing data)
        await client.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                photon_id TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                phone TEXT,
                class TEXT,
                course TEXT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'student',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        // Create tests table
        await client.execute(`
            CREATE TABLE IF NOT EXISTS tests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                subject TEXT NOT NULL,
                duration INTEGER NOT NULL,
                scheduled_date DATETIME,
                start_time TEXT,
                end_time TEXT,
                test_type TEXT DEFAULT 'Other',
                max_marks INTEGER DEFAULT 0,
                created_by INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES users(id)
            )
        `);
        // Add missing columns to existing tests table if they don't exist
        try {
            await client.execute(`ALTER TABLE tests ADD COLUMN start_time TEXT`);
        }
        catch (e) {
            // Column already exists, ignore
        }
        try {
            await client.execute(`ALTER TABLE tests ADD COLUMN end_time TEXT`);
        }
        catch (e) {
            // Column already exists, ignore
        }
        try {
            await client.execute(`ALTER TABLE tests ADD COLUMN test_type TEXT DEFAULT 'Other'`);
        }
        catch (e) {
            // Column already exists, ignore
        }
        try {
            await client.execute(`ALTER TABLE tests ADD COLUMN max_marks INTEGER DEFAULT 0`);
        }
        catch (e) {
            // Column already exists, ignore
        }
        // Create questions table
        await client.execute(`
            CREATE TABLE IF NOT EXISTS questions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                test_id INTEGER NOT NULL,
                question_text TEXT NOT NULL,
                explanation TEXT,
                difficulty TEXT DEFAULT 'medium',
                diagram TEXT,
                FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
            )
        `);
        // Create options table
        await client.execute(`
            CREATE TABLE IF NOT EXISTS options (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                question_id INTEGER NOT NULL,
                option_text TEXT NOT NULL,
                is_correct BOOLEAN DEFAULT FALSE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
            )
        `);
        // Create test_results table
        await client.execute(`
            CREATE TABLE IF NOT EXISTS test_results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                test_id INTEGER NOT NULL,
                student_id INTEGER NOT NULL,
                student_name TEXT NOT NULL,
                score REAL NOT NULL,
                correct_answers INTEGER NOT NULL,
                total_questions INTEGER NOT NULL,
                time_taken INTEGER,
                answers TEXT,
                test_title TEXT,
                test_subject TEXT,
                test_max_marks INTEGER,
                submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE SET NULL
            )
        `);
        // Add missing columns to existing test_results table if they don't exist
        try {
            await client.execute(`ALTER TABLE test_results ADD COLUMN test_title TEXT`);
        }
        catch (e) {
            // Column already exists, ignore
        }
        try {
            await client.execute(`ALTER TABLE test_results ADD COLUMN test_subject TEXT`);
        }
        catch (e) {
            // Column already exists, ignore
        }
        try {
            await client.execute(`ALTER TABLE test_results ADD COLUMN test_max_marks INTEGER`);
        }
        catch (e) {
            // Column already exists, ignore
        }
        // Create study_materials table
        await client.execute(`
            CREATE TABLE IF NOT EXISTS study_materials (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                subject TEXT NOT NULL,
                file_name TEXT NOT NULL,
                file_path TEXT NOT NULL,
                file_type TEXT NOT NULL,
                file_size INTEGER NOT NULL,
                uploaded_by INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (uploaded_by) REFERENCES users(id)
            )
        `);
        console.log('Database initialized successfully');
    }
    catch (error) {
        console.error('Error initializing database:', error);
        console.log('Continuing without database connection...');
    }
}
// Function to get all courses
async function getCourses() {
    try {
        const result = await client.execute('SELECT * FROM courses');
        return result.rows;
    }
    catch (error) {
        console.error('Error fetching courses:', error);
        return [];
    }
}
// Function to get all testimonials
async function getTestimonials() {
    try {
        const result = await client.execute('SELECT * FROM testimonials');
        return result.rows;
    }
    catch (error) {
        console.error('Error fetching testimonials:', error);
        return [];
    }
}
// Function to add a new student
async function addStudent(studentData) {
    try {
        const result = await client.execute({
            sql: 'INSERT INTO students (name, email, phone, course, message) VALUES (?, ?, ?, ?, ?)',
            args: [studentData.name, studentData.email, studentData.phone, studentData.course, studentData.message]
        });
        return result;
    }
    catch (error) {
        console.error('Error adding student:', error);
        return null;
    }
}
// Function to register a new user with all required fields
async function registerUser(userData) {
    try {
        console.log('Attempting to insert user into database:', userData);
        const result = await client.execute({
            sql: 'INSERT INTO users (photon_id, name, phone, class, course, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
            args: [userData.photon_id, userData.name, userData.phone, userData.class, userData.course, userData.email, userData.password]
        });
        console.log('Database insertion result:', result);
        return result;
    }
    catch (error) {
        console.error('Error registering user:', error);
        throw error; // Re-throw the error so it can be handled by the caller
    }
}
// Function to authenticate a user by photon_id and password
async function authenticateUser(photon_id, password) {
    try {
        const result = await client.execute({
            sql: 'SELECT * FROM users WHERE photon_id = ?',
            args: [photon_id]
        });
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const storedPassword = user.password;
            // Check if password is hashed (starts with $2b$ for bcrypt)
            if (storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2a$')) {
                // Use bcrypt to compare
                const bcrypt = require('bcrypt');
                const isMatch = await bcrypt.compare(password, storedPassword);
                if (isMatch) {
                    return user;
                }
            }
            else {
                // Plain text comparison for backwards compatibility
                if (storedPassword === password) {
                    return user;
                }
            }
        }
        return null;
    }
    catch (error) {
        console.error('Error authenticating user:', error);
        return null;
    }
}
// Function to add a new faculty member
async function addFaculty(facultyData) {
    try {
        const result = await client.execute({
            sql: 'INSERT INTO faculty (name, qualification, subject, experience) VALUES (?, ?, ?, ?)',
            args: [facultyData.name, facultyData.qualification || '', facultyData.subject, facultyData.experience || 0]
        });
        return result;
    }
    catch (error) {
        console.error('Error adding faculty:', error);
        throw error;
    }
}
// Function to get all faculty members
async function getFaculty() {
    try {
        const result = await client.execute('SELECT * FROM faculty');
        return result.rows;
    }
    catch (error) {
        console.error('Error fetching faculty:', error);
        return [];
    }
}
// Function to add a faculty user (for login)
async function addFacultyUser(userData) {
    try {
        // First add to faculty table
        await addFaculty({
            name: userData.name,
            subject: userData.subject,
            qualification: userData.qualification,
            experience: userData.experience
        });
        // Then add to users table with faculty flag
        const result = await client.execute({
            sql: 'INSERT INTO users (photon_id, name, password, email, phone, class, course) VALUES (?, ?, ?, ?, ?, ?, ?)',
            args: [userData.photon_id, userData.name, userData.password, `${userData.photon_id.replace('@photon', '')}@photoncoaching.com`, '', '', `Faculty - ${userData.subject}`]
        });
        return result;
    }
    catch (error) {
        console.error('Error adding faculty user:', error);
        throw error;
    }
}
// Function to clear all users from the database
async function clearAllUsers() {
    try {
        const result = await client.execute({
            sql: 'DELETE FROM users'
        });
        console.log('Cleared all users from database. Rows affected:', result.rowsAffected);
        return result;
    }
    catch (error) {
        console.error('Error clearing users:', error);
        return null;
    }
}
// Function to create a new test
async function createTest(testData) {
    try {
        const result = await client.execute({
            sql: 'INSERT INTO tests (title, description, subject, duration, scheduled_date, start_time, end_time, test_type, max_marks, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            args: [testData.title, testData.description, testData.subject, testData.duration, testData.scheduled_date || null, testData.start_time || null, testData.end_time || null, testData.test_type || 'Other', testData.max_marks || 0, testData.created_by]
        });
        return result;
    }
    catch (error) {
        console.error('Error creating test:', error);
        throw error;
    }
}
// Function to add a question to a test
async function addQuestion(questionData) {
    try {
        const result = await client.execute({
            sql: 'INSERT INTO questions (test_id, question_text, explanation, difficulty, diagram) VALUES (?, ?, ?, ?, ?)',
            args: [questionData.test_id, questionData.question_text, questionData.explanation, questionData.difficulty, questionData.diagram || null]
        });
        return result;
    }
    catch (error) {
        console.error('Error adding question:', error);
        throw error;
    }
}
// Function to add an option to a question
async function addOption(optionData) {
    try {
        const result = await client.execute({
            sql: 'INSERT INTO options (question_id, option_text, is_correct) VALUES (?, ?, ?)',
            args: [optionData.question_id, optionData.option_text, optionData.is_correct ? 1 : 0]
        });
        return result;
    }
    catch (error) {
        console.error('Error adding option:', error);
        throw error;
    }
}
// Function to get all tests
async function getAllTests() {
    try {
        const result = await client.execute('SELECT * FROM tests ORDER BY created_at DESC');
        return result.rows;
    }
    catch (error) {
        console.error('Error getting tests:', error);
        throw error;
    }
}
// Function to get test with questions and options
async function getTestWithQuestions(testId) {
    try {
        // Get test details
        const testResult = await client.execute({
            sql: 'SELECT * FROM tests WHERE id = ?',
            args: [testId]
        });
        if (testResult.rows.length === 0) {
            return null;
        }
        const test = testResult.rows[0];
        // Get questions for this test
        const questionsResult = await client.execute({
            sql: 'SELECT * FROM questions WHERE test_id = ?',
            args: [testId]
        });
        const questions = [];
        for (const question of questionsResult.rows) {
            // Get options for each question
            const optionsResult = await client.execute({
                sql: 'SELECT * FROM options WHERE question_id = ?',
                args: [question.id]
            });
            questions.push({
                ...question,
                options: optionsResult.rows
            });
        }
        return {
            ...test,
            questions: questions
        };
    }
    catch (error) {
        console.error('Error getting test with questions:', error);
        throw error;
    }
}
// Function to save test result
async function saveTestResult(resultData) {
    try {
        // First, get the test details to store with the result
        let testTitle = 'Unknown Test';
        let testSubject = 'Unknown Subject';
        let testMaxMarks = resultData.max_marks || 0;
        try {
            const testDetails = await client.execute({
                sql: 'SELECT title, subject, max_marks FROM tests WHERE id = ?',
                args: [resultData.test_id]
            });
            if (testDetails.rows.length > 0) {
                const test = testDetails.rows[0];
                testTitle = test.title || 'Unknown Test';
                testSubject = test.subject || 'Unknown Subject';
                testMaxMarks = test.max_marks || resultData.max_marks || 0;
            }
        }
        catch (testError) {
            console.warn('Could not fetch test details, using defaults:', testError);
        }
        const result = await client.execute({
            sql: 'INSERT INTO test_results (test_id, student_id, student_name, score, correct_answers, total_questions, time_taken, answers, test_title, test_subject, test_max_marks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            args: [
                resultData.test_id,
                resultData.student_id,
                resultData.student_name,
                resultData.score,
                resultData.correct_answers,
                resultData.total_questions,
                resultData.time_taken,
                resultData.answers,
                testTitle,
                testSubject,
                testMaxMarks
            ]
        });
        return result;
    }
    catch (error) {
        console.error('Error saving test result:', error);
        throw error;
    }
}
// Function to get test result by ID
async function getTestResult(resultId) {
    try {
        const result = await client.execute({
            sql: 'SELECT * FROM test_results WHERE id = ?',
            args: [resultId]
        });
        return result.rows[0];
    }
    catch (error) {
        console.error('Error getting test result:', error);
        throw error;
    }
}
// Function to get all results for a test (for ranking)
async function getTestResults(testId) {
    try {
        const result = await client.execute({
            sql: 'SELECT * FROM test_results WHERE test_id = ? ORDER BY score DESC, submitted_at ASC',
            args: [testId]
        });
        return result.rows;
    }
    catch (error) {
        console.error('Error getting test results:', error);
        throw error;
    }
}
// Function to get all test results for a student (including deleted tests)
async function getStudentTestResults(studentId) {
    try {
        const result = await client.execute({
            sql: `SELECT 
                tr.*,
                CASE 
                    WHEN t.id IS NOT NULL THEN t.title 
                    ELSE tr.test_title 
                END as display_title,
                CASE 
                    WHEN t.id IS NOT NULL THEN t.subject 
                    ELSE tr.test_subject 
                END as display_subject,
                CASE 
                    WHEN t.id IS NOT NULL THEN 'active' 
                    ELSE 'deleted' 
                END as test_status
            FROM test_results tr 
            LEFT JOIN tests t ON tr.test_id = t.id 
            WHERE tr.student_id = ? 
            ORDER BY tr.submitted_at DESC`,
            args: [studentId]
        });
        return result.rows;
    }
    catch (error) {
        console.error('Error getting student test results:', error);
        throw error;
    }
}
// Function to get student's rank in a test
async function getStudentRank(testId, resultId) {
    try {
        const results = await getTestResults(testId);
        const rank = results.findIndex((r) => r.id === resultId) + 1;
        return {
            rank: rank,
            totalStudents: results.length
        };
    }
    catch (error) {
        console.error('Error getting student rank:', error);
        throw error;
    }
}
// Function to get performance analytics for all tests
async function getPerformanceAnalytics() {
    try {
        const result = await client.execute(`
            SELECT 
                t.id as test_id,
                t.title,
                t.subject,
                COUNT(DISTINCT tr.student_id) as total_students,
                AVG(tr.score) as avg_score,
                MAX(tr.score) as highest_score,
                MIN(tr.score) as lowest_score
            FROM tests t
            LEFT JOIN test_results tr ON t.id = tr.test_id
            GROUP BY t.id, t.title, t.subject
            ORDER BY t.created_at DESC
        `);
        return result.rows;
    }
    catch (error) {
        console.error('Error getting performance analytics:', error);
        throw error;
    }
}
// Function to get detailed student performance for a specific test
async function getTestPerformanceDetails(testId) {
    try {
        const result = await client.execute({
            sql: `
                SELECT 
                    tr.*,
                    t.title as test_title,
                    t.subject
                FROM test_results tr
                JOIN tests t ON tr.test_id = t.id
                WHERE tr.test_id = ?
                ORDER BY tr.score DESC, tr.submitted_at ASC
            `,
            args: [testId]
        });
        return result.rows;
    }
    catch (error) {
        console.error('Error getting test performance details:', error);
        throw error;
    }
}
// Function to upload study material
async function uploadStudyMaterial(materialData) {
    try {
        const result = await client.execute({
            sql: 'INSERT INTO study_materials (title, description, subject, file_name, file_path, file_type, file_size, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            args: [materialData.title, materialData.description, materialData.subject, materialData.file_name, materialData.file_path, materialData.file_type, materialData.file_size, materialData.uploaded_by]
        });
        return result;
    }
    catch (error) {
        console.error('Error uploading study material:', error);
        throw error;
    }
}
// Function to get all study materials
async function getStudyMaterials() {
    try {
        const result = await client.execute('SELECT * FROM study_materials ORDER BY created_at DESC');
        return result.rows;
    }
    catch (error) {
        console.error('Error fetching study materials:', error);
        return [];
    }
}
// Function to delete study material
async function deleteStudyMaterial(id) {
    try {
        const result = await client.execute({
            sql: 'DELETE FROM study_materials WHERE id = ?',
            args: [id]
        });
        return result;
    }
    catch (error) {
        console.error('Error deleting study material:', error);
        throw error;
    }
}
// Function to get tests with scheduling status for students
async function getTestsWithStatus() {
    try {
        const result = await client.execute(`
            SELECT 
                id, 
                title, 
                description, 
                subject, 
                duration, 
                scheduled_date,
                start_time,
                end_time,
                created_at
            FROM tests 
            ORDER BY created_at DESC
        `);
        // Calculate status in JavaScript with proper timezone handling
        const testsWithStatus = result.rows.map((test) => {
            let status = 'available';
            if (test.start_time && test.end_time) {
                // Get current time in IST (UTC+5:30)
                const now = new Date();
                const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
                const nowIST = new Date(now.getTime() + (now.getTimezoneOffset() * 60 * 1000) + istOffset);
                // Parse times as IST
                const startTime = new Date(test.start_time);
                const endTime = new Date(test.end_time);
                if (nowIST < startTime) {
                    status = 'scheduled';
                }
                else if (nowIST >= startTime && nowIST <= endTime) {
                    status = 'live';
                }
                else if (nowIST > endTime) {
                    status = 'ended';
                }
            }
            return Object.assign({}, test, {
                status: status
            });
        });
        return testsWithStatus;
    }
    catch (error) {
        console.error('Error fetching tests with status:', error);
        return [];
    }
}

import { createClient } from '@libsql/client';

// Initialize Turso client with your actual database credentials
// Note: Using libsql:// protocol directly
const client = createClient({
    url: 'libsql://photon-photon7.turso.io', // Simplified URL
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTkxNjI3NTYsImlkIjoiNTYzZGE0NTQtNTA2NC00MjViLWFlMDktZjhhZDBlMGEyODI1IiwicmlkIjoiZGE2OGMwNjUtMWU4OC00MDE0LWEyNTYtMjhlZTJhYWIyMDRhIn0.J5_dnmOumr0DmOWwzkqG-bEUg5ZngUB-i-c6rnL6vikvv6kMOryKLCiODEC3iQiz0XxDEpQeZRt0seqSu3f1DA'
});

// Function to initialize the database
export async function initializeDatabase() {
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
                created_by INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES users(id)
            )
        `);
        
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
                submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
            )
        `);
        
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
    } catch (error) {
        console.error('Error initializing database:', error);
        console.log('Continuing without database connection...');
    }
}

// Function to get all courses
export async function getCourses() {
    try {
        const result = await client.execute('SELECT * FROM courses');
        return result.rows;
    } catch (error) {
        console.error('Error fetching courses:', error);
        return [];
    }
}

// Function to get all testimonials
export async function getTestimonials() {
    try {
        const result = await client.execute('SELECT * FROM testimonials');
        return result.rows;
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        return [];
    }
}

// Function to add a new student
export async function addStudent(studentData: { name: string; email: string; phone: string; course: string; message: string }) {
    try {
        const result = await client.execute({
            sql: 'INSERT INTO students (name, email, phone, course, message) VALUES (?, ?, ?, ?, ?)',
            args: [studentData.name, studentData.email, studentData.phone, studentData.course, studentData.message]
        });
        return result;
    } catch (error) {
        console.error('Error adding student:', error);
        return null;
    }
}

// Function to register a new user with all required fields
export async function registerUser(userData: { 
    photon_id: string; 
    name: string; 
    phone: string; 
    class: string; 
    course: string; 
    email: string; 
    password: string 
}) {
    try {
        console.log('Attempting to insert user into database:', userData);
        
        const result = await client.execute({
            sql: 'INSERT INTO users (photon_id, name, phone, class, course, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
            args: [userData.photon_id, userData.name, userData.phone, userData.class, userData.course, userData.email, userData.password]
        });
        
        console.log('Database insertion result:', result);
        return result;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error; // Re-throw the error so it can be handled by the caller
    }
}

// Function to authenticate a user by photon_id and password
export async function authenticateUser(photon_id: string, password: string) {
    try {
        const result = await client.execute({
            sql: 'SELECT * FROM users WHERE photon_id = ?',
            args: [photon_id]
        });
        
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const storedPassword = user.password as string;
            
            // Check if password is hashed (starts with $2b$ for bcrypt)
            if (storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2a$')) {
                // Use bcrypt to compare
                const bcrypt = require('bcrypt');
                const isMatch = await bcrypt.compare(password, storedPassword);
                if (isMatch) {
                    return user;
                }
            } else {
                // Plain text comparison for backwards compatibility
                if (storedPassword === password) {
                    return user;
                }
            }
        }
        return null;
    } catch (error) {
        console.error('Error authenticating user:', error);
        return null;
    }
}

// Function to add a new faculty member
export async function addFaculty(facultyData: { 
    name: string; 
    qualification?: string; 
    subject: string; 
    experience?: number 
}) {
    try {
        const result = await client.execute({
            sql: 'INSERT INTO faculty (name, qualification, subject, experience) VALUES (?, ?, ?, ?)',
            args: [facultyData.name, facultyData.qualification || '', facultyData.subject, facultyData.experience || 0]
        });
        return result;
    } catch (error) {
        console.error('Error adding faculty:', error);
        throw error;
    }
}

// Function to get all faculty members
export async function getFaculty() {
    try {
        const result = await client.execute('SELECT * FROM faculty');
        return result.rows;
    } catch (error) {
        console.error('Error fetching faculty:', error);
        return [];
    }
}

// Function to add a faculty user (for login)
export async function addFacultyUser(userData: { 
    photon_id: string; 
    name: string; 
    password: string;
    subject: string;
    qualification?: string;
    experience?: number;
}) {
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
    } catch (error) {
        console.error('Error adding faculty user:', error);
        throw error;
    }
}

// Function to clear all users from the database
export async function clearAllUsers() {
    try {
        const result = await client.execute({
            sql: 'DELETE FROM users'
        });
        
        console.log('Cleared all users from database. Rows affected:', result.rowsAffected);
        return result;
    } catch (error) {
        console.error('Error clearing users:', error);
        return null;
    }
}

// Function to create a new test
export async function createTest(testData: { 
    title: string; 
    description: string; 
    subject: string; 
    duration: number; 
    scheduled_date?: string;
    start_time?: string;
    end_time?: string;
    test_type?: string;
    max_marks?: number;
    created_by: number 
}) {
    try {
        const result = await client.execute({
            sql: 'INSERT INTO tests (title, description, subject, duration, scheduled_date, start_time, end_time, test_type, max_marks, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            args: [testData.title, testData.description, testData.subject, testData.duration, testData.scheduled_date || null, testData.start_time || null, testData.end_time || null, testData.test_type || 'Other', testData.max_marks || 0, testData.created_by]
        });
        return result;
    } catch (error) {
        console.error('Error creating test:', error);
        throw error;
    }
}

// Function to add a question to a test
export async function addQuestion(questionData: { 
    test_id: number; 
    question_text: string; 
    explanation: string; 
    difficulty: string;
    diagram?: string;
}) {
    try {
        const result = await client.execute({
            sql: 'INSERT INTO questions (test_id, question_text, explanation, difficulty, diagram) VALUES (?, ?, ?, ?, ?)',
            args: [questionData.test_id, questionData.question_text, questionData.explanation, questionData.difficulty, questionData.diagram || null]
        });
        return result;
    } catch (error) {
        console.error('Error adding question:', error);
        throw error;
    }
}

// Function to add an option to a question
export async function addOption(optionData: { 
    question_id: number; 
    option_text: string; 
    is_correct: boolean 
}) {
    try {
        const result = await client.execute({
            sql: 'INSERT INTO options (question_id, option_text, is_correct) VALUES (?, ?, ?)',
            args: [optionData.question_id, optionData.option_text, optionData.is_correct ? 1 : 0]
        });
        return result;
    } catch (error) {
        console.error('Error adding option:', error);
        throw error;
    }
}

// Function to get all tests
export async function getAllTests() {
    try {
        const result = await client.execute('SELECT * FROM tests ORDER BY created_at DESC');
        return result.rows;
    } catch (error) {
        console.error('Error getting tests:', error);
        throw error;
    }
}

// Function to get test with questions and options
export async function getTestWithQuestions(testId: number) {
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
    } catch (error) {
        console.error('Error getting test with questions:', error);
        throw error;
    }
}

// Function to save test result
export async function saveTestResult(resultData: {
    test_id: number;
    student_id: number;
    student_name: string;
    score: number;
    correct_answers: number;
    total_questions: number;
    time_taken: number;
    answers: string;
    numerical_score?: number;
    wrong_answers?: number;
    max_marks?: number;
}) {
    try {
        const result = await client.execute({
            sql: 'INSERT INTO test_results (test_id, student_id, student_name, score, correct_answers, total_questions, time_taken, answers, numerical_score, wrong_answers, max_marks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            args: [
                resultData.test_id, 
                resultData.student_id, 
                resultData.student_name, 
                resultData.score, 
                resultData.correct_answers, 
                resultData.total_questions, 
                resultData.time_taken, 
                resultData.answers,
                resultData.numerical_score || 0,
                resultData.wrong_answers || 0,
                resultData.max_marks || 0
            ]
        });
        return result;
    } catch (error) {
        console.error('Error saving test result:', error);
        throw error;
    }
}

// Function to get test result by ID
export async function getTestResult(resultId: number) {
    try {
        const result = await client.execute({
            sql: 'SELECT * FROM test_results WHERE id = ?',
            args: [resultId]
        });
        return result.rows[0];
    } catch (error) {
        console.error('Error getting test result:', error);
        throw error;
    }
}

// Function to get all results for a test (for ranking)
export async function getTestResults(testId: number) {
    try {
        const result = await client.execute({
            sql: 'SELECT * FROM test_results WHERE test_id = ? ORDER BY score DESC, submitted_at ASC',
            args: [testId]
        });
        return result.rows;
    } catch (error) {
        console.error('Error getting test results:', error);
        throw error;
    }
}

// Function to get student's rank in a test
export async function getStudentRank(testId: number, resultId: number) {
    try {
        const results = await getTestResults(testId);
        const rank = results.findIndex((r: any) => r.id === resultId) + 1;
        return {
            rank: rank,
            totalStudents: results.length
        };
    } catch (error) {
        console.error('Error getting student rank:', error);
        throw error;
    }
}

// Function to get performance analytics for all tests
export async function getPerformanceAnalytics() {
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
    } catch (error) {
        console.error('Error getting performance analytics:', error);
        throw error;
    }
}

// Function to get detailed student performance for a specific test
export async function getTestPerformanceDetails(testId: number) {
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
    } catch (error) {
        console.error('Error getting test performance details:', error);
        throw error;
    }
}

// Function to upload study material
export async function uploadStudyMaterial(materialData: {
    title: string;
    description: string;
    subject: string;
    file_name: string;
    file_path: string;
    file_type: string;
    file_size: number;
    uploaded_by: number;
}) {
    try {
        const result = await client.execute({
            sql: 'INSERT INTO study_materials (title, description, subject, file_name, file_path, file_type, file_size, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            args: [materialData.title, materialData.description, materialData.subject, materialData.file_name, materialData.file_path, materialData.file_type, materialData.file_size, materialData.uploaded_by]
        });
        return result;
    } catch (error) {
        console.error('Error uploading study material:', error);
        throw error;
    }
}

// Function to get all study materials
export async function getStudyMaterials() {
    try {
        const result = await client.execute('SELECT * FROM study_materials ORDER BY created_at DESC');
        return result.rows;
    } catch (error) {
        console.error('Error fetching study materials:', error);
        return [];
    }
}

// Function to delete study material
export async function deleteStudyMaterial(id: number) {
    try {
        const result = await client.execute({
            sql: 'DELETE FROM study_materials WHERE id = ?',
            args: [id]
        });
        return result;
    } catch (error) {
        console.error('Error deleting study material:', error);
        throw error;
    }
}

// Function to get tests with scheduling status for students
export async function getTestsWithStatus() {
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
        
        // Calculate status in JavaScript to handle timezones correctly
        const testsWithStatus = result.rows.map((test: any) => {
            let status = 'available';
            
            if (test.start_time && test.end_time) {
                const now = new Date();
                const startTime = new Date(test.start_time);
                const endTime = new Date(test.end_time);
                
                if (now < startTime) {
                    status = 'scheduled';
                } else if (now >= startTime && now <= endTime) {
                    status = 'live';
                } else if (now > endTime) {
                    status = 'ended';
                }
            }
            
            return Object.assign({}, test, {
                status: status
            });
        });
        
        return testsWithStatus;
    } catch (error) {
        console.error('Error fetching tests with status:', error);
        return [];
    }
}

// Export the client for direct usage if needed
export { client };
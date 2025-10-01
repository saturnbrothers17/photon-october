"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var client_1 = require("@libsql/client");
// Initialize Turso client with your actual database credentials
// Note: Using libsql:// protocol directly
var client = (0, client_1.createClient)({
    url: 'libsql://photon-photon7.turso.io', // Simplified URL
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTkxNjI3NTYsImlkIjoiNTYzZGE0NTQtNTA2NC00MjViLWFlMDktZjhhZDBlMGEyODI1IiwicmlkIjoiZGE2OGMwNjUtMWU4OC00MDE0LWEyNTYtMjhlZTJhYWIyMDRhIn0.J5_dnmOumr0DmOWwzkqG-bEUg5ZngUB-i-c6rnL6vikvv6kMOryKLCiODEC3iQiz0XxDEpQeZRt0seqSu3f1DA'
});
exports.client = client;
// Function to initialize the database
function initializeDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var testResult, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    console.log('Attempting to connect to database...');
                    return [4 /*yield*/, client.execute('SELECT 1')];
                case 1:
                    testResult = _a.sent();
                    console.log('Database connection test successful:', testResult);
                    // Create tables if they don't exist
                    return [4 /*yield*/, client.execute("\n            CREATE TABLE IF NOT EXISTS students (\n                id INTEGER PRIMARY KEY AUTOINCREMENT,\n                name TEXT NOT NULL,\n                email TEXT UNIQUE NOT NULL,\n                phone TEXT,\n                course TEXT,\n                message TEXT,\n                enrollment_date DATETIME DEFAULT CURRENT_TIMESTAMP\n            )\n        ")];
                case 2:
                    // Create tables if they don't exist
                    _a.sent();
                    return [4 /*yield*/, client.execute("\n            CREATE TABLE IF NOT EXISTS courses (\n                id INTEGER PRIMARY KEY AUTOINCREMENT,\n                name TEXT NOT NULL,\n                description TEXT,\n                duration TEXT,\n                fee REAL\n            )\n        ")];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, client.execute("\n            CREATE TABLE IF NOT EXISTS faculty (\n                id INTEGER PRIMARY KEY AUTOINCREMENT,\n                name TEXT NOT NULL,\n                qualification TEXT,\n                subject TEXT,\n                experience INTEGER\n            )\n        ")];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, client.execute("\n            CREATE TABLE IF NOT EXISTS testimonials (\n                id INTEGER PRIMARY KEY AUTOINCREMENT,\n                student_name TEXT NOT NULL,\n                message TEXT,\n                course TEXT,\n                date DATETIME DEFAULT CURRENT_TIMESTAMP\n            )\n        ")];
                case 5:
                    _a.sent();
                    // Create users table if it doesn't exist (without dropping existing data)
                    return [4 /*yield*/, client.execute("\n            CREATE TABLE IF NOT EXISTS users (\n                id INTEGER PRIMARY KEY AUTOINCREMENT,\n                photon_id TEXT UNIQUE NOT NULL,\n                name TEXT NOT NULL,\n                phone TEXT,\n                class TEXT,\n                course TEXT,\n                email TEXT UNIQUE NOT NULL,\n                password TEXT NOT NULL,\n                created_at DATETIME DEFAULT CURRENT_TIMESTAMP\n            )\n        ")];
                case 6:
                    // Create users table if it doesn't exist (without dropping existing data)
                    _a.sent();
                    console.log('Database initialized successfully');
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _a.sent();
                    console.error('Error initializing database:', error_1);
                    console.log('Continuing without database connection...');
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
// Function to get all courses
function getCourses() {
    return __awaiter(this, void 0, void 0, function () {
        var result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.execute('SELECT * FROM courses')];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.rows];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error fetching courses:', error_2);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Function to get all testimonials
function getTestimonials() {
    return __awaiter(this, void 0, void 0, function () {
        var result, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.execute('SELECT * FROM testimonials')];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.rows];
                case 2:
                    error_3 = _a.sent();
                    console.error('Error fetching testimonials:', error_3);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Function to add a new student
function addStudent(studentData) {
    return __awaiter(this, void 0, void 0, function () {
        var result, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.execute({
                            sql: 'INSERT INTO students (name, email, phone, course, message) VALUES (?, ?, ?, ?, ?)',
                            args: [studentData.name, studentData.email, studentData.phone, studentData.course, studentData.message]
                        })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
                case 2:
                    error_4 = _a.sent();
                    console.error('Error adding student:', error_4);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Function to register a new user with all required fields
function registerUser(userData) {
    return __awaiter(this, void 0, void 0, function () {
        var result, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log('Attempting to insert user into database:', userData);
                    return [4 /*yield*/, client.execute({
                            sql: 'INSERT INTO users (photon_id, name, phone, class, course, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
                            args: [userData.photon_id, userData.name, userData.phone, userData.class, userData.course, userData.email, userData.password]
                        })];
                case 1:
                    result = _a.sent();
                    console.log('Database insertion result:', result);
                    return [2 /*return*/, result];
                case 2:
                    error_5 = _a.sent();
                    console.error('Error registering user:', error_5);
                    throw error_5; // Re-throw the error so it can be handled by the caller
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Function to authenticate a user by photon_id and password
function authenticateUser(photon_id, password) {
    return __awaiter(this, void 0, void 0, function () {
        var result, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.execute({
                            sql: 'SELECT * FROM users WHERE photon_id = ? AND password = ?',
                            args: [photon_id, password]
                        })];
                case 1:
                    result = _a.sent();
                    if (result.rows.length > 0) {
                        return [2 /*return*/, result.rows[0]];
                    }
                    return [2 /*return*/, null];
                case 2:
                    error_6 = _a.sent();
                    console.error('Error authenticating user:', error_6);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Function to add a new faculty member
function addFaculty(facultyData) {
    return __awaiter(this, void 0, void 0, function () {
        var result, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.execute({
                            sql: 'INSERT INTO faculty (name, qualification, subject, experience) VALUES (?, ?, ?, ?)',
                            args: [facultyData.name, facultyData.qualification || '', facultyData.subject, facultyData.experience || 0]
                        })];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
                case 2:
                    error_7 = _a.sent();
                    console.error('Error adding faculty:', error_7);
                    throw error_7;
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Function to get all faculty members
function getFaculty() {
    return __awaiter(this, void 0, void 0, function () {
        var result, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.execute('SELECT * FROM faculty')];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.rows];
                case 2:
                    error_8 = _a.sent();
                    console.error('Error fetching faculty:', error_8);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Function to add a faculty user (for login)
function addFacultyUser(userData) {
    return __awaiter(this, void 0, void 0, function () {
        var result, error_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    // First add to faculty table
                    return [4 /*yield*/, addFaculty({
                            name: userData.name,
                            subject: userData.subject,
                            qualification: userData.qualification,
                            experience: userData.experience
                        })];
                case 1:
                    // First add to faculty table
                    _a.sent();
                    return [4 /*yield*/, client.execute({
                            sql: 'INSERT INTO users (photon_id, name, password, email, phone, class, course) VALUES (?, ?, ?, ?, ?, ?, ?)',
                            args: [userData.photon_id, userData.name, userData.password, "".concat(userData.photon_id, "@photoncoaching.com"), '', '', "Faculty - ".concat(userData.subject)]
                        })];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, result];
                case 3:
                    error_9 = _a.sent();
                    console.error('Error adding faculty user:', error_9);
                    throw error_9;
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Function to clear all users from the database
function clearAllUsers() {
    return __awaiter(this, void 0, void 0, function () {
        var result, error_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.execute({
                            sql: 'DELETE FROM users'
                        })];
                case 1:
                    result = _a.sent();
                    console.log('Cleared all users from database. Rows affected:', result.rowsAffected);
                    return [2 /*return*/, result];
                case 2:
                    error_10 = _a.sent();
                    console.error('Error clearing users:', error_10);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}

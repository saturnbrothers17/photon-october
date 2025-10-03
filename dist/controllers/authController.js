"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFromCookie = exports.getUser = exports.requireAuthAPI = exports.requireAuth = exports.handleLogout = exports.handleRegister = exports.handleLogin = exports.handleFacultyLogin = exports.showFacultyLogin = exports.showRegister = exports.showLogin = void 0;
const database_1 = require("../database");
// Simple cookie-based authentication for demo purposes
const setUserCookie = (res, photon_id, name, role = 'student') => {
    res.cookie('user', JSON.stringify({ photon_id, name, role }), { maxAge: 900000, httpOnly: true });
};
const clearUserCookie = (res) => {
    res.clearCookie('user');
};
const getUserFromCookie = (req) => {
    if (req.cookies && req.cookies.user) {
        try {
            return JSON.parse(req.cookies.user);
        }
        catch (e) {
        }
    }
    return null;
};
exports.getUserFromCookie = getUserFromCookie;
const showLogin = (req, res) => {
    const redirect = req.query.redirect || '';
    res.render('auth/login', {
        title: 'Login - Photon Coaching',
        error: null,
        redirect: redirect
    });
};
exports.showLogin = showLogin;
const showRegister = (req, res) => {
    res.render('auth/register', {
        title: 'Register - Photon Coaching',
    });
};
exports.showRegister = showRegister;
const showFacultyLogin = (req, res) => {
    const redirect = req.query.redirect || '';
    res.render('auth/faculty-login', {
        title: 'Faculty Login - Photon Coaching',
        error: null,
        redirect: redirect
    });
};
exports.showFacultyLogin = showFacultyLogin;
const handleFacultyLogin = async (req, res) => {
    const { faculty_id, password, redirect } = req.body;
    try {
        // Authenticate faculty against database
        const user = await (0, database_1.authenticateUser)(faculty_id, password);
        if (user) {
            // Check if user is faculty (role should be 'faculty')
            const userRole = user.role || 'student';
            if (userRole !== 'faculty') {
                return res.render('auth/faculty-login', {
                    title: 'Faculty Login - Photon Coaching',
                    error: 'This is the faculty login. Please use the Student Corner login.',
                    redirect: redirect || ''
                });
            }
            // Set cookie to indicate user is logged in with role
            setUserCookie(res, user.photon_id, user.name, 'faculty');
            // Check if a specific redirect URL was provided
            if (redirect) {
                return res.redirect(redirect);
            }
            // Default redirect to teacher dashboard
            return res.redirect('/teacher-dashboard');
        }
        else {
            res.render('auth/faculty-login', {
                title: 'Faculty Login - Photon Coaching',
                error: 'Invalid Faculty ID or Password',
                redirect: redirect || ''
            });
        }
    }
    catch (error) {
        console.error('Faculty login error:', error);
        res.render('auth/faculty-login', {
            title: 'Faculty Login - Photon Coaching',
            error: 'An error occurred during login. Please try again.',
            redirect: redirect || ''
        });
    }
};
exports.handleFacultyLogin = handleFacultyLogin;
const handleLogin = async (req, res) => {
    const { photon_id, password, redirect } = req.body;
    try {
        // Authenticate user against database using photon_id and password
        const user = await (0, database_1.authenticateUser)(photon_id, password);
        if (user) {
            // Check if user is a student (role should be 'student' or null/undefined for existing users)
            const userRole = user.role || 'student';
            if (userRole !== 'student') {
                return res.render('auth/login', {
                    title: 'Login - Photon Coaching',
                    error: 'This is the student login. Please use the Faculty Portal login.',
                    redirect: redirect || ''
                });
            }
            // Set cookie to indicate user is logged in with role
            setUserCookie(res, user.photon_id, user.name, 'student');
            // Check if a specific redirect URL was provided
            if (redirect) {
                return res.redirect(redirect);
            }
            // Default redirect to student corner
            return res.redirect('/student-corner');
        }
        else {
            res.render('auth/login', {
                title: 'Login - Photon Coaching',
                error: 'Invalid Photon ID or Password',
                redirect: redirect || ''
            });
        }
    }
    catch (error) {
        console.error('Login error:', error);
        res.render('auth/login', {
            title: 'Login - Photon Coaching',
            error: 'An error occurred during login. Please try again.',
            redirect: redirect || ''
        });
    }
};
exports.handleLogin = handleLogin;
const handleRegister = async (req, res) => {
    const { photon_id, name, phone, class: studentClass, course, email, password, confirmPassword } = req.body;
    // Log the received form data for debugging
    console.log('=== REGISTRATION ATTEMPT ===');
    console.log('Received registration form data:', req.body);
    console.log('Parsed fields:', { photon_id, name, phone, studentClass, course, email, password, confirmPassword });
    // Basic validation
    if (!photon_id || !name || !phone || !studentClass || !course || !email || !password || !confirmPassword) {
        const missingFields = [];
        if (!photon_id)
            missingFields.push('photon_id');
        if (!name)
            missingFields.push('name');
        if (!phone)
            missingFields.push('phone');
        if (!studentClass)
            missingFields.push('class');
        if (!course)
            missingFields.push('course');
        if (!email)
            missingFields.push('email');
        if (!password)
            missingFields.push('password');
        if (!confirmPassword)
            missingFields.push('confirmPassword');
        console.log('Validation failed - missing required fields:', missingFields);
        return res.render('auth/register', {
            title: 'Register - Photon Coaching',
            error: 'All fields are required. Missing: ' + missingFields.join(', ')
        });
    }
    if (password !== confirmPassword) {
        console.log('Validation failed - passwords do not match');
        return res.render('auth/register', {
            title: 'Register - Photon Coaching',
            error: 'Passwords do not match'
        });
    }
    try {
        // Log the data we're trying to insert for debugging
        console.log('Attempting to register user with data:', { photon_id, name, phone, studentClass, course, email });
        // Register new user in database with all required fields
        const result = await (0, database_1.registerUser)({ photon_id, name, phone, class: studentClass, course, email, password });
        console.log('Database registration result:', result);
        if (result && result.rowsAffected > 0) {
            console.log('User registered successfully');
            // Redirect to login page with success message
            res.render('auth/login', {
                title: 'Login - Photon Coaching',
                error: null,
                success: 'Registration successful! Please login with your Photon ID and Password.',
                redirect: ''
            });
        }
        else {
            console.log('User registration failed - no rows affected');
            res.render('auth/register', {
                title: 'Register - Photon Coaching',
                error: 'Registration failed. Please try again.'
            });
        }
    }
    catch (error) {
        console.error('Registration error:', error);
        // Provide more specific error messages
        let errorMessage = 'An error occurred during registration. Please try again.';
        // Check for SQLite constraint errors
        if (error && typeof error === 'object') {
            // Handle nested error structure from libsql
            let errorMessageString = '';
            // Get the error message from the appropriate location
            // Check the main error object first
            if (error.message) {
                errorMessageString = error.message;
            }
            // Check for Symbol cause property (libsql uses Symbol for cause)
            else {
                // Look for Symbol properties
                const symbols = Object.getOwnPropertySymbols(error);
                for (const symbol of symbols) {
                    if (error[symbol] && error[symbol].proto && error[symbol].proto.message) {
                        errorMessageString = error[symbol].proto.message;
                        break;
                    }
                }
            }
            // Debug logging to see what error message we're getting
            console.log('Error message string for processing:', errorMessageString);
            // Check if it's a constraint error
            if (errorMessageString && (errorMessageString.includes('SQLITE_CONSTRAINT') || errorMessageString.includes('UNIQUE constraint failed'))) {
                // Provide specific error messages based on the constraint
                console.log('Constraint error detected');
                errorMessage = 'User already registered. Please login using your Photon ID and Password.';
                console.log('Setting duplicate user error message');
            }
            else {
                console.log('Not a constraint error or message not matching expected patterns');
            }
        }
        else {
            console.log('Error is not an object or is null');
        }
        console.log('Final error message to display:', errorMessage);
        res.render('auth/register', {
            title: 'Register - Photon Coaching',
            error: errorMessage
        });
    }
};
exports.handleRegister = handleRegister;
const handleLogout = (req, res) => {
    // Clear cookie
    clearUserCookie(res);
    res.redirect('/');
};
exports.handleLogout = handleLogout;
const requireAuth = (req, res, next) => {
    const user = getUserFromCookie(req);
    if (user) {
        req.user = user;
        next();
    }
    else {
        // Check if this is an API request (JSON expected)
        const isApiRequest = req.path.includes('/api/') || req.headers.accept?.includes('application/json');
        if (isApiRequest) {
            return res.status(401).json({ error: 'Unauthorized. Please log in.' });
        }
        else {
            res.redirect('/auth/login');
        }
    }
};
exports.requireAuth = requireAuth;
// API-specific auth middleware that always returns JSON
const requireAuthAPI = (req, res, next) => {
    const user = getUserFromCookie(req);
    if (user) {
        req.user = user;
        next();
    }
    else {
        return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }
};
exports.requireAuthAPI = requireAuthAPI;
const getUser = (req) => {
    return getUserFromCookie(req);
};
exports.getUser = getUser;

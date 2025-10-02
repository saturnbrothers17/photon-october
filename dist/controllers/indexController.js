"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIndexPage = void 0;
const database_1 = require("../database");
const authController_1 = require("./authController");
const getIndexPage = async (req, res) => {
    try {
        // Get user information from cookie
        const user = (0, authController_1.getUserFromCookie)(req);
        // In a real application, you would fetch this data from the database
        const courses = await (0, database_1.getCourses)();
        const testimonials = await (0, database_1.getTestimonials)();
        res.render('index', {
            title: 'Photon Coaching - Best IIT JEE & NEET Coaching Institute in Varanasi',
            description: 'Join Varanasi\'s leading institute for JEE (Main + Advanced) & NEET-UG. We are now enrolling for both Online & Offline batches for Class 11, 12, and Droppers.',
            courses: courses,
            testimonials: testimonials,
            user: user // Pass user information to the view
        });
    }
    catch (error) {
        console.error('Error fetching data for index page:', error);
        res.render('index', {
            title: 'Photon Coaching - Best IIT JEE & NEET Coaching Institute in Varanasi',
            description: 'Join Varanasi\'s leading institute for JEE (Main + Advanced) & NEET-UG. We are now enrolling for both Online & Offline batches for Class 11, 12, and Droppers.',
            courses: [],
            testimonials: [],
            user: null // Pass null user information to the view
        });
    }
};
exports.getIndexPage = getIndexPage;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoursesPage = void 0;
const database_1 = require("../database");
const getCoursesPage = async (req, res) => {
    try {
        const courses = await (0, database_1.getCourses)();
        res.render('courses', {
            title: 'Our Courses - Photon Coaching',
            description: 'Explore our comprehensive courses for JEE and NEET preparation.',
            courses: courses
        });
    }
    catch (error) {
        console.error('Error fetching courses:', error);
        res.render('courses', {
            title: 'Our Courses - Photon Coaching',
            description: 'Explore our comprehensive courses for JEE and NEET preparation.',
            courses: []
        });
    }
};
exports.getCoursesPage = getCoursesPage;

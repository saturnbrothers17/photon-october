import { Request, Response } from 'express';
import { getCourses } from '../database';

export const getCoursesPage = async (req: Request, res: Response) => {
    try {
        const courses = await getCourses();
        
        res.render('courses', {
            title: 'Our Courses - Photon Coaching',
            description: 'Explore our comprehensive courses for JEE and NEET preparation.',
            courses: courses
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.render('courses', {
            title: 'Our Courses - Photon Coaching',
            description: 'Explore our comprehensive courses for JEE and NEET preparation.',
            courses: []
        });
    }
};
import { Request, Response } from 'express';
import { getCourses, getTestimonials } from '../database';
import { getUserFromCookie } from './authController';

export const getIndexPage = async (req: Request, res: Response) => {
    try {
        // Get user information from cookie
        const user = getUserFromCookie(req);
        
        // In a real application, you would fetch this data from the database
        const courses = await getCourses();
        const testimonials = await getTestimonials();
        
        res.render('index', {
            title: 'Photon Coaching - Best IIT JEE & NEET Coaching Institute in Varanasi',
            description: 'Join Varanasi\'s leading institute for JEE (Main + Advanced) & NEET-UG. We are now enrolling for both Online & Offline batches for Class 11, 12, and Droppers.',
            courses: courses,
            testimonials: testimonials,
            user: user // Pass user information to the view
        });
    } catch (error) {
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
import { Request, Response } from 'express';
import { addStudent } from '../database';

export const getContactPage = async (req: Request, res: Response) => {
    // If it's a POST request, handle form submission
    if (req.method === 'POST') {
        try {
            const { name, email, phone, course, message } = req.body;
            
            // Add student to database
            const result = await addStudent({ name, email, phone, course, message });
            
            if (result) {
                res.render('contact', {
                    title: 'Contact Us - Photon Coaching',
                    description: 'Get in touch with us for admissions and other queries.',
                    message: 'Thank you for your inquiry! We will get back to you soon.',
                    messageType: 'success'
                });
            } else {
                res.render('contact', {
                    title: 'Contact Us - Photon Coaching',
                    description: 'Get in touch with us for admissions and other queries.',
                    message: 'There was an error processing your request. Please try again.',
                    messageType: 'error'
                });
            }
        } catch (error) {
            console.error('Error adding student:', error);
            res.render('contact', {
                title: 'Contact Us - Photon Coaching',
                description: 'Get in touch with us for admissions and other queries.',
                message: 'There was an error processing your request. Please try again.',
                messageType: 'error'
            });
        }
    } else {
        // For GET requests, show the contact form
        res.render('contact', {
            title: 'Contact Us - Photon Coaching',
            description: 'Get in touch with us for admissions and other queries.',
            message: null,
            messageType: null
        });
    }
};
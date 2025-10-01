import { client } from './database';

async function seedDatabase() {
    try {
        // Insert sample courses
        await client.execute({
            sql: `INSERT INTO courses (name, description, duration, fee) VALUES 
                (?, ?, ?, ?),
                (?, ?, ?, ?),
                (?, ?, ?, ?)`,
            args: [
                'JEE Coaching (Advanced)', 
                'A comprehensive program designed to tackle the toughest problems in the JEE Advanced syllabus for engineering aspirants in Varanasi.', 
                '2 years', 
                120000,
                
                'NEET Coaching for Medical', 
                'In-depth coverage of the complete NEET Biology, Physics, and Chemistry syllabus with a focus on conceptual understanding.', 
                '2 years', 
                110000,
                
                'Foundation Course (Class IX & X)', 
                'Build a strong base in Science and Mathematics to excel in future competitive exams right here in Varanasi.', 
                '2 years', 
                80000
            ]
        });
        
        // Insert sample testimonials
        await client.execute({
            sql: `INSERT INTO testimonials (student_name, message, course) VALUES 
                (?, ?, ?),
                (?, ?, ?)`,
            args: [
                'Anjali Singh', 
                'The faculty at PHOTON is exceptional. Their guidance was pivotal in my journey to cracking IIT.', 
                'JEE Coaching (Advanced)',
                
                'Rahul Kanwar', 
                'Thanks to the structured curriculum and regular mock tests, I could excel in my JEE preparation.', 
                'JEE Coaching (Advanced)'
            ]
        });
        
        // Insert sample faculty
        await client.execute({
            sql: `INSERT INTO faculty (name, qualification, subject, experience) VALUES 
                (?, ?, ?, ?),
                (?, ?, ?, ?),
                (?, ?, ?, ?)`,
            args: [
                'Dr. Ramesh Sharma', 
                'IIT Delhi, PhD Physics', 
                'Physics', 
                15,
                
                'Dr. Priya Patel', 
                'AIIMS, MD Biology', 
                'Biology', 
                12,
                
                'Prof. Amit Kumar', 
                'IIT Bombay, MSc Mathematics', 
                'Mathematics', 
                10
            ]
        });
        
        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

// Run the seed function
seedDatabase();
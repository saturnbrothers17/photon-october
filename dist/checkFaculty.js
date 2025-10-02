"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
async function checkFaculty() {
    try {
        // Check if the faculty member was added to the users table
        const result = await database_1.client.execute({
            sql: 'SELECT * FROM users WHERE photon_id = ?',
            args: ['jp7@photon']
        });
        if (result.rows.length > 0) {
            console.log('Faculty member found in database:');
            console.log('Name:', result.rows[0].name);
            console.log('Photon ID:', result.rows[0].photon_id);
            console.log('Subject:', result.rows[0].course);
        }
        else {
            console.log('Faculty member not found in database');
        }
        // Also check the faculty table
        const facultyResult = await database_1.client.execute({
            sql: 'SELECT * FROM faculty WHERE name = ?',
            args: ['Jai Prakash Mishra']
        });
        if (facultyResult.rows.length > 0) {
            console.log('\nFaculty details from faculty table:');
            console.log('Name:', facultyResult.rows[0].name);
            console.log('Subject:', facultyResult.rows[0].subject);
            console.log('Qualification:', facultyResult.rows[0].qualification);
            console.log('Experience:', facultyResult.rows[0].experience);
        }
        else {
            console.log('\nFaculty member not found in faculty table');
        }
    }
    catch (error) {
        console.error('Error checking faculty:', error);
    }
}
// Run the function
checkFaculty();

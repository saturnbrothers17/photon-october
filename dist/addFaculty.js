"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
async function addFacultyMembers() {
    try {
        // Add the first teacher
        const teacher1 = {
            photon_id: 'jp7@photon',
            name: 'Jai Prakash Mishra',
            password: 'jp7@photon', // Same as ID as requested
            subject: 'Physics',
            qualification: 'M.Sc. Physics',
            experience: 10
        };
        const result = await (0, database_1.addFacultyUser)(teacher1);
        console.log('Successfully added faculty member:', teacher1.name);
        console.log('Result:', result);
    }
    catch (error) {
        console.error('Error adding faculty member:', error);
    }
}
// Run the function
addFacultyMembers();

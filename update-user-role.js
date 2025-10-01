const { createClient } = require('@libsql/client');

const client = createClient({
    url: 'libsql://photon-photon7.turso.io',
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTkxNjI3NTYsImlkIjoiNTYzZGE0NTQtNTA2NC00MjViLWFlMDktZjhhZDBlMGEyODI1IiwicmlkIjoiZGE2OGMwNjUtMWU4OC00MDE0LWEyNTYtMjhlZTJhYWIyMDRhIn0.J5_dnmOumr0DmOWwzkqG-bEUg5ZngUB-i-c6rnL6vikvv6kMOryKLCiODEC3iQiz0XxDEpQeZRt0seqSu3f1DA'
});

async function updateUserRole() {
    try {
        console.log('Updating Jai Prakash Mishra to faculty role...\n');
        
        // Update jp7@photon to faculty role
        await client.execute({
            sql: "UPDATE users SET role = 'faculty' WHERE photon_id = ?",
            args: ['jp7@photon']
        });
        
        console.log('✅ Successfully updated!');
        console.log('\nJai Prakash Mishra (jp7@photon) is now a faculty member.');
        console.log('\nYou can now login to Faculty Portal with:');
        console.log('  Faculty ID: jp7@photon');
        console.log('  Password: (your existing password)');
        
        // Show updated user
        const result = await client.execute({
            sql: 'SELECT photon_id, name, role FROM users WHERE photon_id = ?',
            args: ['jp7@photon']
        });
        
        console.log('\nUpdated user details:');
        console.log(`  Photon ID: ${result.rows[0].photon_id}`);
        console.log(`  Name: ${result.rows[0].name}`);
        console.log(`  Role: ${result.rows[0].role}`);
        
    } catch (error) {
        console.error('Error updating user role:', error);
    }
}

updateUserRole();

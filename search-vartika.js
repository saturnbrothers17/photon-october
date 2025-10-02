const { createClient } = require('@libsql/client');

const client = createClient({
    url: 'libsql://photon-photon7.turso.io',
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTkxNjI3NTYsImlkIjoiNTYzZGE0NTQtNTA2NC00MjViLWFlMDktZjhhZDBlMGEyODI1IiwicmlkIjoiZGE2OGMwNjUtMWU4OC00MDE0LWEyNTYtMjhlZTJhYWIyMDRhIn0.J5_dnmOumr0DmOWwzkqG-bEUg5ZngUB-i-c6rnL6vikvv6kMOryKLCiODEC3iQiz0XxDEpQeZRt0seqSu3f1DA'
});

async function searchVartika() {
    try {
        console.log('Searching for user "vartika tripathi" in database...\n');
        
        // Search for user with name containing "vartika" (case-insensitive)
        const result = await client.execute({
            sql: 'SELECT * FROM users WHERE LOWER(name) LIKE ?',
            args: ['%vartika%']
        });
        
        if (result.rows.length === 0) {
            console.log('No user found with name containing "vartika"');
            return;
        }
        
        console.log(`Found ${result.rows.length} user(s):\n`);
        
        result.rows.forEach((row, index) => {
            console.log(`User ${index + 1}:`);
            console.log(`  Photon ID: ${row.photon_id}`);
            console.log(`  Name: ${row.name}`);
            console.log(`  Email: ${row.email}`);
            console.log(`  Password: ${row.password}`);
            console.log(`  Role: ${row.role || 'student'}`);
            console.log(`  Created At: ${row.created_at}`);
            console.log('---');
        });
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

searchVartika();

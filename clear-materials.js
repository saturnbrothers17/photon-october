const { createClient } = require('@libsql/client');

const client = createClient({
    url: 'libsql://photon-photon7.turso.io',
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTkxNjI3NTYsImlkIjoiNTYzZGE0NTQtNTA2NC00MjViLWFlMDktZjhhZDBlMGEyODI1IiwicmlkIjoiZGE2OGMwNjUtMWU4OC00MDE0LWEyNTYtMjhlZTJhYWIyMDRhIn0.J5_dnmOumr0DmOWwzkqG-bEUg5ZngUB-i-c6rnL6vikvv6kMOryKLCiODEC3iQiz0XxDEpQeZRt0seqSu3f1DA'
});

async function clearMaterials() {
    try {
        console.log('🗑️  Clearing all study materials from database...\n');
        
        // First, check how many materials exist
        const checkResult = await client.execute('SELECT COUNT(*) as count FROM study_materials');
        const count = checkResult.rows[0].count;
        
        console.log(`Found ${count} material(s) in database`);
        
        if (count === 0) {
            console.log('✅ Database is already empty!');
            return;
        }
        
        // Delete all materials
        const result = await client.execute('DELETE FROM study_materials');
        
        console.log(`\n✅ Successfully deleted ${count} material(s) from database!`);
        console.log('🎉 All study materials have been removed.');
        
    } catch (error) {
        console.error('❌ Error clearing materials:', error.message);
    }
}

clearMaterials();

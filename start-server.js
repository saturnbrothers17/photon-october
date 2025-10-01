const { spawn } = require('child_process');

// Start the server
const server = spawn('node', ['dist/server.js'], { stdio: 'inherit' });

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

server.on('error', (error) => {
  console.error(`Failed to start server: ${error.message}`);
});
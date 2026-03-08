
import { spawn } from 'child_process';
import http from 'http';

console.log('🧪 Starting diagnostic test...');

const server = spawn('node', ['server.js'], {
    cwd: process.cwd(),
    stdio: 'pipe',
    shell: true
});

let serverStarted = false;

server.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(`[SERVER]: ${output.trim()}`);
    
    if (output.includes('Server running on port 5999')) {
        serverStarted = true;
        console.log('✅ Server detected as running. Attempting health check...');
        
        setTimeout(() => {
            http.get('http://localhost:5999/', (res) => {
                console.log(`📡 Health Check status: ${res.statusCode}`);
                console.log('✅ Health Check SUCCESS!');
                // Wait and see if it stays alive
                setTimeout(() => {
                    console.log('✅ Server still alive after 5s. Success.');
                    server.kill('SIGTERM');
                    process.exit(0);
                }, 5000);
            }).on('error', (err) => {
                console.error(`❌ Health Check FAILED: ${err.message}`);
                server.kill('SIGKILL');
                process.exit(1);
            });
        }, 1000);
    }
});

server.stderr.on('data', (data) => {
    console.error(`[SERVER ERROR]: ${data.toString()}`);
});

server.on('close', (code, signal) => {
    console.log(`🔴 Server process closed with code ${code} and signal ${signal}`);
    if (!serverStarted) {
        console.error('❌ Server failed to start correctly.');
        process.exit(1);
    }
});

setTimeout(() => {
    if (!serverStarted) {
        console.error('❌ Timeout: Server did not start within 10s.');
        server.kill('SIGKILL');
        process.exit(1);
    }
}, 10000);

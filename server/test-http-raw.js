import http from 'http';
console.log('--- Raw HTTP Test Start ---');
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
});
server.listen(5002, '127.0.0.1', () => {
    console.log('Raw HTTP Server listening on 5002');
    setTimeout(() => {
        console.log('Shutting down...');
        server.close();
        console.log('--- Raw HTTP Test End ---');
        process.exit(0);
    }, 5000);
});

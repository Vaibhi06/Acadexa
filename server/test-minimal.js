import express from 'express';
const app = express();
const PORT = 5050;

app.get('/', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, '127.0.0.1', () => {
    console.log(`🚀 Minimal server running on http://127.0.0.1:${PORT}`);
});

process.on('exit', (code) => console.log(`👋 Process exiting with code: ${code}`));

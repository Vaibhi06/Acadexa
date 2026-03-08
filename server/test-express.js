import express from 'express';
import cors from 'cors';
const app = express();
console.log('--- Express Test Start ---');
app.use(cors());
app.use(express.json());
app.get('/test', (req, res) => res.json({ ok: true }));
const server = app.listen(5001, '127.0.0.1', () => {
    console.log('Server listening on 5001');
    setTimeout(() => {
        console.log('Shutting down...');
        server.close();
        console.log('--- Express Test End ---');
        process.exit(0);
    }, 5000);
});

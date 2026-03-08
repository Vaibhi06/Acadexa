
import express from 'express';
const app = express();
app.get('/', (req, res) => res.send('OK'));
app.listen(5999, () => console.log('🚀 Minimal server running on 5999'));

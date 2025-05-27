import express from 'express';
import parseRulesRouter from './routes/parseRules.js';

const app = express();
app.use(express.json());

app.use('/ai/parse-rules', parseRulesRouter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`AI Service running on port ${PORT}`);
});
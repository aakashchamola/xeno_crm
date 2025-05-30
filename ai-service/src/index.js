import ort from 'onnxruntime-node';
ort.env.logLevel = 'error';

import express from 'express';
import parseRulesRouter from './routes/parseRules.js';
import suggestMessageRouter from './routes/suggestMessage.js';
import suggestSendTimeRouter from './routes/suggestSendTime.js';
import performanceSummaryRouter from './routes/performanceSummary.js';
import autoTaggingRouter from './routes/autoTagging.js';
import lookAlikeRouter from './routes/lookAlike.js';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/ai/parse-rules', parseRulesRouter);
app.use('/ai/suggest-message', suggestMessageRouter);
app.use('/ai/auto-tag', autoTaggingRouter);
app.use('/ai/lookalike', lookAlikeRouter);
app.use('/ai/performance-summary', performanceSummaryRouter);
app.use('/ai/suggest-send-time', suggestSendTimeRouter);
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Catch-all 404 for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});
// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 8004;
app.listen(PORT, () => {
  console.log(`AI Service running on port ${PORT}`);
});

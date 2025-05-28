import express from 'express';
import parseRulesRouter from './routes/parseRules.js';
import suggestMessageRouter from './routes/suggestMessage.js';
import suggestSendTimeRouter from './routes/suggestSendTime.js';
import performanceSummaryRouter from './routes/performanceSummary.js';
import autoTaggingRouter from './routes/autoTagging.js';
import lookAlikeRouter from './routes/lookAlike.js';

const app = express();
app.use(express.json());

app.use('/ai/parse-rules', parseRulesRouter);
app.use('/ai/suggest-message', suggestMessageRouter);
app.use('/ai/auto-tag', autoTaggingRouter);
app.use('/ai/lookalike', lookAlikeRouter);
app.use('/ai/performance-summary', performanceSummaryRouter);
app.use('/ai/suggest-send-time', suggestSendTimeRouter);
app.get('/health', (req, res) => res.json({ status: 'ok' }));
const PORT = process.env.PORT || 8004;
app.listen(PORT, () => {
  console.log(`AI Service running on port ${PORT}`);
});
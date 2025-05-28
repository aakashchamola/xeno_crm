import express from 'express';
import { performanceSummary } from '../controllers/performaceSummaryController.js';
const router = express.Router();
router.post('/', performanceSummary);
export default router;
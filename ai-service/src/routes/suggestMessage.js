import express from 'express';
import { suggestMessage } from '../controllers/suggesMessageController.js';
const router = express.Router();
router.post('/', suggestMessage);
export default router;
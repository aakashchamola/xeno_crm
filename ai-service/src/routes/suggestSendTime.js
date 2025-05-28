import express from 'express';
import { suggestSendTime } from '../controllers/suggestSendTimeController.js';
const router = express.Router();
router.post('/', suggestSendTime);
export default router;
import express from 'express';
import { suggestMessage } from '../controllers/suggestMessageController.js';
const router = express.Router();
router.post('/', suggestMessage);
export default router;
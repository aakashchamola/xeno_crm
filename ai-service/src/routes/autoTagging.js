import express from 'express';
import { autoTag } from '../controllers/autoTaggingController.js';
const router = express.Router();
router.post('/', autoTag);
export default router;
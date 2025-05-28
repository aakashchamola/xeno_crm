import express from 'express';
import {lookalike  } from '../controllers/lookAlikeController.js';
const router = express.Router();
router.post('/', lookalike);
export default router;
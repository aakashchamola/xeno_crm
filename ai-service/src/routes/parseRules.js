import express from 'express';
import { parseRules } from '../controllers/parseRulesController.js';

const router = express.Router();

router.post('/', parseRules);

export default router;
const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middlewares/authenticate');
const { validatePreview } = require('../validators/preview');
const { previewSegment } = require('../controllers/previewController');

router.post('/', authenticateJWT, validatePreview, previewSegment);

module.exports = router;
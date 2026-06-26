const express = require('express');
const router = express.Router();
const { assignRole } = require('../controllers/roleController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/roles/assign', authenticate, authorize('CFO'), assignRole);

module.exports = router;

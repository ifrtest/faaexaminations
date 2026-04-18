// server/src/routes/users.js
const express = require('express');
const router  = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const ctrl = require('../controllers/userController');

// Self
router.put('/me', requireAuth, ctrl.updateMe);

// Admin
router.get('/admin/stats', requireAuth, requireAdmin, ctrl.adminStats);
router.get('/',            requireAuth, requireAdmin, ctrl.list);
router.get('/:id',         requireAuth, requireAdmin, ctrl.get);
router.put('/:id',         requireAuth, requireAdmin, ctrl.update);

module.exports = router;

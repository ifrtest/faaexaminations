// server/src/routes/auth.js
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

router.post('/register',              ctrl.register);
router.post('/login',                 ctrl.login);
router.post('/logout',                ctrl.logout);
router.post('/password/forgot',       ctrl.requestPasswordReset);
router.post('/password/reset',        ctrl.resetPassword);
router.get('/me',       requireAuth,  ctrl.me);

module.exports = router;

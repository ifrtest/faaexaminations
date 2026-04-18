// server/src/routes/questions.js
const express = require('express');
const router  = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const ctrl = require('../controllers/questionController');

// Admin-only endpoints
router.use(requireAuth, requireAdmin);

router.get('/',                             ctrl.list);
router.get('/:id',                          ctrl.get);
router.post('/',                            ctrl.create);
router.put('/:id',                          ctrl.update);
router.delete('/:id',                       ctrl.remove);
router.post('/upload', ctrl.upload.single('image'), ctrl.uploadImage);

module.exports = router;

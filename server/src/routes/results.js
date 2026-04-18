// server/src/routes/results.js
const express = require('express');
const router  = express.Router();
const { requireAuth } = require('../middleware/auth');
const ctrl    = require('../controllers/resultController');

router.use(requireAuth);

router.get('/dashboard',  ctrl.dashboard);
router.get('/',           ctrl.myResults);
router.get('/:id',        ctrl.getResult);

module.exports = router;

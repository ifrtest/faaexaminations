// server/src/routes/quizzes.js
const express = require('express');
const router  = express.Router();
const { requireAuth } = require('../middleware/auth');
const ctrl    = require('../controllers/quizController');

router.use(requireAuth);

router.get('/exams',                     ctrl.listExams);
router.get('/exams/:code/topics',        ctrl.listTopics);

router.post('/start',                    ctrl.startSession);
router.get('/sessions',                  ctrl.listMySessions);
router.get('/sessions/:id',              ctrl.getSession);
router.post('/sessions/:id/answer',      ctrl.saveAnswer);
router.post('/sessions/:id/submit',      ctrl.submitSession);
router.post('/sessions/:id/abandon',     ctrl.abandonSession);

module.exports = router;

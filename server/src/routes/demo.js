const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

// Public — no auth required
// Returns 3 random Part 107 (UAG) questions with choices, correct answer, explanation
router.get('/part107', async (_req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT q.id, q.question_text, q.choice_a, q.choice_b, q.choice_c, q.choice_d,
              q.correct_answer, q.explanation, t.name AS topic_name
       FROM questions q
       JOIN exams e ON e.id = q.exam_id
       LEFT JOIN topics t ON t.id = q.topic_id
       WHERE e.code = 'UAG' AND q.is_active = true
         AND q.question_text IS NOT NULL
         AND q.choice_a IS NOT NULL AND q.choice_b IS NOT NULL
         AND q.choice_c IS NOT NULL AND q.choice_d IS NOT NULL
         AND q.correct_answer IS NOT NULL
       ORDER BY RANDOM()
       LIMIT 5`
    );
    res.json({ questions: rows });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

const express  = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// POST /api/ai/explain
// Body: { question, choices, correct_answer, selected_answer, explanation, topic }
router.post('/explain', requireAuth, async (req, res) => {
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: 'AI Instructor is not configured.' });
  }

  const { question, choices, correct_answer, selected_answer, explanation, topic } = req.body;

  if (!question || !choices || !correct_answer) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const choiceList = Object.entries(choices)
    .map(([k, v]) => `${k}) ${v}`)
    .join('\n');

  const gotItRight = selected_answer === correct_answer;
  const correctText = choices[correct_answer];
  const selectedText = selected_answer ? choices[selected_answer] : null;

  const prompt = gotItRight
    ? `You are an experienced FAA-certified flight instructor helping a student pilot prepare for their FAA Airman Knowledge Test.

A student just answered a practice question correctly.

Question: ${question}
${topic ? `Topic: ${topic}` : ''}

Answer choices:
${choiceList}

Correct answer: ${correct_answer}) ${correctText}
${explanation ? `Reference: ${explanation}` : ''}

Briefly reinforce why "${correctText}" is correct. Keep it under 120 words. Plain language, no bullet points, no headers. Reference the specific FAA regulation (FAR), AIM section, or aviation principle where relevant.`

    : `You are an experienced FAA-certified flight instructor helping a student pilot prepare for their FAA Airman Knowledge Test.

A student just answered a practice question INCORRECTLY.

Question: ${question}
${topic ? `Topic: ${topic}` : ''}

Answer choices:
${choiceList}

The student chose: ${selected_answer ? `${selected_answer}) ${selectedText}` : 'did not answer'} — this is WRONG.
The correct answer is: ${correct_answer}) ${correctText}
${explanation ? `Reference: ${explanation}` : ''}

IMPORTANT: Do NOT say the student answered correctly. Do NOT use phrases like "you got it right", "correct", "well done", or any praise. The student got this WRONG.

Explain clearly why "${correctText}" is the correct answer${selectedText ? `, and briefly explain why "${selectedText}" is incorrect` : ''}. Keep it under 150 words. Plain language, no bullet points, no headers. Reference the specific FAA regulation (FAR), AIM section, or aviation principle where relevant.`;

  try {
    const message = await anthropic.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 300,
      messages:   [{ role: 'user', content: prompt }],
    });
    res.json({ response: message.content[0].text });
  } catch (err) {
    console.error('[ai-explain]', err.message);
    res.status(500).json({ error: 'AI Instructor is unavailable right now.' });
  }
});

module.exports = router;

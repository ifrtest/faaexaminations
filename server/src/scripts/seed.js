// server/src/scripts/seed.js
// Imports FAA questions from CSV files into the database.
//
//   Usage:
//     node src/scripts/seed.js                          # uses default path
//     node src/scripts/seed.js path/to/faa_all.csv      # custom file
//
require('dotenv').config();
const fs   = require('fs');
const path = require('path');
const { parse } = require('csv-parse');
const db   = require('../config/db');
const { slugify } = require('../utils/helpers');

const DEFAULT_CSV = path.join(__dirname, '..', '..', '..', '..', 'project', 'faa_all_questions.csv');

// ---------- quiz_name parsing ---------------------------------------
// The "quiz_name" column looks like:
//   "FAA Private Pilot Airplane (PAR) - Airplane Engines, Systems & Instruments Quiz 4"
//   "FAA Commercial Pilot Airplane (CAX) - Federal Aviation Regulations Quiz 4"
//   "FAA PPL Aeronautics & General Knowledge Exam 8"
//   "3)FAA Private Pilot Airplane (PAR) - Air Law & Procedures Quiz 3"
//
// We derive:
//   examCode :  PAR | IRA | CAX  (PPL rows are merged into PAR by default)
//   topic    :  the "middle chunk" stripped of the trailing "Quiz N" / "Exam N"
function classify(quizName) {
  const name = String(quizName).trim();

  let examCode;
  if (/\(PAR\)|Private Pilot/i.test(name))      examCode = 'PAR';
  else if (/\(IRA\)|Instrument Rating/i.test(name)) examCode = 'IRA';
  else if (/\(CAX\)|Commercial Pilot/i.test(name))  examCode = 'CAX';
  else if (/\bPPL\b/i.test(name))                examCode = 'PAR'; // general PPL content -> PAR
  else                                           examCode = 'PAR';

  // Strip leading "3)" style prefixes.
  let cleaned = name.replace(/^\s*\d+\)\s*/, '');
  // Strip the "FAA <cert>" prefix up to the first dash.
  //   e.g. "FAA Private Pilot Airplane (PAR) - Airplane Engines, Systems & Instruments Quiz 4"
  //   =>   "Airplane Engines, Systems & Instruments Quiz 4"
  const dashIdx = cleaned.indexOf(' - ');
  if (dashIdx !== -1) cleaned = cleaned.slice(dashIdx + 3);
  else cleaned = cleaned.replace(/^FAA\s+/i, '');

  // Strip trailing "Quiz N" / "Exam N".
  let topic = cleaned.replace(/\s+(Quiz|Exam|Sample Quiz)\s+\d+\s*$/i, '').trim();
  if (!topic) topic = 'General';

  return { examCode, topic };
}

function normalizeAnswer(raw) {
  if (!raw) return null;
  const v = String(raw).trim().toUpperCase();
  return ['A', 'B', 'C', 'D'].includes(v) ? v : null;
}

async function getOrCreateTopic(examId, topicName, cache) {
  const key = `${examId}:${topicName}`;
  if (cache.has(key)) return cache.get(key);
  const slug = slugify(topicName);
  const found = await db.query(
    'SELECT id FROM topics WHERE exam_id=$1 AND slug=$2', [examId, slug]);
  if (found.rows[0]) {
    cache.set(key, found.rows[0].id);
    return found.rows[0].id;
  }
  const ins = await db.query(
    'INSERT INTO topics (exam_id, name, slug) VALUES ($1,$2,$3) RETURNING id',
    [examId, topicName, slug]);
  cache.set(key, ins.rows[0].id);
  return ins.rows[0].id;
}

async function seed(csvPath) {
  if (!fs.existsSync(csvPath)) {
    console.error('CSV file not found:', csvPath);
    process.exit(1);
  }
  console.log('Seeding from', csvPath);

  // Load exam_code -> id
  const { rows: examRows } = await db.query('SELECT id, code FROM exams');
  const examByCode = new Map(examRows.map((e) => [e.code, e.id]));
  if (!examByCode.size) {
    console.error('No exams found. Run `npm run migrate` first.');
    process.exit(1);
  }

  const topicCache = new Map();

  let total = 0, inserted = 0, skipped = 0;

  const parser = fs
    .createReadStream(csvPath)
    .pipe(parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_quotes: true,
      bom: true,
    }));

  // Truncate existing questions so re-running the seed is idempotent.
  // We keep users/results so developers can re-seed without losing accounts.
  console.log('Clearing existing questions and topics...');
  await db.query('TRUNCATE questions RESTART IDENTITY CASCADE');
  await db.query('TRUNCATE topics    RESTART IDENTITY CASCADE');

  for await (const row of parser) {
    total += 1;
    const quizName = row.quiz_name || '';
    const qText    = (row.question || '').trim();
    const answer   = normalizeAnswer(row.correct_answer);

    if (!qText || !answer) { skipped += 1; continue; }

    const { examCode, topic } = classify(quizName);
    const examId  = examByCode.get(examCode) || examByCode.get('PAR');
    const topicId = await getOrCreateTopic(examId, topic, topicCache);

    // Some rows only have 3 options; that's fine — unused choices stay NULL.
    const a = (row.option_a || '').trim() || null;
    const b = (row.option_b || '').trim() || null;
    const c = (row.option_c || '').trim() || null;
    const d = (row.option_d || '').trim() || null;

    // Validate the answer letter actually maps to a non-empty option.
    const map = { A: a, B: b, C: c, D: d };
    if (!map[answer]) { skipped += 1; continue; }

    await db.query(
      `INSERT INTO questions
         (exam_id, topic_id, question_text, choice_a, choice_b, choice_c, choice_d,
          correct_answer, explanation)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [examId, topicId, qText, a, b, c, d, answer, (row.explanation || '').trim() || null]
    );
    inserted += 1;

    if (inserted % 500 === 0) process.stdout.write(`  ...${inserted}\n`);
  }

  console.log(`\nDone. CSV rows: ${total}, inserted: ${inserted}, skipped: ${skipped}`);

  // Summary
  const summary = await db.query(
    `SELECT e.code, COUNT(q.id)::int AS questions
       FROM exams e
       LEFT JOIN questions q ON q.exam_id=e.id
      GROUP BY e.code ORDER BY e.code`);
  console.table(summary.rows);

  process.exit(0);
}

const arg = process.argv[2];
const csvPath = arg
  ? path.resolve(arg)
  : DEFAULT_CSV;

seed(csvPath).catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

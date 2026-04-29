/**
 * ATP Question Inserter
 * Creates ATP exam + 18 topics + inserts 1,496 clean questions.
 * SAFE: only inserts new data, never touches existing exams/questions.
 * Run: node scripts/insert_atp_questions.js
 */

const db = require('../src/config/db');
const fs = require('fs');
const path = require('path');

const JSON_PATH = path.join(__dirname, 'atp_questions_extracted.json');

// Fix known OCR typos in study unit names
const SU_NAME_FIXES = {
  '/FR Navigation Equipment, Holding, and Approaches': 'IFR Navigation Equipment, Holding, and Approaches',
};

function fixSuName(name) {
  return SU_NAME_FIXES[name] || name;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function main() {
  const raw = fs.readFileSync(JSON_PATH, 'utf8');
  const data = JSON.parse(raw);

  // Only clean questions
  const cleanQuestions = data.questions.filter(q => !q.FLAG);
  console.log(`Clean questions to insert: ${cleanQuestions.length}`);

  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    // 1. Create ATP exam (exam_id=6) if not exists
    const examCheck = await client.query("SELECT id FROM exams WHERE code = 'ATP'");
    let examId;
    if (examCheck.rows.length > 0) {
      examId = examCheck.rows[0].id;
      console.log(`ATP exam already exists (id=${examId}), skipping create.`);
    } else {
      const examResult = await client.query(
        `INSERT INTO exams (code, name, description, time_limit, num_questions, passing_score)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [
          'ATP',
          'Airline Transport Pilot (ATP)',
          'FAA aeronautical knowledge test for the Airline Transport Pilot certificate. Covers FARs, aerodynamics, weather, navigation, aircraft systems, and crew resource management.',
          240,
          80,
          70,
        ]
      );
      examId = examResult.rows[0].id;
      console.log(`Created ATP exam (id=${examId})`);
    }

    // 2. Create 18 topics for ATP
    const suNames = {};
    for (const q of cleanQuestions) {
      const num = q.study_unit_num;
      if (!suNames[num]) {
        suNames[num] = fixSuName(q.study_unit_name);
      }
    }

    const topicMap = {}; // su_num → topic_id
    for (const suNum of Object.keys(suNames).sort((a, b) => a - b)) {
      const name = suNames[suNum];
      const slug = slugify(`atp-su${suNum}-${name}`).slice(0, 100);

      const existing = await client.query(
        'SELECT id FROM topics WHERE exam_id = $1 AND name = $2',
        [examId, name]
      );
      if (existing.rows.length > 0) {
        topicMap[suNum] = existing.rows[0].id;
        console.log(`  Topic SU${suNum} already exists (id=${topicMap[suNum]})`);
      } else {
        const result = await client.query(
          'INSERT INTO topics (exam_id, name, slug) VALUES ($1, $2, $3) RETURNING id',
          [examId, name, slug]
        );
        topicMap[suNum] = result.rows[0].id;
        console.log(`  Created topic SU${suNum}: ${name} (id=${topicMap[suNum]})`);
      }
    }

    // 3. Insert clean questions
    let inserted = 0;
    let skipped = 0;

    for (const q of cleanQuestions) {
      const topicId = topicMap[q.study_unit_num];
      if (!topicId) {
        console.warn(`  WARN: No topic for SU${q.study_unit_num}, skipping #${q.global_num}`);
        skipped++;
        continue;
      }

      // Basic sanity: skip if choices somehow empty
      if (!q.choice_a || !q.choice_b || !q.choice_c) {
        console.warn(`  WARN: Missing choices on #${q.global_num}, skipping`);
        skipped++;
        continue;
      }

      const imageUrl = q.figure_refs && q.figure_refs.length > 0
        ? `/atp-figures/figure-${q.figure_refs[0]}.png`
        : null;

      await client.query(
        `INSERT INTO questions
           (exam_id, topic_id, question_text, choice_a, choice_b, choice_c, choice_d,
            correct_answer, explanation, image_url, difficulty, is_active)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
        [
          examId,
          topicId,
          q.question_text,
          q.choice_a,
          q.choice_b,
          q.choice_c,
          q.choice_d || null,
          q.correct_answer,
          q.explanation || null,
          imageUrl,
          'medium',
          true,
        ]
      );
      inserted++;
    }

    await client.query('COMMIT');

    console.log(`\n✅ Done!`);
    console.log(`   Exam: ATP (id=${examId})`);
    console.log(`   Topics created: ${Object.keys(topicMap).length}`);
    console.log(`   Questions inserted: ${inserted}`);
    if (skipped > 0) console.log(`   Skipped: ${skipped}`);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error — rolled back:', err.message);
    throw err;
  } finally {
    client.release();
    process.exit(0);
  }
}

main().catch(e => { console.error(e); process.exit(1); });

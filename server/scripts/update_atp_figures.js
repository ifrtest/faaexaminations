/**
 * Update ATP question figure URLs using corrected page-based mapping.
 * Uses /tmp/atp_q_figures.json (global_num → [fig_labels]) and
 * atp_questions_extracted.json (to map global_num → insertion order).
 * Run: node scripts/update_atp_figures.js
 */

const db = require('../src/config/db');
const fs = require('fs');
const path = require('path');

const FIGURES_MAP_PATH = '/tmp/atp_q_figures.json';
const EXTRACTED_PATH = path.join(__dirname, 'atp_questions_extracted.json');

async function main() {
  // 1. Load the figure mapping: global_num → [fig_labels]
  const figMap = JSON.parse(fs.readFileSync(FIGURES_MAP_PATH, 'utf8'));

  // 2. Load extracted questions to get insertion order of clean questions
  const extracted = JSON.parse(fs.readFileSync(EXTRACTED_PATH, 'utf8'));
  const cleanQuestions = extracted.questions.filter(q => !q.FLAG);
  console.log(`Clean questions: ${cleanQuestions.length}`);

  // 3. Get DB question IDs for exam_id=6 in insertion order (by id ASC)
  const result = await db.query(
    'SELECT id FROM questions WHERE exam_id = 6 ORDER BY id ASC'
  );
  const dbIds = result.rows.map(r => r.id);
  console.log(`DB ATP question IDs found: ${dbIds.length}`);

  if (dbIds.length !== cleanQuestions.length) {
    console.warn(`WARNING: DB count (${dbIds.length}) != clean questions (${cleanQuestions.length})`);
  }

  // 4. Build global_num → db_id map
  const globalToDbId = {};
  for (let i = 0; i < cleanQuestions.length && i < dbIds.length; i++) {
    globalToDbId[cleanQuestions[i].global_num] = dbIds[i];
  }

  // 5. Update image_url and extra_image_urls for each question with figures
  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    // First clear all ATP figure URLs
    await client.query(
      "UPDATE questions SET image_url = NULL, extra_image_urls = NULL WHERE exam_id = 6"
    );
    console.log('Cleared existing figure URLs for ATP questions.');

    let updated = 0;
    let skipped = 0;

    for (const [globalNumStr, labels] of Object.entries(figMap)) {
      const globalNum = parseInt(globalNumStr, 10);
      const dbId = globalToDbId[globalNum];

      if (!dbId) {
        console.warn(`  WARN: No DB id for global_num=${globalNum}, skipping`);
        skipped++;
        continue;
      }

      const primaryLabel = labels[0];
      const imageUrl = `/atp-figures/figure-${primaryLabel}.png`;
      const extraLabels = labels.slice(1);

      if (extraLabels.length > 0) {
        const extraUrls = extraLabels.map(l => `/atp-figures/figure-${l}.png`);
        await client.query(
          `UPDATE questions SET image_url = $1, extra_image_urls = $2::jsonb WHERE id = $3`,
          [imageUrl, JSON.stringify(extraUrls), dbId]
        );
      } else {
        await client.query(
          `UPDATE questions SET image_url = $1, extra_image_urls = NULL WHERE id = $2`,
          [imageUrl, dbId]
        );
      }
      updated++;
    }

    await client.query('COMMIT');

    console.log(`\n✅ Done!`);
    console.log(`   Questions updated with figures: ${updated}`);
    if (skipped > 0) console.log(`   Skipped (no DB match): ${skipped}`);

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

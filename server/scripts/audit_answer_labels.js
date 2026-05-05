/**
 * audit_answer_labels.js
 *
 * Phase 1: READ-ONLY audit.
 * Finds every question where choice columns are not sequential
 * (i.e. a gap like choice_b=NULL while choice_c or choice_d has content).
 * Prints a full report and saves results to a JSON file for the fix phase.
 *
 * Run: node scripts/audit_answer_labels.js
 */

require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

function classifyPattern(q) {
  const a = q.choice_a != null && q.choice_a.trim() !== '';
  const b = q.choice_b != null && q.choice_b.trim() !== '';
  const c = q.choice_c != null && q.choice_c.trim() !== '';
  const d = q.choice_d != null && q.choice_d.trim() !== '';

  if  (a && b && c && d)  return 'a,b,c,d';   // OK
  if  (a && b && c && !d) return 'a,b,c';      // OK
  if  (a && b && !c && !d) return 'a,b';       // OK (2-choice)
  if  (a && !b && !c && !d) return 'a_only';   // Unusual but no gap

  // Gapped patterns (need fixing)
  if  (a && !b && c && d)  return 'GAP_a__cd';
  if  (a && !b && c && !d) return 'GAP_a__c';
  if  (a && b && !c && d)  return 'GAP_ab__d';
  if  (!a && b && c && d)  return 'GAP__bcd';
  if  (!a && b && c && !d) return 'GAP__bc';
  if  (!a && b && !c && !d) return 'GAP__b';
  if  (a && !b && !c && d) return 'GAP_a___d';
  if  (!a && !b && !c && !d) return 'NO_CHOICES';
  return 'OTHER';
}

function isGapped(pattern) {
  return pattern.startsWith('GAP_') || pattern === 'NO_CHOICES';
}

// Given a question row, compute what the remapped correct_answer should be
// after re-packing into sequential a,b,c,d.
// Returns { newChoices, newCorrectAnswer, oldPattern, newPattern }
function computeFix(q) {
  const slots = [
    { letter: 'A', val: q.choice_a },
    { letter: 'B', val: q.choice_b },
    { letter: 'C', val: q.choice_c },
    { letter: 'D', val: q.choice_d },
  ];

  // Collect only non-empty slots in order
  const filled = slots.filter(s => s.val != null && s.val.trim() !== '');

  // Which sequential letter does the original correct_answer map to?
  const origCorrect = (q.correct_answer || '').toUpperCase();
  const origSlot = slots.find(s => s.letter === origCorrect);

  // Find the position of the correct answer in the filled array
  const correctIdx = filled.findIndex(s => s.letter === origCorrect);

  // Sequential labels
  const seqLabels = ['A', 'B', 'C', 'D'];
  const newCorrectAnswer = correctIdx >= 0 ? seqLabels[correctIdx] : origCorrect;

  const newChoices = {
    choice_a: filled[0]?.val ?? null,
    choice_b: filled[1]?.val ?? null,
    choice_c: filled[2]?.val ?? null,
    choice_d: filled[3]?.val ?? null,
  };

  return { newChoices, newCorrectAnswer, origCorrect, correctIdx };
}

async function main() {
  const client = await pool.connect();
  try {
    console.log('=== FAAExaminations.com — Answer Label Audit ===\n');

    const { rows } = await client.query(`
      SELECT id, exam_id, question_text,
             choice_a, choice_b, choice_c, choice_d,
             correct_answer, is_active
      FROM questions
      ORDER BY id
    `);

    console.log(`Total questions in database: ${rows.length}\n`);

    // Classify
    const patternCounts = {};
    const gappedQuestions = [];

    for (const q of rows) {
      const pattern = classifyPattern(q);
      patternCounts[pattern] = (patternCounts[pattern] || 0) + 1;
      if (isGapped(pattern)) {
        const fix = computeFix(q);
        gappedQuestions.push({ ...q, _pattern: pattern, _fix: fix });
      }
    }

    // Summary table
    console.log('--- Pattern Distribution ---');
    const sorted = Object.entries(patternCounts).sort((a, b) => b[1] - a[1]);
    for (const [pat, cnt] of sorted) {
      const flag = isGapped(pat) ? '  *** NEEDS FIX ***' : '';
      console.log(`  ${pat.padEnd(20)} ${String(cnt).padStart(6)} questions${flag}`);
    }

    const totalGapped = gappedQuestions.length;
    console.log(`\nTotal questions needing fix: ${totalGapped}`);

    if (totalGapped === 0) {
      console.log('\nAll questions have sequential labels. Nothing to fix!');
      return;
    }

    // Show 5 before/after examples
    console.log('\n--- Before / After Examples (first 5 gapped questions) ---');
    const examples = gappedQuestions.slice(0, 5);
    for (const q of examples) {
      const f = q._fix;
      console.log(`\nQuestion ID: ${q.id}  (pattern: ${q._pattern})`);
      console.log(`  Text: ${q.question_text.slice(0, 80)}...`);
      console.log(`  BEFORE:  choice_a=${q.choice_a ? '"' + q.choice_a.slice(0,40) + '"' : 'NULL'}`);
      console.log(`           choice_b=${q.choice_b ? '"' + q.choice_b.slice(0,40) + '"' : 'NULL'}`);
      console.log(`           choice_c=${q.choice_c ? '"' + q.choice_c.slice(0,40) + '"' : 'NULL'}`);
      console.log(`           choice_d=${q.choice_d ? '"' + q.choice_d.slice(0,40) + '"' : 'NULL'}`);
      console.log(`           correct_answer=${q.correct_answer}`);
      console.log(`  AFTER:   choice_a=${f.newChoices.choice_a ? '"' + f.newChoices.choice_a.slice(0,40) + '"' : 'NULL'}`);
      console.log(`           choice_b=${f.newChoices.choice_b ? '"' + f.newChoices.choice_b.slice(0,40) + '"' : 'NULL'}`);
      console.log(`           choice_c=${f.newChoices.choice_c ? '"' + f.newChoices.choice_c.slice(0,40) + '"' : 'NULL'}`);
      console.log(`           choice_d=${f.newChoices.choice_d ? '"' + f.newChoices.choice_d.slice(0,40) + '"' : 'NULL'}`);
      console.log(`           correct_answer=${f.newCorrectAnswer}  (was: ${f.origCorrect}, mapped to position ${f.correctIdx})`);
    }

    // Check for questions where correct_answer position can't be found (dangerous edge case)
    const unmappable = gappedQuestions.filter(q => q._fix.correctIdx < 0);
    if (unmappable.length > 0) {
      console.log(`\n⚠️  WARNING: ${unmappable.length} questions have a correct_answer that doesn't match any choice!`);
      console.log('   These will NOT be changed by the fix script. Manual review needed.');
      for (const q of unmappable) {
        console.log(`   ID=${q.id}  correct_answer=${q.correct_answer}  choices: a=${q.choice_a?'Y':'N'} b=${q.choice_b?'Y':'N'} c=${q.choice_c?'Y':'N'} d=${q.choice_d?'Y':'N'}`);
      }
    }

    // Save audit results to JSON for the fix phase
    const outPath = path.join(__dirname, '../backups/answer_label_audit.json');
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify({
      auditDate: new Date().toISOString(),
      totalQuestions: rows.length,
      totalGapped,
      patternCounts,
      gappedQuestions: gappedQuestions.map(q => ({
        id: q.id,
        exam_id: q.exam_id,
        is_active: q.is_active,
        pattern: q._pattern,
        original: {
          choice_a: q.choice_a,
          choice_b: q.choice_b,
          choice_c: q.choice_c,
          choice_d: q.choice_d,
          correct_answer: q.correct_answer,
        },
        fix: q._fix,
      })),
    }, null, 2));
    console.log(`\nAudit saved to backups/answer_label_audit.json`);
    console.log('\nRun fix_answer_labels.js to apply the fixes.');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(err => { console.error(err); process.exit(1); });

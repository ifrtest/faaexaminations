require('dotenv').config();
const { sendEmail, nurtureDay3, nurtureDay7, nurtureDay14 } = require('../utils/email');

const TO   = 'hundals_ca@yahoo.ca';
const NAME = 'Leila';

async function run() {
  console.log('Sending nurture preview emails to', TO);

  await sendEmail({
    to: TO,
    subject: '[PREVIEW — Day 3] What the FAA actually tests you on ✈',
    html: nurtureDay3(NAME, null),
  });
  console.log('✓ Day 3 sent');

  await sendEmail({
    to: TO,
    subject: '[PREVIEW — Day 7] How pilots pass the FAA written first try',
    html: nurtureDay7(NAME, null),
  });
  console.log('✓ Day 7 sent');

  await sendEmail({
    to: TO,
    subject: '[PREVIEW — Day 14] Still studying for your FAA written?',
    html: nurtureDay14(NAME, null),
  });
  console.log('✓ Day 14 sent');

  console.log('\nAll 3 preview emails sent.');
  process.exit(0);
}

run().catch((err) => { console.error(err); process.exit(1); });

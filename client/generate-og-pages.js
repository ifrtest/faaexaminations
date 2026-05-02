import { readFileSync, writeFileSync } from 'fs';

const base = readFileSync('dist/index.html', 'utf8');

const pages = {
  'par': {
    pageTitle: 'FAA Private Pilot Written Test Prep — 1,469 Questions | FAAExaminations.com',
    url: 'https://faaexaminations.com/par',
    ogTitle: 'FAA Private Pilot Written Test Prep — Pass First Try',
    ogDesc: '1,469 practice questions, timed simulator, and AI instructor. Pass your FAA Private Pilot written exam first try. $24.99/month.',
    image: 'https://faaexaminations.com/plane-par-desktop.jpg',
    imageWidth: '1920',
    imageHeight: '1280',
    imageAlt: 'Private Pilot FAA exam prep — FAAExaminations.com',
  },
  'part-107': {
    pageTitle: 'FAA Part 107 Drone License Test Prep | FAAExaminations.com',
    url: 'https://faaexaminations.com/part-107',
    ogTitle: 'FAA Part 107 Drone License Test Prep — Pass First Try',
    ogDesc: 'Get your FAA drone license. Practice questions, timed simulator, and AI instructor. $37.99 one-time payment. Lifetime access.',
    image: 'https://faaexaminations.com/drone_image_faa_examinations.jpg',
    imageWidth: '1440',
    imageHeight: '1080',
    imageAlt: 'FAA Part 107 drone license exam prep — FAAExaminations.com',
  },
  'ira': {
    pageTitle: 'FAA Instrument Rating Written Test Prep — 821 Questions | FAAExaminations.com',
    url: 'https://faaexaminations.com/ira',
    ogTitle: 'FAA Instrument Rating Written Test Prep — Pass First Try',
    ogDesc: '821 IFR practice questions, approach procedures, charts, and AI instructor. Pass your FAA Instrument Rating written exam. $24.99/month.',
    image: 'https://faaexaminations.com/plane-ira.jpg',
    imageWidth: '2400',
    imageHeight: '1792',
    imageAlt: 'Instrument Rating FAA exam prep — FAAExaminations.com',
  },
  'cax': {
    pageTitle: 'FAA Commercial Pilot Written Test Prep — 536 Questions | FAAExaminations.com',
    url: 'https://faaexaminations.com/cax',
    ogTitle: 'FAA Commercial Pilot Written Test Prep — Pass First Try',
    ogDesc: '536 practice questions covering performance, weight & balance, and advanced operations. Pass your FAA Commercial Pilot written exam. $24.99/month.',
    image: 'https://faaexaminations.com/plane-cax-hero.jpg',
    imageWidth: '1200',
    imageHeight: '630',
    imageAlt: 'Commercial Pilot FAA exam prep — FAAExaminations.com',
  },
  'bundle': {
    pageTitle: 'FAA Pilot Certificate Bundle — PAR, IRA & CAX | FAAExaminations.com',
    url: 'https://faaexaminations.com/bundle',
    ogTitle: 'FAA Pilot Certificate Bundle — PAR + IRA + CAX',
    ogDesc: 'All three FAA pilot certificate exams in one subscription. 2,826 practice questions, timed simulators, AI instructor. Save $35/month vs individual.',
    image: 'https://faaexaminations.com/plane-bundle.jpg',
    imageWidth: '2400',
    imageHeight: '1792',
    imageAlt: 'FAA Pilot Certificate Bundle — FAAExaminations.com',
  },
  'part-107-cheat-sheet': {
    pageTitle: 'FAA Part 107 Cheat Sheet — Key Rules, Airspace & Numbers (2026) | FAAExaminations.com',
    url: 'https://faaexaminations.com/part-107-cheat-sheet',
    ogTitle: 'FAA Part 107 Cheat Sheet — Key Rules, Airspace & Numbers (2026)',
    ogDesc: 'Free FAA Part 107 drone license exam cheat sheet. Altitude limits, airspace authorization, Remote ID, weather minimums, waivers, and key regulations.',
    image: 'https://faaexaminations.com/drone_image_faa_examinations.jpg',
    imageWidth: '1440',
    imageHeight: '1080',
    imageAlt: 'FAA Part 107 drone license exam cheat sheet — FAAExaminations.com',
  },
  'par-cheat-sheet': {
    pageTitle: 'FAA Private Pilot Exam Cheat Sheet (PAR) — Key Numbers, Rules & Formulas (2026) | FAAExaminations.com',
    url: 'https://faaexaminations.com/par-cheat-sheet',
    ogTitle: 'FAA Private Pilot Exam Cheat Sheet — Key Numbers, Rules & Formulas',
    ogDesc: 'Free FAA Private Pilot (PAR) written exam cheat sheet. FARs, airspace minimums, METAR codes, density altitude, weight & balance, and more. Printable reference.',
    image: 'https://faaexaminations.com/plane-par-desktop.jpg',
    imageWidth: '1920',
    imageHeight: '1280',
    imageAlt: 'FAA Private Pilot exam cheat sheet — FAAExaminations.com',
  },
  'ira-cheat-sheet': {
    pageTitle: 'FAA Instrument Rating Cheat Sheet (IRA) — IFR Rules, Approaches & Minimums (2026) | FAAExaminations.com',
    url: 'https://faaexaminations.com/ira-cheat-sheet',
    ogTitle: 'FAA Instrument Rating Cheat Sheet — IFR Rules, Approaches & Minimums',
    ogDesc: 'Free FAA Instrument Rating (IRA) written exam cheat sheet. IFR currency, CRAFT clearances, approach minimums, alternate rules, holding procedures, and more.',
    image: 'https://faaexaminations.com/plane-ira.jpg',
    imageWidth: '2400',
    imageHeight: '1792',
    imageAlt: 'FAA Instrument Rating exam cheat sheet — FAAExaminations.com',
  },
  'cax-cheat-sheet': {
    pageTitle: 'FAA Commercial Pilot Exam Cheat Sheet (CAX) — Regs, Performance & Maneuvers (2026) | FAAExaminations.com',
    url: 'https://faaexaminations.com/cax-cheat-sheet',
    ogTitle: 'FAA Commercial Pilot Exam Cheat Sheet — Regs, Performance & Maneuvers',
    ogDesc: 'Free FAA Commercial Pilot (CAX) written exam cheat sheet. FAR 61.129 requirements, V-speeds, weight & balance, advanced aerodynamics, commercial maneuvers.',
    image: 'https://faaexaminations.com/plane-cax-hero.jpg',
    imageWidth: '1200',
    imageHeight: '630',
    imageAlt: 'FAA Commercial Pilot exam cheat sheet — FAAExaminations.com',
  },
  'par-practice-test': {
    pageTitle: 'FAA Private Pilot Practice Test (PAR) — 30 Free Questions (2026) | FAAExaminations.com',
    url: 'https://faaexaminations.com/par-practice-test',
    ogTitle: 'FAA Private Pilot Practice Test — 30 Free Questions (2026)',
    ogDesc: 'Free FAA Private Pilot (PAR) practice test with 30 real exam-style questions. Instant scoring, answer explanations, no login required.',
    image: 'https://faaexaminations.com/plane-par-desktop.jpg',
    imageWidth: '1920',
    imageHeight: '1280',
    imageAlt: 'FAA Private Pilot practice test — FAAExaminations.com',
  },
  'ira-practice-test': {
    pageTitle: 'FAA Instrument Rating Practice Test (IRA) — 30 Free Questions (2026) | FAAExaminations.com',
    url: 'https://faaexaminations.com/ira-practice-test',
    ogTitle: 'FAA Instrument Rating Practice Test — 30 Free Questions (2026)',
    ogDesc: 'Free FAA Instrument Rating (IRA) practice test with 30 real exam-style questions. IFR procedures, approaches, holds, weather. No login required.',
    image: 'https://faaexaminations.com/plane-ira.jpg',
    imageWidth: '2400',
    imageHeight: '1792',
    imageAlt: 'FAA Instrument Rating practice test — FAAExaminations.com',
  },
  'cax-practice-test': {
    pageTitle: 'FAA Commercial Pilot Practice Test (CAX) — 30 Free Questions (2026) | FAAExaminations.com',
    url: 'https://faaexaminations.com/cax-practice-test',
    ogTitle: 'FAA Commercial Pilot Practice Test — 30 Free Questions (2026)',
    ogDesc: 'Free FAA Commercial Pilot (CAX) practice test with 30 real exam-style questions. Regulations, aerodynamics, performance, multi-engine. No login required.',
    image: 'https://faaexaminations.com/plane-cax-hero.jpg',
    imageWidth: '1200',
    imageHeight: '630',
    imageAlt: 'FAA Commercial Pilot practice test — FAAExaminations.com',
  },
  'part-107-practice-test': {
    pageTitle: 'Part 107 Practice Test — 30 Free Questions (2026) | FAA Drone Exam | FAAExaminations.com',
    url: 'https://faaexaminations.com/part-107-practice-test',
    ogTitle: 'Part 107 Practice Test — 30 Free Questions (2026)',
    ogDesc: 'Free FAA Part 107 drone license practice test with 30 real exam-style questions. Airspace, VLOS, Remote ID, weather. No login required.',
    image: 'https://faaexaminations.com/drone_image_faa_examinations.jpg',
    imageWidth: '1440',
    imageHeight: '1080',
    imageAlt: 'FAA Part 107 drone license practice test — FAAExaminations.com',
  },
};

for (const [slug, meta] of Object.entries(pages)) {
  const html = base
    .replace(/<title>[^<]*<\/title>/, `<title>${meta.pageTitle}</title>`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${meta.url}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${meta.ogTitle}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${meta.ogDesc}" />`)
    .replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${meta.image}" />`)
    .replace(/<meta property="og:image:width" content="[^"]*" \/>/, `<meta property="og:image:width" content="${meta.imageWidth}" />`)
    .replace(/<meta property="og:image:height" content="[^"]*" \/>/, `<meta property="og:image:height" content="${meta.imageHeight}" />`)
    .replace(/<meta property="og:image:alt" content="[^"]*" \/>/, `<meta property="og:image:alt" content="${meta.imageAlt}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${meta.ogTitle}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${meta.ogDesc}" />`)
    .replace(/<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${meta.image}" />`);

  writeFileSync(`dist/${slug}.html`, html);
  console.log(`Generated dist/${slug}.html`);
}

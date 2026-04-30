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

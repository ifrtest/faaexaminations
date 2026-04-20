// client/src/pages/References.jsx
import { useNavigate } from 'react-router-dom';

const SECTIONS = [
  {
    title: '🏛 Official FAA Source Handbooks & ACS',
    description:
      'These are the FAA handbooks and Airman Certification Standards (ACS) that all knowledge-test questions are drawn from. All free from faa.gov.',
    items: [
      {
        name: "Pilot's Handbook of Aeronautical Knowledge (FAA-H-8083-25)",
        file: 'https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/phak',
        note: 'The primary reference for all pilot knowledge tests',
        external: true,
      },
      {
        name: 'Instrument Flying Handbook (FAA-H-8083-15)',
        file: 'https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/instrument_flying_handbook',
        note: 'Core reference for IRA',
        external: true,
      },
      {
        name: 'Instrument Procedures Handbook (FAA-H-8083-16)',
        file: 'https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/instrument_procedures_handbook',
        note: 'IFR operations and procedures',
        external: true,
      },
      {
        name: 'Airplane Flying Handbook (FAA-H-8083-3)',
        file: 'https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/airplane_handbook',
        note: 'Airplane operating techniques and procedures',
        external: true,
      },
      {
        name: 'Aviation Weather Handbook (FAA-H-8083-28)',
        file: 'https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/media/faa-h-8083-28.pdf',
        note: 'Weather theory and products',
        external: true,
      },
      {
        name: 'Aeronautical Information Manual (AIM)',
        file: 'https://www.faa.gov/air_traffic/publications/',
        note: 'Official guide to flight procedures, ATC, and airspace',
        external: true,
      },
      {
        name: 'FAR — Title 14 CFR (Federal Aviation Regulations)',
        file: 'https://www.ecfr.gov/current/title-14',
        note: 'The regulations — Parts 61, 91, 141, etc.',
        external: true,
      },
      {
        name: 'Private Pilot — Airplane ACS (FAA-S-ACS-6)',
        file: 'https://www.faa.gov/training_testing/testing/acs',
        note: 'Standards for PAR knowledge test',
        external: true,
      },
      {
        name: 'Instrument Rating — Airplane ACS (FAA-S-ACS-8)',
        file: 'https://www.faa.gov/training_testing/testing/acs',
        note: 'Standards for IRA knowledge test',
        external: true,
      },
      {
        name: 'Commercial Pilot — Airplane ACS (FAA-S-ACS-7)',
        file: 'https://www.faa.gov/training_testing/testing/acs',
        note: 'Standards for CAX knowledge test',
        external: true,
      },
    ],
  },
  {
    title: '📘 FAA Official Testing Supplements',
    description: 'Official FAA reference booklets — these are the exact figures and charts used on your real FAA written exam.',
    items: [
      {
        name: 'Instrument Rating (IRA) — Airman Knowledge Testing Supplement',
        file: '/references/instrument_rating_akts.pdf',
        note: 'Figures and charts for IRA exam',
      },
    ],
  },
  {
    title: '📊 Performance Charts',
    description: 'Aircraft performance charts used in practice questions.',
    items: [
      { name: 'Airspeed Correction Chart', file: '/172-Airspeed-Correction-Chart.pdf' },
      { name: 'C150 Cruise Performance Charts', file: '/C150-Cruise-Performance-Charts.pdf' },
      { name: 'C150 Landing Distance Chart', file: '/C150-Landing-Distance-Chart.pdf' },
      { name: 'C150 Short-Field Take-off Chart', file: '/C150-Short-Field-Take-off-Chart.pdf' },
      { name: 'C17R Time/Fuel in Climb Chart', file: '/C17R-Time-Fuel-in-Climb-Chart.pdf' },
      { name: 'Cruise Performance Chart', file: '/Cruise-Performance-Chart.pdf' },
      { name: 'Rate of Climb Chart', file: '/Rate-of-Climb-Chart.pdf' },
      { name: 'Stall Speed Chart', file: '/Stall-Speed-Chart.pdf' },
      { name: 'Crosswind Chart', file: '/Crosswind-chart.pdf' },
    ],
  },
  {
    title: '⚖ Weight & Balance',
    description: 'Weight and balance reference charts.',
    items: [
      { name: 'Weight and Balance Chart 1', file: '/Weight-and-Balance-Chart-1.pdf' },
      { name: 'Weight and Balance Chart 2', file: '/Weight-and-Balance-Chart-2.pdf' },
      { name: 'W&B Loading Chart', file: '/WB-Loading-Chart.png' },
    ],
  },
  {
    title: '🛫 Takeoff & Landing',
    description: 'Takeoff distance reference charts.',
    items: [
      { name: 'Takeoff Distance Chart (3)', file: '/Take-Distance-chart-3.pdf' },
      { name: 'Takeoff Distance Chart (4)', file: '/Take-Distance-chart-4.pdf' },
    ],
  },
  {
    title: '🧭 Instruments',
    description: 'Flight instrument diagrams and reference tables.',
    items: [
      { name: 'Turn Coordinator Diagram', file: '/1920px-Turn_coordinators-en.svg_.png' },
      { name: 'Airspeed Correction Table', file: '/airspeed_correction_table.png' },
    ],
  },
];

export default function References() {
  const navigate = useNavigate();

  return (
    <div className="container page" style={{ maxWidth: 960 }}>
      <h1>Free FAA Study References</h1>
      <p style={{ color: 'var(--text2)', marginBottom: 32, lineHeight: 1.7, fontSize: '1.05rem' }}>
        Every official FAA handbook, Airman Certification Standard (ACS), and testing supplement
        you need to pass your written exam — all free, all in one place. Bookmark this page.
      </p>

      {SECTIONS.map((section) => (
        <div key={section.title} className="card" style={{ marginBottom: 24 }}>
          <div className="card-title">{section.title}</div>
          <p style={{ color: 'var(--text2)', marginBottom: 16, lineHeight: 1.6 }}>
            {section.description}
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {section.items.map((item) => (
              <li
                key={item.file}
                style={{
                  padding: '12px 14px',
                  borderRadius: 8,
                  background: 'var(--panel2)',
                  marginBottom: 8,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                  flexWrap: 'wrap',
                }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ color: 'var(--text)', fontWeight: 600 }}>{item.name}</div>
                  {item.note && (
                    <div style={{ color: 'var(--text2)', fontSize: '.85rem', marginTop: 2 }}>
                      {item.note}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a
                    href={item.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    style={{
                      background: 'var(--blue)',
                      color: '#fff',
                      fontSize: '.9rem',
                      padding: '6px 12px',
                    }}>
                    {item.external ? 'Open ↗' : 'View / Download'}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ marginTop: 12 }}>
        ← Go back
      </button>
    </div>
  );
}

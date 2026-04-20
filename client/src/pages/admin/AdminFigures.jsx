// client/src/pages/admin/AdminFigures.jsx
// Tool for linking unmatched IRA questions to the correct FAA figure.
import { useEffect, useState } from 'react';
import { questions as qApi } from '../../api/client';
import { Spinner } from '../../components/ProtectedRoute';

// All available FAA figure numbers (from client/public/ira-figures-faa/)
const FAA_FIGURES = [
  '2','3','4','5','7','13','18','19','20','24','31','34','40','47','48','53','59','61',
  '64','65','66','67','71','71A','76','78','81','82','86','87','88','89','90','91','94',
  '95','96','97','98','99','106','109','110','111','112','113','114','115','116','131',
  '134','135','136','137','138','139','140','141','142','144','145','146','147','148',
  '149','150','151','155','156','157','158','159','160','161','162','163','164','165',
  '166','167','168','169','170','171','172','172A','173','174','175','176','176A','177',
  '178','179','180','181','182','183','184','185','186','187','188','189','190','191',
  '192','193','194','195','196','197','198','199','200','201','202','203','203A','204',
  '205','206','208','209','210','211','212','213','214','215','216','216A','217','218',
  '219','220','221','222','223','224','225','226','227','228','229','230','231','232',
  '233','234','235','236','237','238','239','240','241','242','243','244','245','247',
  '248','249','250','251','252','253','254','255','256','257','258','259','260','261',
  '262','263','264','265','266','267','268','269','270','271'
];

export default function AdminFigures() {
  const [list, setList] = useState(null);
  const [saving, setSaving] = useState({});
  const [picks, setPicks] = useState({}); // { questionId: figureNumber }
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState('');
  const [previewFig, setPreviewFig] = useState(null);

  useEffect(() => {
    // Grab all IRA questions (up to 1000), filter client-side
    qApi.list({ exam: 'IRA', pageSize: 1000 })
      .then((d) => setList(d.questions || []))
      .catch(() => setList([]));
  }, []);

  const stripHtml = (html) => (html || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

  const candidates = (list || []).filter((q) => {
    if (q.image_url) return showAll;
    // Already has image unless showAll
    const text = stripHtml(q.question_text);
    if (!text) return false;
    // Questions likely needing a figure: mention chart/approach/RWY/VOR/intersection/airway/MEA/TDZE/MDA
    const looksLikeChart = /\b(figure|refer to|chart|RWY \d|VOR|VORTAC|ILS|LOC|MEA|MOCA|MDA|MSA|TDZE|approach|airport|V\d+|J\d+|intersection|VOR\/DME)\b/i.test(text);
    if (!looksLikeChart && !showAll) return false;
    if (filter) {
      const f = filter.toLowerCase();
      if (!text.toLowerCase().includes(f) && String(q.id) !== f) return false;
    }
    return true;
  });

  const save = async (q) => {
    const fig = picks[q.id];
    if (!fig) return;
    setSaving((s) => ({ ...s, [q.id]: true }));
    try {
      const newUrl = `/ira-figures-faa/figure-${fig}.jpg`;
      await qApi.update(q.id, { ...q, image_url: newUrl });
      setList((l) => l.map((x) => (x.id === q.id ? { ...x, image_url: newUrl } : x)));
    } finally {
      setSaving((s) => ({ ...s, [q.id]: false }));
    }
  };

  const clearImage = async (q) => {
    if (!window.confirm('Remove the figure from this question?')) return;
    setSaving((s) => ({ ...s, [q.id]: true }));
    try {
      await qApi.update(q.id, { ...q, image_url: '' });
      setList((l) => l.map((x) => (x.id === q.id ? { ...x, image_url: '' } : x)));
    } finally {
      setSaving((s) => ({ ...s, [q.id]: false }));
    }
  };

  if (list === null) return <Spinner />;

  return (
    <>
      <h2>Link IRA Figures</h2>
      <p style={{ color: 'var(--muted)', marginTop: -8 }}>
        For each IRA question below, pick the correct FAA figure number and click Save.
        Click "Preview" next to any figure number to see it before saving.
      </p>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '14px 0', flexWrap: 'wrap' }}>
        <input
          placeholder="Filter by text or question ID…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ minWidth: 260, flex: 1 }}
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} />
          Show all IRA questions (including already-linked)
        </label>
        <span style={{ color: 'var(--muted)', fontSize: '.88rem' }}>
          {candidates.length} shown
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {candidates.map((q) => (
          <div key={q.id} className="card" style={{ padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 300 }}>
                <div style={{ fontSize: '.78rem', color: 'var(--muted)', marginBottom: 4 }}>
                  Q #{q.id} · {q.topic_name || 'No topic'}
                </div>
                <div style={{ color: 'var(--text)' }}>{stripHtml(q.question_text)}</div>
                {q.image_url && (
                  <div style={{ fontSize: '.8rem', color: 'var(--blue)', marginTop: 6 }}>
                    Current: <a href={q.image_url} target="_blank" rel="noopener noreferrer">{q.image_url}</a>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <select
                  value={picks[q.id] || ''}
                  onChange={(e) => setPicks((p) => ({ ...p, [q.id]: e.target.value }))}
                  style={{ minWidth: 140 }}>
                  <option value="">— pick figure —</option>
                  {FAA_FIGURES.map((n) => (
                    <option key={n} value={n}>Figure {n}</option>
                  ))}
                </select>
                <button
                  className="btn btn-ghost btn-sm"
                  disabled={!picks[q.id]}
                  onClick={() => setPreviewFig(picks[q.id])}>
                  Preview
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  disabled={!picks[q.id] || saving[q.id]}
                  onClick={() => save(q)}>
                  {saving[q.id] ? 'Saving…' : 'Save'}
                </button>
                {q.image_url && (
                  <button
                    className="btn btn-ghost btn-sm"
                    disabled={saving[q.id]}
                    onClick={() => clearImage(q)}
                    style={{ color: 'var(--red)', borderColor: 'var(--red)' }}>
                    Unlink
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {previewFig && (
        <div
          onClick={() => setPreviewFig(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,.85)',
            display: 'grid', placeItems: 'center', zIndex: 100, padding: 20, cursor: 'zoom-out',
          }}>
          <div style={{ maxWidth: '92vw', maxHeight: '92vh', textAlign: 'center' }}>
            <div style={{ color: '#fff', marginBottom: 10, fontWeight: 700 }}>Figure {previewFig}</div>
            <img
              src={`/ira-figures-faa/figure-${previewFig}.jpg`}
              alt={`Figure ${previewFig}`}
              style={{ maxWidth: '100%', maxHeight: '82vh', borderRadius: 8 }}
            />
            <div style={{ color: '#bcd', marginTop: 8, fontSize: '.85rem' }}>Click anywhere to close</div>
          </div>
        </div>
      )}
    </>
  );
}

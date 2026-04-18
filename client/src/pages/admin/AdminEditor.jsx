// client/src/pages/admin/AdminEditor.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { questions as qApi, quizzes as qzApi } from '../../api/client';
import { Spinner } from '../../components/ProtectedRoute';

const blank = {
  exam_code:      'PAR',
  topic_name:     '',
  question_text:  '',
  choice_a: '', choice_b: '', choice_c: '', choice_d: '',
  correct_answer: 'A',
  explanation:    '',
  image_url:      '',
  difficulty:     'medium',
  is_active:      true,
};

export default function AdminEditor() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm]   = useState(blank);
  const [loading, setL]   = useState(editing);
  const [exams, setExams] = useState([]);
  const [err, setErr]     = useState('');
  const [msg, setMsg]     = useState('');
  const [busy, setBusy]   = useState(false);
  const [uploading, setU] = useState(false);

  useEffect(() => {
    qzApi.exams().then((d) => setExams(d.exams || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!editing) return;
    qApi.get(id)
      .then(({ question }) => {
        setForm({
          exam_code: question.exam_code,
          topic_name: question.topic_name || '',
          question_text: question.question_text,
          choice_a: question.choice_a || '',
          choice_b: question.choice_b || '',
          choice_c: question.choice_c || '',
          choice_d: question.choice_d || '',
          correct_answer: question.correct_answer,
          explanation: question.explanation || '',
          image_url: question.image_url || '',
          difficulty: question.difficulty || 'medium',
          is_active: question.is_active,
        });
      })
      .catch((ex) => setErr(ex.response?.data?.error || 'Could not load question.'))
      .finally(() => setL(false));
  }, [id, editing]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const upload = async (file) => {
    if (!file) return;
    setU(true); setErr('');
    try {
      const { url } = await qApi.upload(file);
      set({ image_url: url });
    } catch (ex) {
      setErr(ex.response?.data?.error || 'Upload failed.');
    } finally { setU(false); }
  };

  const save = async (e) => {
    e.preventDefault();
    setErr(''); setMsg('');
    if (!form.question_text.trim()) return setErr('Question text is required.');
    const letter = form.correct_answer;
    if (!form[`choice_${letter.toLowerCase()}`]) {
      return setErr(`The selected correct answer (${letter}) has no matching choice text.`);
    }
    setBusy(true);
    try {
      if (editing) {
        await qApi.update(id, form);
        setMsg('Question updated.');
      } else {
        const { question } = await qApi.create(form);
        navigate(`/admin/questions/${question.id}`, { replace: true });
        setMsg('Question created.');
      }
    } catch (ex) {
      setErr(ex.response?.data?.error || 'Save failed.');
    } finally { setBusy(false); }
  };

  if (loading) return <Spinner />;

  return (
    <div className="card" style={{padding:28}}>
      <div className="card-header">
        <div className="card-title">{editing ? `Edit question #${id}` : 'New question'}</div>
      </div>

      {err && <div className="alert alert-err">{err}</div>}
      {msg && <div className="alert alert-ok">{msg}</div>}

      <form onSubmit={save}>
        <div className="row-2">
          <div className="field">
            <label>Exam</label>
            <select value={form.exam_code} onChange={(e) => set({ exam_code: e.target.value })}>
              {exams.map((e) => <option key={e.code} value={e.code}>{e.code} — {e.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Topic (name — auto-created if new)</label>
            <input value={form.topic_name} onChange={(e) => set({ topic_name: e.target.value })}
                   placeholder="e.g. Weather, Aerodynamics" />
          </div>
        </div>

        <div className="field">
          <label>Question text</label>
          <textarea rows={3} required value={form.question_text}
                    onChange={(e) => set({ question_text: e.target.value })} />
        </div>

        {['a','b','c','d'].map((k) => (
          <div className="field" key={k}>
            <label>Choice {k.toUpperCase()}</label>
            <input value={form[`choice_${k}`]} onChange={(e) => set({ [`choice_${k}`]: e.target.value })}
                   placeholder={k === 'd' ? 'Optional (leave empty if 3-choice question)' : ''} />
          </div>
        ))}

        <div className="row-2">
          <div className="field">
            <label>Correct answer</label>
            <select value={form.correct_answer} onChange={(e) => set({ correct_answer: e.target.value })}>
              {['A','B','C','D'].map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Difficulty</label>
            <select value={form.difficulty} onChange={(e) => set({ difficulty: e.target.value })}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label>Explanation / reference</label>
          <textarea rows={3} value={form.explanation}
                    onChange={(e) => set({ explanation: e.target.value })} />
        </div>

        <div className="field">
          <label>Image (optional)</label>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <input type="file" accept="image/*" onChange={(e) => upload(e.target.files?.[0])} />
            {uploading && <span style={{color:'var(--muted)'}}>Uploading…</span>}
          </div>
          {form.image_url && (
            <div style={{marginTop:10}}>
              <img src={form.image_url} alt="preview" style={{maxWidth:300,borderRadius:8,border:'1px solid var(--line)'}} />
              <div style={{marginTop:6}}>
                <code style={{fontSize:'.8rem',color:'var(--muted)'}}>{form.image_url}</code>
                <button type="button" className="btn btn-ghost btn-sm" style={{marginLeft:10}}
                        onClick={() => set({ image_url: '' })}>Remove</button>
              </div>
            </div>
          )}
        </div>

        {editing && (
          <div className="field">
            <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer'}}>
              <input type="checkbox" checked={form.is_active}
                     onChange={(e) => set({ is_active: e.target.checked })}
                     style={{width:'auto'}} />
              Active (appears in exams)
            </label>
          </div>
        )}

        <div style={{display:'flex',gap:10}}>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? 'Saving…' : (editing ? 'Save changes' : 'Create question')}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/admin/questions')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// client/src/pages/QuizRunner.jsx
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { quizzes as quizApi } from '../api/client';
import { Spinner } from '../components/ProtectedRoute';

const LETTERS = ['A', 'B', 'C', 'D'];

export default function QuizRunner() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession]     = useState(null);
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx]             = useState(0);
  const [answers, setAnswers]     = useState({});   // { questionId: 'A' }
  const [flagged, setFlagged]     = useState(new Set());
  const [revealed, setRevealed]   = useState(new Set()); // study-mode: which ids have been checked
  const [err, setErr]             = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmSubmit, setConfirm] = useState(false);
  const [aiResponse, setAiResponse]   = useState({});  // { [questionId]: text }
  const [aiLoading, setAiLoading]     = useState(false);

  // Timer state
  const [secondsLeft, setSecondsLeft] = useState(null); // null = untimed
  const timerRef = useRef(null);

  // --------------- Load session + questions --------------------------
  useEffect(() => {
    (async () => {
      try {
        const { session, questions } = await quizApi.session(id);
        if (session.status === 'completed') {
          // Find the linked result row and route there.
          try {
            const { results } = await (await import('../api/client')).results.mine();
            const match = (results || []).find((r) => r.session_id === session.id);
            if (match) { navigate(`/results/${match.id}`, { replace: true }); return; }
          } catch { /* fall through */ }
          navigate('/results', { replace: true });
          return;
        }
        setSession(session);
        setQuestions(questions);
        setIdx(session.current_index || 0);
        setAnswers(session.answers || {});
        setFlagged(new Set(session.flagged_ids || []));

        if (session.mode === 'exam' && session.time_limit > 0) {
          const started = new Date(session.started_at).getTime();
          const elapsed = Math.floor((Date.now() - started) / 1000);
          const remaining = session.time_limit * 60 - elapsed;
          setSecondsLeft(Math.max(0, remaining));
        }
      } catch (ex) {
        setErr(ex.response?.data?.error || 'Could not load quiz session.');
      }
    })();
  }, [id, navigate]);

  // --------------- Tick timer ---------------------------------------
  useEffect(() => {
    if (secondsLeft === null) return;
    if (secondsLeft <= 0) { handleSubmit(); return; }
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => (s === null ? null : s - 1));
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft !== null, secondsLeft === 0]);

  // --------------- Helpers ------------------------------------------
  const current = questions[idx];

  const isStudyMode = session?.mode === 'study';
  const isRevealed  = current && (isStudyMode && revealed.has(current.id));

  const persist = useCallback(async (patch) => {
    if (!current) return;
    try {
      await quizApi.answer(id, {
        question_id: current.id,
        answer: patch.answer !== undefined ? patch.answer : (answers[current.id] || null),
        flagged: patch.flagged,
        current_index: patch.current_index !== undefined ? patch.current_index : idx,
      });
    } catch {
      // Non-blocking; local state is already updated.
    }
  }, [id, current, answers, idx]);

  const choose = (letter) => {
    if (!current) return;
    if (isStudyMode && revealed.has(current.id)) return; // locked after reveal
    setAnswers((a) => ({ ...a, [current.id]: letter }));
    persist({ answer: letter });
  };

  const toggleFlag = () => {
    if (!current) return;
    setFlagged((s) => {
      const next = new Set(s);
      const on = !next.has(current.id);
      on ? next.add(current.id) : next.delete(current.id);
      persist({ flagged: on });
      return next;
    });
  };

  const go = (nextIdx) => {
    const bounded = Math.max(0, Math.min(questions.length - 1, nextIdx));
    setIdx(bounded);
    persist({ current_index: bounded });
  };

  const revealInStudyMode = () => {
    if (!isStudyMode || !current) return;
    if (!answers[current.id]) return;
    setRevealed((s) => new Set(s).add(current.id));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    clearInterval(timerRef.current);
    try {
      const { result } = await quizApi.submit(id);
      navigate(`/results/${result.id}`, { replace: true });
    } catch (ex) {
      setErr(ex.response?.data?.error || 'Could not submit the exam.');
      setSubmitting(false);
    }
  };

  const abandon = async () => {
    if (!window.confirm('Abandon this session? Your progress will be saved but this attempt will not count.')) return;
    try { await quizApi.abandon(id); } catch { /* ignore */ }
    navigate('/dashboard');
  };

  const askAI = async () => {
    if (!current || aiLoading) return;
    setAiLoading(true);
    try {
      const choices = {};
      LETTERS.forEach((l) => {
        const t = current[`choice_${l.toLowerCase()}`];
        if (t) choices[l] = t;
      });
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('faa_token')}`,
        },
        body: JSON.stringify({
          question:        current.question_text,
          choices,
          correct_answer:  current.correct_answer,
          selected_answer: answers[current.id] || null,
          explanation:     current.explanation || '',
          topic:           current.topic_name || '',
        }),
      });
      const data = await res.json();
      if (data.response) {
        setAiResponse((prev) => ({ ...prev, [current.id]: data.response }));
      }
    } catch {
      setAiResponse((prev) => ({ ...prev, [current.id]: 'Could not reach AI Instructor right now. Try again.' }));
    } finally {
      setAiLoading(false);
    }
  };

  // Keyboard shortcuts: 1-4 pick, arrows navigate, F flag, Enter = next
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (!current) return;
      if (['1','2','3','4'].includes(e.key)) {
        const letter = LETTERS[parseInt(e.key, 10) - 1];
        if (current[`choice_${letter.toLowerCase()}`]) choose(letter);
      }
      else if (e.key === 'ArrowRight' || e.key === 'Enter') go(idx + 1);
      else if (e.key === 'ArrowLeft') go(idx - 1);
      else if (e.key.toLowerCase() === 'f') toggleFlag();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, idx, answers]);

  if (err)    return <div className="container page"><div className="alert alert-err">{err}</div><Link to="/dashboard">Back to dashboard</Link></div>;
  if (!session || !current) return <div className="container page"><Spinner /></div>;

  const total       = questions.length;
  const answered    = Object.keys(answers).length;
  const progressPct = Math.round(((idx + 1) / total) * 100);

  const timerClass = secondsLeft === null ? '' :
    secondsLeft < 60 ? 'danger' :
    secondsLeft < 300 ? 'warning' : '';

  return (
    <div className="container page">
      <div className="quiz-topbar">
        <div>
          <strong style={{color:'var(--navy)'}}>{session.mode === 'exam' ? 'Exam Simulation' : 'Study Mode'}</strong>
          <span className="quiz-progress" style={{marginLeft:12}}>
            Question {idx + 1} of {total} · {answered} answered · {flagged.size} flagged
          </span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          {secondsLeft !== null && (
            <div className={`quiz-timer ${timerClass}`}>{formatTime(secondsLeft)}</div>
          )}
          <button className="btn btn-ghost btn-sm" onClick={abandon}>Exit</button>
          <button className="btn btn-gold btn-sm" onClick={() => setConfirm(true)} disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit'}
          </button>
        </div>
      </div>

      {/* slim progress bar */}
      <div className="bar" style={{height:3,marginBottom:12}}>
        <div style={{width:`${progressPct}%`,background:'var(--navy)'}} />
      </div>

      <div className="quiz-layout">
        {/* ---- question panel ---- */}
        <div>
          <div className="card question-card">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <span className="badge">Question {idx + 1}</span>
              <button className={`flag-btn ${flagged.has(current.id) ? 'on' : ''}`} onClick={toggleFlag} title="Flag (F)">
                {flagged.has(current.id) ? '🚩 Flagged' : '🏳  Flag for review'}
              </button>
            </div>

            <div
              className="question-text"
              dangerouslySetInnerHTML={{ __html: current.question_text }}
            />
            {current.image_url && (
              <img className="question-image" src={current.image_url} alt="Reference" />
            )}

            {LETTERS.map((letter) => {
              const text = current[`choice_${letter.toLowerCase()}`];
              if (!text) return null;

              const selected = answers[current.id] === letter;
              let className = 'choice';
              if (selected) className += ' selected';

              // In study mode after reveal, show correctness
              if (isRevealed) {
                if (letter === current.correct_answer) className += ' correct';
                else if (selected) className += ' wrong';
              }

              return (
                <div key={letter} className={className} onClick={() => choose(letter)}>
                  <div className="letter">{letter}</div>
                  <div className="text" dangerouslySetInnerHTML={{ __html: text }} />
                </div>
              );
            })}

            {/* Study mode: reveal / explanation */}
            {isStudyMode && (
              isRevealed ? (
                <div className="explanation">
                  <div style={{marginBottom:8}}>
                    <strong>Correct answer:</strong> {current.correct_answer}
                  </div>
                  <div>
                    <strong>Explanation:</strong>{' '}
                    {current.explanation
                      ? <span dangerouslySetInnerHTML={{ __html: current.explanation }} />
                      : 'No explanation is available for this question.'}
                  </div>
                  <div style={{marginTop:14}}>
                    <button
                      onClick={askAI}
                      disabled={aiLoading || !!aiResponse[current.id]}
                      style={{
                        display:'inline-flex',alignItems:'center',gap:8,
                        background:'transparent',border:'1px solid var(--blue)',
                        color:'var(--blue)',borderRadius:8,padding:'8px 16px',
                        cursor: aiLoading || aiResponse[current.id] ? 'default' : 'pointer',
                        fontSize:'.9rem',fontWeight:600,
                        opacity: aiLoading || aiResponse[current.id] ? 0.6 : 1,
                      }}>
                      🤖 {aiLoading ? 'Thinking…' : aiResponse[current.id] ? 'AI Instructor' : 'Ask AI Instructor'}
                    </button>
                    {aiResponse[current.id] && (
                      <div style={{marginTop:10,padding:'12px 16px',background:'var(--panel2)',
                                   borderLeft:'3px solid var(--blue)',borderRadius:'0 8px 8px 0'}}>
                        <strong style={{color:'var(--blue)',fontSize:'.85rem'}}>✈ AI Instructor</strong>
                        <p style={{margin:'8px 0 0',color:'var(--text2)',lineHeight:1.6,fontSize:'.92rem'}}>
                          {aiResponse[current.id]}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <button className="btn btn-ghost" onClick={revealInStudyMode}
                        style={{marginTop:14}} disabled={!answers[current.id]}>
                  {answers[current.id] ? 'Check answer' : 'Pick an answer first'}
                </button>
              )
            )}

            <div className="quiz-footer">
              <button className="btn btn-ghost" onClick={() => go(idx - 1)} disabled={idx === 0}>
                ← Previous
              </button>
              {idx === total - 1 ? (
                <button className="btn btn-primary" onClick={() => setConfirm(true)} disabled={submitting}>
                  Finish &amp; Submit
                </button>
              ) : (
                <button className="btn btn-primary" onClick={() => go(idx + 1)}>Next →</button>
              )}
            </div>
          </div>

          <div style={{color:'var(--muted)',fontSize:'.82rem',marginTop:10,textAlign:'center'}}>
            Shortcuts: <kbd>1-4</kbd> select · <kbd>←/→</kbd> navigate · <kbd>F</kbd> flag · <kbd>Enter</kbd> next
          </div>
        </div>

        {/* ---- nav panel ---- */}
        <div>
          <div className="q-nav">
            <h4>Question navigator</h4>
            <div className="q-nav-grid">
              {questions.map((q, i) => {
                let cls = '';
                if (answers[q.id]) cls = 'answered';
                if (flagged.has(q.id)) cls = 'flagged';
                if (i === idx) cls = 'current';
                return (
                  <button key={q.id} className={cls} onClick={() => go(i)}>
                    {i + 1}
                  </button>
                );
              })}
            </div>
            <div className="q-nav-legend">
              <span><i /> Answered</span>
              <span><i className="f" /> Flagged</span>
            </div>
            <hr style={{border:0,borderTop:'1px solid var(--line)',margin:'14px 0'}} />
            <div style={{fontSize:'.85rem',color:'var(--muted)'}}>
              <div style={{marginBottom:6}}>Answered: <strong style={{color:'var(--ink)'}}>{answered}/{total}</strong></div>
              <div style={{marginBottom:6}}>Flagged: <strong style={{color:'var(--ink)'}}>{flagged.size}</strong></div>
              <div>Remaining: <strong style={{color:'var(--ink)'}}>{total - answered}</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit confirmation modal */}
      {confirmSubmit && (
        <div onClick={() => setConfirm(false)}
             style={{position:'fixed',inset:0,background:'rgba(15,23,42,.55)',
                     display:'grid',placeItems:'center',zIndex:100}}>
          <div onClick={(e) => e.stopPropagation()} className="card"
               style={{maxWidth:460,width:'90%',padding:28}}>
            <h3>Submit exam?</h3>
            <p style={{color:'var(--muted)'}}>
              You have answered <strong>{answered}</strong> of <strong>{total}</strong> questions.
              {answered < total && ' Unanswered questions will be marked incorrect.'}
            </p>
            <div style={{display:'flex',gap:10,marginTop:18}}>
              <button className="btn btn-ghost btn-block" onClick={() => setConfirm(false)}>Keep working</button>
              <button className="btn btn-primary btn-block" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(totalSec) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

// client/src/pages/Result.jsx
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { results as resultsApi } from '../api/client';
import { Spinner } from '../components/ProtectedRoute';

const LETTERS = ['A', 'B', 'C', 'D'];

export default function Result() {
  const { id } = useParams();
  const [data, setData]   = useState(null);
  const [err, setErr]     = useState('');
  const [filter, setFilter] = useState('all'); // all | wrong | correct

  useEffect(() => {
    resultsApi.one(id)
      .then(setData)
      .catch((ex) => setErr(ex.response?.data?.error || 'Could not load result.'));
  }, [id]);

  if (err)  return <div className="container page"><div className="alert alert-err">{err}</div></div>;
  if (!data) return <div className="container page"><Spinner /></div>;

  const { result, detail } = data;
  const score    = Number(result.score);
  const passed   = result.passed;
  const duration = formatDuration(result.duration_sec);
  const topics   = Object.entries(result.topic_breakdown || {});

  const filtered = detail.filter((q) => {
    if (filter === 'wrong')   return !q.is_correct;
    if (filter === 'correct') return q.is_correct;
    return true;
  });

  return (
    <div className="container page">
      <div className={`result-hero ${passed ? 'pass' : 'fail'}`}>
        <div style={{opacity:.9,textTransform:'uppercase',letterSpacing:'.08em',fontSize:'.85rem'}}>
          {result.exam_code} — {result.exam_name}
        </div>
        <div className="big">{score.toFixed(1)}%</div>
        <div style={{marginTop:4,fontSize:'1.25rem',fontWeight:700}}>
          {passed ? '✓ PASSED' : '✗ DID NOT PASS'}
        </div>
        <div className="small">
          {result.correct_count} of {result.total_questions} correct · {duration}
        </div>
      </div>

      {/* Summary tiles */}
      <div className="result-row" style={{marginBottom:24}}>
        <div className="stat">
          <div className="label">Correct</div>
          <div className="value" style={{color:'var(--ok)'}}>{result.correct_count}</div>
        </div>
        <div className="stat">
          <div className="label">Incorrect</div>
          <div className="value" style={{color:'var(--err)'}}>{result.total_questions - result.correct_count}</div>
        </div>
        <div className="stat">
          <div className="label">Time taken</div>
          <div className="value" style={{fontSize:'1.6rem'}}>{duration}</div>
        </div>
        <div className="stat">
          <div className="label">Score</div>
          <div className="value">{score.toFixed(0)}%</div>
        </div>
      </div>

      {/* Topic breakdown */}
      {topics.length > 0 && (
        <div className="card" style={{marginBottom:20}}>
          <div className="card-header">
            <div className="card-title">Performance by topic</div>
          </div>
          {topics
            .sort((a, b) => (a[1].correct / a[1].total) - (b[1].correct / b[1].total))
            .map(([topic, stats]) => {
            const pct = Math.round((stats.correct / stats.total) * 100);
            const color = pct < 60 ? '#EF4444' : pct < 75 ? '#F59E0B' : '#16A34A';
            return (
              <div key={topic} className="weak-topic-row">
                <div style={{flex:1}}>
                  <div className="name">{topic}</div>
                  <div className="bar"><div style={{width:`${pct}%`,background:color}} /></div>
                </div>
                <div className="acc" style={{marginLeft:12,minWidth:80,textAlign:'right'}}>
                  <strong style={{color:'var(--ink)'}}>{pct}%</strong>
                  <div style={{fontSize:'.75rem'}}>{stats.correct}/{stats.total}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Question review</div>
          <div style={{display:'flex',gap:6}}>
            {['all','wrong','correct'].map((f) => (
              <button key={f}
                      className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setFilter(f)}>
                {f === 'all' ? 'All' : f === 'wrong' ? 'Incorrect' : 'Correct'}
              </button>
            ))}
          </div>
        </div>

        {filtered.map((q, i) => (
          <div key={q.id} className={`review-q ${q.is_correct ? 'correct' : 'wrong'}`}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
              <span style={{fontWeight:700,color:'var(--muted)'}}>Q{i + 1}</span>
              <span className={`badge ${q.is_correct ? 'badge-ok' : 'badge-err'}`}>
                {q.is_correct ? 'Correct' : 'Incorrect'}
              </span>
            </div>
            <div style={{marginBottom:10,color:'var(--ink)'}}>{q.question_text}</div>
            {q.image_url && <img src={q.image_url} alt="" className="question-image" />}

            {LETTERS.map((letter) => {
              const text = q[`choice_${letter.toLowerCase()}`];
              if (!text) return null;
              const isCorrect  = letter === q.correct_answer;
              const isSelected = letter === q.selected_answer;
              let cls = 'choice';
              if (isCorrect)          cls += ' correct';
              else if (isSelected)    cls += ' wrong';
              return (
                <div key={letter} className={cls} style={{cursor:'default'}}>
                  <div className="letter">{letter}</div>
                  <div className="text">
                    {text}
                    {isSelected && !isCorrect && <em style={{marginLeft:8,color:'var(--err)'}}>(your answer)</em>}
                    {isCorrect && <em style={{marginLeft:8,color:'var(--ok)'}}>(correct)</em>}
                  </div>
                </div>
              );
            })}

            {q.explanation && (
              <div className="explanation">
                <strong>Explanation:</strong> {q.explanation}
              </div>
            )}
            {q.topic_name && (
              <div style={{color:'var(--muted)',fontSize:'.82rem',marginTop:8}}>
                Topic: {q.topic_name}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{display:'flex',gap:10,justifyContent:'center',marginTop:24}}>
        <Link to="/dashboard" className="btn btn-ghost">Back to dashboard</Link>
        <Link to="/exams"     className="btn btn-primary">Take another exam</Link>
      </div>
    </div>
  );
}

function formatDuration(sec) {
  if (!sec) return '0s';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

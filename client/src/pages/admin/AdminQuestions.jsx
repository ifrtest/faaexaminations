// client/src/pages/admin/AdminQuestions.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { questions as qApi, quizzes as qzApi } from '../../api/client';
import { Spinner } from '../../components/ProtectedRoute';

export default function AdminQuestions() {
  const [list, setList]       = useState(null);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [exam, setExam]       = useState('');
  const [exams, setExams]     = useState([]);
  const [search, setSearch]   = useState('');
  const [searchInput, setSI]  = useState('');
  const pageSize = 25;

  useEffect(() => {
    qzApi.exams().then((d) => setExams(d.exams || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setList(null);
    qApi.list({ page, pageSize, exam: exam || undefined, search: search || undefined })
      .then((d) => {
        setList(d.questions);
        setTotal(d.total);
      })
      .catch(() => setList([]));
  }, [page, exam, search]);

  const applySearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const onDelete = async (id) => {
    if (!window.confirm('Deactivate this question? It will no longer appear in exams.')) return;
    await qApi.remove(id);
    setList((l) => l.filter((q) => q.id !== id));
  };

  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <>
      <div className="admin-toolbar">
        <form onSubmit={applySearch} style={{display:'flex',flex:1,gap:8}}>
          <input placeholder="Search question text…" value={searchInput}
                 onChange={(e) => setSI(e.target.value)} />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
        <select value={exam} onChange={(e) => { setExam(e.target.value); setPage(1); }}>
          <option value="">All exams</option>
          {exams.map((e) => <option key={e.code} value={e.code}>{e.code} — {e.name}</option>)}
        </select>
        <Link to="/admin/questions/new" className="btn btn-gold">+ New question</Link>
      </div>

      <div className="card" style={{padding:0}}>
        {list === null ? <Spinner /> :
          list.length === 0 ? <div className="empty">No questions found.</div> : (
          <table className="data">
            <thead>
              <tr>
                <th style={{width:60}}>ID</th>
                <th>Question</th>
                <th style={{width:80}}>Exam</th>
                <th>Topic</th>
                <th style={{width:80}}>Answer</th>
                <th style={{width:80}}>Active</th>
                <th style={{width:140}}></th>
              </tr>
            </thead>
            <tbody>
              {list.map((q) => (
                <tr key={q.id}>
                  <td>{q.id}</td>
                  <td style={{maxWidth:440,overflow:'hidden',textOverflow:'ellipsis'}}>
                    {q.question_text.length > 140 ? q.question_text.slice(0, 140) + '…' : q.question_text}
                  </td>
                  <td><span className="badge">{q.exam_code}</span></td>
                  <td style={{color:'var(--muted)',fontSize:'.85rem'}}>{q.topic_name || '—'}</td>
                  <td><strong>{q.correct_answer}</strong></td>
                  <td>
                    <span className={`badge ${q.is_active ? 'badge-ok' : 'badge-err'}`}>
                      {q.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <Link to={`/admin/questions/${q.id}`} className="btn btn-ghost btn-sm">Edit</Link>
                    <button onClick={() => onDelete(q.id)} className="btn btn-danger btn-sm" style={{marginLeft:6}}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="pagination">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
        <div className="page-info">Page {page} of {pages} · {total} total</div>
        <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page >= pages}>Next</button>
      </div>
    </>
  );
}

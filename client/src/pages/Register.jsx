// client/src/pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (form.password.length < 6) return setErr('Password must be at least 6 characters.');
    if (form.password !== form.confirm) return setErr('Passwords do not match.');
    setBusy(true);
    try {
      await register(form.email, form.password, form.full_name);
      if (window.fbq) fbq('track', 'Lead');
      navigate('/dashboard', { replace: true });
    } catch (ex) {
      setErr(ex.response?.data?.error || 'Could not create account.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container page center-col">
      <Helmet>
        <title>Create Your Account | FAAExaminations.com</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="card auth-card">
        <h2>Create your account</h2>
        <p className="sub">Free forever. No card needed.</p>
        {err && <div className="alert alert-err">{err}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label>Full name</label>
            <input name="full_name" value={form.full_name} onChange={onChange} autoComplete="name" />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" name="email" required autoComplete="email"
                   value={form.email} onChange={onChange} />
          </div>
          <div className="row-2">
            <div className="field">
              <label>Password</label>
              <input type="password" name="password" required autoComplete="new-password"
                     value={form.password} onChange={onChange} />
            </div>
            <div className="field">
              <label>Confirm password</label>
              <input type="password" name="confirm" required autoComplete="new-password"
                     value={form.confirm} onChange={onChange} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? 'Creating…' : 'Create account'}
          </button>
        </form>
        <div className="alt">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

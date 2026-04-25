import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate('/');
  };

  const close = () => setOpen(false);

  return (
    <nav className="nav">
      <div className="container nav-inner">
        <NavLink to="/" className="nav-brand" onClick={close}>
          <span style={{ letterSpacing: '.2px' }}>FAA<span style={{ color: 'var(--blue)' }}>Examinations</span><span style={{ color: 'var(--text2)', fontSize: '0.85em' }}>.com</span></span>
        </NavLink>

        <button
          className="nav-hamburger"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
        >
          <span /><span /><span />
        </button>

        <div className={`nav-links${open ? ' nav-links--open' : ''}`}>
          {user ? (
            <>
              <NavLink to="/dashboard" onClick={close}>Dashboard</NavLink>
              <NavLink to="/exams" onClick={close}>Practice Exams</NavLink>
              <NavLink to="/results" onClick={close}>History</NavLink>
              <NavLink to="/references" onClick={close}>References</NavLink>
              <NavLink to="/profile" onClick={close}>Profile</NavLink>
              {user.role === 'admin' && <NavLink to="/admin" onClick={close}>Admin</NavLink>}
              <button onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <NavLink to="/" onClick={close}>Home</NavLink>
              <a href="/#features" onClick={close} style={{ color: 'var(--text2)', textDecoration: 'none', padding: '6px 10px', borderRadius: 6 }}>Features</a>
              <a href="/#products" onClick={close} style={{ color: 'var(--text2)', textDecoration: 'none', padding: '6px 10px', borderRadius: 6 }}>Pricing</a>
              <NavLink to="/references" onClick={close}>Free References</NavLink>
              <NavLink to="/login" onClick={close}>Login</NavLink>
              <NavLink to="/register" onClick={close}
                style={{ background: 'var(--blue)', color: '#fff', padding: '8px 16px', borderRadius: 8, fontWeight: 700 }}>
                Get Started
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="nav">
      <div className="container nav-inner">
        <NavLink to="/" className="nav-brand">
          <span style={{ letterSpacing: '.2px' }}>FAA<span style={{ color: 'var(--blue)' }}>Examinations</span><span style={{ color: 'var(--text2)', fontSize: '0.85em' }}>.com</span></span>
        </NavLink>

        <div className="nav-links">
          {user ? (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/exams">Practice Exams</NavLink>
              <NavLink to="/results">History</NavLink>
              <NavLink to="/references">References</NavLink>
              <NavLink to="/profile">Profile</NavLink>
              {user.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
              <button onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <NavLink to="/references">References</NavLink>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register"
                style={{ background: 'var(--blue)', color: '#fff', padding: '8px 16px', borderRadius: 8, fontWeight: 700 }}>
                Start Free
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

// client/src/pages/admin/AdminLayout.jsx
import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="container page">
      <h1>Admin</h1>
      <div className="admin-layout">
        <aside className="admin-side">
          <NavLink to="/admin" end>Overview</NavLink>
          <NavLink to="/admin/questions">Questions</NavLink>
          <NavLink to="/admin/questions/new">Add question</NavLink>
          <NavLink to="/admin/users">Users</NavLink>
        </aside>
        <section>
          <Outlet />
        </section>
      </div>
    </div>
  );
}

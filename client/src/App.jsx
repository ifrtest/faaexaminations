// client/src/App.jsx
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

import Landing        from './pages/Landing';
import Login          from './pages/Login';
import Register       from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword  from './pages/ResetPassword';

import Dashboard   from './pages/Dashboard';
import ExamList    from './pages/ExamList';
import QuizRunner  from './pages/QuizRunner';
import Result      from './pages/Result';
import History     from './pages/History';
import Profile      from './pages/Profile';
import CancelPolicy from './pages/CancelPolicy';
import References   from './pages/References';

import AdminLayout    from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminQuestions from './pages/admin/AdminQuestions';
import AdminEditor    from './pages/admin/AdminEditor';
import AdminUsers     from './pages/admin/AdminUsers';
import AdminFigures   from './pages/admin/AdminFigures';
import Blog           from './pages/Blog';
import NotFound       from './pages/NotFound';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function App() {
  const { pathname } = useLocation();
  const isLanding = pathname === '/';

  return (
    <div className="app-shell">
      {!isLanding && <Navbar />}
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public */}
          <Route path="/"               element={<Landing />} />
          <Route path="/login"          element={<Login />} />
          <Route path="/register"       element={<Register />} />
          <Route path="/forgot"         element={<ForgotPassword />} />
          <Route path="/reset"          element={<ResetPassword />} />

          {/* Authenticated */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/exams"     element={<ProtectedRoute><ExamList /></ProtectedRoute>} />
          <Route path="/quiz/:id"  element={<ProtectedRoute><QuizRunner /></ProtectedRoute>} />
          <Route path="/results/:id" element={<ProtectedRoute><Result /></ProtectedRoute>} />
          <Route path="/results"   element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/profile"        element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/cancel-policy"  element={<CancelPolicy />} />
          <Route path="/references"     element={<References />} />
          <Route path="/blog"           element={<Blog />} />

          {/* Public references page */}

          {/* Admin */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index                element={<AdminDashboard />} />
            <Route path="questions"     element={<AdminQuestions />} />
            <Route path="questions/new" element={<AdminEditor />} />
            <Route path="questions/:id" element={<AdminEditor />} />
            <Route path="users"         element={<AdminUsers />} />
            <Route path="figures"       element={<AdminFigures />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isLanding && <Footer />}
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

// client/src/App.jsx
import { useEffect } from 'react';
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
import CancelPolicy  from './pages/CancelPolicy';
import Checkout      from './pages/Checkout';
import References    from './pages/References';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import About from './pages/About';

import AdminLayout    from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminQuestions from './pages/admin/AdminQuestions';
import AdminEditor    from './pages/admin/AdminEditor';
import AdminUsers     from './pages/admin/AdminUsers';
import AdminFigures   from './pages/admin/AdminFigures';
import Blog           from './pages/Blog';
import BlogPost       from './pages/BlogPost';
import NotFound       from './pages/NotFound';
import PARLanding        from './pages/PARLanding';
import IRALanding        from './pages/IRALanding';
import CAXLanding        from './pages/CAXLanding';
import Part107Landing    from './pages/Part107Landing';
import BundleLanding     from './pages/BundleLanding';
import PARPracticeTest   from './pages/PARPracticeTest';
import IRAPracticeTest   from './pages/IRAPracticeTest';
import CAXPracticeTest   from './pages/CAXPracticeTest';
import Part107PracticeTest from './pages/Part107PracticeTest';
import PARCheatSheet from './pages/PARCheatSheet';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function App() {
  const { pathname } = useLocation();
  const isLanding = ['/', '/par', '/ira', '/cax', '/part-107', '/bundle', '/checkout', '/par-practice-test', '/ira-practice-test', '/cax-practice-test', '/part-107-practice-test', '/par-cheat-sheet'].includes(pathname);

  useEffect(() => {
    // Don't override hash-based scrolling (e.g. /par#products)
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <div className="app-shell">
      {!isLanding && <Navbar />}
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public */}
          <Route path="/"               element={<Landing />} />
          <Route path="/par"            element={<PARLanding />} />
          <Route path="/ira"            element={<IRALanding />} />
          <Route path="/cax"            element={<CAXLanding />} />
          <Route path="/part-107"       element={<Part107Landing />} />
          <Route path="/bundle"              element={<BundleLanding />} />
          <Route path="/par-practice-test"   element={<PARPracticeTest />} />
          <Route path="/ira-practice-test"   element={<IRAPracticeTest />} />
          <Route path="/cax-practice-test"   element={<CAXPracticeTest />} />
          <Route path="/part-107-practice-test" element={<Part107PracticeTest />} />
          <Route path="/par-cheat-sheet"        element={<PARCheatSheet />} />
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
          <Route path="/checkout"       element={<Checkout />} />
          <Route path="/references"     element={<References />} />
          <Route path="/privacy"        element={<PrivacyPolicy />} />
          <Route path="/terms"          element={<TermsOfService />} />
          <Route path="/about"          element={<About />} />
          <Route path="/blog"           element={<Blog />} />
          <Route path="/blog/:slug"     element={<BlogPost />} />

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

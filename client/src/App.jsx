// client/src/App.jsx
import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute, AdminRoute, Spinner } from './components/ProtectedRoute';

// ── Pages loaded immediately (on the critical path / first paint) ──────────
import Landing        from './pages/Landing';
import Login          from './pages/Login';
import Register       from './pages/Register';

// ── Everything else: lazy-loaded (only fetched when user navigates there) ──
// Pre-warm chunks users land on right after login so Suspense is invisible
const _preload = () => {
  import('./pages/Dashboard');
  import('./pages/ExamList');
};
if (typeof window !== 'undefined') setTimeout(_preload, 2000);

const ForgotPassword   = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword    = lazy(() => import('./pages/ResetPassword'));
const Dashboard        = lazy(() => import('./pages/Dashboard'));
const ExamList         = lazy(() => import('./pages/ExamList'));
const QuizRunner       = lazy(() => import('./pages/QuizRunner'));
const Result           = lazy(() => import('./pages/Result'));
const History          = lazy(() => import('./pages/History'));
const Profile          = lazy(() => import('./pages/Profile'));
const CancelPolicy     = lazy(() => import('./pages/CancelPolicy'));
const Checkout         = lazy(() => import('./pages/Checkout'));
const References       = lazy(() => import('./pages/References'));
const PrivacyPolicy    = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService   = lazy(() => import('./pages/TermsOfService'));
const About            = lazy(() => import('./pages/About'));
const Blog             = lazy(() => import('./pages/Blog'));
const BlogPost         = lazy(() => import('./pages/BlogPost'));
const NotFound         = lazy(() => import('./pages/NotFound'));
const PARLanding       = lazy(() => import('./pages/PARLanding'));
const IRALanding       = lazy(() => import('./pages/IRALanding'));
const CAXLanding       = lazy(() => import('./pages/CAXLanding'));
const Part107Landing   = lazy(() => import('./pages/Part107Landing'));
const BundleLanding    = lazy(() => import('./pages/BundleLanding'));
const PARPracticeTest      = lazy(() => import('./pages/PARPracticeTest'));
const IRAPracticeTest      = lazy(() => import('./pages/IRAPracticeTest'));
const CAXPracticeTest      = lazy(() => import('./pages/CAXPracticeTest'));
const Part107PracticeTest  = lazy(() => import('./pages/Part107PracticeTest'));
const PARCheatSheet        = lazy(() => import('./pages/PARCheatSheet'));
const Part107CheatSheet    = lazy(() => import('./pages/Part107CheatSheet'));
const IRACheatSheet        = lazy(() => import('./pages/IRACheatSheet'));
const CAXCheatSheet        = lazy(() => import('./pages/CAXCheatSheet'));
const CheatSheetVerify     = lazy(() => import('./pages/CheatSheetVerify'));
const AdminLayout          = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard       = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminQuestions       = lazy(() => import('./pages/admin/AdminQuestions'));
const AdminEditor          = lazy(() => import('./pages/admin/AdminEditor'));
const AdminUsers           = lazy(() => import('./pages/admin/AdminUsers'));
const AdminUserDetail      = lazy(() => import('./pages/admin/AdminUserDetail'));
const AdminFigures         = lazy(() => import('./pages/admin/AdminFigures'));

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function App() {
  const { pathname } = useLocation();
  const isLanding = ['/', '/par', '/ira', '/cax', '/part-107', '/bundle', '/checkout', '/par-practice-test', '/ira-practice-test', '/cax-practice-test', '/part-107-practice-test', '/par-cheat-sheet', '/part-107-cheat-sheet', '/ira-cheat-sheet', '/cax-cheat-sheet'].includes(pathname) || pathname.startsWith('/cheatsheet/');

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
        <Suspense fallback={
          <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Spinner />
          </div>
        }>
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
            <Route path="/par-cheat-sheet"          element={<PARCheatSheet />} />
            <Route path="/part-107-cheat-sheet"    element={<Part107CheatSheet />} />
            <Route path="/ira-cheat-sheet"         element={<IRACheatSheet />} />
            <Route path="/cax-cheat-sheet"         element={<CAXCheatSheet />} />
            <Route path="/cheatsheet/verify/:token" element={<CheatSheetVerify />} />
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

            {/* Admin */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index                element={<AdminDashboard />} />
              <Route path="questions"     element={<AdminQuestions />} />
              <Route path="questions/new" element={<AdminEditor />} />
              <Route path="questions/:id" element={<AdminEditor />} />
              <Route path="users"         element={<AdminUsers />} />
              <Route path="users/:id"     element={<AdminUserDetail />} />
              <Route path="figures"       element={<AdminFigures />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!isLanding && <Footer />}
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

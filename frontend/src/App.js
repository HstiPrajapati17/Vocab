import React, { useEffect, useCallback, createContext, useContext, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './style/H_style.css';

import Navbar    from './components/Navbar';
import AppShell  from './components/AppShell';

import Home          from './container/Home';
import Login         from './container/Login';
import Signup        from './container/Signup';
import Dashboard     from './container/Dashboard';
import Courses       from './container/Courses';
import Quests        from './container/Quests';
import Shop          from './container/Shop';
import LessonPage    from './container/LessonPage';
import Leaderboard   from './container/Leaderboard';
import Profile       from './container/Profile';
import LanguageSelect from './container/LanguageSelect';
import SettingsPage  from './container/SettingPage';
import AboutUs       from './container/AboutUs';
import Terms         from './container/Terms';
import Privacy       from './container/Privacy';
import Blog          from './container/Blog';
import Help          from './container/Help';
import Letters       from './container/Letters';
import Onboarding    from './container/Onboarding';

/* ─────────────────────────── Context ─────────────────────────── */
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [user,            setUser]            = useState(null);
  const [previewLanguage, setPreviewLanguage] = useState(null);
  const [lessonStats,     setLessonStats]     = useState({ total: 0, completed: 0 });

  // Restore session on mount
  useEffect(() => {
    const saved = localStorage.getItem('linguaUser');
    if (saved) {
      try { setUser(JSON.parse(saved)); }
      catch { localStorage.removeItem('linguaUser'); }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('linguaUser', JSON.stringify(userData));
  };

  const handleSignupComplete = (partialUser) => {
    setUser(partialUser);
  };

  const handleLanguageSelected = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('linguaUser', JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    setUser(null);
    setPreviewLanguage(null);
    localStorage.removeItem('linguaUser');
  };

  const refreshUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('linguaUser', JSON.stringify(updatedUser));
    setPreviewLanguage(null);
  };

  const handleLessonStats = useCallback((stats) => {
    setLessonStats(stats);
  }, []);

  return (
    <AppContext.Provider value={{
      user, setUser,
      previewLanguage, setPreviewLanguage,
      lessonStats, handleLessonStats,
      handleLogin,
      handleSignupComplete,
      handleLanguageSelected,
      handleLogout,
      refreshUser,
    }}>
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => useContext(AppContext);

/* ─────────────────────────── Route guards ─────────────────────── */

/** Redirect logged-in users away from auth pages */
const PublicRoute = ({ children }) => {
  const { user } = useApp();
  return user ? <Navigate to="/dashboard" replace /> : children;
};

/** Redirect guests to /login, preserving the intended destination */
const ProtectedRoute = ({ children }) => {
  const { user } = useApp();
  const location = useLocation();
  return user
    ? children 
    : <Navigate to="/login" state={{ from: location }} replace />;
};

/* ─────────────────────────── Layouts ──────────────────────────── */

/**
 * PublicLayout – wraps marketing / info pages with the public Navbar.
 * Renders {children} properly (was broken before – always rendered <Home>).
 */
const PublicLayout = ({ children }) => {
  const navigate     = useNavigate();
  const { user }     = useApp();
  const location     = useLocation();
  const currentPage  = location.pathname.replace('/', '') || 'home';

  return (
    <>
      <Navbar
        navigate={navigate}
        isLoggedIn={!!user}
        user={user}
        currentPage={currentPage}
      />
      <main className="h_main_content">
        {children}
      </main>
    </>
  );
};

/**
 * ShellLayout – sidebar + right-panel layout for authenticated app pages.
 */
const ShellLayout = ({ children }) => (
  <AppShell>{children}</AppShell>
);

/**
 * LessonLayout – truly fullscreen, no extra chrome.
 * The lesson page uses position:fixed overlays so we just render it bare.
 */
const LessonLayout = ({ children }) => <>{children}</>;

/* ─────────────────────────── App ──────────────────────────────── */
function App() {
  return (
    <Router>
      <AppProvider>
        <div className="h_app_wrapper">
          <Routes>

            {/* ── Public / auth routes ── */}
            <Route path="/"        element={<PublicRoute><PublicLayout><Home /></PublicLayout></PublicRoute>} />
            <Route path="/login"   element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup"  element={<PublicRoute><Signup /></PublicRoute>} />
            <Route path="/onboarding"     element={<Onboarding />} />
            <Route path="/language-select" element={<LanguageSelect />} />

            {/* ── Info / marketing pages (navbar, no shell) ── */}
            <Route path="/about"   element={<PublicLayout><AboutUs /></PublicLayout>} />
            <Route path="/terms"   element={<PublicLayout><Terms /></PublicLayout>} />
            <Route path="/privacy" element={<PublicLayout><Privacy /></PublicLayout>} />
            <Route path="/blog"    element={<PublicLayout><Blog /></PublicLayout>} />
            <Route path="/help"    element={<PublicLayout><Help /></PublicLayout>} />

            {/* ── Authenticated shell pages ── */}
            <Route path="/dashboard" element={
              <ProtectedRoute><ShellLayout><Dashboard /></ShellLayout></ProtectedRoute>
            } />
            <Route path="/courses" element={
              <ProtectedRoute><ShellLayout><Courses /></ShellLayout></ProtectedRoute>
            } />
            <Route path="/letters" element={
              <ProtectedRoute><ShellLayout><Letters /></ShellLayout></ProtectedRoute>
            } />
            <Route path="/leaderboard" element={
              <ProtectedRoute><ShellLayout><Leaderboard /></ShellLayout></ProtectedRoute>
            } />
            <Route path="/quests" element={
              <ProtectedRoute><ShellLayout><Quests /></ShellLayout></ProtectedRoute>
            } />
            <Route path="/shop" element={
              <ProtectedRoute><ShellLayout><Shop /></ShellLayout></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><ShellLayout><Profile /></ShellLayout></ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute><ShellLayout><SettingsPage /></ShellLayout></ProtectedRoute>
            } />

            {/* ── Fullscreen lesson (no navbar, no shell) ── */}
            <Route path="/lesson/:lessonId" element={
              <ProtectedRoute><LessonLayout><LessonPage /></LessonLayout></ProtectedRoute>
            } />

            {/* ── 404 / catch-all → Home ── */}
            <Route path="*" element={<PublicLayout><Home /></PublicLayout>} />

          </Routes>
        </div>
      </AppProvider>
    </Router>
  );
}

export { useApp };
export default App;

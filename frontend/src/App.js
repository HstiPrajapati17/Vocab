import React, {
  useEffect,
  useCallback,
  createContext,
  useContext,
  useState,
  useRef,
  useMemo,
} from 'react';
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

import { getUser, getUserByEmail, logoutUser } from './api';

import Navbar    from './components/Navbar';
import AppShell  from './components/AppShell';

import Home          from './container/Home';
import Login         from './container/Login';
import Signup        from './container/Signup';
import Dashboard     from './container/Dashboard';
import Courses       from './container/Courses';
import LessonPage    from './container/LessonPage';
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
import Insights      from './container/Insights';

/* ─────────────────────────── Context ─────────────────────────── */
const AppContext = createContext();

const normalizeUser = (raw) => {
  if (!raw) return null;
  const base = typeof raw === 'object' ? raw : {};
  return {
    id: base.id || base._id || `u_${Date.now()}`,
    name: base.name || 'Learner',
    email: base.email || '',
    avatar: base.avatar ?? base.avatarUrl ?? null,
    language: base.language || base.onboarding?.languageToLearn || 'English',
    dailyGoal: base.dailyGoal || base.onboarding?.dailyTimeCommitment || 'Regular',
    level: base.level || base.onboarding?.learningLevel || 'Beginner',
    streak: Number(base.streak ?? base.streakDays) || 0,
    hearts: Number.isFinite(base.hearts) ? Number(base.hearts) : 5,
    maxHearts: Number(base.maxHearts) || 5,
    completedLessons: (Array.isArray(base.completedLessons) ? base.completedLessons : [])
      .map((item) => {
        const id = item && typeof item === 'object' ? (item.journeyLessonId || item.lessonId || item._id) : item;
        return id == null ? null : String(id);
      })
      .filter(Boolean),
    joinedDate: base.joinedDate || base.createdAt || null,
    createdAt: base.createdAt || base.joinedDate || new Date().toISOString(),
    lastActive: base.lastActive || new Date().toISOString(),
  };
};

/** Save normalized user to localStorage (never store avatar — too large). */
const saveToStorage = (normalized) => {
  if (!normalized) { localStorage.removeItem('linguaUser'); return; }
  try {
    localStorage.setItem('linguaUser', JSON.stringify({ ...normalized, avatar: null }));
  } catch {
    try {
      const { id, name, email, language, streak, hearts, maxHearts,
              level, dailyGoal, completedLessons, joinedDate,
              createdAt, lastActive } = normalized;
      localStorage.setItem('linguaUser', JSON.stringify({
        id, name, email, language, streak, hearts, maxHearts,
        level, dailyGoal, completedLessons, joinedDate,
        createdAt, lastActive,
      }));
    } catch { /* give up */ }
  }
};

/* ─────────────────────────── Provider ─────────────────────────── */
const AppProvider = ({ children }) => {
  // ── raw state ──────────────────────────────────────────────────
  const [user,            setUserRaw]         = useState(null);
  const [previewLanguage, setPreviewLanguage] = useState(null);
  const [lessonStats,     setLessonStats]     = useState({ total: 0, completed: 0 });
  const [toast,           setToast]           = useState(null);
  const toastTimerRef = useRef(null);

  // ── stable setUser ─────────────────────────────────────────────
  // All callers go through this. It normalizes the incoming value,
  // persists to localStorage, and commits to React state.
  // Using useCallback with empty deps so the reference never changes
  // — this is safe because setUserRaw (from useState) is always stable.
  const setUser = useCallback((next) => {
    setUserRaw((prev) => {
      const value = typeof next === 'function' ? next(prev) : next;
      const n = normalizeUser(value);
      saveToStorage(n);
      return n;
    });
  }, []); // setUserRaw is stable, so no deps needed

  // ── restore session on mount ───────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem('linguaUser');
    if (!saved) return;
    let parsed = null;
    try {
      parsed = JSON.parse(saved);
    } catch {
      localStorage.removeItem('linguaUser');
      return;
    }

    const normalized = normalizeUser(parsed);

    // If there's no id or email at all, session is unusable.
    if (!normalized || (!normalized.id && !normalized.email)) {
      localStorage.removeItem('linguaUser');
      return;
    }

    // Apply localStorage data immediately so UI renders without flash
    setUserRaw(normalized);

    // Re-fetch from backend to restore avatar, correct id and server-side state.
    // If server lookup fails → session is out of sync (stale id, deleted user,
    // db reset etc.) → kill the corrupt session immediately so we never try
    // to PATCH a non-existent /users/{id} later (which causes the 404 toast).
    if (normalized?.id || normalized?.email) {
      const id = normalized.id;
      const email = normalized.email;
      const tryFetch = id
        ? getUser(id).catch(() => (email ? getUserByEmail(email) : Promise.reject()))
        : (email ? getUserByEmail(email) : Promise.reject());

      tryFetch
        .then((fresh) => {
          if (!fresh) return Promise.reject(new Error('empty'));
          const n = normalizeUser(fresh);
          saveToStorage(n);
          setUserRaw(n);
        })
        .catch(() => {
          localStorage.removeItem('linguaUser');
          setUserRaw(null);
          setPreviewLanguage(null);
          // if running inside <Router> (already rendered) would redirect here
          // via navigation — but for now just clear state so protected routes
          // bounce the user to /login.
        });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── toast helper ───────────────────────────────────────────────
  const showToast = useCallback((message, kind = 'success') => {
    setToast({ message, kind, id: Date.now() });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const consumeHeart = useCallback(() => {
    let ok = false;
    setUser((prev) => {
      if (!prev || prev.hearts <= 0) return prev;
      ok = true;
      return { ...prev, hearts: prev.hearts - 1 };
    });
    return ok;
  }, [setUser]);

  const completeLesson = useCallback((lessonId) => {
    setUser((prev) => {
      if (!prev) return prev;
      const already = prev.completedLessons.includes(lessonId);
      return {
        ...prev,
        completedLessons: already
          ? prev.completedLessons
          : [...prev.completedLessons, lessonId],
        lastActive: new Date().toISOString(),
      };
    });
  }, [setUser]);

  // ── auth helpers ───────────────────────────────────────────────
  const handleLogin = useCallback((userData) => {
    setUser(normalizeUser(userData));
  }, [setUser]);

  const handleSignupComplete = useCallback((partialUser) => {
    setUser(normalizeUser(partialUser));
  }, [setUser]);

  const handleLanguageSelected = useCallback((updatedUser) => {
    setUser(normalizeUser(updatedUser));
  }, [setUser]);

  const handleLogout = useCallback(() => {
    logoutUser().catch((error) => console.error('Logout request failed:', error));
    setUserRaw(null);
    setPreviewLanguage(null);
    localStorage.removeItem('linguaUser');
    localStorage.removeItem('token');
  }, []);

  // ── refreshUser ────────────────────────────────────────────────
  // Pass full updated user object (from PATCH response) → apply directly.
  // Pass bare id string/number → re-fetch from backend.
  const refreshUser = useCallback((updatedUserOrId) => {
    if (updatedUserOrId && typeof updatedUserOrId === 'object') {
      setUser(normalizeUser(updatedUserOrId));
    } else if (updatedUserOrId) {
      getUser(updatedUserOrId)
        .then((fresh) => setUser(normalizeUser(fresh)))
        .catch(() => {});
    }
  }, [setUser]);

  // ── lesson stats ───────────────────────────────────────────────
  const handleLessonStats = useCallback((stats) => {
    setLessonStats(stats);
  }, []);

  // ── context value (memoized) ───────────────────────────────────
  // Functions are all stable useCallbacks — only state values in deps.
  const value = useMemo(() => ({
    user, setUser,
    previewLanguage, setPreviewLanguage,
    lessonStats, handleLessonStats,
    handleLogin,
    handleSignupComplete,
    handleLanguageSelected,
    handleLogout,
    refreshUser,
    completeLesson,
    consumeHeart,
    toast, showToast,
  }), [
    user, previewLanguage, lessonStats, toast,
    setUser, handleLessonStats, handleLogin, handleSignupComplete,
    handleLanguageSelected, handleLogout, refreshUser,
    completeLesson, consumeHeart, showToast,
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => useContext(AppContext);

/* ─────────────────────────── Route guards ─────────────────────── */
const PublicRoute = ({ children }) => {
  const { user } = useApp();
  return user ? <Navigate to="/dashboard" replace /> : children;
};

const ProtectedRoute = ({ children }) => {
  const { user } = useApp();
  const location = useLocation();
  return user
    ? children
    : <Navigate to="/login" state={{ from: location }} replace />;
};

/* ─────────────────────────── Layouts ──────────────────────────── */
const PublicLayout = ({ children }) => {
  const navigate    = useNavigate();
  const { user, handleLogout } = useApp();
  const location    = useLocation();
  const currentPage = location.pathname.replace('/', '') || 'home';
  return (
    <>
      <Navbar
        navigate={navigate}
        isLoggedIn={!!user}
        onLogout={handleLogout}
        user={user}
        currentPage={currentPage}
      />
      <main className="h_main_content">
        {children}
      </main>
    </>
  );
};

const ShellLayout = ({ children }) => <AppShell>{children}</AppShell>;

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
            <Route path="/onboarding"      element={<Onboarding />} />
            <Route path="/language-select" element={<LanguageSelect />} />

            {/* ── Info / marketing pages ── */}
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
            <Route path="/profile" element={
              <ProtectedRoute><ShellLayout><Profile /></ShellLayout></ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute><ShellLayout><SettingsPage /></ShellLayout></ProtectedRoute>
            } />
            <Route path="/insights" element={
              <ProtectedRoute><ShellLayout><Insights /></ShellLayout></ProtectedRoute>
            } />

            {/* ── Fullscreen lesson ── */}
            <Route path="/lesson/:lessonId" element={
              <ProtectedRoute><LessonLayout><LessonPage /></LessonLayout></ProtectedRoute>
            } />

            {/* ── 404 ── */}
            <Route path="*" element={<PublicLayout><Home /></PublicLayout>} />
          </Routes>
        </div>
      </AppProvider>
    </Router>
  );
}

export { useApp };
export default App;

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
import Insights      from './container/Insights';

/* ─────────────────────────── Context ─────────────────────────── */
const AppContext = createContext();

const normalizeUser = (raw) => {
  if (!raw) return null;
  const base = typeof raw === 'object' ? raw : {};
  return {
    id: base.id || `u_${Date.now()}`,
    name: base.name || 'Learner',
    email: base.email || '',
    language: base.language || 'English',
    dailyGoal: base.dailyGoal || 'Regular',
    level: base.level || 'Beginner',
    xp: Number(base.xp) || 0,
    streak: Number(base.streak) || 0,
    hearts: Number.isFinite(base.hearts) ? Number(base.hearts) : 5,
    maxHearts: Number(base.maxHearts) || 5,
    gems: Number(base.gems) || 0,
    completedLessons: Array.isArray(base.completedLessons) ? base.completedLessons : [],
    powerups: {
      streakFreeze: Number(base.powerups?.streakFreeze) || 0,
      xpBoostMinutes: Number(base.powerups?.xpBoostMinutes) || 0,
      xpBoostActiveUntil: base.powerups?.xpBoostActiveUntil || null,
      ...(base.powerups || {}),
    },
    createdAt: base.createdAt || new Date().toISOString(),
    lastActive: base.lastActive || new Date().toISOString(),
  };
};

const persistUser = (u) => {
  const n = normalizeUser(u);
  if (n) localStorage.setItem('linguaUser', JSON.stringify(n));
  return n;
};

const AppProvider = ({ children }) => {
  const [user,            setUserState]      = useState(null);
  const [previewLanguage, setPreviewLanguage] = useState(null);
  const [lessonStats,     setLessonStats]     = useState({ total: 0, completed: 0 });
  const [toast,           setToast]           = useState(null);
  const toastTimer = React.useRef(null);

  const setUser = (next) => {
    const n = normalizeUser(next);
    setUserState(n);
    if (n) localStorage.setItem('linguaUser', JSON.stringify(n));
    else localStorage.removeItem('linguaUser');
  };

  // Restore session on mount + normalize legacy user shape
  useEffect(() => {
    const saved = localStorage.getItem('linguaUser');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(normalizeUser(parsed));
      } catch {
        localStorage.removeItem('linguaUser');
      }
    }
  }, []);

  const showToast = (message, kind = 'success') => {
    setToast({ message, kind, id: Date.now() });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  const addGems = (amount, reason) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, gems: Math.max(0, prev.gems + Number(amount || 0)) };
      return persistUser(next);
    });
    if (amount > 0) showToast(`+${amount} 💎 ${reason ? '· ' + reason : ''}`, 'success');
  };

  const addXP = (amount) => {
    setUser((prev) => {
      if (!prev) return prev;
      let bonus = 1;
      if (prev.powerups?.xpBoostActiveUntil) {
        if (new Date(prev.powerups.xpBoostActiveUntil) > new Date()) bonus = 2;
      }
      const finalXP = Math.round(Number(amount || 0) * bonus);
      return persistUser({ ...prev, xp: prev.xp + finalXP });
    });
  };

  const consumeHeart = () => {
    let ok = false;
    setUser((prev) => {
      if (!prev) return prev;
      if (prev.hearts <= 0) return prev;
      ok = true;
      return persistUser({ ...prev, hearts: prev.hearts - 1 });
    });
    return ok;
  };

  const refillHearts = () => {
    setUser((prev) => {
      if (!prev) return prev;
      return persistUser({ ...prev, hearts: prev.maxHearts || 5 });
    });
    showToast('All hearts restored ❤️', 'success');
  };

  const awardHearts = (n) => {
    setUser((prev) => {
      if (!prev) return prev;
      const max = prev.maxHearts || 5;
      return persistUser({ ...prev, hearts: Math.min(max, prev.hearts + Number(n || 0)) });
    });
  };

  const activateXpBoost = (minutes) => {
    setUser((prev) => {
      if (!prev) return prev;
      const now = new Date();
      const existingEnd = prev.powerups?.xpBoostActiveUntil
        ? new Date(prev.powerups.xpBoostActiveUntil)
        : now;
      const end = new Date(Math.max(now.getTime(), existingEnd.getTime()) + minutes * 60 * 1000);
      return persistUser({
        ...prev,
        powerups: {
          ...prev.powerups,
          xpBoostActiveUntil: end.toISOString(),
          xpBoostMinutes: (prev.powerups?.xpBoostMinutes || 0) + minutes,
        },
      });
    });
    showToast(`XP Boost activated for ${minutes} min ⚡`, 'success');
  };

  const addStreakFreeze = (count = 1) => {
    setUser((prev) => {
      if (!prev) return prev;
      return persistUser({
        ...prev,
        powerups: {
          ...prev.powerups,
          streakFreeze: (prev.powerups?.streakFreeze || 0) + count,
        },
      });
    });
    showToast(`+${count} Streak Freeze ❄️`, 'success');
  };

  const consumeStreakFreeze = () => {
    let used = false;
    setUser((prev) => {
      if (!prev) return prev;
      if (!prev.powerups?.streakFreeze || prev.powerups.streakFreeze <= 0) return prev;
      used = true;
      return persistUser({
        ...prev,
        powerups: { ...prev.powerups, streakFreeze: prev.powerups.streakFreeze - 1 },
      });
    });
    return used;
  };

  const buyShopItem = (item) => {
    let success = false;
    let reason = '';
    setUser((prev) => {
      if (!prev) return prev;
      const price = Number(item?.price) || 0;
      const currency = item?.currency || 'gem';
      const avail = currency === 'gem' ? prev.gems : prev.xp;
      if (avail < price) {
        reason = `Not enough ${currency === 'gem' ? 'gems' : 'XP'}`;
        return prev;
      }
      const baseNext = currency === 'gem'
        ? { ...prev, gems: prev.gems - price }
        : { ...prev, xp: prev.xp - price };

      let next = baseNext;
      switch (item?.id) {
        case 'streak_freeze':
          next = {
            ...next,
            powerups: {
              ...next.powerups,
              streakFreeze: (next.powerups?.streakFreeze || 0) + (item?.quantity || 1),
            },
          };
          break;
        case 'xp_boost_15':
        case 'xp_boost_30': {
          const mins = item?.id === 'xp_boost_30' ? 30 : 15;
          const now = new Date();
          const existingEnd = next.powerups?.xpBoostActiveUntil
            ? new Date(next.powerups.xpBoostActiveUntil)
            : now;
          const end = new Date(Math.max(now.getTime(), existingEnd.getTime()) + mins * 60 * 1000);
          next = {
            ...next,
            powerups: {
              ...next.powerups,
              xpBoostActiveUntil: end.toISOString(),
              xpBoostMinutes: (next.powerups?.xpBoostMinutes || 0) + mins,
            },
          };
          break;
        }
        case 'refill_hearts':
          next = { ...next, hearts: next.maxHearts || 5 };
          break;
        case 'hearts_pack_10':
          next = {
            ...next,
            maxHearts: Math.max(next.maxHearts || 5, (next.maxHearts || 5) + (item?.bonusMax || 0)),
            hearts: (next.hearts || 0) + (item?.quantity || 0),
          };
          break;
        case 'gem_pack_small':
        case 'gem_pack_medium':
        case 'gem_pack_large':
          next = { ...next, gems: next.gems + (item?.quantity || 0) };
          break;
        default:
          break;
      }
      success = true;
      return persistUser(next);
    });
    if (success) {
      showToast(`Purchased: ${item?.title} ✨`, 'success');
    } else if (reason) {
      showToast(reason, 'error');
    }
    return success;
  };

  const completeLesson = (lessonId, xpEarned = 10, gemReward = 2) => {
    setUser((prev) => {
      if (!prev) return prev;
      const already = prev.completedLessons.includes(lessonId);
      const bonus = prev.powerups?.xpBoostActiveUntil
        && new Date(prev.powerups.xpBoostActiveUntil) > new Date() ? 2 : 1;
      const finalXP = already ? 0 : Math.round(xpEarned * bonus);
      const finalGems = already ? 0 : gemReward;
      const streak = already ? prev.streak : prev.streak;
      return persistUser({
        ...prev,
        xp: prev.xp + finalXP,
        gems: prev.gems + finalGems,
        streak,
        completedLessons: already
          ? prev.completedLessons
          : [...prev.completedLessons, lessonId],
        lastActive: new Date().toISOString(),
      });
    });
  };

  const handleLogin = (userData) => setUser(normalizeUser(userData));
  const handleSignupComplete = (partialUser) => setUser(normalizeUser(partialUser));
  const handleLanguageSelected = (updatedUser) => setUser(updatedUser);

  const handleLogout = () => {
    setUser(null);
    setPreviewLanguage(null);
    localStorage.removeItem('linguaUser');
  };

  const refreshUser = (updatedUser) => {
    setUser(updatedUser);
    setPreviewLanguage(null);
  };

  const handleLessonStats = useCallback((stats) => {
    setLessonStats(stats);
  }, []);

  const value = React.useMemo(() => ({
    user, setUser,
    previewLanguage, setPreviewLanguage,
    lessonStats, handleLessonStats,
    handleLogin,
    handleSignupComplete,
    handleLanguageSelected,
    handleLogout,
    refreshUser,
    // Economy
    addGems,
    addXP,
    completeLesson,
    consumeHeart,
    refillHearts,
    awardHearts,
    activateXpBoost,
    addStreakFreeze,
    consumeStreakFreeze,
    buyShopItem,
    // UI
    toast, showToast,
  }), [user, previewLanguage, lessonStats, toast]);

  return (
    <AppContext.Provider value={value}>
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
            <Route path="/insights" element={
              <ProtectedRoute><ShellLayout><Insights /></ShellLayout></ProtectedRoute>
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

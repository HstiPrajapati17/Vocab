import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './style/H_style.css';
import Navbar from './components/Navbar';
import AppShell from './components/AppShell';
import Home from './container/Home';
import Login from './container/Login';
import Signup from './container/Signup';
import Dashboard from './container/Dashboard';
import Courses from './container/Courses';
import Quests from './container/Quests';
import Shop from './container/Shop';
import LessonPage from './container/LessonPage';
import Leaderboard from './container/Leaderboard';
import Profile from './container/Profile';
import LanguageSelect from './container/LanguageSelect';
import SettingsPage from './container/SettingPage';
import AboutUs from './container/AboutUs';
import Terms from './container/Terms';
import Privacy from './container/Privacy';
import Letters from './container/Letters';

const shellPages = ['dashboard', 'courses', 'leaderboard', 'quests', 'shop', 'profile', 'settings'];

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [previewLanguage, setPreviewLanguage] = useState(null);
  const [lessonStats, setLessonStats] = useState({ total: 0, completed: 0 });

  useEffect(() => {
    const saved = localStorage.getItem("linguaUser");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
      } catch {
        localStorage.removeItem("linguaUser");
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("linguaUser", JSON.stringify(userData));
  };

  const handleSignupComplete = (partialUser) => {
    setUser(partialUser);
  };

  const handleLanguageSelected = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("linguaUser", JSON.stringify(updatedUser));
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
      user,
      setUser,
      previewLanguage,
      setPreviewLanguage,
      lessonStats,
      handleLessonStats,
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

const ProtectedRoute = ({ children }) => {
  const { user } = useApp();
  const location = useLocation();
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

const PublicRoute = ({ children }) => {
  const { user } = useApp();
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const ShellLayout = ({ children }) => {
  const { user, previewLanguage, lessonStats, handleLogout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const isLesson = location.pathname.startsWith('/lesson');

  if (isLesson) {
    return children;
  }

  return (
    <AppShell>
      {children}
    </AppShell>
  );
};

const LessonLayout = ({ children }) => {
  return <main className="h_main_content">{children}</main>;
};

function App() {
  return (
    <Router>
      <AppProvider>
        <div className="h_app_wrapper">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicRoute><PublicLayout /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
            <Route path="/language-select" element={<LanguageSelect />} />

            {/* Protected Routes with Shell */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <ShellLayout><Dashboard /></ShellLayout>
              </ProtectedRoute>
            } />
            <Route path="/courses" element={
              <ProtectedRoute>
                <ShellLayout><Courses /></ShellLayout>
              </ProtectedRoute>
            } />
            <Route path="/letters" element={
              <ProtectedRoute>
                <ShellLayout><Letters /></ShellLayout>
              </ProtectedRoute>
            } />
            <Route path="/leaderboard" element={
              <ProtectedRoute>
                <ShellLayout><Leaderboard /></ShellLayout>
              </ProtectedRoute>
            } />
            <Route path="/quests" element={
              <ProtectedRoute>
                <ShellLayout><Quests /></ShellLayout>
              </ProtectedRoute>
            } />
            <Route path="/shop" element={
              <ProtectedRoute>
                <ShellLayout><Shop /></ShellLayout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ShellLayout><Profile /></ShellLayout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <ShellLayout><SettingsPage /></ShellLayout>
              </ProtectedRoute>
            } />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/lesson/:lessonId" element={
              <ProtectedRoute>
                <LessonLayout><LessonPage /></LessonLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </AppProvider>
    </Router>
  );
}

const PublicLayout = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const location = useLocation();
  const currentPage = location.pathname.replace('/', '') || 'home';
  
  return (
    <>
      <Navbar navigate={navigate} isLoggedIn={false} currentPage={currentPage} />
      <main className="h_main_content">
        <Home navigate={navigate} />
      </main>
    </>
  );
};

export { useApp };
export default App;

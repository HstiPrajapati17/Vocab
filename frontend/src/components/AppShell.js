import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';
import BottomNav from './BottomNav';
import { useApp } from '../App';

const AppShell = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, handleLogout, previewLanguage, lessonStats } = useApp();
  const [showMore, setShowMore] = useState(false);

  const currentPage = location.pathname.replace('/', '') || 'dashboard';

  return (
    <div className="h_app_shell">
      <Sidebar
        currentPage={currentPage}
        navigate={navigate}
        onLogout={handleLogout}
        onMoreClick={() => setShowMore(!showMore)}
      />

      <div className="h_shell_body">
        <main className="h_shell_center">
          {children}
        </main>

        <RightPanel
          user={user}
          previewLanguage={previewLanguage}
          currentPage={currentPage}
          navigate={navigate}
          lessonCount={lessonStats.total}
          completedCount={lessonStats.completed}
        />
      </div>

      <BottomNav
        currentPage={currentPage}
        navigate={navigate}
        onLogout={handleLogout}
      />

      {showMore && (
        <div className="h_more_overlay" onClick={() => setShowMore(false)}>
          <div className="h_more_menu" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => { navigate('/courses'); setShowMore(false); }}>Courses</button>
            <button type="button" onClick={() => { navigate('/settings'); setShowMore(false); }}>Settings</button>
            <button type="button" className="text-danger" onClick={() => { handleLogout(); setShowMore(false); }}>Logout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppShell;

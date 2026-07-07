import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';
import BottomNav from './BottomNav';
import { useApp } from '../App';

const AppShell = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, handleLogout, previewLanguage, lessonStats } = useApp();
  const currentPage = location.pathname.replace('/', '') || 'dashboard';

  return (
    <div className="h_app_shell">
      <Sidebar
        currentPage={currentPage}
        navigate={navigate}
        onLogout={handleLogout}
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

    </div>
  );
};

export default AppShell;

import React from 'react';
import {
  Home, Type, Trophy, Zap, ShoppingBag, User, MoreHorizontal, Globe, LogOut
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Learn', icon: Home },
  { id: 'courses', label: 'Courses', icon: Globe },
  { id: 'letters', label: 'Letters', icon: Type },
  { id: 'leaderboard', label: 'Leaderboards', icon: Trophy },
  { id: 'quests', label: 'Quests', icon: Zap },
  { id: 'shop', label: 'Shop', icon: ShoppingBag },
  { id: 'profile', label: 'Profile', icon: User },
];

const Sidebar = ({ currentPage, navigate, onLogout, onMoreClick }) => {
  const handleNav = (page) => {
    if (page === 'letters') {
      navigate('/dashboard');
      return;
    }
    navigate(`/${page}`);
  };

  const isActive = (id) => {
    if (id === 'dashboard') return currentPage === 'dashboard' || currentPage === 'lesson';
    return currentPage === id;
  };

  return (
    <aside className="h_sidebar">
      <div className="h_sidebar_logo" onClick={() => navigate('/dashboard')}>
        <span className="h_sidebar_logo_icon">V</span>
        <span className="h_sidebar_logo_text">vocablearn</span>
      </div>

      <nav className="h_sidebar_nav">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`h_sidebar_item ${isActive(id) ? 'h_sidebar_item_active' : ''}`}
            onClick={() => handleNav(id)}
          >
            <span className="h_sidebar_icon"><Icon size={22} strokeWidth={2.2} /></span>
            <span className="h_sidebar_label">{label}</span>
          </button>
        ))}
        <button type="button" className="h_sidebar_item" onClick={onMoreClick}>
          <span className="h_sidebar_icon"><MoreHorizontal size={22} /></span>
          <span className="h_sidebar_label">More</span>
        </button>
      </nav>

      <button type="button" className="h_sidebar_logout d-none d-lg-flex" onClick={onLogout}>
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;

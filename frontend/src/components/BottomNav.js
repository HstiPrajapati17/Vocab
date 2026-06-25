import React from 'react';
import { Home, Globe, Trophy, Zap, User } from 'lucide-react';

const items = [
  { id: 'dashboard', icon: Home, label: 'Learn' },
  { id: 'courses', icon: Globe, label: 'Courses' },
  { id: 'leaderboard', icon: Trophy, label: 'Rank' },
  { id: 'quests', icon: Zap, label: 'Quests' },
  { id: 'profile', icon: User, label: 'Profile' },
];

const BottomNav = ({ currentPage, navigate }) => {
  const isActive = (id) => {
    if (id === 'dashboard') return currentPage === 'dashboard' || currentPage === 'lesson';
    return currentPage === id;
  };

  return (
    <nav className="h_bottom_nav d-lg-none">
      {items.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          type="button"
          className={`h_bottom_nav_item ${isActive(id) ? 'h_bottom_nav_active' : ''}`}
          onClick={() => navigate(`/${id}`)}
        >
          <Icon size={22} strokeWidth={isActive(id) ? 2.5 : 2} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;

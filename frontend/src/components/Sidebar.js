import React, { useState, useRef, useEffect } from 'react';
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

const Sidebar = ({ currentPage, navigate, onLogout }) => {
  const [showMore, setShowMore] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const moreBtnRef = useRef(null);

  useEffect(() => {
    if (!showMore || !moreBtnRef.current) return;

    const updatePosition = () => {
      const rect = moreBtnRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.top, left: rect.right + 12 });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [showMore]);

  const handleNav = (page) => {
    navigate(`/${page}`);
  };

  const closeMore = () => setShowMore(false);

  const isActive = (id) => {
    if (id === 'dashboard') return currentPage === 'dashboard' || currentPage === 'lesson';
    return currentPage === id;
  };

  return (
    <aside className="h_sidebar">
      <div className="h_sidebar_logo" onClick={() => navigate('/dashboard')}>
        <div className="h_brand_logo_img">
            <img src="https://png.pngtree.com/png-vector/20260128/ourlarge/pngtree-a-small-green-bird-flying-with-spread-wings-on-black-background-png-image_18307190.webp" />
          </div>
        {/* <span className="h_sidebar_logo_icon">V</span> */}
        <span className="h_sidebar_logo_text">Vocablearn</span>
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
        <button
          ref={moreBtnRef}
          type="button"
          className={`h_sidebar_item h_sidebar_item_more${showMore ? ' h_sidebar_item_active' : ''}`}
          onClick={() => setShowMore((prev) => !prev)}
        >
          <span className="h_sidebar_icon"><MoreHorizontal size={22} /></span>
          <span className="h_sidebar_label">More</span>
        </button>
      </nav>

      {showMore && (
        <>
          <div className="h_more_backdrop" onClick={closeMore} />
          <div
            className="h_more_popover"
            style={{ top: menuPos.top, left: menuPos.left }}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" onClick={() => { navigate('/settings'); closeMore(); }}>Settings</button>
            <button type="button" onClick={() => { navigate('/help'); closeMore(); }}>Help</button>
            <div className="h_more_popover_divider" />
            <button type="button" className="h_more_popover_danger" onClick={() => { onLogout(); closeMore(); }}>Log out</button>
          </div>
        </>
      )}

      <button type="button" className="h_sidebar_logout d-none d-lg-flex" onClick={onLogout}>
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;

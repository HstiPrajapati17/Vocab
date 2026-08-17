import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Home,
  Globe,
  Trophy,
  Zap,
  CircleHelp,
  LogOut,
  BarChart2,
  ShoppingCart,
} from "lucide-react";
import { RxLetterCaseCapitalize } from "react-icons/rx";
import { CgProfile } from "react-icons/cg";
import { GrMore } from "react-icons/gr";
import { IoMdSettings } from "react-icons/io";
import { FcSettings } from "react-icons/fc";

const items = [
  { id: "dashboard",   icon: Home,      label: "Learn"    },
  { id: "courses",     icon: Globe,     label: "Courses"  },
  { id: "leaderboard", icon: Trophy,    label: "Rank"     },
  { id: "insights",    icon: BarChart2, label: "Insights" },
];

const BottomNav = ({ currentPage, navigate, onRequestLogout }) => {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0, w: 226, arrowX: 0 });
  const menuRef = useRef(null);
  const moreBtnRef = useRef(null);

  const isActive = (id) => {
    if (id === "dashboard")
      return currentPage === "dashboard" || currentPage === "lesson";
    return currentPage === id;
  };

  const calcMenuPosition = () => {
    if (!moreBtnRef.current) return;
    const btn = moreBtnRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const menuW = 220;
    const gap = 12;

    let x = btn.left + btn.width / 2 - menuW / 2;
    if (x < 12) x = 12;
    if (x + menuW > vw - 12) x = vw - 12 - menuW;

    const y = btn.top - gap;
    const arrowX = btn.left + btn.width / 2 - x;

    setMenuPos({ x, y, w: menuW, arrowX });
  };

  useEffect(() => {
    if (open) {
      calcMenuPosition();
      const t = setTimeout(calcMenuPosition, 10);
      const handler = () => calcMenuPosition();
      window.addEventListener("resize", handler);
      window.addEventListener("scroll", handler, true);
      return () => {
        clearTimeout(t);
        window.removeEventListener("resize", handler);
        window.removeEventListener("scroll", handler, true);
      };
    }
  }, [open]);

  const handleLogoutClick = () => {
    setOpen(false);
    if (onRequestLogout) {
      onRequestLogout();
    }
  };

  const menuItems = [
    {
      id: "quests",
      label: "Quests",
      icon: Zap,
      color: "var(--warning)",
      onClick: () => { navigate("/quests"); setOpen(false); },
    },
    {
      id: "letters",
      label: "Letters",
      icon: RxLetterCaseCapitalize,
      color: "var(--primary)",
      onClick: () => { navigate("/letters"); setOpen(false); },
    },
    {
      id: "shop",
      label: "Shop",
      icon: ShoppingCart,
      color: "var(--success)",
      onClick: () => { navigate("/shop"); setOpen(false); },
    },
    {
      id: "profile",
      label: "Profile",
      icon: CgProfile,
      color: "var(--info)",
      onClick: () => { navigate("/profile"); setOpen(false); },
    },
    {
      id: "settings",
      label: "Settings",
      icon: FcSettings,
      color: "var(--info)",
      onClick: () => { navigate("/settings"); setOpen(false); },
    },
    {
      id: "help",
      label: "Help",
      icon: CircleHelp,
      color: "var(--text-muted)",
      onClick: () => { navigate("/help"); setOpen(false); },
    },
    {
      id: "logout",
      label: "Logout",
      icon: LogOut,
      color: "#e53935",
      danger: true,
      onClick: handleLogoutClick,
    },
  ];

  return (
    <nav className="h_bottom_nav d-lg-none">
      {items.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          className={`h_bottom_nav_item ${
            isActive(id) ? "h_bottom_nav_active" : ""
          }`}
          onClick={() => navigate(`/${id}`)}
        >
          <Icon size={22} />
          <span>{label}</span>
        </button>
      ))}

      <div className="h_more_wrapper">
        <button
          ref={moreBtnRef}
          className={`h_bottom_nav_item ${open ? "h_bottom_nav_active" : ""}`}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
        >
          <GrMore size={26} />
          <span>More</span>
        </button>
      </div>

      {open && typeof document !== "undefined" && createPortal(
        <div
          ref={menuRef}
          className="h_more_menu"
          style={{
            position: "fixed",
            left: `${menuPos.x}px`,
            top: `${menuPos.y}px`,
            width: `${menuPos.w}px`,
            transform: "translateY(-100%)",
            zIndex: 9999,
          }}
        >
          <div className="h_more_menu_arrow" style={{ left: `${menuPos.arrowX}px` }} />
          {menuItems.map(({ id, label, icon: Icon, color, danger, onClick }) => (
            <button
              key={id}
              onClick={onClick}
              className={`h_more_menu_item ${danger ? "danger" : ""}`}
            >
              <span className="h_more_menu_icon" style={{ background: danger ? "#fff2f2" : `${color}15` }}>
                <Icon size={17} style={{ color }} />
              </span>
              <span className="h_more_menu_label">{label}</span>
            </button>
          ))}
        </div>,
        document.body
      )}
    </nav>
  );
};

export default BottomNav;

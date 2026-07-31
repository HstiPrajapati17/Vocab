import React, { useState, useRef, useEffect } from "react";
import {
  Home,
  Globe,
  Trophy,
  Zap,
  CircleHelp,
  LogOut,
} from "lucide-react";
import { RxLetterCaseCapitalize } from "react-icons/rx";
import { CgProfile } from "react-icons/cg";
import { GrMore } from "react-icons/gr";

const items = [
  { id: "dashboard", icon: Home, label: "Learn" },
  { id: "courses", icon: Globe, label: "Courses" },
  { id: "leaderboard", icon: Trophy, label: "Rank" },
  { id: "quests", icon: Zap, label: "Quests" },
];

const BottomNav = ({ currentPage, navigate, onRequestLogout }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const isActive = (id) => {
    if (id === "dashboard")
      return currentPage === "dashboard" || currentPage === "lesson";
    return currentPage === id;
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogoutClick = () => {
    setOpen(false);
    if (onRequestLogout) {
      onRequestLogout();
    }
  };

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

      <div className="h_more_wrapper" ref={menuRef}>
        <button
          className={`h_bottom_nav_item ${open ? "h_bottom_nav_active" : ""}`}
          onClick={() => setOpen(!open)}
        >
          <GrMore size={26} />
          <span>More</span>
        </button>

        {open && (
          <div className="h_more_menu">
            <button
              onClick={() => {
                navigate("/letters");
                setOpen(false);
              }}
            >
              <RxLetterCaseCapitalize size={18} />
              <span>Letters</span>
            </button>

            <button
              onClick={() => {
                navigate("/profile");
                setOpen(false);
              }}
            >
              <CgProfile size={18} />
              <span>Profile</span>
            </button>

            <button
              onClick={() => {
                navigate("/help");
                setOpen(false);
              }}
            >
              <CircleHelp size={18} />
              <span>Help</span>
            </button>

            <button
              className="logout"
              onClick={handleLogoutClick}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default BottomNav;

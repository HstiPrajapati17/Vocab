import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./style/h_style.css";
import Navbar from "./components/Navbar";
import Home from "./container/Home";
import Login from "./container/Login";
import Signup from "./container/Signup";
import Dashboard from "./container/Dashboard";
import LessonPage from "./container/LessonPage";
import Leaderboard from "./container/Leaderboard";
import Profile from "./container/Profile";
import LanguageSelect from "./container/LanguageSelect";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [currentLessonId, setCurrentLessonId] = useState(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("linguaUser");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        setIsLoggedIn(true);
        setCurrentPage("dashboard");
      } catch {
        localStorage.removeItem("linguaUser");
      }
    }
  }, []);

  const navigate = (page, extra) => {
    if (page === "lesson" && extra?.lessonId) {
      setCurrentLessonId(extra.lessonId);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem("linguaUser", JSON.stringify(userData));
    setCurrentPage("dashboard");
  };

  // Called after signup step 1 — go to language select
  const handleSignupComplete = (partialUser) => {
    setUser(partialUser);
    setCurrentPage("language-select");
  };

  // Called after language select — finalize login
  const handleLanguageSelected = (updatedUser) => {
    setUser(updatedUser);
    setIsLoggedIn(true);
    localStorage.setItem("linguaUser", JSON.stringify(updatedUser));
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("linguaUser");
    setCurrentPage("home");
  };

  // Update user data (e.g. after completing a lesson)
  const refreshUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("linguaUser", JSON.stringify(updatedUser));
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home navigate={navigate} />;
      case "login":
        return <Login navigate={navigate} onLogin={handleLogin} />;
      case "signup":
        return (
          <Signup navigate={navigate} onSignupDone={handleSignupComplete} />
        );
      case "language-select":
        return (
          <LanguageSelect
            navigate={navigate}
            user={user}
            onDone={handleLanguageSelected}
          />
        );
      case "dashboard":
        return isLoggedIn ? (
          <Dashboard
            navigate={navigate}
            user={user}
            refreshUser={refreshUser}
          />
        ) : (
          <Home navigate={navigate} />
        );
      case "lesson":
        return isLoggedIn ? (
          <LessonPage
            navigate={navigate}
            user={user}
            lessonId={currentLessonId}
            refreshUser={refreshUser}
          />
        ) : (
          <Home navigate={navigate} />
        );
      case "leaderboard":
        return isLoggedIn ? (
          <Leaderboard navigate={navigate} user={user} />
        ) : (
          <Home navigate={navigate} />
        );
      case "profile":
        return isLoggedIn ? (
          <Profile navigate={navigate} user={user} refreshUser={refreshUser} />
        ) : (
          <Home navigate={navigate} />
        );
      default:
        return <Home navigate={navigate} />;
    }
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={""}></Route>
        </Routes>
      </BrowserRouter>

      <div className="h_app_wrapper">
        <Navbar
          navigate={navigate}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          user={user}
          currentPage={currentPage}
        />
        <main className="h_main_content">{renderPage()}</main>
      </div>
    </>
  );
}

export default App;

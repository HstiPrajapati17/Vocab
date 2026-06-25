import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/x_style.css'; // External CSS file
import { useApp } from '../App';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');

  const toggleNotifications = () => setNotifications(!notifications);
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const handleLanguageChange = (e) => setLanguage(e.target.value);

  return (
    <div className="container x_container my-5 p-4 rounded shadow-lg">
      <h2 className="x_title mb-4 text-center">Settings</h2>

      <div className="x_card mb-4 p-3">
        <h5 className="x_subtitle mb-3">Language</h5>
        <select
          className="form-select x_select"
          value={language}
          onChange={handleLanguageChange}
        >
          <option>English</option>
          <option>Spanish</option>
          <option>French</option>
          <option>German</option>
          <option>Chinese</option>
        </select>
      </div>

      <div className="x_card mb-4 p-3 d-flex align-items-center justify-content-between">
        <h5 className="x_subtitle mb-0">Notifications</h5>
        <div className="form-check form-switch x_switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="notificationsSwitch"
            checked={notifications}
            onChange={toggleNotifications}
          />
        </div>
      </div>

      <div className="x_card mb-4 p-3 d-flex align-items-center justify-content-between">
        <h5 className="x_subtitle mb-0">Dark Mode</h5>
        <div className="form-check form-switch x_switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="darkModeSwitch"
            checked={darkMode}
            onChange={toggleDarkMode}
          />
        </div>
      </div>

      <div className="x_animations mt-4 text-center">
        <div className="x_bouncingBall"></div>
      </div>
    </div>
  );
};

export default SettingsPage;
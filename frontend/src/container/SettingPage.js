import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import '../style/SettingsPage.css';
import { 
  FaGlobe, 
  FaPalette, 
  FaBell, 
  FaClock, 
  FaVolumeUp, 
  FaPlay, 
  FaChartBar, 
  FaUser, 
  FaEnvelope, 
  FaTrash, 
  FaSignOutAlt 
} from 'react-icons/fa';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [settings, setSettings] = useState({
    language: 'English',
    notifications: true,
    darkMode: false,
    soundEffects: true,
    dailyReminder: true,
    autoPlay: false,
    showProgress: true
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('vocabSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('vocabSettings', JSON.stringify(newSettings));
    
    if (key === 'darkMode') {
      document.body.classList.toggle('dark-mode', value);
    }
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', flag: '🇮🇳' }
  ];

  const SettingCard = ({ icon: Icon, title, description, children }) => (
    <div className="settings-card">
      <div className="settings-card-header">
        <div className="settings-icon"><Icon size={16} /></div>
        <div className="settings-info">
          <h3 className="settings-title">{title}</h3>
          {description && <p className="settings-description">{description}</p>}
        </div>
      </div>
      <div className="settings-card-body">
        {children}
      </div>
    </div>
  );

  const ToggleSwitch = ({ checked, onChange, label }) => (
    <div className="toggle-wrapper">
      <label className="toggle-label">{label}</label>
      <button 
        className={`toggle-switch ${checked ? 'toggle-on' : 'toggle-off'}`}
        onClick={() => onChange(!checked)}
        aria-label={label}
      >
        <div className="toggle-knob"></div>
      </button>
    </div>
  );

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <h1 className="settings-page-title">Settings</h1>
          <p className="settings-page-subtitle">Customize your learning experience</p>
        </div>

        <div className="settings-section" style={{ animationDelay: '0.1s' }}>
          <h2 className="section-title">Language & Region</h2>
          
          <SettingCard 
            icon={FaGlobe}
            title="Learning Language"
            description="Choose the language you want to learn"
          >
            <div className="language-selector">
              <select
                className="settings-select"
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.name}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </SettingCard>
        </div>

       

        <div className="settings-section" style={{ animationDelay: '0.3s' }}>
          <h2 className="section-title">Notifications</h2>
          
          <SettingCard 
            icon={FaBell}
            title="Push Notifications"
            description="Get notified about your learning progress"
          >
            <ToggleSwitch 
              checked={settings.notifications}
              onChange={(value) => handleSettingChange('notifications', value)}
              label={settings.notifications ? 'Enabled' : 'Disabled'}
            />
          </SettingCard>

          <SettingCard 
            icon={FaClock}
            title="Daily Reminder"
            description="Receive daily reminders to practice"
          >
            <ToggleSwitch 
              checked={settings.dailyReminder}
              onChange={(value) => handleSettingChange('dailyReminder', value)}
              label={settings.dailyReminder ? 'Enabled' : 'Disabled'}
            />
          </SettingCard>
        </div>

        <div className="settings-section" style={{ animationDelay: '0.4s' }}>
          <h2 className="section-title">Learning Experience</h2>
          
          <SettingCard 
            icon={FaVolumeUp}
            title="Sound Effects"
            description="Play sounds during lessons and quizzes"
          >
            <ToggleSwitch 
              checked={settings.soundEffects}
              onChange={(value) => handleSettingChange('soundEffects', value)}
              label={settings.soundEffects ? 'Enabled' : 'Disabled'}
            />
          </SettingCard>

          <SettingCard 
            icon={FaPlay}
            title="Auto-Play Audio"
            description="Automatically play audio pronunciations"
          >
            <ToggleSwitch 
              checked={settings.autoPlay}
              onChange={(value) => handleSettingChange('autoPlay', value)}
              label={settings.autoPlay ? 'Enabled' : 'Disabled'}
            />
          </SettingCard>

          <SettingCard 
            icon={FaChartBar}
            title="Show Progress"
            description="Display progress indicators and statistics"
          >
            <ToggleSwitch 
              checked={settings.showProgress}
              onChange={(value) => handleSettingChange('showProgress', value)}
              label={settings.showProgress ? 'Enabled' : 'Disabled'}
            />
          </SettingCard>
        </div>

        <div className="settings-section" style={{ animationDelay: '0.5s' }}>
          <h2 className="section-title">Account</h2>
          
          <SettingCard 
            icon={FaUser}
            title="Profile Information"
            description={`Logged in as ${user?.username || 'User'}`}
          >
            <button 
              className="settings-button settings-button-secondary"
              onClick={() => navigate('/profile')}
            >
              Edit Profile
            </button>
          </SettingCard>

          <SettingCard 
            icon={FaEnvelope}
            title="Email Preferences"
            description="Manage your email subscription"
          >
            <button className="settings-button settings-button-secondary">
              Manage Emails
            </button>
          </SettingCard>
        </div>

        <div className="settings-section danger-zone" style={{ animationDelay: '0.6s' }}>
          <h2 className="section-title section-danger">Danger Zone</h2>
          
          <SettingCard 
            icon={FaTrash}
            title="Reset All Progress"
            description="This will delete all your learning progress"
          >
            <button className="settings-button settings-button-danger">
              Reset Progress
            </button>
          </SettingCard>

          <SettingCard 
            icon={FaSignOutAlt}
            title="Logout"
            description="Sign out of your account"
          >
            <button className="settings-button settings-button-danger">
              Logout
            </button>
          </SettingCard>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import '../style/SettingsPage.css';
import { updateUser, resetUserProgress, deleteUserAccount, getUserSettings } from '../api';
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
  FaSignOutAlt 
} from 'react-icons/fa';
import { GrPowerReset } from 'react-icons/gr';
import { MdAutoDelete } from 'react-icons/md';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, refreshUser, handleLogout } = useApp();
  const [settings, setSettings] = useState({
    language: user?.language || 'English',
    notifications: true,
    darkMode: false,
    soundEffects: true,
    dailyReminder: true,
    autoPlay: false,
    showProgress: true
  });

  useEffect(() => {
    const savedSettings = user?.settings || localStorage.getItem('vocabSettings');
    if (savedSettings) {
      const parsed = typeof savedSettings === 'string' ? JSON.parse(savedSettings) : savedSettings;
      // Merge but prefer the user's actual language from the app context
      setSettings(prev => ({
        ...parsed,
        language: user?.language || parsed.language || 'English',
      }));
    } else if (user?.language) {
      setSettings(prev => ({ ...prev, language: user.language }));
    }
  }, [user?.language, user?.settings]);

  useEffect(() => {
    if (!user?.id) return;
    getUserSettings().then((data) => {
      setSettings((prev) => ({
        ...prev,
        notifications: data?.notifications?.status ?? prev.notifications,
        dailyReminder: data?.notifications?.dailyPracticeReminder ?? prev.dailyReminder,
        showProgress: data?.notifications?.weeklyProgressSummary ?? prev.showProgress,
        soundEffects: data?.preferences?.soundEffects ?? prev.soundEffects,
        autoPlay: data?.preferences?.listeningExercises ?? prev.autoPlay,
      }));
    }).catch((error) => console.error('Could not load settings:', error));
  }, [user?.id]);

  const handleSettingChange = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('vocabSettings', JSON.stringify(newSettings));
    
    if (key === 'darkMode') {
      document.body.classList.toggle('dark-mode', value);
    }

    if (user?.id) {
      try {
        const updated = await updateUser(user.id, {
          settings: newSettings,
          ...(key === 'language' ? { language: value } : {}),
        });
        refreshUser(updated);
      } catch (err) {
        console.error('Failed to update language:', err);
      }
    }
  };

  const handleResetProgress = async () => {
    if (!user?.id || !window.confirm('Reset all lesson progress, streak and insights?')) return;
    try {
      const updated = await resetUserProgress(user.id);
      refreshUser(updated);
    } catch (error) {
      window.alert(error.message || 'Could not reset progress.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.id || !window.confirm('Delete your account and learning history permanently?')) return;
    try {
      await deleteUserAccount(user.id);
      handleLogout();
      navigate('/');
    } catch (error) {
      window.alert(error.message || 'Could not delete your account.');
    }
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'pl', name: 'Polish', flag: '🇵🇱' },
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
            icon={GrPowerReset}
            title="Reset All Progress"
            description="This will delete all your learning progress"
          >
            <button className="settings-button settings-button-danger" onClick={handleResetProgress}>
              Reset Progress
            </button>
          </SettingCard>

          <SettingCard 
            icon={MdAutoDelete}
            title="Delete Account"
            description="Permanently delete your account and all data"
          >
            <button className="settings-button settings-button-danger" onClick={handleDeleteAccount}>
              Delete Account
            </button>
          </SettingCard>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

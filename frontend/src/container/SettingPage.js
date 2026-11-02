import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import '../style/SettingsPage.css';
import { updateUser, resetUserProgress, deleteUserAccount, getUserSettings } from '../api';
import { 
  FaBell, 
  FaClock, 
  FaUser, 
} from 'react-icons/fa';
import { GrPowerReset } from 'react-icons/gr';
import { MdAutoDelete } from 'react-icons/md';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, refreshUser, handleLogout, showToast } = useApp();
  const [savingKey, setSavingKey] = useState('');
  const [settings, setSettings] = useState({
    notifications: true,
    dailyReminder: true
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('vocabSettings');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings((prev) => Object.fromEntries(Object.keys(prev).map((key) => [
          key,
          typeof parsed[key] === 'boolean' ? parsed[key] : prev[key],
        ])));
      }
    } catch { localStorage.removeItem('vocabSettings'); }
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    getUserSettings().then((data) => {
      setSettings((prev) => ({
        ...prev,
        notifications: data?.notifications?.status ?? prev.notifications,
        dailyReminder: data?.notifications?.dailyPracticeReminder ?? prev.dailyReminder,
      }));
    }).catch((error) => console.error('Could not load settings:', error));
  }, [user?.id]);

  const handleSettingChange = async (key, value) => {
    const previousSettings = settings;
    const newSettings = { ...previousSettings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('vocabSettings', JSON.stringify(newSettings));
    setSavingKey(key);
    if (user?.id) {
      try {
        const updated = await updateUser(user.id, { settings: newSettings });
        refreshUser(updated);
        showToast('Settings saved.', 'success');
      } catch (err) {
        setSettings(previousSettings);
        localStorage.setItem('vocabSettings', JSON.stringify(previousSettings));
        showToast(err.message || 'Could not save this setting.', 'error');
      } finally {
        setSavingKey('');
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

  const ToggleSwitch = ({ checked, onChange, label, disabled }) => (
    <div className="toggle-wrapper">
      <button 
        type="button"
        className={`toggle-switch ${checked ? 'toggle-on' : 'toggle-off'}`}
        onClick={() => onChange(!checked)}
        disabled={disabled || Boolean(savingKey)}
        aria-label={label}
        aria-checked={checked}
        role="switch"
      >
        <span className="toggle-knob" />
      </button>
      <span className={`toggle-state ${checked ? 'is-on' : ''}`}>{checked ? 'On' : 'Off'}</span>
    </div>
  );

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <h1 className="settings-page-title">Settings</h1>
          <p className="settings-page-subtitle">{savingKey ? 'Saving your changes…' : 'Your preferences save automatically'}</p>
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
              label="Push notifications"
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
              label="Daily practice reminder"
            />
          </SettingCard>
        </div>

        <div className="settings-section" style={{ animationDelay: '0.5s' }}>
          <h2 className="section-title">Account</h2>
          
          <SettingCard 
            icon={FaUser}
            title="Profile Information"
            description={`Logged in as ${user?.username || user?.name || user?.email || 'User'}`}
          >
            <button 
              className="settings-button settings-button-secondary"
              onClick={() => navigate('/profile')}
            >
              Edit Profile
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

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Spinner } from 'react-bootstrap';
import {
  FaFire, FaStar, FaMedal, FaEdit, FaCheck,
  FaChartBar, FaBook, FaCamera, FaTrash,
  FaCalendar, FaShieldAlt, FaLanguage,
  FaBullseye, FaClock, FaCrown, FaGem,
  FaRocket, FaTrophy, FaAward
} from 'react-icons/fa';
import {
  updateUser,
  getAchievements,
  getUserActivity,
  getLevelThresholds,
  getLessonProgress,
  getLessons,
} from '../api';
import { useApp } from '../App';
import '../style/profile_style.css';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const LEVEL_ORDER = ['Beginner', 'Intermediate', 'Advanced', 'Fluent', 'Master'];

const checkAchievement = (criteria, user, progressRecords = []) => {
  if (!criteria || !user) return false;

  if (criteria === 'dailyGoal') return !!user.dailyGoal && user.dailyGoal !== '';

  const streak = Number(user.streak) || 0;
  const xp = Number(user.xp) || 0;
  const completedCount = (user.completedLessons || []).length;
  const levelIdx = LEVEL_ORDER.indexOf(user.level || 'Beginner');
  const perfectScores = progressRecords.filter(p => Number(p.score) >= 100).length;

  if (criteria.startsWith('streak>=')) {
    const n = Number(criteria.split('>=')[1]) || 0;
    return streak >= n;
  }
  if (criteria.startsWith('completedLessons>=')) {
    const n = Number(criteria.split('>=')[1]) || 0;
    return completedCount >= n;
  }
  if (criteria.startsWith('xp>=')) {
    const n = Number(criteria.split('>=')[1]) || 0;
    return xp >= n;
  }
  if (criteria.startsWith('level>=')) {
    const target = criteria.split('>=')[1];
    const targetIdx = LEVEL_ORDER.indexOf(target);
    return targetIdx >= 0 && levelIdx >= targetIdx;
  }
  if (criteria.startsWith('perfectScore>=')) {
    const n = Number(criteria.split('>=')[1]) || 0;
    return perfectScores >= n;
  }
  if (criteria.startsWith('leaderboard<=')) {
    return false;
  }
  if (criteria.startsWith('oneDayLessons>=')) {
    const n = Number(criteria.split('>=')[1]) || 0;
    const byDay = {};
    progressRecords.forEach(p => {
      if (!p.completedAt) return;
      const d = new Date(p.completedAt).toDateString();
      byDay[d] = (byDay[d] || 0) + 1;
    });
    return Math.max(0, ...Object.values(byDay)) >= n;
  }

  return false;
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useApp();
  const [ activeTab, setActiveTab ] = useState('activity');
  const [ editing, setEditing ] = useState(false);
  const [ displayName, setDisplayName ] = useState(user?.name || 'Learner');
  const [ saving, setSaving ] = useState(false);
  const [ selectedImage, setSelectedImage ] = useState(null);
  const fileInputRef = React.useRef(null);

  const [loading, setLoading] = useState(true);
  const [allAchievements, setAllAchievements] = useState([]);
  const [thresholds, setThresholds] = useState([]);
  const [lessonsMap, setLessonsMap] = useState({});
  const [progressRecords, setProgressRecords] = useState([]);
  const [weeklyXP, setWeeklyXP] = useState(
    weekDays.map(day => ({ day, xp: 0 }))
  );

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, []);

  useEffect(() => {
    if (editing) return; // don't overwrite live edits
    setDisplayName(user?.name || 'Learner');
    if (user?.avatar && typeof user.avatar === 'string' && user.avatar.startsWith('data:')) {
      setSelectedImage(user.avatar);
    } else {
      setSelectedImage(null);
    }
  }, [user, editing]);

  useEffect(() => {
    if (!user?.id) return;
    let mounted = true;
    setLoading(true);

    const loadAll = async () => {
      try {
        const [achievementsRes, activityRes, thresholdsRes, progressRes, lessonsRes] = await Promise.all([
          getAchievements(),
          getUserActivity(user.id),
          getLevelThresholds(),
          getLessonProgress(user.id),
          getLessons(user.language || 'English'),
        ]);

        if (!mounted) return;

        setAllAchievements(Array.isArray(achievementsRes) ? achievementsRes : []);
        setThresholds(Array.isArray(thresholdsRes) ? thresholdsRes : []);
        setProgressRecords(Array.isArray(progressRes) ? progressRes : []);

        const lMap = {};
        (Array.isArray(lessonsRes) ? lessonsRes : []).forEach(l => { lMap[l.id] = l; });
        setLessonsMap(lMap);

        if (activityRes && Array.isArray(activityRes.week) && activityRes.week.length > 0) {
          setWeeklyXP(
            weekDays.map(d => {
              const found = activityRes.week.find(w => w.day === d);
              return { day: d, xp: found ? Number(found.xp) || 0 : 0 };
            })
          );
        } else {
          const streakDays = Number(user.streak) || 0;
          setWeeklyXP(
            weekDays.map((d, i) => ({
              day: d,
              xp: i < Math.min(streakDays, 7) ? 20 + Math.floor((user.xp || 0) / 10) % 60 : 0,
            }))
          );
        }
      } catch (e) {
        console.error('Profile data load failed:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadAll();
    return () => { mounted = false; };
  }, [user?.id, user?.language, user?.streak, user?.xp]);

  const getInitial = n => n?.trim()?.charAt(0)?.toUpperCase() || 'L';
  const completedLessons = user?.completedLessons || [];
  const currentXP = user?.xp || 0;

  const levelConfig = thresholds.find(t => t.level === (user?.level || 'Beginner'));
  const maxXP = levelConfig ? Number(levelConfig.maxXP) - Number(levelConfig.minXP) : 500;
  const xpInLevel = levelConfig
    ? Math.max(0, currentXP - Number(levelConfig.minXP))
    : currentXP;
  const levelProgress = maxXP > 0 ? Math.min(Math.round((xpInLevel / maxXP) * 100), 100) : 0;
  const xpToNext = Math.max(0, maxXP - xpInLevel);

  const achievements = allAchievements.map(a => ({
    ...a,
    earned: checkAchievement(a.criteria, user, progressRecords),
  }));
  const earnedCount = achievements.filter(a => a.earned).length;

  const maxBarXP = Math.max(...weeklyXP.map(d => d.xp), 1);
  const joinedDate = user?.joinedDate
    ? new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Recently joined';

  const handleSaveName = async () => {
    if (!displayName.trim() || !user?.id) { setEditing(false); return; }
    setSaving(true);
    try {
      const updated = await updateUser(user.id, { name: displayName.trim(), avatar: selectedImage || null });
      // refreshUser is now synchronous — state updates before setEditing(false)
      refreshUser(updated);
    } catch (e) { console.error(e); }
    finally { setSaving(false); setEditing(false); }
  };

  const handleImageUpload = async e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onloadend = () => {
      // Compress image to max 200x200 and quality 0.7 to keep payload small
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const MAX = 200;
        let w = img.width, h = img.height;
        if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
        else { w = Math.round(w * MAX / h); h = MAX; }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setSelectedImage(dataUrl);
        if (user?.id) {
          try {
            const updated = await updateUser(user.id, { avatar: dataUrl });
            refreshUser(updated);
          } catch (err) {
            console.error('Avatar save failed:', err);
          }
        }
      };
      img.src = r.result;
    };
    r.readAsDataURL(f);
  };

  const handleCameraClick = () => fileInputRef.current?.click();

  const handleRemoveImage = async () => {
    setSelectedImage(null);
    if (user?.id) {
      try {
        const updated = await updateUser(user.id, { avatar: null });
        refreshUser(updated);
      } catch (err) {
        console.error('Avatar remove failed:', err);
      }
    }
  };

  const getLeagueBadge = () => {
    const xp = currentXP;
    if (xp >= 400) return { label: 'Diamond League', icon: <FaGem />, color: '#6b7fd4', bg: 'linear-gradient(135deg, #eef0ff, #dde2ff)' };
    if (xp >= 250) return { label: 'Gold League', icon: <FaCrown />, color: '#c4973b', bg: 'linear-gradient(135deg, #fdf5dc, #faecd0)' };
    if (xp >= 100) return { label: 'Silver League', icon: <FaMedal />, color: '#6b7280', bg: 'linear-gradient(135deg, #f0f1f3, #e4e6ea)' };
    return { label: 'Bronze League', icon: <FaShieldAlt />, color: '#a67c52', bg: 'linear-gradient(135deg, #faeedd, #f4dec6)' };
  };

  const league = getLeagueBadge();

  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' · ' +
        d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch { return 'Completed'; }
  };

  if (loading) {
    return (
      <div className="hprof_page">
        <div className="text-center py-5">
          <Spinner animation="border" variant="success" />
          <p className="mt-3 text-muted">Loading profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hprof_page">
      <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleImageUpload} />

      {/* MAIN PROFILE CARD */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="hprof_profile_card"
      >
        {/* AVATAR + NAME SECTION */}
        <div className="hprof_header">
          <div className="hprof_avatar_section">
            <div className="hprof_avatar_ring">
              <div className="hprof_avatar">
                {selectedImage ? <img src={selectedImage} alt="avatar" /> : <span>{getInitial(displayName)}</span>}
              </div>
              {editing && (
                <div className="hprof_avatar_actions">
                  <button type="button" className="hprof_avatar_btn hprof_cam_btn" onClick={handleCameraClick} title="Change photo" aria-label="Change profile photo">
                    <FaCamera size={12} />
                  </button>
                </div>
              )}
            </div>
            {editing && selectedImage && (
              <button type="button" className="hprof_remove_photo_btn" onClick={handleRemoveImage}>
                <FaTrash size={12} />
                <span>Remove photo</span>
              </button>
            )}
          </div>

          <div className="hprof_info_section">
            {editing ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="hprof_edit_block"
              >
                <label className="hprof_edit_label">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  autoFocus
                  className="hprof_name_input"
                  placeholder="Your full name"
                  maxLength={30}
                />
                <div className="hprof_edit_actions">
                  <button className="hprof_save_btn" onClick={handleSaveName} disabled={saving}>
                    <FaCheck size={12} /> {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                  <button className="hprof_cancel_btn" onClick={() => {
                    setEditing(false);
                    setDisplayName(user?.name || 'Learner');
                    setSelectedImage(user?.avatar && typeof user.avatar === 'string' && user.avatar.startsWith('data:') ? user.avatar : null);
                  }}>
                    Cancel
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
                <div className="hprof_name_row">
                  <h1 className="hprof_name">
                    {displayName}
                    <span className="hprof_name_sparkle" role="img" aria-label="sparkle">✨</span>
                  </h1>
                  <button className="hprof_edit_btn" onClick={() => setEditing(true)} title="Edit profile">
                    <FaEdit size={13} /> Edit
                  </button>
                </div>
                <p className="hprof_email">{user?.email || ''}</p>

                <div className="hprof_badges_row">
                  <span className="hprof_badge hprof_badge_lang">
                    <FaLanguage size={10} /> Learning {user?.language || 'Spanish'}
                  </span>
                  <span
                    className="hprof_badge hprof_badge_league"
                    style={{ '--league-color': league.color, '--league-bg': league.bg }}
                  >
                    <span className="hprof_league_icon">{league.icon}</span>
                    {league.label}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* XP LEVEL PROGRESS */}
        {!editing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="hprof_level_section"
          >
            <div className="hprof_level_header">
              <div className="hprof_level_title">
                <span className="hprof_level_icon"><FaTrophy size={14} /></span>
                <span className="hprof_level_text">Level: <strong>{user?.level || 'Beginner'}</strong></span>
              </div>
              <div className="hprof_level_xp">
                <strong>{xpInLevel}</strong> / {maxXP} XP
              </div>
            </div>
            <div className="hprof_progress_track">
              <div className="hprof_progress_fill" style={{ width: `${levelProgress}%` }}>
                <div className="hprof_progress_shine" />
              </div>
            </div>
            <div className="hprof_level_footer">
              <span className="hprof_next_level">
                <FaRocket size={11} /> {xpToNext} XP to next level
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* STATS GRID */}
      {!editing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="hprof_stats_grid"
        >
          {[
            {
              icon: <FaFire />,
              value: user?.streak || 0,
              label: 'Day Streak',
              color: '#f2a541',
              bg: 'linear-gradient(135deg, #fff7ec 0%, #ffe9cf 100%)',
              border: 'rgba(242, 165, 65, 0.35)'
            },
            {
              icon: <FaStar />,
              value: currentXP,
              label: 'Total XP',
              color: '#2f855a',
              bg: 'linear-gradient(135deg, #eefaf3 0%, #d7f0e1 100%)',
              border: 'rgba(47, 133, 90, 0.30)'
            },
            {
              icon: <FaAward />,
              value: user?.hearts ?? 5,
              label: 'Hearts Left',
              color: '#c45c5c',
              bg: 'linear-gradient(135deg, #fdf0f0 0%, #fadddd 100%)',
              border: 'rgba(196, 92, 92, 0.30)'
            },
            {
              icon: <FaBook />,
              value: completedLessons.length,
              label: 'Lessons Done',
              color: '#6b7fd4',
              bg: 'linear-gradient(135deg, #eef0ff 0%, #dde2ff 100%)',
              border: 'rgba(107, 127, 212, 0.30)'
            },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.06) }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="hprof_stat_card"
              style={{ '--stat-bg': s.bg, '--stat-color': s.color, '--stat-border': s.border }}
            >
              <div className="hprof_stat_icon">{s.icon}</div>
              <div className="hprof_stat_value">{s.value}</div>
              <div className="hprof_stat_label">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* QUICK INFO BAR */}
      {!editing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="hprof_info_bar"
        >
          <div className="hprof_info_item">
            <div className="hprof_info_icon"><FaCalendar size={13} /></div>
            <div className="hprof_info_content">
              <div className="hprof_info_label">Joined</div>
              <div className="hprof_info_value">{joinedDate}</div>
            </div>
          </div>
          <div className="hprof_info_divider" />
          <div className="hprof_info_item">
            <div className="hprof_info_icon"><FaBullseye size={13} /></div>
            <div className="hprof_info_content">
              <div className="hprof_info_label">Daily Goal</div>
              <div className="hprof_info_value">{user?.dailyGoal || 'Regular'}</div>
            </div>
          </div>
          <div className="hprof_info_divider" />
          <div className="hprof_info_item">
            <div className="hprof_info_icon"><FaClock size={13} /></div>
            <div className="hprof_info_content">
              <div className="hprof_info_label">Achievements</div>
              <div className="hprof_info_value">{earnedCount} / {achievements.length || 0}</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TABS CONTENT CARD */}
      {!editing && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="hprof_tabs_card"
        >
          <div className="hprof_tabs_nav">
            {[
              { key: 'activity', icon: <FaChartBar size={12} />, label: 'Activity' },
              { key: 'achievements', icon: <FaMedal size={12} />, label: 'Badges' },
              { key: 'history', icon: <FaBook size={12} />, label: 'History' },
            ].map(t => (
              <button
                key={t.key}
                className={`hprof_tab_btn ${activeTab === t.key ? 'hprof_tab_active' : ''}`}
                onClick={() => setActiveTab(t.key)}
              >
                {t.icon}
                <span>{t.label}</span>
                {activeTab === t.key && <motion.span layoutId="hprofTabIndicator" className="hprof_tab_indicator" />}
              </button>
            ))}
          </div>

          <div className="hprof_tab_content">
            <AnimatePresence mode="wait">
              {activeTab === 'activity' && (
                <motion.div
                  key="activity"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28 }}
                  className="hprof_tab_panel"
                >
                  <div className="hprof_section_head">
                    <h4 className="hprof_section_title">Weekly XP Activity</h4>
                    <span className="hprof_section_subtitle">Last 7 days progress</span>
                  </div>

                  <div className="hprof_chart_wrap">
                    <div className="hprof_chart">
                      {weeklyXP.map((d, i) => (
                        <div key={i} className="hprof_chart_col">
                          {d.xp > 0 && <span className="hprof_chart_val">{d.xp}</span>}
                          <div
                            className={`hprof_chart_bar ${d.xp === 0 ? 'hprof_bar_empty' : ''}`}
                            style={{ height: `${Math.max((d.xp / maxBarXP) * 100, d.xp > 0 ? 6 : 2)}px` }}
                          />
                          <span className={`hprof_chart_day ${d.xp === 0 ? 'hprof_day_dim' : ''}`}>{d.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="hprof_summary_grid">
                    {[
                      { icon: '⭐', val: currentXP, lbl: 'Total XP Earned', color: '#2f855a' },
                      { icon: '🔥', val: `${user?.streak || 0}d`, lbl: 'Current Streak', color: '#f2a541' },
                      { icon: '✅', val: completedLessons.length, lbl: 'Lessons Completed', color: '#6b7fd4' },
                    ].map((s, i) => (
                      <div key={i} className="hprof_summary_card" style={{ '--sum-accent': s.color }}>
                        <span className="hprof_sum_icon">{s.icon}</span>
                        <div className="hprof_sum_meta">
                          <div className="hprof_sum_val">{s.val}</div>
                          <div className="hprof_sum_lbl">{s.lbl}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'achievements' && (
                <motion.div
                  key="achievements"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28 }}
                  className="hprof_tab_panel"
                >
                  <div className="hprof_section_head">
                    <h4 className="hprof_section_title">Your Achievements</h4>
                    <span className="hprof_section_subtitle">
                      {earnedCount} earned · {Math.max(0, achievements.length - earnedCount)} to go
                    </span>
                  </div>

                  {achievements.length === 0 ? (
                    <div className="hprof_empty_state">
                      <div className="hprof_empty_icon">🏅</div>
                      <h5>No achievements yet</h5>
                      <p>Achievements will appear once configured.</p>
                    </div>
                  ) : (
                    <div className="hprof_ach_grid">
                      {achievements.map((a, i) => (
                        <motion.div
                          key={a.id || i}
                          whileHover={a.earned ? { y: -4, scale: 1.02 } : {}}
                          transition={{ duration: 0.2 }}
                          className={`hprof_ach_card ${a.earned ? '' : 'hprof_ach_locked'}`}
                          style={{ '--ach-accent': a.accent || '#999' }}
                        >
                          <div className={`hprof_ach_icon_wrap ${a.earned ? 'hprof_ach_unlocked_bg' : 'hprof_ach_locked_bg'}`}>
                            <span className="hprof_ach_icon">{a.icon || '🏆'}</span>
                            {a.earned && <span className="hprof_ach_check"><FaCheck size={8} /></span>}
                          </div>
                          <div className="hprof_ach_label">{a.label}</div>
                          <div className="hprof_ach_desc">{a.desc}</div>
                          {a.earned ? (
                            <span className="hprof_ach_status hprof_ach_earned">
                              <FaCheck size={9} /> Unlocked
                            </span>
                          ) : (
                            <span className="hprof_ach_status hprof_ach_locked_text">
                              🔒 Locked
                            </span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'history' && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28 }}
                  className="hprof_tab_panel"
                >
                  <div className="hprof_section_head">
                    <h4 className="hprof_section_title">Lesson History</h4>
                    <span className="hprof_section_subtitle">Your learning journey</span>
                  </div>

                  {completedLessons.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="hprof_empty_state"
                    >
                      <div className="hprof_empty_icon">📖</div>
                      <h5>No lessons completed yet</h5>
                      <p>Start your learning journey and track progress here.</p>
                      <button className="hprof_empty_cta" onClick={() => navigate('/dashboard')}>
                        Start Learning <FaRocket size={12} />
                      </button>
                    </motion.div>
                  ) : (
                    <div className="hprof_history_list">
                      {completedLessons.slice().reverse().map((id, i) => {
                        const lesson = lessonsMap[id];
                        const record = progressRecords.find(p => Number(p.lessonId) === Number(id));
                        const xpEarned = record?.xpEarned || lesson?.xp || 10;
                        const completedAt = record?.completedAt;
                        const score = record?.score;

                        return (
                          <motion.div
                            key={`${id}-${i}`}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                            whileHover={{ x: 4, backgroundColor: 'var(--primary-soft)' }}
                            className="hprof_history_row"
                          >
                            <div className="hprof_history_icon">
                              {lesson?.icon ? <span style={{ fontSize: 18 }}>{lesson.icon}</span> : <FaBook size={14} />}
                            </div>
                            <div className="hprof_history_meta">
                              <div className="hprof_history_title">
                                {lesson?.title ? `${lesson.title}` : `Lesson ${id}`}
                              </div>
                              <div className="hprof_history_sub">
                                <FaCalendar size={10} />{' '}
                                {completedAt ? formatDate(completedAt) : 'Completed'}
                                {typeof score === 'number' && (
                                  <span className="ms-2">· Score: {score}%</span>
                                )}
                              </div>
                            </div>
                            <div className="hprof_history_badge">+{xpEarned} XP</div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Profile;

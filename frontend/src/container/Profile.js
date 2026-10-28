import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Spinner } from 'react-bootstrap';
import {
  FaFire, FaEdit, FaCheck,
  FaChartBar, FaBook, FaCamera, FaTrash,
  FaCalendar, FaLanguage,
  FaBullseye, FaClock, FaAward
} from 'react-icons/fa';
import {
  updateUser,
  getAchievements,
  getLessonProgress,
  getLessons,
} from '../api';
import { useApp } from '../App';
import '../style/profile_style.css';

const checkAchievement = (criteria, user, progressRecords = []) => {
  if (!criteria || !user) return false;

  if (criteria === 'dailyGoal') return !!user.dailyGoal && user.dailyGoal !== '';

  const streak = Number(user.streak) || 0;
  const completedCount = (user.completedLessons || []).length;
  const perfectScores = progressRecords.filter(p => Number(p.score) >= 100).length;

  if (criteria.startsWith('streak>=')) {
    const n = Number(criteria.split('>=')[1]) || 0;
    return streak >= n;
  }
  if (criteria.startsWith('completedLessons>=')) {
    const n = Number(criteria.split('>=')[1]) || 0;
    return completedCount >= n;
  }
  if (criteria.startsWith('perfectScore>=')) {
    const n = Number(criteria.split('>=')[1]) || 0;
    return perfectScores >= n;
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
  const { user, refreshUser, showToast } = useApp();
  const [ activeTab, setActiveTab ] = useState('activity');
  const [ editing, setEditing ] = useState(false);
  const [ displayName, setDisplayName ] = useState(user?.name || 'Learner');
  const [ saving, setSaving ] = useState(false);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const [ selectedImage, setSelectedImage ] = useState(null);
  const fileInputRef = React.useRef(null);

  const [loading, setLoading] = useState(true);
  const [allAchievements, setAllAchievements] = useState([]);
  const [lessonsMap, setLessonsMap] = useState({});
  const [progressRecords, setProgressRecords] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, []);

  useEffect(() => {
    if (editing) return; // don't overwrite live edits
    setDisplayName(user?.name || 'Learner');
    setSelectedImage(typeof user?.avatar === 'string' ? user.avatar : null);
  }, [user, editing]);

  useEffect(() => {
    if (!user?.id) return;
    let mounted = true;
    setLoading(true);

    const loadAll = async () => {
      try {
        const [achievementsRes, progressRes, lessonsRes] = await Promise.all([
          getAchievements(),
          getLessonProgress(user.id),
          getLessons(user.language || 'English'),
        ]);

        if (!mounted) return;

        setAllAchievements(Array.isArray(achievementsRes) ? achievementsRes : []);
        setProgressRecords(Array.isArray(progressRes) ? progressRes : []);

        const lMap = {};
        (Array.isArray(lessonsRes) ? lessonsRes : []).forEach(l => { lMap[l.id] = l; });
        setLessonsMap(lMap);

      } catch (e) {
        console.error('Profile data load failed:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadAll();
    return () => { mounted = false; };
  }, [user?.id, user?.language]);

  const getInitial = n => n?.trim()?.charAt(0)?.toUpperCase() || 'L';
  const completedLessons = user?.completedLessons || [];
  const achievements = allAchievements.filter((achievement) =>
    /^(dailyGoal|streak>=|completedLessons>=|perfectScore>=|oneDayLessons>=)/i.test(achievement.criteria || ''),
  ).map(a => ({
    ...a,
    earned: checkAchievement(a.criteria, user, progressRecords),
  }));
  const earnedCount = achievements.filter(a => a.earned).length;

  const joinedDate = user?.joinedDate
    ? new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Recently joined';

  const handleSaveName = async () => {
    if (!displayName.trim() || !user?.id) { setEditing(false); return; }
    setSaving(true);
    try {
      const updated = await updateUser(user.id, { name: displayName.trim() });
      refreshUser(updated);
      showToast('Profile updated successfully', 'success');
      setEditing(false);
    } catch (error) {
      console.error('Profile update failed:', error);
      showToast(error?.message || 'Could not update your profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setAvatarSaving(true);
    try {
      const { blob, preview } = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX = 200;
          let w = img.width, h = img.height;
          if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
          else { w = Math.round(w * MAX / h); h = MAX; }
          canvas.width = w;
          canvas.height = h;
          const context = canvas.getContext('2d');
          if (!context) {
            reject(new Error('Could not process the selected image'));
            return;
          }
          context.drawImage(img, 0, 0, w, h);
          canvas.toBlob((result) => {
            if (!result) {
              reject(new Error('Could not process the selected image'));
              return;
            }
            resolve({ blob: result, preview: canvas.toDataURL('image/jpeg', 0.7) });
          }, 'image/jpeg', 0.7);
        };
        img.onerror = () => reject(new Error('Could not read the selected image'));
        img.src = imageUrl;
      });

      if (!user?.id) throw new Error('Please sign in again before changing your photo');
      setSelectedImage(preview);
      const updated = await updateUser(user.id, { avatar: blob });
      const savedAvatar = updated?.avatar || updated?.avatarUrl;
      if (!savedAvatar) throw new Error('The server did not return the saved profile photo');
      refreshUser(updated);
      setSelectedImage(savedAvatar);
      showToast('Profile photo saved', 'success');
    } catch (error) {
      console.error('Avatar save failed:', error);
      setSelectedImage(typeof user?.avatar === 'string' ? user.avatar : null);
      showToast(error?.message || 'Could not save your profile photo', 'error');
    } finally {
      URL.revokeObjectURL(imageUrl);
      setAvatarSaving(false);
      e.target.value = '';
    }
  };

  const handleCameraClick = () => fileInputRef.current?.click();

  const handleRemoveImage = async () => {
    if (!user?.id) return;
    const previousImage = selectedImage;
    setSelectedImage(null);
    setAvatarSaving(true);
    try {
      const updated = await updateUser(user.id, { avatar: null });
      refreshUser(updated);
      showToast('Profile photo removed', 'success');
    } catch (error) {
      console.error('Avatar remove failed:', error);
      setSelectedImage(previousImage);
      showToast(error?.message || 'Could not remove your profile photo', 'error');
    } finally {
      setAvatarSaving(false);
    }
  };

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
                  <button type="button" className="hprof_avatar_btn hprof_cam_btn" onClick={handleCameraClick} title="Change photo" aria-label="Change profile photo" disabled={avatarSaving}>
                    <FaCamera size={12} />
                  </button>
                </div>
              )}
            </div>
            {editing && selectedImage && (
              <button type="button" className="hprof_remove_photo_btn" onClick={handleRemoveImage} disabled={avatarSaving}>
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
                  <button className="hprof_save_btn" onClick={handleSaveName} disabled={saving || avatarSaving}>
                    <FaCheck size={12} /> {saving ? 'Saving…' : avatarSaving ? 'Saving photo…' : 'Save Changes'}
                  </button>
                  <button className="hprof_cancel_btn" onClick={() => {
                    setEditing(false);
                    setDisplayName(user?.name || 'Learner');
                    setSelectedImage(typeof user?.avatar === 'string' ? user.avatar : null);
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
                </div>
              </>
            )}
          </div>
        </div>

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
              { key: 'achievements', icon: <FaAward size={12} />, label: 'Badges' },
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
                    <h4 className="hprof_section_title">Learning Activity</h4>
                    <span className="hprof_section_subtitle">Your learning progress</span>
                  </div>

                  <div className="hprof_summary_grid">
                    {[
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
                        Start Learning
                      </button>
                    </motion.div>
                  ) : (
                    <div className="hprof_history_list">
                      {completedLessons.slice().reverse().map((id, i) => {
                        const lesson = lessonsMap[id];
                        const record = progressRecords.find((p) => String(p.journeyLessonId || p.lessonId) === String(id));
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

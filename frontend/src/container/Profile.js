
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Badge, Button, ProgressBar, Tab, Nav } from 'react-bootstrap';
import {
  FaFire, FaStar, FaHeart, FaTrophy, FaMedal,
  FaEdit, FaCheck, FaGlobe, FaCalendar,
  FaChartBar, FaBook, FaCheckCircle, FaCamera, FaTrash
} from 'react-icons/fa';
import { updateUser } from '../api';
import { useApp } from '../App';

const allAchievements = [
  { icon: '🔥', label: '7-Day Streak', desc: 'Practice 7 days in a row', check: (u) => (u.streak || 0) >= 7 },
  { icon: '⭐', label: 'First Lesson', desc: 'Complete your first lesson', check: (u) => (u.completedLessons || []).length >= 1 },
  { icon: '💎', label: '100 XP Club', desc: 'Earn 100 XP total', check: (u) => (u.xp || 0) >= 100 },
  { icon: '🏆', label: 'Top 10', desc: 'Reach top 10 on leaderboard', check: () => false },
  { icon: '🌟', label: 'Perfect Score', desc: 'Get 100% on a lesson', check: () => false },
  { icon: '📚', label: '10 Lessons', desc: 'Complete 10 lessons', check: (u) => (u.completedLessons || []).length >= 10 },
  { icon: '🚀', label: 'Level Up', desc: 'Advance to intermediate', check: (u) => u.level === 'Intermediate' || u.level === 'Advanced' },
  { icon: '🎯', label: 'Goal Setter', desc: 'Set a daily goal', check: (u) => !!u.dailyGoal },
];

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const Profile = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useApp();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.name || 'Learner');
  const [saving, setSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, []);

  useEffect(() => {
    setDisplayName(user?.name || 'Learner');
    if (user?.avatar) {
      if (typeof user.avatar === 'string' && user.avatar.startsWith('data:')) {
        setSelectedImage(user.avatar);
      } else {
        setSelectedImage(null);
      }
    }
  }, [user]);

  const getInitial = (name) => {
    if (!name) return 'L';
    return name.trim().charAt(0).toUpperCase();
  };

  const completedLessons = user?.completedLessons || [];
  const maxXP = 500;
  const levelProgress = Math.min(Math.round(((user?.xp || 0) / maxXP) * 100), 100);

  const achievements = allAchievements.map(a => ({ ...a, earned: a.check(user) }));

  // Fake weekly data based on xp
  const activityData = weekDays.map((day, i) => ({
    day,
    xp: i < (user?.streak || 0) ? Math.floor(Math.random() * 80) + 10 : 0,
  }));

  const handleSaveName = async () => {
    if (!displayName.trim() || !user?.id) { setEditing(false); return; }
    setSaving(true);
    try {
      const updated = await updateUser(user.id, {
        name: displayName.trim(),
        avatar: selectedImage || null,
      });
      refreshUser(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
      setEditing(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="h_profile_inner" style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      <Row className="g-4 profile-page-content" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0' }}>
        {/* Left Column - Profile Info */}
        <Col xs={12} className="p-0 m-0">
          <Card className="h_profile_card border-0 mb-4" style={{
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-md)',
            overflow: 'hidden'
          }}>
            <div className="profile-header-banner" style={{
              background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
              height: '70px'
            }}></div>
            <Card.Body className="p-3 overflow-hidden profile-card-body" style={{ marginTop: '-40px' }}>
              <div className="text-center mb-4">
                {/* Avatar */}
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.75rem' }}>
                  {selectedImage ? (
                    <div style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      border: '4px solid var(--bg-white)',
                      boxShadow: 'var(--shadow-md)',
                      overflow: 'hidden'
                    }} className="profile-avatar">
                      <img 
                        src={selectedImage} 
                        alt="Avatar" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  ) : (
                    <div style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      border: '4px solid var(--bg-white)',
                      boxShadow: 'var(--shadow-md)',
                      background: 'var(--bg-card)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary-dark)',
                      fontSize: '2.25rem',
                      fontWeight: '800'
                    }} className="profile-avatar">
                      {getInitial(displayName)}
                    </div>
                  )}
                  {editing && (
                    <div style={{ position: 'absolute', bottom: '0px', right: '0px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <button
                        type="button"
                        onClick={handleCameraClick}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'var(--primary)',
                          color: 'var(--text-light)',
                          border: '2px solid var(--bg-white)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      >
                        <FaCamera size={12} />
                      </button>
                      {selectedImage && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'var(--danger)',
                            color: 'var(--text-light)',
                            border: '2px solid var(--bg-white)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: 'var(--shadow-sm)'
                          }}
                        >
                          <FaTrash size={10} />
                        </button>
                      )}
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                </div>

                {editing ? (
                  <div>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      autoFocus
                      className="profile-name-input"
                      style={{
                        width: '100%',
                        maxWidth: '300px',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '2px solid var(--primary-border)',
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        textAlign: 'center',
                        marginBottom: '1rem',
                        outline: 'none',
                        transition: 'all var(--transition)'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--primary-border)'}
                      placeholder="Enter your name"
                    />
                    <div className="d-flex gap-2 justify-content-center h_profile_edit_actions">
                      <Button
                        variant="primary"
                        onClick={handleSaveName}
                        disabled={saving}
                        className="h_profile_editbtn_save"
                        style={{
                          background: 'var(--primary)',
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          fontWeight: '700',
                          padding: '0.5rem 1.5rem'
                        }}
                      >
                        {saving ? <FaCheck className="me-1" /> : null}
                        {saving ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setEditing(false);
                          setDisplayName(user?.name || 'Learner');
                          setSelectedImage(user?.avatar ? (typeof user.avatar === 'string' && user.avatar.startsWith('data:') ? user.avatar : null) : null);
                        }}
                        className="h_profile_editbtn_cancel"
                        style={{
                          background: 'var(--bg-muted)',
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          fontWeight: '600',
                          color: 'var(--text-muted)',
                          padding: '0.5rem 1.5rem'
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="h_profile_name" style={{
                      fontWeight: '800',
                      color: 'var(--text)',
                      fontSize: '1.5rem',
                      marginBottom: '0.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}>
                      {displayName}
                      <FaEdit
                        style={{
                          cursor: 'pointer',
                          color: 'var(--text-muted)',
                          padding: '0.25rem',
                          borderRadius: '50%',
                          transition: 'all var(--transition)'
                        }}
                        onClick={() => setEditing(true)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--primary)';
                          e.currentTarget.style.background = 'var(--primary-soft)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--text-muted)';
                          e.currentTarget.style.background = 'transparent';
                        }}
                      />
                    </h3>
                    <p className="h_profile_email" style={{ color: 'var(--text-muted)', margin: '0', fontSize: '0.95rem' }}>
                      {user?.email || ''}
                    </p>
                  </div>
                )}
              </div>

              {!editing && (
                <>
                  <div className="d-flex justify-content-center mb-4">
                    <Badge className="h_profile_badge" style={{
                      background: 'var(--primary-soft) !important',
                      color: 'var(--primary-dark)',
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      border: '1px solid var(--primary-border)'
                    }}>
                      <FaGlobe className="me-2" />
                      Learning {user?.language || 'Spanish'}
                    </Badge>
                  </div>

                  <div className="h_profile_levelcard" style={{
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    marginBottom: '1.5rem',
                    border: '1px solid var(--primary-border)'
                  }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="h_profile_level_label" style={{ fontWeight: '700', color: 'var(--text)', fontSize: '0.9rem' }}>
                        Level: {user?.level || 'Beginner'}
                      </span>
                      <span className="h_profile_level_xp" style={{ fontWeight: '600', color: 'var(--primary-dark)', fontSize: '0.9rem' }}>
                        {user?.xp || 0} / {maxXP} XP
                      </span>
                    </div>
                    <ProgressBar
                      now={levelProgress}
                      className="h_level_bar"
                      style={{ height: '10px', borderRadius: '6px' }}
                    />
                  </div>

                  <Row className="g-3 mb-4 h_profile_statscol">
                    <Col xs={6}>
                      <div className="h_profile_statcard" style={{
                        background: 'var(--bg-card)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1rem',
                        textAlign: 'center',
                        border: '1px solid var(--primary-border)'
                      }}>
                        <FaFire className="mb-1 h_profile_statcard_icon" style={{ color: 'var(--warning)', fontSize: '1.35rem' }} />
                        <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text)' }} className="stat-card-value">
                          {user?.streak || 0}
                        </div>
                        <div className="h_profile_statcard_label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                          Streak
                        </div>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="h_profile_statcard" style={{
                        background: 'var(--bg-card)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1rem',
                        textAlign: 'center',
                        border: '1px solid var(--primary-border)'
                      }}>
                        <FaStar className="mb-1 h_profile_statcard_icon" style={{ color: 'var(--primary)', fontSize: '1.35rem' }} />
                        <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text)' }} className="stat-card-value">
                          {user?.xp || 0}
                        </div>
                        <div className="h_profile_statcard_label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                          Total XP
                        </div>
                      </div>
                    </Col>
                  </Row>
                </>
              )}
            </Card.Body>
          </Card>

          {!editing && (
            <Card className="border-0 h_profile_hearts_card" style={{
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-md)',
              background: 'linear-gradient(135deg, var(--danger-soft), #fff5f5)'
            }}>
              <Card.Body className="p-3 text-center">
                <h6 style={{ fontWeight: '800', color: 'var(--danger)', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                  <FaHeart className="me-2" /> Hearts
                </h6>
                <div className="d-flex justify-content-center gap-2 mb-3">
                  {Array(5).fill(0).map((_, i) => (
                    <FaHeart
                      key={i}
                      className="h_profile_hearts_heart"
                      size={24}
                      style={{
                        color: i < (user?.hearts ?? 5) ? 'var(--danger)' : '#ffcdd2',
                        transition: 'transform 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  ))}
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: '500', fontSize: '0.85rem' }}>
                  {(user?.hearts ?? 5) === 5 ? 'Fully charged! Ready to learn!' : `${user?.hearts ?? 0} hearts remaining`}
                </p>
                <Button
                  variant="danger"
                  onClick={() => navigate('dashboard')}
                  className="h_profile_hearts_cardbtn"
                  style={{
                    background: 'var(--danger)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: '700',
                    width: '100%',
                    fontSize: '0.85rem'
                  }}
                >
                  Practice to Restore
                </Button>
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* Right Column - Tabs */}
        {!editing && (
          <Col xs={12} className="p-0">
            <Card className="border-0" style={{
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-md)',
              overflow: 'hidden'
            }}>
              <Tab.Container defaultActiveKey="activity">
                <Nav variant="tabs" className="h_profile_tabs_nav flex-nowrap" style={{
                  background: 'var(--bg-card)',
                  padding: '0.75rem 1rem 0',
                  borderBottom: '1px solid var(--primary-border)',
                }}>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="activity"
                      style={{
                        fontWeight: '700',
                        color: 'var(--text-muted)',
                        border: 'none',
                        borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                        padding: '0.75rem 1.25rem',
                        marginRight: '0.5rem',
                        transition: 'all var(--transition)',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <FaChartBar className="me-2" /> Activity
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="achievements"
                      style={{
                        fontWeight: '700',
                        color: 'var(--text-muted)',
                        border: 'none',
                        borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                        padding: '0.75rem 1.25rem',
                        marginRight: '0.5rem',
                        transition: 'all var(--transition)',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <FaMedal className="me-2" /> Achievements
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="history"
                      style={{
                        fontWeight: '700',
                        color: 'var(--text-muted)',
                        border: 'none',
                        borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                        padding: '0.75rem 1.25rem',
                        marginRight: '0.5rem',
                        transition: 'all var(--transition)',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <FaBook className="me-2" /> History
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                <style jsx>{`
                  .nav-link.active {
                    background: white !important;
                    color: var(--primary-dark) !important;
                    border-bottom: 3px solid var(--primary) !important;
                    margin-bottom: -1px !important;
                  }
                  .nav-link:hover:not(.active) {
                    color: var(--primary) !important;
                    background: var(--primary-soft) !important;
                  }
                `}</style>

                <Card.Body className="p-3 h_profile_tab_body">
                  <Tab.Content>
                    {/* Activity Tab */}
                    <Tab.Pane eventKey="activity">
                      <h5 className="h_profile_section_title" style={{ fontWeight: '800', color: 'var(--text)', marginBottom: '1.25rem', fontSize: '1.1rem' }}>
                        <FaChartBar className="me-2" style={{ color: 'var(--primary)' }} />
                        Weekly XP Activity
                      </h5>

                      <div className="h_profile_chart_wrap" style={{
                        background: 'var(--bg-card)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.25rem',
                        marginBottom: '1.25rem',
                        border: '1px solid var(--primary-border)'
                      }}>
                        <div className="h_profile_chart_container d-flex justify-content-between align-items-end" style={{ height: '140px', minHeight: '140px' }}>
                          {activityData.map((d, i) => (
                            <div key={i} className="text-center h_profile_chart_bar_wrap" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                              <div
                                className="h_profile_chart_bar"
                                style={{
                                  height: `${Math.max((d.xp / 100) * 110, d.xp > 0 ? 8 : 4)}px`,
                                  width: '28px',
                                  maxHeight: '110px',
                                  background: d.xp > 0
                                    ? 'linear-gradient(180deg, var(--primary), var(--primary-light))'
                                    : 'var(--bg-muted)',
                                  borderRadius: '6px 6px 4px 4px',
                                  transition: 'all 0.3s ease',
                                  marginTop: 'auto'
                                }}
                              ></div>
                              <div className="h_profile_chart_day" style={{
                                marginTop: '0.75rem',
                                fontWeight: '700',
                                color: d.xp > 0 ? 'var(--primary-dark)' : 'var(--text-muted)',
                                fontSize: '0.75rem'
                              }}>{d.day}</div>
                              <div className="h_profile_chart_xp" style={{
                                fontWeight: '800',
                                color: 'var(--text)',
                                fontSize: '0.7rem'
                              }}>{d.xp}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Row className="g-3">
                        {[
                          { label: 'Total XP', value: user?.xp || 0, icon: <FaStar style={{ color: 'var(--primary)' }} /> },
                          { label: 'Best Streak', value: `${user?.streak || 0} days`, icon: <FaFire style={{ color: 'var(--warning)' }} /> },
                          { label: 'Lessons Done', value: completedLessons.length, icon: <FaCheckCircle style={{ color: 'var(--success)' }} /> },
                        ].map((s, i) => (
                          <Col xs={12} sm={4} key={i}>
                            <div className="h_profile_summary_card" style={{
                              background: 'var(--bg-card)',
                              borderRadius: 'var(--radius-md)',
                              padding: '1rem',
                              textAlign: 'center',
                              border: '1px solid var(--primary-border)',
                              height: '100%'
                            }}>
                              <div className="h_profile_summary_icon" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                              <div className="h_profile_summary_value" style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text)' }}>{s.value}</div>
                              <div className="h_profile_summary_label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>{s.label}</div>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </Tab.Pane>

                    {/* Achievements Tab */}
                    <Tab.Pane eventKey="achievements">
                      <h5 className="h_profile_section_title" style={{ fontWeight: '800', color: 'var(--text)', marginBottom: '1.25rem', fontSize: '1.1rem' }}>
                        <FaMedal className="me-2" style={{ color: 'var(--primary)' }} />
                        Your Achievements
                      </h5>

                      <Row className="g-3">
                        {achievements.map((a, i) => (
                          <Col xs={6} sm={4} md={3} key={i}>
                            <div className="h_profile_achievement_card" style={{
                              background: a.earned ? 'linear-gradient(135deg, var(--primary-soft), var(--bg-card))' : 'var(--bg-card)',
                              borderRadius: 'var(--radius-md)',
                              padding: '1rem',
                              textAlign: 'center',
                              border: a.earned ? '2px solid var(--primary-border)' : '1px solid var(--primary-border)',
                              opacity: a.earned ? 1 : 0.5,
                              height: '100%',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                              <div className="h_profile_achievement_icon" style={{ fontSize: '2.1rem', marginBottom: '0.5rem' }}>{a.icon}</div>
                              <div className="h_profile_achievement_label" style={{ fontSize: '0.82rem', fontWeight: '800', color: 'var(--text)', marginBottom: '0.25rem' }}>
                                {a.label}
                              </div>
                              <div className="h_profile_achievement_desc" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                                {a.desc}
                              </div>
                              {a.earned && (
                                <div style={{ marginTop: '0.5rem', color: 'var(--success)', fontWeight: '800', fontSize: '0.75rem' }}>
                                  <FaCheck className="me-1" /> Earned!
                                </div>
                              )}
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </Tab.Pane>

                    {/* History Tab */}
                    <Tab.Pane eventKey="history">
                      <h5 className="h_profile_section_title" style={{ fontWeight: '800', color: 'var(--text)', marginBottom: '1.25rem', fontSize: '1.1rem' }}>
                        <FaBook className="me-2" style={{ color: 'var(--primary)' }} />
                        Lesson History
                      </h5>

                      {completedLessons.length === 0 ? (
                        <div className="h_profile_empty_state" style={{
                          textAlign: 'center',
                          padding: '2.5rem 1.5rem',
                          background: 'var(--bg-card)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px dashed var(--primary-border)'
                        }}>
                          <FaBook size={32} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
                          <h6 style={{ fontWeight: '700', color: 'var(--text)', marginBottom: '0.5rem' }}>
                            No lessons completed yet
                          </h6>
                          <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                            Start your learning journey today!
                          </p>
                          <Button
                            className="h_btn_get_started"
                            onClick={() => navigate('dashboard')}
                            style={{
                              background: 'var(--primary)',
                              border: 'none',
                              borderRadius: 'var(--radius-md)',
                              fontWeight: '700',
                              padding: '0.75rem 1.5rem',
                              fontSize: '0.9rem'
                            }}
                          >
                            Go to Dashboard
                          </Button>
                        </div>
                      ) : (
                        <div style={{
                          background: 'var(--bg-card)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--primary-border)',
                          overflow: 'hidden'
                        }}>
                          {completedLessons.map((lessonId, i) => (
                            <div key={i} className="h_profile_history_item" style={{
                              padding: '1rem 1.25rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                              borderBottom: i < completedLessons.length - 1 ? '1px solid var(--primary-border)' : 'none',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-soft)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              <div className="h_profile_history_iconbox" style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: 'var(--radius-md)',
                                background: 'var(--primary-soft)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--primary-dark)',
                                fontSize: '1.1rem',
                                flexShrink: '0'
                              }}>
                                <FaBook />
                              </div>
                              <div style={{ flexGrow: 1 }}>
                                <div className="h_profile_history_title" style={{ fontWeight: '700', color: 'var(--text)', fontSize: '0.95rem' }}>
                                  Lesson {lessonId}
                                </div>
                                <div className="h_profile_history_sub" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                                  <FaCalendar className="me-1" size={10} /> Completed
                                </div>
                              </div>
                              <Badge className="h_profile_history_badge" style={{
                                background: 'var(--primary)',
                                padding: '0.4rem 0.85rem',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: '700',
                                fontSize: '0.8rem',
                                flexShrink: '0'
                              }}>
                                +10 XP
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </Tab.Pane>
                  </Tab.Content>
                </Card.Body>
              </Tab.Container>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Profile;

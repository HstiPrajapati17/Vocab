import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Badge, Button, ProgressBar, Tab, Nav } from 'react-bootstrap';
import {
  Flame, Star, Heart, Trophy, Medal,
  Edit, Check, Globe, Calendar,
  BarChart, BookOpen, CheckCircle
} from 'lucide-react';
import { useApp } from '../App';
import { updateUser } from '../api';

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
      const updated = await updateUser(user.id, { name: displayName.trim() });
      refreshUser(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
      setEditing(false);
    }
  };

  return (
    <div className="h_profile_inner">
        <Row className="g-4">
          {/* Profile Card */}
          <Col xs={12} lg={4}>
            <Card className="h_profile_card text-center border-0 shadow-sm mb-4">
              <Card.Body className="p-4 p-md-5">
                <div className="h_profile_avatar_wrap mb-3">
                  <div className="h_profile_avatar">{user?.avatar || '🧑‍💻'}</div>
                </div>

                {editing ? (
                  <div className="mb-3 d-flex gap-2 justify-content-center">
                    <input
                      className="h_edit_name_input text-center"
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      autoFocus
                    />
                    <Button size="sm" variant="success" onClick={handleSaveName} disabled={saving}>
                      {saving ? '...' : 'Save'}
                    </Button>
                  </div>
                ) : (
                  <h4 className="fw-bold mb-1 d-flex align-items-center justify-content-center gap-2">
                    {displayName}
                    <Edit size={14} className="text-muted h_edit_name_icon" onClick={() => setEditing(true)} style={{ cursor: 'pointer' }} />
                  </h4>
                )}

                <div className="text-muted small mb-3">{user?.email || ''}</div>

                <Badge className="h_lang_badge mb-4">
                  <Globe className="me-1" size={16} /> Learning {user?.language || 'Spanish'}
                </Badge>

                <div className="h_level_section mb-4">
                  <div className="d-flex justify-content-between small mb-1">
                    <span className="fw-semibold">Level: {user?.level || 'Beginner'}</span>
                    <span className="text-muted">{user?.xp || 0}/{maxXP} XP</span>
                  </div>
                  <ProgressBar now={levelProgress} className="h_level_bar" />
                </div>

                <Row className="g-2 text-center">
                  <Col xs={4}>
                    <div className="h_pstat">
                      <Flame className="h_icon_fire" size={20} />
                      <div className="h_pstat_val fw-bold">{user?.streak || 0}</div>
                      <div className="h_pstat_lbl small text-muted">Streak</div>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="h_pstat">
                      <Star className="h_icon_xp" size={20} />
                      <div className="h_pstat_val fw-bold">{user?.xp || 0}</div>
                      <div className="h_pstat_lbl small text-muted">Total XP</div>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="h_pstat">
                      <Trophy className="text-warning" size={20} />
                      <div className="h_pstat_val fw-bold">#{user?.xp >= 300 ? 2 : user?.xp >= 100 ? 5 : 10}</div>
                      <div className="h_pstat_lbl small text-muted">Rank</div>
                    </div>
                  </Col>
                </Row>

                <hr className="my-3" />

                <Row className="g-2 text-center">
                  <Col xs={6}>
                    <div className="h_pstat">
                      <BookOpen className="text-primary" size={18} />
                      <div className="h_pstat_val fw-bold">{completedLessons.length}</div>
                      <div className="h_pstat_lbl small text-muted">Lessons Done</div>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="h_pstat">
                      <Calendar className="text-info" size={18} />
                      <div className="h_pstat_val fw-bold">{user?.streak || 0}</div>
                      <div className="h_pstat_lbl small text-muted">Active Days</div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
              <Card.Body className="p-3 text-center">
                <h6 className="fw-bold mb-2">Hearts</h6>
                <div className="h_hearts_row d-flex justify-content-center gap-2 mb-2">
                  {Array(5).fill(0).map((_, i) => (
                    <Heart key={i} size={22} className={i < (user?.hearts ?? 5) ? 'h_icon_heart' : 'h_icon_heart_empty'} />
                  ))}
                </div>
                <p className="text-muted small mb-2">
                  {(user?.hearts ?? 5) === 5 ? 'Fully charged' : `${user?.hearts ?? 0} hearts remaining`}
                </p>
                <Button size="sm" variant="outline-danger" className="w-100" onClick={() => navigate('dashboard')}>
                  Practice to Restore
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Content */}
          <Col xs={12} lg={8}>
            <Tab.Container defaultActiveKey="activity">
              <Nav variant="tabs" className="h_profile_tabs mb-4">
                <Nav.Item>
                  <Nav.Link eventKey="activity" className="h_profile_tab">
                    <BarChart className="me-1" size={16} /> Activity
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="achievements" className="h_profile_tab">
                    <Medal className="me-1" size={16} /> Achievements
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="history" className="h_profile_tab">
                    <BookOpen className="me-1" size={16} /> History
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                {/* Activity */}
                <Tab.Pane eventKey="activity">
                  <Card className="border-0 shadow-sm mb-4">
                    <Card.Body className="p-4">
                      <h6 className="fw-bold mb-4">Weekly XP Activity</h6>
                      <div className="h_activity_chart">
                        {activityData.map((d, i) => (
                          <div key={i} className="h_activity_bar_col text-center">
                            <div className="h_bar_wrap">
                              <div className="h_bar_fill" style={{ height: `${(d.xp / 100) * 100}%` }}></div>
                            </div>
                            <div className="h_bar_label small text-muted mt-1">{d.day}</div>
                            <div className="h_bar_xp small fw-semibold">{d.xp}</div>
                          </div>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>

                  <Row className="g-3">
                    {[
                      { label: 'Total XP', value: user?.xp || 0, icon: <Star className="h_icon_xp" size={20} />, change: 'Earned' },
                      { label: 'Best Streak', value: `${user?.streak || 0} days`, icon: <Flame className="h_icon_fire" size={20} />, change: user?.streak > 0 ? 'Active' : 'Start!' },
                      { label: 'Lessons Done', value: completedLessons.length, icon: <CheckCircle style={{ color: 'var(--success)' }} size={20} />, change: `${completedLessons.length} total` },
                    ].map((s, i) => (
                      <Col xs={12} sm={4} key={i}>
                        <Card className="h_summary_card border-0 shadow-sm text-center">
                          <Card.Body className="p-3">
                            <div className="mb-1">{s.icon}</div>
                            <div className="fw-bold fs-5">{s.value}</div>
                            <div className="text-muted small">{s.label}</div>
                            <Badge bg="light" text="success" className="mt-1 small">{s.change}</Badge>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Tab.Pane>

                {/* Achievements */}
                <Tab.Pane eventKey="achievements">
                  <Row className="g-3">
                    {achievements.map((a, i) => (
                      <Col xs={6} md={3} key={i}>
                        <Card className={`h_achievement_card text-center border-0 shadow-sm ${!a.earned ? 'h_achievement_locked' : ''}`}>
                          <Card.Body className="p-3">
                            <div className="h_achievement_big_icon mb-2">{a.icon}</div>
                            <div className="fw-bold small">{a.label}</div>
                            <div className="text-muted" style={{ fontSize: '0.7rem' }}>{a.desc}</div>
                            {a.earned && <Check className="text-success mt-1" size={14} />}
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Tab.Pane>

                {/* History */}
                <Tab.Pane eventKey="history">
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="p-0">
                      {completedLessons.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                          <BookOpen size={32} className="mb-2" />
                          <p>No lessons completed yet. Start learning!</p>
                          <Button size="sm" className="h_btn_get_started" onClick={() => navigate('dashboard')}>
                            Go to Dashboard
                          </Button>
                        </div>
                      ) : (
                        completedLessons.map((lessonId, i) => (
                          <div key={i} className="h_history_row d-flex align-items-center gap-3 p-3">
                            <div className="h_history_icon">
                              <BookOpen className="text-primary" size={18} />
                            </div>
                            <div className="flex-grow-1">
                              <div className="fw-semibold">Lesson {lessonId}</div>
                              <div className="text-muted small">Completed</div>
                            </div>
                            <Badge className="h_xp_earned">+10 XP</Badge>
                          </div>
                        ))
                      )}
                    </Card.Body>
                  </Card>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Col>
        </Row>
    </div>
  );
};

export default Profile;

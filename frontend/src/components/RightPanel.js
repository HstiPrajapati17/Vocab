import React, { useState } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { Flame, Heart, Star, Trophy, Zap, Shield, BookOpen, Gem } from 'lucide-react';

const langFlags = {
  English: 'E🇸', French: '🇫🇷', German: '🇩🇪', Polish: '�',
};

const langMeta = {
  English: { learners: '1.5B', level: 'Global language' },
  French: { learners: '18M', level: 'Popular choice' },
  German: { learners: '12M', level: 'Structured path' },
  Polish: { learners: '8M', level: 'Slavic language' },
  default: { learners: '5M+', level: 'Start learning today' },
};

const RightPanel = ({ user, previewLanguage, currentPage, navigate, lessonCount = 0, completedCount = 0 }) => {
  const activeLang = previewLanguage || user?.language || 'English';
  const flag = langFlags[activeLang] || '🌍';
  const meta = langMeta[activeLang] || langMeta.default;

  const dailyGoalXP = { Casual: 10, Regular: 20, Serious: 30, Intense: 50 };
  const goalMax = dailyGoalXP[user?.dailyGoal] || 20;
  const todayXP = Math.min(user?.xp % 100 || 0, goalMax);
  const lessonsNeeded = Math.max(0, 3 - (user?.completedLessons?.length || 0));
  const progress = lessonCount > 0 ? Math.round((completedCount / lessonCount) * 100) : 0;

  const showCoursePreview = currentPage === 'courses' && previewLanguage;

  // Hover states
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (item, event) => {
    setHoveredItem(item);
    setHoverPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return (
    <aside className="h_right_panel">
      {/* Stats bar */}
      <div className="h_rp_stats">
        <button 
          type="button" 
          className="h_rp_stat h_rp_lang_btn" 
          onClick={() => navigate('/courses')} 
          title="Change language"
          onMouseEnter={(e) => handleMouseEnter('language', e)}
          onMouseLeave={handleMouseLeave}
        >
          <span className="h_rp_flag">{flag}</span>
        </button>
        <div 
          className="h_rp_stat"
          onMouseEnter={(e) => handleMouseEnter('streak', e)}
          onMouseLeave={handleMouseLeave}
        >
          <Flame className="h_icon_fire" size={20} />
          <span>{user?.streak || 0}</span>
        </div>
        <div 
          className="h_rp_stat"
          onMouseEnter={(e) => handleMouseEnter('xp', e)}
          onMouseLeave={handleMouseLeave}
        >
          <Star className="h_icon_xp" size={20} />
          <span>{user?.xp || 0}</span>
        </div>
        <div 
          className="h_rp_stat"
          onMouseEnter={(e) => handleMouseEnter('hearts', e)}
          onMouseLeave={handleMouseLeave}
        >
          <Heart className="h_icon_heart" size={20} />
          <span>{user?.hearts ?? 5}</span>
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredItem && (
        <div 
          className="h_rp_tooltip"
          style={{
            position: 'fixed',
            left: `${hoverPosition.x + 10}px`,
            top: `${hoverPosition.y + 10}px`,
            zIndex: 1000
          }}
        >
          {hoveredItem === 'language' && (
            <div className="h_rp_tooltip_content">
              <h6 className="fw-bold mb-1">{activeLang}</h6>
              <p className="small text-muted mb-0">{meta.learners} learners · {meta.level}</p>
            </div>
          )}
          {hoveredItem === 'streak' && (
            <div className="h_rp_tooltip_content">
              <h6 className="fw-bold mb-1">Day Streak</h6>
              <p className="small text-muted mb-0">You have a {user?.streak || 0} day streak!</p>
            </div>
          )}
          {hoveredItem === 'xp' && (
            <div className="h_rp_tooltip_content">
              <h6 className="fw-bold mb-1">XP</h6>
              <p className="small text-muted mb-0">You have {user?.xp || 0} total XP</p>
            </div>
          )}
          {hoveredItem === 'hearts' && (
            <div className="h_rp_tooltip_content">
              <h6 className="fw-bold mb-1">Hearts</h6>
              <p className="small text-muted mb-0">You have {user?.hearts ?? 5} hearts</p>
              <button className="h_rp_tooltip_link mt-2">GO TO SHOP</button>
            </div>
          )}
          {hoveredItem === 'leaderboard-locked' && (
            <div className="h_rp_tooltip_content">
              <h6 className="fw-bold mb-1">Leaderboard Locked</h6>
              <p className="small text-muted mb-0">Complete {lessonsNeeded} more lesson{lessonsNeeded > 1 ? 's' : ''} to unlock</p>
            </div>
          )}
          {hoveredItem === 'leaderboard-unlocked' && (
            <div className="h_rp_tooltip_content">
              <h6 className="fw-bold mb-1">Leaderboard</h6>
              <p className="small text-muted mb-0">Tap to see your rank this week</p>
            </div>
          )}
        </div>
      )}

      {/* Language preview when selecting courses */}
      {showCoursePreview && (
        <div className="h_rp_card h_rp_lang_preview">
          <div className="h_rp_lang_preview_flag">{flag}</div>
          <h6 className="fw-bold mb-1">{activeLang}</h6>
          <p className="text-muted small mb-2">{meta.learners} learners · {meta.level}</p>
          <p className="small mb-0">Switch to this course to update your learning path.</p>
        </div>
      )}

      {/* Leaderboard unlock */}
      {lessonsNeeded > 0 ? (
        <div 
          className="h_rp_card"
        >
          <div className="d-flex align-items-start gap-3">
            <div className="h_rp_card_icon"><Shield size={28} style={{ color: 'var(--primary)' }} /></div>
            <div>
              <h6 className="fw-bold mb-1">Unlock Leaderboards!</h6>
              <p className="text-muted small mb-0">
                Complete {lessonsNeeded} more lesson{lessonsNeeded > 1 ? 's' : ''} to start competing
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div 
          className="h_rp_card h_rp_card_clickable" 
          onClick={() => navigate('/leaderboard')}
          onMouseEnter={(e) => handleMouseEnter('leaderboard-unlocked', e)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="d-flex align-items-start gap-3">
            <div className="h_rp_card_icon"><Trophy size={28} style={{ color: 'var(--warning)' }} /></div>
            <div>
              <h6 className="fw-bold mb-1">Leaderboards Unlocked!</h6>
              <p className="text-muted small mb-0">Tap to see your rank this week</p>
            </div>
          </div>
        </div>
      )}

      {/* Daily Quests */}
      <div 
        className="h_rp_card"
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-bold mb-0">Daily Quests</h6>
          <button type="button" className="h_rp_link_btn" onClick={() => navigate('/quests')}>VIEW ALL</button>
        </div>
        <div className="h_rp_quest">
          <div className="d-flex align-items-center gap-2 mb-2">
            <Zap size={18} style={{ color: 'var(--warning)' }} />
            <span className="small fw-semibold">Earn {goalMax} XP</span>
            <span className="ms-auto small text-muted">{todayXP}/{goalMax}</span>
          </div>
          <ProgressBar now={goalMax > 0 ? (todayXP / goalMax) * 100 : 0} className="h_goal_bar" />
        </div>
      </div>

      {/* Current course progress */}
      <div 
        className="h_rp_card"
        onMouseEnter={(e) => handleMouseEnter('course', e)}
        onMouseLeave={handleMouseLeave}
      >
        <div className="d-flex align-items-center gap-2 mb-2">
          <BookOpen size={18} style={{ color: 'var(--primary)' }} />
          <h6 className="fw-bold mb-0">{activeLang}</h6>
        </div>
        <p className="text-muted small mb-2">{user?.level || 'Beginner'} · {completedCount}/{lessonCount || '—'} lessons</p>
        <ProgressBar now={progress} className="h_course_bar" />
        <p className="small text-muted mt-2 mb-0">{progress}% complete</p>
      </div>

      {/* Footer links */}
      <div className="h_rp_footer">
        <button className="h_rp_footer_link" style={{ opacity: 0.8 }} onClick={() => navigate('/about')}>ABOUT</button>
        <button className="h_rp_footer_link" style={{ opacity: 0.8 }} onClick={() => navigate('/blog')}>BLOG</button>
        {/* <span className="h_rp_footer_link" style={{ opacity: 0.8 }}>STORE</span> */}
        <button className="h_rp_footer_link" style={{ opacity: 0.8 }} onClick={() => navigate('/terms')}>TERMS</button>
        <button className="h_rp_footer_link" style={{ opacity: 0.8 }} onClick={() => navigate('/privacy')}>PRIVACY</button>
        <button className="h_rp_footer_link" style={{ opacity: 0.8 }} onClick={() => navigate('/help')}>HELP</button>
      </div>
    </aside>
  );
};

export default RightPanel;

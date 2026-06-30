import React from 'react';
import { ProgressBar } from 'react-bootstrap';
import { Flame, Heart, Star, Trophy, Zap, Shield, BookOpen } from 'lucide-react';

const langFlags = {
  Spanish: '🇪🇸', French: '🇫🇷', German: '🇩🇪', Japanese: '🇯🇵',
  Hindi: '🇮🇳', Portuguese: '🇵🇹', Italian: '🇮🇹', Korean: '🇰🇷',
  Russian: '🇷🇺', Chinese: '🇨🇳', Arabic: '🇸🇦', Dutch: '🇳🇱',
  English: '🇺🇸',
};

const langMeta = {
  Spanish: { learners: '42M', level: 'Beginner friendly' },
  French: { learners: '18M', level: 'Popular choice' },
  German: { learners: '12M', level: 'Structured path' },
  Japanese: { learners: '15M', level: 'Character focus' },
  Hindi: { learners: '9M', level: 'Growing fast' },
  Portuguese: { learners: '11M', level: 'Brazil & Portugal' },
  Italian: { learners: '8M', level: 'Romance language' },
  Korean: { learners: '10M', level: 'K-pop culture' },
  default: { learners: '5M+', level: 'Start learning today' },
};

const RightPanel = ({ user, previewLanguage, currentPage, navigate, lessonCount = 0, completedCount = 0 }) => {
  const activeLang = previewLanguage || user?.language || 'Spanish';
  const flag = langFlags[activeLang] || '🌍';
  const meta = langMeta[activeLang] || langMeta.default;

  const dailyGoalXP = { Casual: 10, Regular: 20, Serious: 30, Intense: 50 };
  const goalMax = dailyGoalXP[user?.dailyGoal] || 20;
  const todayXP = Math.min(user?.xp % 100 || 0, goalMax);
  const lessonsNeeded = Math.max(0, 3 - (user?.completedLessons?.length || 0));
  const progress = lessonCount > 0 ? Math.round((completedCount / lessonCount) * 100) : 0;

  const showCoursePreview = currentPage === 'courses' && previewLanguage;

  return (
    <aside className="h_right_panel">
      {/* Stats bar */}
      <div className="h_rp_stats">
        <button type="button" className="h_rp_stat h_rp_lang_btn" onClick={() => navigate('/courses')} title="Change language">
          <span className="h_rp_flag">{flag}</span>
        </button>
        <div className="h_rp_stat">
          <Flame className="h_icon_fire" size={20} />
          <span>{user?.streak || 0}</span>
        </div>
        <div className="h_rp_stat">
          <Star className="h_icon_xp" size={20} />
          <span>{user?.xp || 0}</span>
        </div>
        <div className="h_rp_stat">
          <Heart className="h_icon_heart" size={20} />
          <span>{user?.hearts ?? 5}</span>
        </div>
      </div>

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
        <div className="h_rp_card">
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
        <div className="h_rp_card h_rp_card_clickable" onClick={() => navigate('/leaderboard')}>
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
      <div className="h_rp_card">
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
      <div className="h_rp_card">
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
        <button className="h_rp_footer_link" style={{ cursor: 'not-allowed', opacity: 0.5 }} onClick={() => navigate('/about')}>ABOUT</button>
        <button className="h_rp_footer_link" style={{ cursor: 'not-allowed', opacity: 0.5 }} onClick={() => navigate('/blog')}>BLOG</button>
        {/* <span className="h_rp_footer_link" style={{ cursor: 'not-allowed', opacity: 0.5 }}>STORE</span> */}
        <button className="h_rp_footer_link" style={{ cursor: 'not-allowed', opacity: 0.5 }} onClick={() => navigate('/terms')}>TERMS</button>
        <button className="h_rp_footer_link" style={{ cursor: 'not-allowed', opacity: 0.5 }} onClick={() => navigate('/privacy')}>PRIVACY</button>
        <button className="h_rp_footer_link" style={{ cursor: 'not-allowed', opacity: 0.5 }} onClick={() => navigate('/help')}>HELP</button>
      </div>
    </aside>
  );
};

export default RightPanel;

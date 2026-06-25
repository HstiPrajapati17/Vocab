import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressBar } from 'react-bootstrap';
import { Lock, Gift } from 'lucide-react';
import { useApp } from '../App';

const quests = [
  { id: 1, title: 'Earn 10 XP', icon: '⚡', target: 10, current: 0, reward: 'Chest', locked: false },
  { id: 2, title: 'Complete 1 lesson', icon: '📚', target: 1, current: 0, reward: 'Gems', locked: false },
  { id: 3, title: 'Maintain streak', icon: '🔥', target: 1, current: 0, reward: 'XP Boost', locked: true },
];

const Quests = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const todayXP = user?.xp % 100 || 0;

  return (
    <div className="h_quests_page">
      <div className="h_quests_banner">
        <div>
          <h1 className="h_quests_title">Welcome!</h1>
          <p className="mb-0">Complete quests to earn rewards! Quests refresh every day.</p>
        </div>
        <span className="h_quests_mascot">🎁</span>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
        <h5 className="fw-bold mb-0">Daily Quests</h5>
        <span className="h_quests_timer">⏱ 7 HOURS</span>
      </div>

      {quests.map((q, i) => {
        const progress = i === 0 ? Math.min(todayXP, q.target) : 0;
        return (
          <div key={q.id} className={`h_quest_card ${q.locked ? 'h_quest_locked' : ''}`}>
            <div className="h_quest_icon">{q.icon}</div>
            <div className="flex-grow-1">
              <div className="fw-semibold">{q.title}</div>
              {!q.locked ? (
                <>
                  <ProgressBar now={(progress / q.target) * 100} className="h_goal_bar mt-2" />
                  <small className="text-muted">{progress} / {q.target}</small>
                </>
              ) : (
                <small className="text-muted d-flex align-items-center gap-1 mt-1">
                  <Lock size={12} /> More quests unlock soon
                </small>
              )}
            </div>
            <Gift size={20} style={{ color: 'var(--primary)', opacity: q.locked ? 0.3 : 1 }} />
          </div>
        );
      })}

      <button type="button" className="h_btn_get_started mt-4 px-4 py-2" onClick={() => navigate('dashboard')}>
        Start a Lesson
      </button>
    </div>
  );
};

export default Quests;

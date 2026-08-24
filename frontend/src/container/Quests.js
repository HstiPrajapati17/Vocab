import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressBar, Spinner } from 'react-bootstrap';
import { Lock, Gift } from 'lucide-react';
import { useApp } from '../App';
import { getQuests } from '../api';
import gold from '../assets/gold.png';

const Quests = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const todayXP = user?.xp % 100 || 0;
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getQuests()
      .then((data) => {
        setQuests(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h_quests_page">
        <div className="text-center py-5">
          <Spinner animation="border" variant="success" />
        </div>
      </div>
    );
  }

  return (
    <div className="h_quests_page">
      <div className="h_quests_banner">
        <div>
          <h1 className="h_quests_title">Welcome!</h1>
          <p className="mb-0">Complete quests to earn rewards! Quests refresh every day.</p>
        </div>
        <span className="h_quests_mascot">
          <img className='gold_img' src={gold} alt="Gold" />
        </span>
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

      <button type="button" className="hlp2_feedback_btn" onClick={() => navigate('dashboard')}>
        Start a Lesson
      </button>
    </div>
  );
};

export default Quests;

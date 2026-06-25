import React, { useState, useEffect } from 'react';
import { Card, Badge, Nav, Spinner } from 'react-bootstrap';
import { Trophy, Medal, Flame, Star, ArrowUp, ArrowDown, Minus, Crown } from 'lucide-react';
import { useApp } from '../App';
import { getLeaderboard } from '../api';

const leagues = ['Bronze', 'Silver', 'Gold', 'Diamond'];

const Leaderboard = () => {
  const { user } = useApp();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLeague, setActiveLeague] = useState('Silver');
  const [activeTab, setActiveTab] = useState('weekly');

  const lessonsNeeded = Math.max(0, 3 - (user?.completedLessons?.length || 0));
  const unlocked = lessonsNeeded === 0;

  useEffect(() => {
    getLeaderboard()
      .then(entries => {
        setData(entries);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const enriched = data.map(entry => ({
    ...entry,
    isYou: entry.userId === user?.id,
  }));

  const getChangeIcon = (change) => {
    if (change === 'up') return <ArrowUp className="text-success" size={12} />;
    if (change === 'down') return <ArrowDown className="text-danger" size={12} />;
    return <Minus className="text-muted" size={12} />;
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return <Crown className="h_rank_gold" size={20} />;
    if (rank === 2) return <Medal className="h_rank_silver" size={20} />;
    if (rank === 3) return <Medal className="h_rank_bronze" size={20} />;
    return <span className="h_rank_num">{rank}</span>;
  };

  const top3 = enriched.slice(0, 3);

  if (!unlocked) {
    return (
      <div className="h_lb_unlock_page">
        <div className="h_lb_unlock_shields">
          <span>🥉</span><span>🥇</span><span>🥈</span>
        </div>
        <h2 className="fw-bold mb-2">Unlock Leaderboards!</h2>
        <p className="text-muted mb-4">
          Complete {lessonsNeeded} more lesson{lessonsNeeded > 1 ? 's' : ''} to start competing
        </p>
        <div className="h_lb_info_card">
          <h6 className="fw-bold text-uppercase small text-muted">What are Leaderboards?</h6>
          <p className="fw-bold mb-1">Do lessons. Earn XP. Compete.</p>
          <p className="text-muted small mb-0">
            Earn XP through lessons, then compete with players in a weekly leaderboard.
          </p>
          <span className="h_lb_mascot">🦉</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h_lb_page_inner">
      <div className="text-center mb-4">
        <Trophy size={40} style={{ color: 'var(--warning)' }} className="mb-2" />
        <h2 className="fw-bold h_lb_page_title">Leaderboard</h2>
        <p className="text-muted small">Compete with learners worldwide</p>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-4">
        {leagues.map((league) => (
          <button
            key={league}
            type="button"
            className={`h_lb_league_pill ${activeLeague === league ? 'h_lb_league_pill_active' : ''}`}
            onClick={() => setActiveLeague(league)}
          >
            {league === 'Bronze' ? '🥉' : league === 'Silver' ? '🥈' : league === 'Gold' ? '🥇' : '💎'} {league}
          </button>
        ))}
      </div>

      <Nav variant="tabs" className="h_lb_tabs mb-4">
        {['weekly', 'monthly', 'alltime'].map((tab) => (
          <Nav.Item key={tab}>
            <Nav.Link
              className={`h_lb_tab ${activeTab === tab ? 'h_lb_tab_active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'weekly' ? 'This Week' : tab === 'monthly' ? 'Monthly' : 'All Time'}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="success" />
        </div>
      ) : (
        <>
          {top3.length >= 3 && (
            <div className="h_podium_row mb-4">
              {[top3[1], top3[0], top3[2]].map((entry, i) => {
                const heights = ['h_pod_2nd', 'h_pod_1st', 'h_pod_3rd'];
                return (
                  <div key={i} className={`h_podium_item text-center ${heights[i]} ${entry.isYou ? 'h_podium_you' : ''}`}>
                    <div className="h_pod_avatar">{entry.avatar}</div>
                    <div className="h_pod_name">{entry.name.split(' ')[0]}</div>
                    <div className="h_pod_xp">{entry.xp} XP</div>
                    <div className="h_pod_rank_badge">{getRankBadge(entry.rank)}</div>
                  </div>
                );
              })}
            </div>
          )}

          <Card className="h_lb_list_card border-0">
            <Card.Body className="p-0">
              {enriched.map((entry) => (
                <div
                  key={entry.id}
                  className={`h_lb_entry d-flex align-items-center gap-3 p-3
                    ${entry.isYou ? 'h_lb_you_row' : ''}
                    ${entry.rank <= 3 ? 'h_lb_top3' : ''}`}
                >
                  <div style={{ minWidth: 32 }}>{getRankBadge(entry.rank)}</div>
                  <div className="h_lb_avatar">{entry.avatar}</div>
                  <div className="flex-grow-1">
                    <div className="h_lb_name">
                      {entry.name}
                      {entry.isYou && <Badge bg="secondary" className="ms-2 small">You</Badge>}
                    </div>
                    <div className="d-flex align-items-center gap-2 mt-1">
                      <span className="text-muted small">{entry.language}</span>
                      <span className="text-muted small">
                        <Flame className="h_icon_fire_sm" size={14} /> {entry.streak} day streak
                      </span>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="h_lb_xp_count">{entry.xp} <Star className="h_icon_xp_sm" size={14} /></div>
                    <div>{getChangeIcon(entry.change)}</div>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};

export default Leaderboard;

 import React, { useState, useMemo } from "react";
import { useApp } from "../App";
import { Flame, RefreshCw, Maximize2 } from "lucide-react";

/* ── helpers ── */
const DAYS = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // shift so Monday=0
  const startOffset = (firstDay + 6) % 7;
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

/* streak week — last 7 days Mon-Sun */
function getStreakWeek(practicedDates = []) {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

  return DAYS.map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    const isToday =
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate();
    const isPast = d < today && !isToday;
    const isPracticed = practicedDates.includes(key);
    return { day: DAYS[i], isToday, isPast, isPracticed, date: d };
  });
}

/* ── Streak node icon ── */
const StreakNode = ({ isPracticed, isToday, isPast }) => {
  if (isPracticed)
    return <span className="ins_streak_fire">🔥</span>;
  if (isToday)
    return <span className="ins_streak_fire ins_streak_fire_today">🔥</span>;
  return (
    <span
      className={`ins_streak_dot ${isPast ? "ins_streak_dot_missed" : "ins_streak_dot_future"}`}
    />
  );
};

/* ── Circular progress ring ── */
const CircleProgress = ({ value, color, size = 80, stroke = 8 }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} className="ins_ring_svg">
      <circle cx={size / 2} cy={size / 2} r={r} className="ins_ring_track" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        className="ins_ring_fill"
        strokeWidth={stroke}
        stroke={color}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
};

/* ── Skill card ── */
const SkillCard = ({ label, value, delta, color }) => {
  const isUp = delta >= 0;
  return (
    <div className="ins_skill_card">
      <div className="ins_skill_ring_wrap">
        <CircleProgress value={value} color={color} size={84} stroke={9} />
        <span className="ins_skill_value">{value}</span>
      </div>
      <p className="ins_skill_label">{label}</p>
      <p className={`ins_skill_delta ${isUp ? "ins_delta_up" : "ins_delta_down"}`}>
        {isUp ? "↑" : "↓"} {Math.abs(delta)}%
      </p>
    </div>
  );
};

/* ── Achievement badge ── */
const AchievementCard = ({ icon, title, desc, locked = false }) => (
  <div className={`ins_achievement_card ${locked ? "ins_achievement_locked" : ""}`}>
    <div className="ins_achievement_icon">{icon}</div>
    <div className="ins_achievement_body">
      <p className="ins_achievement_title">{title}</p>
      <p className="ins_achievement_desc">{desc}</p>
    </div>
  </div>
);

/* ── Completed lesson row ── */
const LessonRow = ({ emoji, title, difficulty, terms, score, time }) => {
  const scoreColor =
    score >= 80 ? "var(--success)" : score >= 50 ? "var(--warning)" : "var(--danger)";
  return (
    <div className="ins_lesson_row">
      <div className="ins_lesson_emoji">{emoji}</div>
      <div className="ins_lesson_info">
        <p className="ins_lesson_title">{title}</p>
        <p className="ins_lesson_meta">
          {difficulty} · {terms} terms
        </p>
      </div>
      <div className="ins_lesson_score_wrap">
        <span className="ins_lesson_score" style={{ color: scoreColor }}>
          {score} <span className="ins_lesson_score_max">/100</span>
        </span>
        <span className="ins_lesson_arrow">›</span>
      </div>
      <p className="ins_lesson_time">{time}</p>
    </div>
  );
};

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
const Insights = () => {
  const { user } = useApp();

  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [showCalendar, setShowCalendar] = useState(false);

  /* mock practiced dates — in a real app come from user data */
  const practicedDates = useMemo(() => {
    const base = [];
    const d = new Date();
    // mark the last `streak` days as practiced
    const streak = user?.streak || 5;
    for (let i = 0; i < streak; i++) {
      const dd = new Date(d);
      dd.setDate(d.getDate() - i);
      base.push(dd.toISOString().slice(0, 10));
    }
    return base;
  }, [user?.streak]);

  const streakWeek = useMemo(() => getStreakWeek(practicedDates), [practicedDates]);
  const calDays = useMemo(() => getCalendarDays(calYear, calMonth), [calYear, calMonth]);

  const streak = user?.streak || 5;
  const daysToGoal = Math.max(0, 7 - streak);

  /* skill values derived from XP / completed lessons */
  const xp = user?.xp || 0;
  const completedCount = user?.completedLessons?.length || 0;
  const speakingScore = Math.min(99, 40 + Math.floor(xp / 10) % 60);
  const listeningScore = Math.min(99, 35 + Math.floor(xp / 13) % 65);
  const vocabScore = Math.min(99, 30 + Math.floor(completedCount * 7) % 70);

  const skills = [
    { label: "Speaking", value: speakingScore, delta: 12, color: "#58cc02" },
    { label: "Listening", value: listeningScore, delta: -3.4, color: "#58cc02" },
    { label: "Vocabulary", value: vocabScore, delta: 17, color: "#58cc02" },
  ];

  const achievements = [
    {
      icon: "🌟",
      title: "Word Collector",
      desc: "You've learned 50 new words.",
      locked: completedCount < 2,
    },
    {
      icon: "🎧",
      title: "Listening Champ",
      desc: "You completed 10 listening practices.",
      locked: completedCount < 5,
    },
    {
      icon: "📚",
      title: "Quiz Master",
      desc: "You aced 5 quizzes in a row.",
      locked: completedCount < 8,
    },
    {
      icon: "🗣️",
      title: "Fluent Five",
      desc: "You passed 5 speaking tests.",
      locked: completedCount < 10,
    },
  ];

  /* mock completed lessons list */
  const lessonEmojis = ["🌍", "🎒", "🏠", "🍎", "🚗", "📖", "✈️", "🎵"];
  const completedLessons = Array.from(
    { length: Math.min(4, completedCount || 4) },
    (_, i) => ({
      emoji: lessonEmojis[i % lessonEmojis.length],
      title: "Topic name",
      difficulty: "Easy",
      terms: 12,
      score: [66, 48, 95, 84][i] || 70,
      time: "1 day ago",
    })
  );

  /* calendar nav */
  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  /* is a calendar day practiced? */
  const isDayPracticed = (day) => {
    if (!day) return false;
    const key = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return practicedDates.includes(key);
  };
  const isToday = (day) =>
    day === today.getDate() &&
    calMonth === today.getMonth() &&
    calYear === today.getFullYear();

  return (
    <div className="ins_page">
      {/* ── HEADER ── */}
      <div className="ins_header">
        <h1 className="ins_page_title">Insights</h1>
        <div className="ins_header_actions">
          <button className="ins_upgrade_btn">
            🌍 Upgrade
          </button>
          <div className="ins_streak_pill">
            <span className="ins_streak_pill_count">{streak}</span>
            <Flame size={16} className="ins_icon_fire" />
          </div>
        </div>
      </div>

      {/* ── STREAK BANNER ── */}
      <div className="ins_streak_banner">
        <div className="ins_streak_banner_text">
          <div className="ins_streak_banner_head">
            {streak >= 7
              ? "You're on fire! 🔥"
              : streak > 0
              ? `Practiced ${streak} day${streak > 1 ? "s" : ""} in a row!`
              : "Start your streak today!"}
          </div>
          <div className="ins_streak_banner_sub">
            {daysToGoal > 0
              ? `Just ${daysToGoal} more day${daysToGoal > 1 ? "s" : ""} to hit your weekly goal.`
              : "You hit your weekly goal! Amazing!"}
          </div>
        </div>
        <button
          className="ins_streak_expand_btn"
          onClick={() => setShowCalendar((v) => !v)}
          aria-label="Toggle calendar"
        >
          {showCalendar ? <RefreshCw size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>

      {/* ── WEEKLY STREAK DOTS ── */}
      {!showCalendar && (
        <div className="ins_streak_week">
          {streakWeek.map((item) => (
            <div key={item.day} className="ins_streak_day_col">
              <StreakNode
                isPracticed={item.isPracticed}
                isToday={item.isToday}
                isPast={item.isPast}
              />
              <span className={`ins_streak_day_label ${item.isToday ? "ins_streak_day_today" : ""}`}>
                {item.day}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── MONTHLY CALENDAR ── */}
      {showCalendar && (
        <div className="ins_calendar">
          <div className="ins_calendar_header">
            <button className="ins_cal_nav" onClick={prevMonth}>‹</button>
            <span className="ins_calendar_title">
              {MONTHS[calMonth]}, {calYear}
            </span>
            <button className="ins_cal_nav" onClick={nextMonth}>›</button>
            <button
              className="ins_cal_close"
              onClick={() => setShowCalendar(false)}
              aria-label="Close calendar"
            >
              <Maximize2 size={16} />
            </button>
          </div>
          <div className="ins_calendar_sub">
            {daysToGoal > 0
              ? `Just ${daysToGoal} more day${daysToGoal > 1 ? "s" : ""} to hit your weekly goal.`
              : "You hit your weekly goal! Amazing!"}
          </div>

          {/* day-of-week headers */}
          <div className="ins_cal_grid_header">
            {DAYS.map((d) => (
              <span key={d} className="ins_cal_day_name">{d}</span>
            ))}
          </div>

          {/* date cells */}
          <div className="ins_cal_grid">
            {calDays.map((day, idx) => (
              <div
                key={idx}
                className={`ins_cal_cell ${!day ? "ins_cal_empty" : ""} ${
                  isToday(day) ? "ins_cal_today" : ""
                }`}
              >
                {day && (
                  <>
                    {isDayPracticed(day) && <span className="ins_cal_fire">🔥</span>}
                    <span className="ins_cal_date">{day}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── EMPTY STATE when no lessons yet ── */}
      {completedCount === 0 && (
        <div className="ins_empty_state">
          <div className="ins_empty_section">
            <div className="ins_empty_icon">📊</div>
            <h3 className="ins_empty_title">Skill Trends</h3>
            <p className="ins_empty_desc">
              Your speaking, listening, and grammar progress will appear here after you complete a few lessons.
            </p>
          </div>
          <div className="ins_empty_section">
            <div className="ins_empty_icon">🏆</div>
            <h3 className="ins_empty_title">Achievements</h3>
            <p className="ins_empty_desc">
              Complete lessons, practice daily, and hit milestones to earn badges.
            </p>
          </div>
          <div className="ins_empty_section">
            <div className="ins_empty_icon">✅</div>
            <h3 className="ins_empty_title">Completed Lessons</h3>
            <p className="ins_empty_desc">
              Pick a topic to start your first lesson and track your progress.
            </p>
          </div>
        </div>
      )}

      {/* ── SKILL TRENDS ── */}
      {completedCount > 0 && (
        <>
          <h2 className="ins_section_title">Skill Trends</h2>
          <div className="ins_skills_row">
            {skills.map((s) => (
              <SkillCard key={s.label} {...s} />
            ))}
          </div>

          {/* ── ACHIEVEMENTS ── */}
          <h2 className="ins_section_title">Achievements</h2>
          <div className="ins_achievements_grid">
            {achievements.map((a) => (
              <AchievementCard key={a.title} {...a} />
            ))}
          </div>

          {/* ── COMPLETED LESSONS ── */}
          <h2 className="ins_section_title">Completed Lessons</h2>
          <div className="ins_lessons_list">
            {completedLessons.map((l, i) => (
              <LessonRow key={i} {...l} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Insights;

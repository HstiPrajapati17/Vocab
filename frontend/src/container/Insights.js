import React, { useState, useMemo } from "react";
import { useApp } from "../App";
import {
  Flame,
  Calendar,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Trophy,
  Lock,
  TrendingUp,
  TrendingDown,
  Award,
  Sparkles,
  ArrowRight,
} from "lucide-react";

/* ── helpers ── */
const DAYS = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay + 6) % 7;
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

function getStreakWeek(practicedDates = []) {
  const today = new Date();
  const dayOfWeek = today.getDay();
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

/* ── Streak bar node ── */
const StreakNode = ({ isPracticed, isToday, isPast, day }) => {
  const stateClass = isPracticed
    ? "ins_snode_done"
    : isToday
    ? "ins_snode_today"
    : isPast
    ? "ins_snode_missed"
    : "ins_snode_future";

  return (
    <div className={`ins_snode ${stateClass}`}>
      <div className="ins_snode_bar">
        {isPracticed && <Flame size={20} className="ins_snode_fire" />}
        {isToday && !isPracticed && <Sparkles size={20} className="ins_snode_spark" />}
      </div>
      <span className={`ins_snode_day ${isToday ? "ins_snode_day_today" : ""}`}>{day}</span>
    </div>
  );
};

/* ── Skill card ── */
const SkillCard = ({ label, value, delta, color }) => {
  const isUp = delta >= 0;
  return (
    <div className="ins_skill_card" style={{ "--skill-color": color }}>
      <div className="ins_skill_top">
        <div className="ins_skill_ring_wrap">
          <CircleProgress value={value} color={color} size={90} stroke={10} />
          <span className="ins_skill_value">{value}</span>
        </div>
        <div className="ins_skill_delta_wrap">
          {isUp ? (
            <TrendingUp size={14} className="ins_delta_icon_up" />
          ) : (
            <TrendingDown size={14} className="ins_delta_icon_down" />
          )}
          <span className={`ins_skill_delta ${isUp ? "ins_delta_up" : "ins_delta_down"}`}>
            {isUp ? "+" : ""}{delta}%
          </span>
        </div>
      </div>
      <div className="ins_skill_body">
        <p className="ins_skill_label">{label}</p>
        <div className="ins_skill_progress">
          <div
            className="ins_skill_progress_fill"
            style={{ width: `${value}%`, background: color }}
          />
        </div>
      </div>
    </div>
  );
};

/* ── Achievement badge ── */
const AchievementCard = ({ icon, title, desc, locked = false, progress }) => (
  <div className={`ins_achievement_card ${locked ? "ins_achievement_locked" : ""}`}>
    <div className={`ins_achievement_icon ${locked ? "" : "ins_ach_unlocked"}`}>
      {locked ? <Lock size={22} /> : <span className="ins_achievement_emoji">{icon}</span>}
    </div>
    <div className="ins_achievement_body">
      <div className="ins_achievement_top">
        <p className="ins_achievement_title">{title}</p>
        {!locked && <Award size={16} className="ins_ach_award_icon" />}
      </div>
      <p className="ins_achievement_desc">{desc}</p>
      {locked && progress !== undefined && (
        <div className="ins_ach_progress_wrap">
          <div className="ins_ach_progress">
            <div className="ins_ach_progress_fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="ins_ach_progress_text">{progress}%</span>
        </div>
      )}
    </div>
  </div>
);

/* ── Completed lesson row ── */
const LessonRow = ({ emoji, title, difficulty, terms, score, time }) => {
  const scoreColor =
    score >= 80 ? "var(--success)" : score >= 50 ? "var(--warning)" : "var(--danger)";
  const scoreLabel = score >= 80 ? "Excellent" : score >= 50 ? "Good" : "Needs Work";
  return (
    <div className="ins_lesson_row">
      <div className="ins_lesson_emoji_wrap">
        <span className="ins_lesson_emoji">{emoji}</span>
      </div>
      <div className="ins_lesson_info">
        <div className="ins_lesson_top">
          <p className="ins_lesson_title">{title}</p>
          <span
            className="ins_lesson_score_badge"
            style={{ background: `${scoreColor}15`, color: scoreColor }}
          >
            {scoreLabel}
          </span>
        </div>
        <p className="ins_lesson_meta">
          <span className="ins_lesson_diff">{difficulty}</span>
          <span className="ins_lesson_meta_divider">·</span>
          <span className="ins_lesson_terms">{terms} terms</span>
          <span className="ins_lesson_meta_divider">·</span>
          <span className="ins_lesson_time">{time}</span>
        </p>
        <div className="ins_lesson_progress_row">
          <div className="ins_lesson_progress">
            <div
              className="ins_lesson_progress_fill"
              style={{ width: `${score}%`, background: scoreColor }}
            />
          </div>
          <span className="ins_lesson_score_num" style={{ color: scoreColor }}>
            {score}/100
          </span>
        </div>
      </div>
      <ArrowRight size={18} className="ins_lesson_arrow" />
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

  const practicedDates = useMemo(() => {
    const base = [];
    const d = new Date();
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

  const xp = user?.xp || 0;
  const completedCount = user?.completedLessons?.length || 0;
  const level = Math.floor(xp / 500) + 1;
  const xpInLevel = xp % 500;
  const xpToNext = 500 - xpInLevel;
  const levelProgress = Math.floor((xpInLevel / 500) * 100);

  const speakingScore = Math.min(99, 40 + Math.floor(xp / 10) % 60);
  const listeningScore = Math.min(99, 35 + Math.floor(xp / 13) % 65);
  const vocabScore = Math.min(99, 30 + Math.floor(completedCount * 7) % 70);

  const skills = [
    { label: "Speaking", value: speakingScore, delta: 12, color: "#2f855a" },
    { label: "Listening", value: listeningScore, delta: -3.4, color: "#f2a541" },
    { label: "Vocabulary", value: vocabScore, delta: 17, color: "#5b6abf" },
  ];

  const unlockedCount = Math.min(4, Math.floor(completedCount / 2));
  const achievements = [
    {
      icon: "🌟",
      title: "Word Collector",
      desc: "You've learned 50 new words.",
      locked: completedCount < 2,
      progress: Math.min(100, Math.floor((completedCount / 2) * 100)),
    },
    {
      icon: "🎧",
      title: "Listening Champ",
      desc: "You completed 10 listening practices.",
      locked: completedCount < 5,
      progress: Math.min(100, Math.floor((completedCount / 5) * 100)),
    },
    {
      icon: "📚",
      title: "Quiz Master",
      desc: "You aced 5 quizzes in a row.",
      locked: completedCount < 8,
      progress: Math.min(100, Math.floor((completedCount / 8) * 100)),
    },
    {
      icon: "🗣️",
      title: "Fluent Five",
      desc: "You passed 5 speaking tests.",
      locked: completedCount < 10,
      progress: Math.min(100, Math.floor((completedCount / 10) * 100)),
    },
  ];

  const lessonEmojis = ["🌍", "🎒", "🏠", "🍎", "🚗", "📖", "✈️", "🎵"];
  const lessonTitles = [
    "Travel Essentials",
    "Everyday Phrases",
    "At Home Vocab",
    "Food & Drinks",
    "Transportation",
    "Reading Practice",
    "Airport Terms",
    "Music & Art",
  ];
  const lessonDiffs = ["Easy", "Medium", "Easy", "Hard", "Medium", "Easy", "Hard", "Medium"];
  const completedLessons = Array.from(
    { length: Math.min(5, Math.max(4, completedCount || 4)) },
    (_, i) => ({
      emoji: lessonEmojis[i % lessonEmojis.length],
      title: lessonTitles[i % lessonTitles.length],
      difficulty: lessonDiffs[i % lessonDiffs.length],
      terms: [12, 18, 8, 22, 15][i] || 12,
      score: [66, 48, 95, 84, 91][i] || 70,
      time: ["Today", "Yesterday", "2 days ago", "4 days ago", "1 week ago"][i] || "1 day ago",
    })
  );

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  const isDayPracticed = (day) => {
    if (!day) return false;
    const key = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return practicedDates.includes(key);
  };
  const isTodayInCal = (day) =>
    day === today.getDate() &&
    calMonth === today.getMonth() &&
    calYear === today.getFullYear();

  return (
    <div className="ins_page">

      {/* ── STREAK BANNER ── */}
      <div className="ins_streak_banner">
        <div className="ins_streak_banner_text">
          <div className="ins_streak_banner_head">
            <Flame size={22} className="ins_streak_head_fire" />
            {streak >= 7
              ? "You're on fire! 🔥"
              : streak > 0
              ? `Practiced ${streak} day${streak > 1 ? "s" : ""} in a row!`
              : "Start your streak today!"}
          </div>
          <div className="ins_streak_banner_sub">
            {daysToGoal > 0
              ? `Just ${daysToGoal} more day${daysToGoal > 1 ? "s" : ""} to hit your weekly goal.`
              : "You hit your weekly goal! Amazing work!"}
          </div>
        </div>
        <button
          className="ins_streak_toggle_btn"
          onClick={() => setShowCalendar((v) => !v)}
          aria-label="Toggle calendar"
        >
          <Calendar size={18} />
          <span>{showCalendar ? "Week View" : "Month View"}</span>
        </button>
      </div>

      {/* ── WEEKLY STREAK BARS ── */}
      {!showCalendar && (
        <div className="ins_streak_week_card">
          <div className="ins_section_head_card">
            <div>
              <h3 className="ins_week_title">This Week</h3>
              <p className="ins_week_sub">Your daily practice activity</p>
            </div>
            <div className="ins_week_legend">
              <div className="ins_legend_item"><span className="ins_legend_dot ins_legend_done" />Done</div>
              <div className="ins_legend_item"><span className="ins_legend_dot ins_legend_today" />Today</div>
              <div className="ins_legend_item"><span className="ins_legend_dot ins_legend_missed" />Missed</div>
              <div className="ins_legend_item"><span className="ins_legend_dot ins_legend_future" />Upcoming</div>
            </div>
          </div>
          <div className="ins_streak_week">
            {streakWeek.map((item) => (
              <StreakNode
                key={item.day}
                day={item.day}
                isPracticed={item.isPracticed}
                isToday={item.isToday}
                isPast={item.isPast}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── MONTHLY CALENDAR ── */}
      {showCalendar && (
        <div className="ins_calendar_card">
          <div className="ins_calendar_header">
            <div className="ins_cal_nav_wrap">
              <button className="ins_cal_nav" onClick={prevMonth} aria-label="Previous month">
                <ChevronLeft size={20} />
              </button>
              <div className="ins_calendar_title_wrap">
                <span className="ins_calendar_title">{MONTHS[calMonth]}</span>
                <span className="ins_calendar_year">{calYear}</span>
              </div>
              <button className="ins_cal_nav" onClick={nextMonth} aria-label="Next month">
                <ChevronRight size={20} />
              </button>
            </div>
            <button
              className="ins_cal_close"
              onClick={() => setShowCalendar(false)}
              aria-label="Close calendar"
            >
              <span>Week View</span>
            </button>
          </div>

          <div className="ins_cal_grid_header">
            {DAYS.map((d) => (
              <span key={d} className="ins_cal_day_name">{d}</span>
            ))}
          </div>

          <div className="ins_cal_grid">
            {calDays.map((day, idx) => (
              <div
                key={idx}
                className={`ins_cal_cell ${!day ? "ins_cal_empty" : ""} ${
                  isTodayInCal(day) ? "ins_cal_today" : ""
                } ${isDayPracticed(day) ? "ins_cal_practiced" : ""}`}
              >
                {day && (
                  <>
                    <span className="ins_cal_date">{day}</span>
                    {isDayPracticed(day) && (
                      <div className="ins_cal_marker">
                        <Flame size={12} />
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="ins_calendar_footer">
            <Trophy size={16} className="ins_cal_footer_icon" />
            <span>
              {streak >= 7
                ? "Perfect week! Keep the flame alive all month."
                : `${practicedDates.length} day${practicedDates.length > 1 ? "s" : ""} practiced this month.`}
            </span>
          </div>
        </div>
      )}

      {/* ── EMPTY STATE ── */}
      {completedCount === 0 && (
        <div className="ins_empty_state">
          <div className="ins_empty_card">
            <div className="ins_empty_icon_wrap">
              <div className="ins_empty_icon">📊</div>
            </div>
            <h3 className="ins_empty_title">Skill Trends</h3>
            <p className="ins_empty_desc">
              Your speaking, listening, and vocabulary progress will appear here after you complete a few lessons.
            </p>
          </div>
          <div className="ins_empty_card">
            <div className="ins_empty_icon_wrap">
              <div className="ins_empty_icon">🏆</div>
            </div>
            <h3 className="ins_empty_title">Achievements</h3>
            <p className="ins_empty_desc">
              Complete lessons, practice daily, and hit milestones to earn exclusive badges.
            </p>
          </div>
          <div className="ins_empty_card">
            <div className="ins_empty_icon_wrap">
              <div className="ins_empty_icon">✅</div>
            </div>
            <h3 className="ins_empty_title">Completed Lessons</h3>
            <p className="ins_empty_desc">
              Pick a topic to start your first lesson and track your learning journey.
            </p>
          </div>
        </div>
      )}

      {/* ── SKILL TRENDS ── */}
      {completedCount >= 0 && (
        <>
          <div className="ins_section_header">
            <div>
              <h2 className="ins_section_title">Skill Trends</h2>
              <p className="ins_section_sub">Track how your language skills are evolving</p>
            </div>
          </div>
          <div className="ins_skills_row">
            {skills.map((s) => (
              <SkillCard key={s.label} {...s} />
            ))}
          </div>

          {/* ── ACHIEVEMENTS ── */}
          <div className="ins_section_header">
            <div>
              <h2 className="ins_section_title">Achievements</h2>
              <p className="ins_section_sub">
                {unlockedCount}/4 unlocked · {Math.ceil(((4 - unlockedCount) / 4) * 100)}% to go
              </p>
            </div>
            <Trophy size={22} className="ins_section_icon" />
          </div>
          <div className="ins_achievements_grid">
            {achievements.map((a) => (
              <AchievementCard key={a.title} {...a} />
            ))}
          </div>

          {/* ── COMPLETED LESSONS ── */}
          <div className="ins_section_header">
            <div>
              <h2 className="ins_section_title">Recent Lessons</h2>
              <p className="ins_section_sub">Lessons you've finished in the past week</p>
            </div>
            <BookOpen size={22} className="ins_section_icon" />
          </div>
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

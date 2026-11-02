import React, { useState, useMemo, useEffect } from "react";
import { useApp } from "../App";
import { getUserInsights } from "../api";
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
} from "lucide-react";

/* ── helpers ── */
const DAYS = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
const isImageUrl = (value) =>
  typeof value === "string" && /^(https?:\/\/|data:image\/|blob:)/i.test(value.trim());

const IconVisual = ({ value, alt, fallback }) => {
  if (!isImageUrl(value)) return <>{value || fallback}</>;
  return (
    <span className="ins_icon_image_wrap">
      <img
        src={value.trim()}
        alt={alt}
        onError={(event) => event.currentTarget.classList.add("ins_icon_image_failed")}
      />
      <span className="ins_icon_image_fallback">{fallback}</span>
    </span>
  );
};
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
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
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
const SkillCard = ({ label, value, delta, direction, color, hasData }) => {
  const isUp = direction ? direction !== "down" : delta >= 0;
  return (
    <div className="ins_skill_card" style={{ "--skill-color": color }}>
      <div className="ins_skill_top">
        <div className="ins_skill_ring_wrap">
          <CircleProgress value={value} color={color} size={90} stroke={10} />
          <span className="ins_skill_value">{hasData ? value : "—"}</span>
        </div>
        <div className="ins_skill_delta_wrap">
          {isUp ? (
            <TrendingUp size={14} className="ins_delta_icon_up" />
          ) : (
            <TrendingDown size={14} className="ins_delta_icon_down" />
          )}
          <span className={`ins_skill_delta ${isUp ? "ins_delta_up" : "ins_delta_down"}`}>
            {hasData ? `${delta}%` : "No data"}
          </span>
        </div>
      </div>
      <div className="ins_skill_body">
        <p className="ins_skill_label">{label}</p>
        <div className="ins_skill_progress">
          <div
            className="ins_skill_progress_fill"
            style={{ width: `${hasData ? value : 0}%`, background: color }}
          />
        </div>
      </div>
    </div>
  );
};

/* ── Achievement badge ── */
const AchievementCard = ({ icon, title, desc, locked = false, progress, currentProgress, target }) => (
  <div className={`ins_achievement_card ${locked ? "ins_achievement_locked" : ""}`}>
    <div className={`ins_achievement_icon ${locked ? "" : "ins_ach_unlocked"}`}>
      {locked ? <Lock size={22} /> : (
        <span className="ins_achievement_emoji">
          <IconVisual value={icon} alt={title} fallback="🏆" />
        </span>
      )}
    </div>
    <div className="ins_achievement_body">
      <div className="ins_achievement_top">
        <p className="ins_achievement_title">{title}</p>
        {!locked && <Award size={16} className="ins_ach_award_icon" />}
      </div>
      <p className="ins_achievement_desc">{desc}</p>
      {progress !== undefined && (
        <div className="ins_ach_progress_wrap">
          <div className="ins_ach_progress">
            <div className="ins_ach_progress_fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="ins_ach_progress_text">{currentProgress}/{target}</span>
        </div>
      )}
    </div>
  </div>
);

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
const Insights = () => {
  const { user } = useApp();
  const [insightData, setInsightData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    if (!user?.id) { setInsightData(null); setIsLoading(false); return undefined; }
    let active = true;
    setIsLoading(true);
    getUserInsights(user.id, calYear, calMonth + 1)
      .then((data) => { if (active) setInsightData(data); })
      .catch((error) => console.error('Failed to load insights:', error))
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [user?.id, user?.streak, calMonth, calYear]);

  const practicedDates = useMemo(() => insightData?.practicedDates || [], [insightData]);
  const streakWeek = useMemo(() => getStreakWeek(practicedDates), [practicedDates]);
  const calDays = useMemo(() => getCalendarDays(calYear, calMonth), [calYear, calMonth]);

  const streak = Number(user?.streak ?? insightData?.streakCard?.streakDays) || 0;
  const daysToGoal = Number(insightData?.streakCard?.daysToWeeklyGoal ?? Math.max(0, 7 - streak)) || 0;
  const daysPracticedThisWeek = Number(insightData?.streakCard?.daysPracticedThisWeek) || 0;
  const weeklyGoal = Number(insightData?.streakCard?.weeklyGoal) || 7;
  const completedRecords = insightData?.completedLessons || [];
  const completedCount = insightData ? completedRecords.length : user?.completedLessons?.length || 0;
  const skillTrends = insightData?.skillTrends || {};
  const skillScores = insightData?.skillScores || {};
  const speakingScore = Number(skillTrends.speaking?.score ?? skillScores.speaking) || 0;
  const listeningScore = Number(skillTrends.listening?.score ?? skillScores.listening) || 0;
  const vocabScore = Number(skillTrends.vocabulary?.score ?? skillScores.vocabulary) || 0;

  const skills = [
    { label: "Speaking", value: speakingScore, delta: Number(skillTrends.speaking?.trendPercent) || 0, direction: skillTrends.speaking?.trendDirection, color: "#2f855a", hasData: Boolean(insightData) && !skillTrends.isEmpty && (speakingScore > 0 || completedCount > 0) },
    { label: "Listening", value: listeningScore, delta: Number(skillTrends.listening?.trendPercent) || 0, direction: skillTrends.listening?.trendDirection, color: "#f2a541", hasData: Boolean(insightData) && !skillTrends.isEmpty && (listeningScore > 0 || completedCount > 0) },
    { label: "Vocabulary", value: vocabScore, delta: Number(skillTrends.vocabulary?.trendPercent) || 0, direction: skillTrends.vocabulary?.trendDirection, color: "#5b6abf", hasData: Boolean(insightData) && !skillTrends.isEmpty && (vocabScore > 0 || completedCount > 0) },
  ];

  const achievementDefinitions = insightData?.achievementDefinitions || [];
  const achievements = achievementDefinitions.map((achievement) => {
    const target = Number(achievement.target || achievement.requiredCompleted) || 1;
    const progress = Number(achievement.progressPercent);
    return {
      icon: achievement.icon,
      title: achievement.title,
      desc: achievement.desc,
      target,
      currentProgress: Number(achievement.currentProgress) || 0,
      locked: achievement.isUnlocked !== undefined ? !achievement.isUnlocked : completedCount < target,
      progress: Number.isFinite(progress) ? progress : Math.min(100, Math.round((completedCount / target) * 100)),
    };
  });
  const unlockedCount = achievements.filter((achievement) => !achievement.locked).length;
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
  const practicedDaysInSelectedMonth = calDays.filter((day) => day && isDayPracticed(day)).length;

  return (
    <div className="ins_page">
      <section className="ins_overview">
        <div className="ins_overview_copy">
          <span className="ins_overview_kicker">LEARNING INSIGHTS</span>
          <h1>Your progress, in focus.</h1>
          <p>A clear view of the practice and milestones building your {user?.language || "language"} skills.</p>
        </div>
        <div className="ins_overview_stats">
          <div className="ins_overview_stat"><Flame size={17} /><strong>{streak}</strong><span>day streak</span></div>
          <div className="ins_overview_stat"><BookOpen size={17} /><strong>{completedCount}</strong><span>lessons done</span></div>
          <div className="ins_overview_stat"><Award size={17} /><strong>{unlockedCount}</strong><span>badges earned</span></div>
        </div>
      </section>
      {isLoading && <div className="ins_loading_state">Updating your learning insights…</div>}

      {/* ── STREAK BANNER ── */}
      <div className="ins_streak_banner">
        <div className="ins_streak_banner_text">
          <div className="ins_streak_banner_head">
            <Flame size={22} className="ins_streak_head_fire" />
            {(streak >= 7
              ? "You're on fire! 🔥"
              : streak > 0
              ? `Practiced ${streak} day${streak > 1 ? "s" : ""} in a row!`
              : "Start your streak today!")}
          </div>
          <div className="ins_streak_banner_sub">
            {(daysToGoal > 0
              ? `Just ${daysToGoal} more day${daysToGoal > 1 ? "s" : ""} to hit your weekly goal.`
              : "You hit your weekly goal! Amazing work!")}
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
              {daysPracticedThisWeek >= weeklyGoal
                ? "Perfect week! Keep the flame alive all month."
                : `${practicedDaysInSelectedMonth} day${practicedDaysInSelectedMonth === 1 ? "" : "s"} practiced this month.`}
            </span>
          </div>
        </div>
      )}

      {/* ── SKILL TRENDS ── */}
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
                {unlockedCount}/{achievements.length} unlocked · {achievements.filter((a) => a.locked).length} to earn
              </p>
            </div>
            <Trophy size={22} className="ins_section_icon" />
          </div>
          {achievements.length ? <div className="ins_achievements_grid">
            {achievements.map((a) => <AchievementCard key={a.title} {...a} />)}
          </div> : <p className="ins_section_empty">Achievement milestones will appear here when they’re available.</p>}

      </>
    </div>
  );
};

export default Insights;

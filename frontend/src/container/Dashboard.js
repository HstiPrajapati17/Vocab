import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import {
  Lock, CheckCircle, Star, Dumbbell, Trophy,
  BookOpen, ChevronLeft, ArrowRight, X
} from 'lucide-react';
import { useApp } from '../App';
import { getLessons } from '../api';
import InstructionsModal from '../components/InstructionsModal';
import { FaAnglesLeft } from "react-icons/fa6";

/* ── unit metadata ── */
const unitMeta = [
  {
    id: 1,
    section: "Section 1, Unit 1",
    sectionLabel: "Section 1",
    title: "Basics: Greetings & Introductions",
    description: "I can greet people and introduce myself in everyday situations.",
    color: "var(--primary)",
    emoji: "👋",
    unitCount: 4,
  },
  {
    id: 2,
    section: "Section 1, Unit 2",
    sectionLabel: "Section 2",
    title: "Phrases: Daily Conversations",
    description: "I can participate in short, simple conversations about familiar topics.",
    color: "#7c87a3",
    emoji: "💬",
    unitCount: 6,
  },
  {
    id: 3,
    section: "Section 2, Unit 1",
    sectionLabel: "Section 3",
    title: "Travel: Compare Experiences",
    description: "I am able to discuss travel plans, compare experiences and give opinions.",
    color: "#5f6982",
    emoji: "✈️",
    unitCount: 8,
  },
];

const pathIcons = [Star, Dumbbell, Trophy, Star, Lock];

/* ════════════════════════════════════════════════════════════════
   SECTIONS OVERVIEW PANEL  (Duolingo-style slide-in)
════════════════════════════════════════════════════════════════ */
const SectionsPanel = ({ units, completedLessons, allLessons, onClose, onJump, activeLesson }) => {
  return (
    <div className="db_panel_overlay" onClick={onClose}>
      <div className="db_panel" onClick={e => e.stopPropagation()}>

        {/* header */}
        <div className="db_panel_header">
          <button className="db_panel_close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
          <h2 className="db_panel_title">All Sections</h2>
        </div>

        {/* section cards */}
        <div className="db_panel_body">
          {units.map((unit, idx) => {
            const unitLessons = allLessons.filter(l => l.unitId === unit.id);
            const completedCount = unitLessons.filter(l => completedLessons.includes(l.id)).length;
            const totalCount = unitLessons.length || unit.unitCount;
            const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
            const isActive = unitLessons.some(l => l.id === activeLesson);
            const isLocked = idx > 0 && units.slice(0, idx).every(u => {
              const prev = allLessons.filter(l => l.unitId === u.id);
              return prev.length > 0 && prev.every(l => completedLessons.includes(l.id));
            }) === false && completedCount === 0 && !isActive;

            return (
              <div
                key={unit.id}
                className={`db_section_card ${isActive ? 'db_section_card_active' : ''} ${isLocked ? 'db_section_card_locked' : ''}`}
              >
                {/* left col */}
                <div className="db_section_left">
                  <div className="db_section_emoji_wrap" style={{ background: isLocked ? 'rgba(0,0,0,0.08)' : unit.color + '22', borderColor: isLocked ? 'rgba(0,0,0,0.10)' : unit.color + '55' }}>
                    {isLocked ? <Lock size={20} style={{ color: 'var(--text-muted)' }} /> : <span style={{ fontSize: '1.4rem' }}>{unit.emoji}</span>}
                  </div>

                  <div>
                    <p className="db_section_label">{unit.sectionLabel}</p>
                    <h3 className="db_section_title">{unit.title}</h3>
                    {isLocked ? (
                      <p className="db_section_locked_hint">
                        <Lock size={11} /> {totalCount} units · locked
                      </p>
                    ) : (
                      <p className="db_section_progress_text">{completedCount} / {totalCount} units</p>
                    )}

                    {/* progress bar */}
                    {!isLocked && (
                      <div className="db_section_bar_wrap">
                        <div className="db_section_bar_track">
                          <div
                            className="db_section_bar_fill"
                            style={{ width: `${progressPct}%`, background: unit.color }}
                          />
                        </div>
                        <span className="db_section_bar_pct">{progressPct}%</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* right action */}
                {!isLocked && (
                  <button
                    className={`db_section_btn ${isActive ? 'db_section_btn_active' : 'db_section_btn_jump'}`}
                    onClick={() => { onJump(unit.id); onClose(); }}
                  >
                    {isActive ? (
                      <>Continue <ArrowRight size={14} /></>
                    ) : completedCount === totalCount ? (
                      <>Review <ArrowRight size={14} /></>
                    ) : (
                      <>Jump here <ArrowRight size={14} /></>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   DASHBOARD
════════════════════════════════════════════════════════════════ */
const Dashboard = () => {
  const navigate = useNavigate();
  const { user, handleLessonStats } = useApp();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showSections, setShowSections] = useState(false);
  const [jumpToUnit, setJumpToUnit] = useState(null);

  useEffect(() => {
    setLoading(true);
    getLessons(user?.language || 'English')
      .then(data => { setLessons(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user?.language]);

  useEffect(() => {
    const completed = user?.completedLessons?.length || 0;
    handleLessonStats?.({ total: lessons.length, completed });
  }, [lessons.length, user?.completedLessons, handleLessonStats]);

  const completedLessons = useMemo(
    () => (user?.completedLessons || []).map(id => parseInt(id)),
    [user?.completedLessons]
  );

  const activeLesson = useMemo(() => {
    const next = lessons.find(l => !completedLessons.includes(l.id));
    return next ? next.id : (lessons[0]?.id || 1);
  }, [lessons, completedLessons]);

  const handleLessonClick = (lesson) => {
    const isCompleted = completedLessons.includes(lesson.id);
    const isActive = lesson.id === activeLesson;
    if (!isCompleted && !isActive) return;
    navigate(`/lesson/${lesson.id}`);
  };

  const unitGroups = unitMeta.map(unit => ({
    ...unit,
    lessons: lessons.filter(l => l.unitId === unit.id),
  }));

  // Which unit is currently active (has the active lesson)
  const activeUnit =
    unitGroups.find(u => u.lessons.some(l => l.id === activeLesson)) ||
    unitGroups[0];

  // Scroll to a unit when jumping from the panel
  useEffect(() => {
    if (jumpToUnit !== null) {
      const el = document.getElementById(`db_unit_${jumpToUnit}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setJumpToUnit(null);
    }
  }, [jumpToUnit]);

  return (
    <div className="h_learn_page">

      {/* ── section banner ── */}
      {activeUnit && (
        <div className="h_section_banner" style={{ background: activeUnit.color }}>
          {/* back → opens sections panel */}
          <button
            type="button"
            className="h_section_back"
            aria-label="All sections"
            onClick={() => setShowSections(true)}
          >
            <ChevronLeft size={18} />
          </button>

          <div className="h_section_banner_text">
            <div className="h_section_sub_label">{activeUnit.section}</div>
            <div className="h_section_main_label">{activeUnit.title}</div>
          </div>

          <button
            type="button"
            className="h_guidebook_btn"
            onClick={() => setShowInstructions(true)}
          >
            <BookOpen size={16} /> GUIDEBOOK
          </button>
        </div>
      )}

      {/* ── loading ── */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="success" />
          <p className="text-muted mt-2 small">Loading {user?.language || 'English'} lessons…</p>
        </div>
      ) : (
        unitGroups.map(unit => (
          <div key={unit.id} id={`db_unit_${unit.id}`} className="h_learn_unit">
            {unit.id > 1 && (
              <div className="h_unit_divider">
                <span>{unit.title}</span>
              </div>
            )}

            <div className="h_learn_path">
              {unit.lessons.map((lesson, idx) => {
                const isCompleted = completedLessons.includes(lesson.id);
                const isActive    = lesson.id === activeLesson;
                const isLocked    = !isCompleted && !isActive;
                const offset      = idx % 2 === 0 ? 'left' : 'right';
                const IconComp    = isLocked
                  ? Lock
                  : isCompleted
                    ? CheckCircle
                    : pathIcons[idx % pathIcons.length];

                return (
                  <div key={lesson.id} className={`h_learn_node_wrap h_learn_node_${offset}`}>
                    <div className="h_learn_node_area">
                      {isActive && !isCompleted && (
                        <span className="h_start_label">START</span>
                      )}
                      <button
                        type="button"
                        className={`h_learn_node
                          ${isCompleted ? 'h_learn_node_done'   : ''}
                          ${isActive    ? 'h_learn_node_active' : ''}
                          ${isLocked    ? 'h_learn_node_locked' : ''}`}
                        onClick={() => handleLessonClick(lesson)}
                        disabled={isLocked}
                        aria-label={lesson.title}
                      >
                        <IconComp size={isActive ? 28 : 24} strokeWidth={2.5} />
                      </button>
                    </div>
                    {idx < unit.lessons.length - 1 && (
                      <div className={`h_learn_connector ${isCompleted ? 'h_learn_connector_done' : ''}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* jump section at bottom */}
      {!loading && lessons.length > 0 && (
        <div className="h_jump_section">
          <div className="h_unit_divider"><span>Jump ahead?</span></div>
          <button type="button" className="h_jump_btn" onClick={() => setShowSections(true)}>
            <FaAnglesLeft />
          </button>
          <p className="h_jump_label">VIEW ALL SECTIONS</p>
        </div>
      )}

      {/* ── sections panel ── */}
      {showSections && (
        <SectionsPanel
          units={unitGroups}
          completedLessons={completedLessons}
          allLessons={lessons}
          activeLesson={activeLesson}
          onClose={() => setShowSections(false)}
          onJump={(unitId) => setJumpToUnit(unitId)}
        />
      )}

      <InstructionsModal
        show={showInstructions}
        onHide={() => setShowInstructions(false)}
      />
    </div>
  );
};

export default Dashboard;

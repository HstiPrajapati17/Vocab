import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import {
  Lock, CheckCircle, Star, Dumbbell, Trophy, BookOpen, ChevronLeft
} from 'lucide-react';
import { useApp } from '../App';
import { getLessons, updateUser } from '../api';
import InstructionsModal from '../components/InstructionsModal';
import { FaAnglesLeft } from "react-icons/fa6";

const unitMeta = [
  {
    id: 1,
    section: "Section 1, Unit 1",
    title: "Basics: Greetings & Introductions",
    color: "#7c87a3",
  },
  {
    id: 2,
    section: "Section 1, Unit 2",
    title: "Phrases: Daily Conversations",
    color: "#9aa3bb",
  },
  {
    id: 3,
    section: "Section 2, Unit 1",
    title: "Travel: Compare Experiences",
    color: "#5f6982",
  },
];

const pathIcons = [Star, Dumbbell, Trophy, Star, Lock];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, handleLessonStats, refreshUser } = useApp();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);
  const [localActiveLesson, setLocalActiveLesson] = useState(null);

  useEffect(() => {
    setLoading(true);
    getLessons(user?.language || 'English')
      .then(data => {
        setLessons(data);
        // Set activeLesson to first lesson ID if not set or if language changed
        if (data.length > 0) {
          const firstLessonId = data[0].id;
          setLocalActiveLesson(firstLessonId);
          if (!user?.activeLesson || user?.language !== data[0].language) {
            // The first lesson should be active by default
            updateUser(user.id, { activeLesson: firstLessonId }).then(refreshUser);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user?.language]);

  useEffect(() => {
    const completed = user?.completedLessons?.length || 0;
    handleLessonStats?.({ total: lessons.length, completed });
  }, [lessons.length, user?.completedLessons, handleLessonStats]);

  const completedLessons = user?.completedLessons || [];
  const activeLesson = localActiveLesson || user?.activeLesson || 1;

  const handleLessonClick = (lesson) => {
    const isCompleted = completedLessons.includes(lesson.id);
    const isActive = lesson.id === activeLesson;
    const isLocked = !isCompleted && !isActive;
    if (isLocked) return;
    navigate(`/lesson/${lesson.id}`);
  };

  const unitGroups = unitMeta.map((unit) => ({
    ...unit,
    lessons: lessons.filter((l) => l.unitId === unit.id),
  }));

  const activeUnit =
    unitGroups.find((u) => u.lessons.some((l) => l.id === activeLesson)) ||
    unitGroups[0];

  return (
    <div className="h_learn_page">
      {activeUnit && (
        <div
          className="h_section_banner"
          style={{ background: "var(--primary)" }}
        >
          <button type="button" className="h_section_back" aria-label="Back">
            <ChevronLeft size={18} />
          </button>
          <div className="h_section_banner_text">
            <div className="h_section_sub_label">{activeUnit.section}</div>
            <div className="h_section_main_label">{activeUnit.title}</div>
          </div>
          <button type="button" className="h_guidebook_btn" onClick={() => setShowInstructions(true)}>
            <BookOpen size={16} /> GUIDEBOOK
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="success" />
          <p className="text-muted mt-2 small">
            Loading {user?.language || "Spanish"} lessons...
          </p>
        </div>
      ) : (
        unitGroups.map((unit) => (
          <div key={unit.id} className="h_learn_unit">
            {unit.id > 1 && (
              <div className="h_unit_divider">
                <span>{unit.title}</span>
              </div>
            )}

            <div className="h_learn_path">
              {unit.lessons.map((lesson, idx) => {
                const isCompleted = completedLessons.includes(lesson.id);
                const isActive = lesson.id === activeLesson;
                const isLocked = !isCompleted && !isActive;
                const offset = idx % 2 === 0 ? "left" : "right";
                const IconComp = isLocked
                  ? Lock
                  : isCompleted
                    ? CheckCircle
                    : pathIcons[idx % pathIcons.length];

                return (
                  <div
                    key={lesson.id}
                    className={`h_learn_node_wrap h_learn_node_${offset}`}
                  >
                    <div className="h_learn_node_area">
                      {isActive && !isCompleted && (
                        <span className="h_start_label">START</span>
                      )}
                      <button
                        type="button"
                        className={`h_learn_node
                          ${isCompleted ? "h_learn_node_done" : ""}
                          ${isActive ? "h_learn_node_active" : ""}
                          ${isLocked ? "h_learn_node_locked" : ""}`}
                        onClick={() => handleLessonClick(lesson)}
                        disabled={isLocked}
                        aria-label={lesson.title}
                      >
                        <IconComp size={isActive ? 28 : 24} strokeWidth={2.5} />
                      </button>
                    </div>
                    {idx < unit.lessons.length - 1 && (
                      <div
                        className={`h_learn_connector ${isCompleted ? "h_learn_connector_done" : ""}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {!loading && lessons.length > 0 && (
        <div className="h_jump_section">
          <div className="h_unit_divider">
            <span>Jump ahead?</span>
          </div>
          <button type="button" className="h_jump_btn" disabled>
            <span className="h_jump_icon"><FaAnglesLeft /></span>
          </button>
          <p className="h_jump_label">JUMP HERE?</p>
        </div>
      )}

      <InstructionsModal
        show={showInstructions}
        onHide={() => setShowInstructions(false)}
      />
    </div>
  );
};

export default Dashboard;

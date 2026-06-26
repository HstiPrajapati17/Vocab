import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Spinner } from 'react-bootstrap';
import { Check, Search } from 'lucide-react';
import { useApp } from '../App';
import { updateUser } from '../api';

const allLanguages = [
  { flag: '🇪🇸', name: 'English', learners: '50M' },
  { flag: '🇩🇪', name: 'German', learners: '12M' },
  { flag: '🇫🇷', name: 'French', learners: '18M' },
  { flag: '🇵🇱', name: 'Polish', learners: '8M' },
];

const Courses = () => {
  const navigate = useNavigate();
  const { user, refreshUser, setPreviewLanguage } = useApp();
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(null);

  const filtered = allLanguages.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = async (lang) => {
    setPreviewLanguage(lang.name);

    if (!user?.id || lang.name === user.language) return;

    setSaving(lang.name);
    try {
      const updated = await updateUser(user.id, {
        language: lang.name,
        activeLesson: 1,
        completedLessons: [],
      });
      refreshUser(updated);
      setTimeout(() => navigate('/dashboard'), 400);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="h_courses_page">
      <div className="h_courses_header">
        <div>
          <h1 className="h_courses_title">Courses for English Speakers</h1>
          <p className="text-muted small mb-0">Select a language — your learning path updates instantly</p>
        </div>
        <div className="h_courses_speak">
          <span>I SPEAK</span>
          <strong>ENGLISH</strong>
        </div>
      </div>

      <div className="h_courses_search mb-4">
        <Search size={18} className="h_courses_search_icon" />
        <input
          type="text"
          placeholder="Search languages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h_courses_search_input"
        />
      </div>

      <Row className="g-3 g-md-4">
        {filtered.map((lang) => {
          const isActive = user?.language === lang.name;
          const isSaving = saving === lang.name;
          return (
            <Col xs={6} sm={4} md={3} lg={3} key={lang.name}>
              <button
                type="button"
                className={`h_course_card ${isActive ? 'h_course_card_active' : ''}`}
                onClick={() => handleSelect(lang)}
                disabled={isSaving}
              >
                {isActive && (
                  <span className="h_course_check"><Check size={14} strokeWidth={3} /></span>
                )}
                {isSaving ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <>
                    <span className="h_course_flag">{lang.flag}</span>
                    <span className="h_course_name">{lang.name}</span>
                    <span className="h_course_learners">{lang.learners} learners</span>
                  </>
                )}
              </button>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default Courses;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Spinner } from 'react-bootstrap';
import { Check, Search } from 'lucide-react';
import { useApp } from '../App';
import { updateUser, getLanguages } from '../api';
import flag_1 from "../assets/USFlag.webp";
import flag_2 from "../assets/FranceFlag.png";
import flag_3 from "../assets/GermanyFlag.jpg";
import flag_4 from "../assets/PolandFlag.png";

const FLAG_MAP = {
  "USFlag.webp": flag_1,
  "FranceFlag.png": flag_2,
  "GermanyFlag.jpg": flag_3,
  "PolandFlag.png": flag_4,
};

const Courses = () => {
  const navigate = useNavigate();
  const { user, refreshUser, setPreviewLanguage } = useApp();
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(null);
  const [allLanguages, setAllLanguages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLanguages()
      .then((langs) => {
        setAllLanguages(
          langs.map((l) => ({ ...l, flag: FLAG_MAP[l.flagImg] || flag_1 })),
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
            <Col xs={6} sm={4} md={3} lg={6} xl={3} key={lang.name}>
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
                    <div
                      className="h_course_icon"
                      style={{ backgroundColor: `${lang.color}20` }}
                    >
                      <img src={lang.flag} alt={lang.name} />
                    </div>

                    <div className="h_course_content">
                      <h5>{lang.name}</h5>
                      <p>{lang.native}</p>

                      <span
                        className="h_course_badge"
                        style={{ backgroundColor: lang.color }}
                      >
                        {lang.learners} Speakers
                      </span>
                    </div>
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

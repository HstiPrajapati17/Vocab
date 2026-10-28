import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Check, Search } from 'lucide-react';
import { useApp } from '../App';
import { updateUser, getLanguages } from '../api';
import { getLanguageFlag } from '../utils/languageFlags';

const Courses = () => {
  const navigate = useNavigate();
  const { user, setUser, showToast } = useApp();

  const [search,       setSearch]       = useState('');
  const [savingId,     setSavingId]     = useState(null);
  const [allLanguages, setAllLanguages] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');

  const userRef = useRef(user);
  useEffect(() => { userRef.current = user; }, [user]);

  const selectedLang = user?.language?.toLowerCase() || '';

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getLanguages()
      .then((langs) => {
        if (cancelled) return;
        console.info('Languages received from backend:', langs.map(({ id, name, image }) => ({ id, name, image })));
        setAllLanguages(langs.map((language) => ({
          ...language,
          flag: getLanguageFlag(language.name, language.flagImg || language.image),
        })));
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load languages. Please refresh.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const filtered = allLanguages.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.native.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = useCallback(async (lang) => {
    const currentUser = userRef.current;

    if (!currentUser?.id) {
      showToast('Please login to select a language', 'warn');
      navigate('/login');
      return;
    }

    if (lang.name.toLowerCase() === currentUser.language?.toLowerCase()) {
      showToast(`${lang.name} is already your active language`, 'info');
      return;
    }

    setError('');
    setSavingId(lang.id);

    try {
      const updated = await updateUser(currentUser.id, {
        language: lang.name,
      });

      setUser(updated);
      // showToast(`Language changed to ${lang.name} 🎉`, 'success');
    } catch (err) {
      console.error('Language switch failed:', err);
      const msg = err?.message || 'Unknown error';
      const is404 = /failed.*404/i.test(msg);

      // 404 specifically means the server doesn't know this user id anymore
      // → session is definitely corrupted. Clear it and force re-login so the
      // next login re-syncs id with the server (permanently removes 404s).
      if (is404) {
        setError(`Your session is out of sync. Logging out… please sign in again.`);
        showToast('Session expired — please sign in again', 'warn');
        setSavingId(null);
        setTimeout(() => {
          localStorage.removeItem('linguaUser');
          setUser(null);
          navigate('/login', { replace: true });
        }, 1200);
        return;
      }

      setError(`Could not switch language: ${msg}`);
      showToast(`Language change failed: ${msg}`, 'error');
    } finally {
      setSavingId(null);
    }
  }, [setUser, showToast, navigate]);

  return (
    <div className="h_courses_page">
      <div className="h_courses_header">
        <div>
          <h1 className="h_courses_title">
            Courses for {user?.language || 'English'} Speakers
          </h1>
          <p className="text-muted small mb-0">
            {loading
              ? 'Loading languages from backend…'
              : `Backend languages (${allLanguages.length}): ${allLanguages.map((language) => language.name).join(', ') || 'none found'}`}
          </p>
        </div>
        <div className="h_courses_speak">
          <span>I SPEAK</span>
          <strong>{(user?.language || 'English').toUpperCase()}</strong>
        </div>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')} className="mt-2">
          {error}
        </Alert>
      )}

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

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="success" />
          <p className="text-muted small mt-2">Loading languages…</p>
        </div>
      ) : (
        <Row className="g-3 g-md-4">
          {filtered.length === 0 ? (
            <Col xs={12}>
              <Alert variant="info" className="text-center py-4">
                No languages found matching <strong>"{search}"</strong>.
              </Alert>
            </Col>
          ) : (
            filtered.map((lang) => {
              const isActive = selectedLang === lang.name.toLowerCase();
              const isTargetSaving = savingId === lang.id;
              const anySaving = savingId !== null;

              return (
                <Col xs={6} sm={4} md={3} lg={6} xl={3} key={lang.id || lang.name}>
                  <button
                    type="button"
                    className={`h_course_card ${isActive ? 'h_course_card_active' : ''} ${isTargetSaving ? 'h_course_card_saving' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSelect(lang);
                    }}
                    disabled={anySaving}
                    aria-pressed={isActive}
                    aria-busy={isTargetSaving}
                    style={{ pointerEvents: anySaving ? 'none' : 'auto' }}
                  >
                    {isActive && !anySaving && (
                      <span className="h_course_check" aria-hidden="true">
                        <Check size={14} strokeWidth={3} />
                      </span>
                    )}

                    {isTargetSaving ? (
                      <div className="d-flex flex-column align-items-center justify-content-center w-100 py-3 gap-2">
                        <Spinner animation="border" size="sm" variant="success" />
                        <small className="text-muted small mb-0">Switching to {lang.name}…</small>
                      </div>
                    ) : (
                      <>
                        <div
                          className="h_course_icon"
                          style={{ backgroundColor: `${lang.color}22` }}
                          aria-hidden="true"
                        >
                          <img src={lang.flag} alt={lang.name} draggable={false} />
                        </div>
                        <div className="h_course_content">
                          <h5>{lang.name}</h5>
                          <p>{lang.native}</p>
                          {/* <span
                            className="h_course_badge"
                            style={{ backgroundColor: lang.color }}
                          >
                            {lang.learners} Speakers
                          </span> */}
                        </div>
                      </>
                    )}
                  </button>
                </Col>
              );
            })
          )}
        </Row>
      )}
    </div>
  );
};

export default Courses;

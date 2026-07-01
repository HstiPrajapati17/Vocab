import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { Search, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useApp } from '../App';
import { registerUser } from '../api';

const allLanguages = [
  { flag: '�🇸', name: 'English', native: 'English' },
  { flag: '🇫🇷', name: 'French', native: 'Français' },
  { flag: '🇩🇪', name: 'German', native: 'Deutsch' },
  { flag: '🇵🇱', name: 'Polish', native: 'Polski' },
];

const levels = [
  { id: 'Beginner', label: 'Beginner', desc: "I'm just starting out", icon: '🌱' },
  { id: 'Intermediate', label: 'Intermediate', desc: 'I know some basics', icon: '📚' },
  { id: 'Advanced', label: 'Advanced', desc: 'I want to polish my skills', icon: '🚀' },
];

const goals = [
  { label: 'Casual', xp: 10, icon: '😌' },
  { label: 'Regular', xp: 20, icon: '📚' },
  { label: 'Serious', xp: 30, icon: '🎯' },
  { label: 'Intense', xp: 50, icon: '🔥' },
];

// Step 1: Pick language
// Step 2: Pick level
// Step 3: Pick daily goal → register
const LanguageSelect = () => {
  const navigate = useNavigate();
  const { user, handleLanguageSelected } = useApp();
  const [search, setSearch] = useState('');
  const [selectedLang, setSelectedLang] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const filtered = allLanguages.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.native.toLowerCase().includes(search.toLowerCase())
  );

  const handleFinish = async () => {
    if (!selectedGoal) { setError('Please pick a goal.'); return; }
    setLoading(true);
    setError('');
    try {
      const newUser = await registerUser(
        user.name,
        user.email,
        user.password,
        selectedLang.name,
        selectedLevel,
        selectedGoal
      );
      handleLanguageSelected(newUser);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Try a different email.');
      setLoading(false);
    }
  };

  const stepTitles = [
    'What do you want to learn?',
    `How well do you know ${selectedLang?.name || 'it'}?`,
    'Set your daily goal',
  ];

  return (
    <div className="h_lang_select_page py-5">
      <Container>
        {/* Progress dots */}
        <div className="d-flex justify-content-center gap-3 mb-4">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`h_step_dot ${s === step ? 'h_step_dot_active' : s < step ? 'h_step_dot_done' : ''}`}
            />
          ))}
        </div>

        <div className="text-center mb-5">
          <div className="h_auth_logo">V</div>
          <h2 className="h_section_title">{stepTitles[step - 1]}</h2>
          {step === 1 && <p className="text-muted">Choose a language and start your journey</p>}
          {step === 2 && <p className="text-muted">Select your current level</p>}
          {step === 3 && <p className="text-muted">How much do you want to learn per day?</p>}
        </div>

        {error && (
          <Row className="justify-content-center mb-3">
            <Col xs={12} md={6}>
              <Alert variant="danger" className="py-2 small text-center">{error}</Alert>
            </Col>
          </Row>
        )}

        {/* STEP 1 — Language */}
        {step === 1 && (
          <>
            <Row className="justify-content-center mb-4">
              <Col xs={12} md={6} lg={4}>
                <div className="h_input_wrap">
                  <Search className="h_input_icon" size={18} />
                  <Form.Control
                    type="text"
                    placeholder="Search language..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h_form_input ps-5"
                  />
                </div>
              </Col>
            </Row>
            <Row className="g-3 justify-content-center">
              {filtered.map((lang, i) => (
                <Col xs={6} sm={4} md={3} lg={2} key={i}>
                  <Card
                    className={`h_lang_card text-center ${selectedLang?.name === lang.name ? 'h_lang_selected' : ''}`}
                    onClick={() => setSelectedLang(lang)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Card.Body className="p-3">
                      <div className="h_lang_flag">{lang.flag}</div>
                      <div className="h_lang_name">{lang.name}</div>
                      <div className="h_lang_native text-muted small">{lang.native}</div>
                      {selectedLang?.name === lang.name && (
                        <Check className="text-success mt-1" size={18} />
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}

        {/* STEP 2 — Level */}
        {step === 2 && (
          <Row className="justify-content-center g-3">
            {levels.map((lvl) => (
              <Col xs={12} sm={6} md={4} key={lvl.id}>
                <Card
                  className={`h_level_card text-center p-3 ${selectedLevel === lvl.id ? 'h_level_selected' : ''}`}
                  onClick={() => setSelectedLevel(lvl.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="h_level_emoji mb-2">{lvl.icon}</div>
                  <h5 className="fw-bold">{lvl.label}</h5>
                  <p className="text-muted small mb-0">{lvl.desc}</p>
                  {selectedLevel === lvl.id && <Check className="text-success mt-2" size={18} />}
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* STEP 3 — Daily Goal */}
        {step === 3 && (
          <Row className="justify-content-center g-3">
            {goals.map((goal, i) => (
              <Col xs={6} sm={3} key={i}>
                <div
                  className={`h_goal_card text-center p-3 ${selectedGoal === goal.label ? 'h_goal_selected' : ''}`}
                  onClick={() => { setSelectedGoal(goal.label); setError(''); }}
                >
                  <div className="h_goal_emoji">{goal.icon}</div>
                  <div className="h_goal_name fw-bold">{goal.label}</div>
                  <div className="h_goal_xp text-muted small">{goal.xp} XP / day</div>
                  {selectedGoal === goal.label && <Check className="text-success mt-1" size={18} />}
                </div>
              </Col>
            ))}
          </Row>
        )}

        {/* Navigation */}
        <div className="d-flex justify-content-center gap-3 mt-5">
          {step > 1 && (
            <Button
              variant="outline-secondary"
              className="h_btn_back_step px-4"
              onClick={() => { setStep(s => s - 1); setError(''); }}
            >
              <ArrowLeft className="me-1" size={16} /> Back
            </Button>
          )}
          {step < 3 && (
            <Button
              className="h_btn_get_started fw-bold px-5 py-2"
              onClick={() => {
                if (step === 1 && !selectedLang) { setError('Please select a language.'); return; }
                if (step === 2 && !selectedLevel) { setError('Please select your level.'); return; }
                setError('');
                setStep(s => s + 1);
              }}
            >
              Continue <ArrowRight className="ms-1" size={16} />
            </Button>
          )}
          {step === 3 && (
            <Button
              className="h_btn_get_started fw-bold px-5 py-2"
              onClick={handleFinish}
              disabled={loading || !selectedGoal}
            >
              {loading ? 'Creating account...' : 'Start Learning!'}
            </Button>
          )}
        </div>
      </Container>
    </div>
  );
};

export default LanguageSelect;

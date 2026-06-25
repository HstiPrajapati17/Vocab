import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, ProgressBar, Badge, Spinner } from 'react-bootstrap';
import { Heart, CheckCircle, XCircle, X, Star } from 'lucide-react';
import { useApp } from '../App';
import { getQuestionsByLesson, updateUser, updateLeaderboard } from '../api';

const LessonPage = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const { user, refreshUser } = useApp();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [hearts, setHearts] = useState(user?.hearts ?? 5);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);

  useEffect(() => {
    const id = lessonId || 1;
    getQuestionsByLesson(id)
      .then(data => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [lessonId]);

  const q = questions[current];
  const progress = questions.length > 0 ? Math.round(((current + (answered ? 1 : 0)) / questions.length) * 100) : 0;

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
  };

  const handleCheck = () => {
    if (selected === null) return;
    const correct = selected === q.correct;
    setIsCorrect(correct);
    setAnswered(true);
    setShowFeedback(true);
    if (correct) {
      setScore(s => s + 1);
      setEarnedXP(xp => xp + 10);
    } else {
      setHearts(h => Math.max(0, h - 1));
    }
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelected(null);
    setAnswered(false);
    if (current + 1 >= questions.length) {
      setShowResult(true);
      saveProgress();
    } else {
      setCurrent(c => c + 1);
    }
  };

  const handleSkip = () => {
    if (answered) return;
    handleNext();
  };

  const saveProgress = async () => {
    if (!user?.id) return;
    const passed = score >= Math.ceil(questions.length * 0.6);
    if (!passed) return;

    const completedLessons = user.completedLessons || [];
    if (completedLessons.includes(lessonId)) return;

    const updates = {
      completedLessons: [...completedLessons, lessonId],
      xp: (user.xp || 0) + earnedXP + 10,
      streak: (user.streak || 0) + (user.streak === 0 ? 1 : 0),
      hearts,
      activeLesson: lessonId + 1,
    };

    try {
      const updatedUser = await updateUser(user.id, updates);
      await updateLeaderboard(user.id, updates.xp, updates.streak);
      refreshUser(updatedUser);
    } catch (err) {
      console.error('Failed to save progress:', err);
    }
  };

  const resetLesson = () => {
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setEarnedXP(0);
    setShowResult(false);
    setHearts(5);
    setShowFeedback(false);
  };

  if (loading) {
    return (
      <div className="h_lesson_fullscreen d-flex align-items-center justify-content-center">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="h_lesson_fullscreen d-flex align-items-center justify-content-center">
        <div className="text-center px-3">
          <div style={{ fontSize: '3.5rem' }}>📭</div>
          <h4 className="fw-bold mt-3">No questions yet</h4>
          <Button className="h_btn_get_started mt-3" onClick={() => navigate('dashboard')}>Back to Learn</Button>
        </div>
      </div>
    );
  }

  if (hearts === 0 && !showResult) {
    return (
      <div className="h_lesson_fullscreen d-flex align-items-center justify-content-center">
        <div className="h_out_of_hearts text-center mx-3">
          <div className="h_no_hearts_icon mb-3">💔</div>
          <h3 className="fw-bold mb-2">Out of Hearts!</h3>
          <p className="text-muted mb-4">Try again to keep practicing!</p>
          <Button className="h_btn_get_started me-2 mb-2" onClick={() => navigate('dashboard')}>Back to Learn</Button>
          <Button variant="outline-secondary" className="h_btn_outline mb-2" onClick={resetLesson}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (showResult) {
    const passed = score >= Math.ceil(questions.length * 0.6);
    return (
      <div className="h_lesson_fullscreen d-flex align-items-center justify-content-center">
        <div className="h_result_card text-center mx-3 p-4 p-md-5" style={{ maxWidth: 480, width: '100%' }}>
          <div className="h_result_emoji mb-3">{passed ? '🎉' : '😔'}</div>
          <h2 className="fw-bold mb-1">{passed ? 'Lesson Complete!' : 'Keep Practicing!'}</h2>
          <p className="text-muted mb-4">
            {passed ? "Great job! You've passed this lesson." : 'You need 60% to pass. Try again!'}
          </p>
          <div className="d-flex justify-content-center gap-4 mb-4">
            <div><Star className="h_icon_xp" size={22} /><div className="h_result_value">+{earnedXP}</div><div className="h_result_label">XP</div></div>
            <div><CheckCircle style={{ color: 'var(--success)' }} size={22} /><div className="h_result_value">{score}/{questions.length}</div><div className="h_result_label">Correct</div></div>
            <div><Heart className="h_icon_heart" size={22} /><div className="h_result_value">{hearts}</div><div className="h_result_label">Hearts</div></div>
          </div>
          {passed && <Badge className="h_xp_reward_badge mb-4">+{earnedXP} XP earned</Badge>}
          <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
            <Button className="h_btn_get_started" onClick={() => navigate('dashboard')}>Continue</Button>
            {!passed && <Button variant="outline-secondary" className="h_btn_outline" onClick={resetLesson}>Try Again</Button>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h_lesson_fullscreen">
      {/* Top bar */}
      <div className="h_lesson_topbar">
        <button type="button" className="h_lesson_close" onClick={() => navigate('dashboard')} aria-label="Close">
          <X size={24} />
        </button>
        <ProgressBar now={progress} className="h_lesson_progress flex-grow-1" />
        <div className="h_hearts_row d-flex">
          {Array(5).fill(0).map((_, i) => (
            <Heart key={i} size={20} className={i < hearts ? 'h_icon_heart' : 'h_icon_heart_empty'} />
          ))}
        </div>
      </div>

      {/* Question area */}
      <div className="h_lesson_body">
        <div className="h_lesson_content">
          <p className="h_lesson_type_label text-capitalize">{q.type.replace('-', ' ')}</p>
          <h2 className="h_question_text">{q.question}</h2>
          <div className="h_options_grid mt-4">
            {q.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                className={`h_option_btn
                  ${selected === i ? 'h_option_selected' : ''}
                  ${answered && i === q.correct ? 'h_option_correct' : ''}
                  ${answered && selected === i && i !== q.correct ? 'h_option_wrong' : ''}`}
                onClick={() => handleSelect(i)}
                disabled={answered}
              >
                <span className="h_option_letter">{i + 1}</span>
                <span className="flex-grow-1">{opt}</span>
                {answered && i === q.correct && <CheckCircle size={20} style={{ color: 'var(--success)' }} />}
                {answered && selected === i && i !== q.correct && <XCircle size={20} style={{ color: 'var(--danger)' }} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div className={`h_lesson_footer ${showFeedback ? (isCorrect ? 'h_lesson_footer_correct' : 'h_lesson_footer_wrong') : ''}`}>
        {showFeedback ? (
          <div className="h_lesson_footer_inner">
            <div className="h_lesson_feedback_text">
              {isCorrect ? (
                <><CheckCircle size={22} /> <strong>Nice!</strong></>
              ) : (
                <>
                  <XCircle size={22} />
                  <div>
                    <strong>Correct solution:</strong>
                    <div>{q.options[q.correct]}</div>
                  </div>
                </>
              )}
            </div>
            <Button className="h_lesson_continue_btn" onClick={handleNext}>
              {current + 1 >= questions.length ? 'Continue' : 'Continue'}
            </Button>
          </div>
        ) : (
          <div className="h_lesson_footer_inner">
            <button type="button" className="h_lesson_skip_btn" onClick={handleSkip}>SKIP</button>
            <Button
              className={`h_lesson_check_btn ${selected === null ? 'h_btn_disabled' : ''}`}
              onClick={handleCheck}
              disabled={selected === null}
            >
              CHECK
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonPage;

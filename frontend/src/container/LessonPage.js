import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, ProgressBar, Spinner } from 'react-bootstrap';
import { Heart, CheckCircle, XCircle, X, RefreshCw, Volume2, Mic, Square } from 'lucide-react';

import { getQuestionsByLesson, recordLessonCompletion, updateUser, verifyUserSpeaking } from '../api';
import { useApp } from '../App';
// import '../style/lesson_image_styles.css';

const LessonPage = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const { user, refreshUser, consumeHeart, showToast } = useApp();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingProgress, setSavingProgress] = useState(false);
  const [progressSaved, setProgressSaved] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [hearts, setHearts] = useState(user?.hearts ?? 5);
  const [score, setScore] = useState(0);
  const scoreRef = React.useRef(0);
  const [showResult, setShowResult] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [verifyingSpeech, setVerifyingSpeech] = useState(false);
  const [speechResult, setSpeechResult] = useState(null);
  const [showMicrophoneHelp, setShowMicrophoneHelp] = useState(false);
  const recorderRef = React.useRef(null);
  const audioChunksRef = React.useRef([]);

  useEffect(() => () => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
  }, []);

  useEffect(() => {
    if (typeof user?.hearts === 'number' && !showResult) {
      setHearts(user.hearts);
    }
  }, [user?.hearts, showResult]);

  useEffect(() => {
    let active = true;
    setQuestions([]);
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    scoreRef.current = 0;
    setShowResult(false);
    setProgressSaved(false);
    setRecordedAudio(null);
    setSpeechResult(null);
    setLoading(true);
    getQuestionsByLesson(lessonId)
      .then((questionData) => {
        if (!active) return;
        setQuestions(questionData);
      })
      .catch(err => {
        console.error('Error fetching questions:', err);
        if (active) showToast('Could not load this lesson. Please try again.', 'error');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [lessonId, showToast]);

  const q = questions[current];

  const progress = questions.length > 0 ? Math.round(((current + (answered ? 1 : 0)) / questions.length) * 100) : 0;

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
  };

  const handleCheck = () => {
    if (selected === null) return;
    if (!Number.isInteger(q.correct) || q.correct < 0 || q.correct >= q.options.length) {
      showToast('This question is missing a valid correct answer. Please try again later.', 'error');
      return;
    }
    const correct = selected === q.correct;
    setIsCorrect(correct);
    setAnswered(true);
    setShowFeedback(true);
    if (correct) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
    } else {
      const lost = consumeHeart();
      const remainingHearts = Math.max(0, hearts - (lost ? 1 : 0));
      setHearts(remainingHearts);
      if (lost && user?.id) {
        updateUser(user.id, { hearts: remainingHearts })
          .then(refreshUser)
          .catch((error) => {
            console.error('Could not save remaining hearts:', error);
            showToast('Could not save your heart balance. Please check your connection.', 'error');
          });
      }
    }
  };

  const saveProgress = async (finalScore, forceComplete = false) => {
    if (!user?.id) {
      showToast('Please sign in again to save lesson progress.', 'error');
      return false;
    }
    const passed = forceComplete || finalScore >= Math.ceil(questions.length * 0.6);
    if (!passed) {
      try {
        const attemptUpdates = { hearts, lastActive: new Date().toISOString() };
        const updatedUser = await updateUser(user.id, attemptUpdates);
        refreshUser(updatedUser);
      } catch (error) {
        console.error('Could not save lesson attempt:', error);
      }
      return false;
    }

    try {
      const totalScore = questions.length ? Math.round((finalScore / questions.length) * 100) : 0;
      const updatedUser = await recordLessonCompletion(user.id, {
        lessonId,
        score: totalScore,
        hearts,
        language: user.onboarding?.languageToLearn || user.language,
      });
      // refreshUser is now synchronous — applies PATCH response directly to state
      refreshUser(updatedUser);
      return true;
    } catch (err) {
      console.error('Failed to save progress:', err);
      showToast('Could not save lesson progress. Please retry before continuing.', 'error');
      return false;
    }
  };

  const handleNext = async () => {
    setShowFeedback(false);
    setSelected(null);
    setAnswered(false);
    setRecordedAudio(null);
    setSpeechResult(null);
    if (current + 1 >= questions.length) {
      setShowResult(true);
      setSavingProgress(true);
      const saved = await saveProgress(scoreRef.current);
      setProgressSaved(saved);
      setSavingProgress(false);
    } else {
      setCurrent(c => c + 1);
    }
  };

  const continueAfterLesson = async () => {
    const passed = score >= Math.ceil(questions.length * 0.6);
    if (passed && !progressSaved) {
      setSavingProgress(true);
      const saved = await saveProgress(scoreRef.current);
      setProgressSaved(saved);
      setSavingProgress(false);
      if (!saved) return;
    }
    navigate('/dashboard');
  };

  const handleSkip = () => {
    if (answered) return;
    if (q?.type === 'speaking') {
      scoreRef.current = questions.length;
      setScore(questions.length);
      setSavingProgress(true);
      saveProgress(questions.length, true).then((saved) => {
        setProgressSaved(saved);
        setShowResult(true);
      }).finally(() => setSavingProgress(false));
      return;
    }
    handleNext();
  };

  const playQuestionAudio = () => {
    if (q?.audio) {
      const audio = new Audio(q.audio);
      audio.play().catch(() => showToast('Could not play the audio. Please try again.', 'error'));
      return;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(q?.question || '');
      utterance.lang = user?.onboarding?.languageToLearn || user?.language || 'en';
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleRecording = async () => {
    if (isRecording && recorderRef.current) {
      recorderRef.current.stop();
      setIsRecording(false);
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      showToast('Audio recording is not supported by this browser.', 'error');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size) audioChunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        setRecordedAudio(new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' }));
        stream.getTracks().forEach((track) => track.stop());
        recorderRef.current = null;
      };
      recorderRef.current = recorder;
      recorder.start();
      setRecordedAudio(null);
      setIsRecording(true);
    } catch (error) {
      console.error('Could not access microphone:', error);
      setShowMicrophoneHelp(true);
    }
  };

  const handleCheckSpeaking = async () => {
    if (!recordedAudio || !q?._id) return;
    setVerifyingSpeech(true);
    try {
      const result = await verifyUserSpeaking(q._id, recordedAudio);
      setSpeechResult(result);
      setIsCorrect(Boolean(result?.isCorrect));
      setAnswered(true);
      setShowFeedback(true);
      if (result?.isCorrect) {
        scoreRef.current += 1;
        setScore(scoreRef.current);
      } else {
        const lost = consumeHeart();
        const remainingHearts = Math.max(0, hearts - (lost ? 1 : 0));
        setHearts(remainingHearts);
        if (lost && user?.id) updateUser(user.id, { hearts: remainingHearts }).then(refreshUser).catch(() => {});
      }
    } catch (error) {
      showToast(error.message || 'Could not check your speech. Please try again.', 'error');
    } finally {
      setVerifyingSpeech(false);
    }
  };

  const resetLesson = () => {
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    scoreRef.current = 0;
    setShowResult(false);
    setProgressSaved(false);
    setHearts(user?.hearts ?? 5);
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
          <div className="h_no_questions_icon mb-3">
            <XCircle size={64} style={{ color: 'var(--muted)' }} />
          </div>
          <h4 className="fw-bold mt-3">No questions yet</h4>
          <Button className="h_btn_get_started mt-3" onClick={() => navigate('/dashboard')}>Back to Learn</Button>
        </div>
      </div>
    );
  }

  // Safety check: if current question doesn't exist, reset to first question
  if (!q && questions.length > 0) {
    setCurrent(0);
  }

  if (hearts === 0 && !showResult) {
    return (
      <div className="h_lesson_fullscreen d-flex align-items-center justify-content-center">
        <div className="h_out_of_hearts text-center mx-3">
          <div className="h_no_hearts_icon mb-3">
            <Heart size={64} style={{ color: 'var(--danger)' }} />
          </div>
          <h3 className="fw-bold mb-2">Out of Hearts!</h3>
          <p className="text-muted mb-4">Your hearts will refill to 5 after one minute.</p>
          <Button className="h_btn_get_started me-2 mb-2" onClick={() => navigate('/dashboard')}>Back to Learn</Button>
        </div>
      </div>
    );
  }

  if (showResult) {
    const passed = score >= Math.ceil(questions.length * 0.6);
    const accuracy = Math.round((score / questions.length) * 100);
    return (
      <div className='container'>
      <div className="lp_result_overlay">
        {/* top close */}
        {/* <button className="lp_result_close" onClick={() => navigate('/dashboard')} aria-label="Close">
          <X size={22} />
        </button> */}

        <div className="lp_result_body">
          {/* mascot / animation */}
          <div className="lp_result_mascot">
            {passed ? (
              <video
                src={`${process.env.PUBLIC_URL}/assets/w2.mp4`}
                autoPlay
                loop
                muted
                playsInline
                className="lp_result_video"
              />
            ) : (
              <div className="lp_result_fail_icon">
                <RefreshCw size={64} />
              </div>
            )}
          </div>

          {/* headline */}
          <h1 className="lp_result_title">
            {passed ? 'Lesson Complete!' : 'Keep Practicing!'}
          </h1>
          <p className="lp_result_sub">
            {passed
              ? `You completed ${questions.length} questions in this lesson`
              : 'You need 60% to pass. Give it another try!'}
          </p>

          {/* stat pills */}
          <div className="lp_result_stats">
            <div className={`lp_stat_pill ${accuracy >= 60 ? 'lp_stat_great' : 'lp_stat_ok'}`}>
              <span className="lp_stat_pill_label">{accuracy >= 80 ? 'GREAT!' : accuracy >= 60 ? 'GOOD' : 'KEEP TRYING'}</span>
              <span className="lp_stat_pill_val">
                <CheckCircle size={15} /> {accuracy}%
              </span>
            </div>
            <div className="lp_stat_pill lp_stat_hearts">
              <span className="lp_stat_pill_label">HEARTS</span>
              <span className="lp_stat_pill_val">
                <Heart size={15} /> {hearts}
              </span>
            </div>
          </div>
        </div>

        {/* bottom action bar */}
        <div className="lp_result_footer">
          <button className="hlp2_feedback_btn" onClick={resetLesson}>
            {passed ? 'Review Lesson' : 'Try Again'}
          </button>
          <button
            className=" hlp2_feedback_btn"
            onClick={continueAfterLesson}
            disabled={savingProgress}
          >
            {savingProgress
              ? 'Saving…'
              : passed && !progressSaved
                ? 'Retry Save'
                : 'Back to Lessons'}
          </button>
        </div>
      </div>
      </div>
    );
  }

  return (
    <div className={`h_lesson_fullscreen ${q.type === 'speaking' ? 'h_lesson_speaking' : ''}`}>
      {/* Top bar */}
      <div className="h_lesson_topbar">
        <button type="button" className="h_lesson_close" onClick={() => navigate('/dashboard')} aria-label="Close">
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
          <p className="h_lesson_type_label text-capitalize">{q.type === 'speaking' ? 'Speak this sentence' : q.type.replace('-', ' ')}</p>
          <div className='d-flex align-items-center'>
          {/* SVG Image Display */}
          {q.image && (
            <div className="h_question_image_container">
              <img 
                src={/^(https?:|data:|\/)/i.test(q.image) ? q.image : `${process.env.PUBLIC_URL}/assets/${q.image}`}
                alt="Question illustration" 
                className="h_question_image"
              />
            </div>
          )}
          
          {q.type !== 'speaking' && <h2 className="h_question_text">{q.question}</h2>}
          </div>
          {q.type === 'speaking' ? (
            <div className="h_speaking_task mt-4">
              <div className="h_speaking_sentence">
                <button type="button" className="h_speaking_audio_btn" onClick={playQuestionAudio} aria-label="Play sentence audio">
                  <Volume2 size={22} />
                </button>
                <span>{q.question}</span>
              </div>
              <button type="button" className={`h_speaking_record_btn ${isRecording ? 'h_speaking_recording' : ''}`} onClick={toggleRecording} disabled={answered || verifyingSpeech}>
                {isRecording ? <Square size={20} /> : <Mic size={20} />}
                {isRecording ? 'STOP RECORDING' : recordedAudio ? 'RECORD AGAIN' : 'CLICK TO SPEAK'}
              </button>
              {speechResult?.transcribedText && <p className="h_speaking_transcript">You said: {speechResult.transcribedText}</p>}
            </div>
          ) : <div className="h_options_grid mt-4">
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
          </div>}
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
                    <div>{q.type === 'speaking' ? (speechResult?.targetText || q.question) : (q.options[q.correct] || q.rightAnswer || 'Correct answer is not available.')}</div>
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
            {q.type === 'speaking' ? (
              <button type="button" className="h_speaking_skip_btn" onClick={handleSkip} disabled={savingProgress || verifyingSpeech}>
                {savingProgress ? 'Saving…' : "Can't speak now"}
              </button>
            ) : <button type="button" className="h_lesson_skip_btn" onClick={handleSkip}>SKIP</button>}
            {q.type === 'speaking' ? <button
              className={`h_lesson_check_btn ${!recordedAudio || verifyingSpeech ? 'h_btn_disabled' : ''}`}
              onClick={handleCheckSpeaking}
              disabled={!recordedAudio || verifyingSpeech}
            >{verifyingSpeech ? 'CHECKING…' : 'CHECK'}</button> : <button
              className={`h_lesson_check_btn ${selected === null || !Number.isInteger(q.correct) || q.correct < 0 ? 'h_btn_disabled' : ''}`}
              onClick={handleCheck}
              disabled={selected === null || !Number.isInteger(q.correct) || q.correct < 0}
            >
              CHECK
            </button>}
          </div>
        )}
      </div>
      {showMicrophoneHelp && (
        <div className="h_microphone_modal_backdrop" role="presentation" onClick={() => setShowMicrophoneHelp(false)}>
          <section className="h_microphone_modal" role="dialog" aria-modal="true" aria-labelledby="h_microphone_modal_title" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="h_microphone_modal_close" onClick={() => setShowMicrophoneHelp(false)} aria-label="Close microphone help">
              <X size={22} />
            </button>
            <h2 id="h_microphone_modal_title">Microphone not authorized!</h2>
            <p>To practice your speaking skills, please allow microphone access for this site. You can change this in your browser’s site settings, then click “Click to speak” again.</p>
          </section>
        </div>
      )}
    </div>
  );
};
export default LessonPage;

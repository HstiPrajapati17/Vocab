import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Globe, Star, Flame, Trophy, ArrowRight, BookOpen, Users, Zap } from 'lucide-react';

const languages = [
  { flag: '🇪🇸', name: 'Spanish', learners: '32M', native: 'Español' },
  { flag: '🇫🇷', name: 'French', learners: '18M', native: 'Français' },
  { flag: '🇩🇪', name: 'German', learners: '12M', native: 'Deutsch' },
  { flag: '🇯🇵', name: 'Japanese', learners: '15M', native: '日本語' },
  { flag: '🇮🇳', name: 'Hindi', learners: '9M', native: 'हिन्दी' },
  { flag: '🇵🇹', name: 'Portuguese', learners: '11M', native: 'Português' },
  { flag: '🇮🇹', name: 'Italian', learners: '8M', native: 'Italiano' },
  { flag: '🇰🇷', name: 'Korean', learners: '10M', native: '한국어' },
];

const features = [
  {
    icon: <Star size={26} />,
    title: 'Earn XP & Rewards',
    desc: 'Complete lessons to earn experience points, unlock achievements and climb the leaderboard.',
  },
  {
    icon: <Flame size={26} />,
    title: 'Daily Streaks',
    desc: 'Build a habit by maintaining your daily learning streak. Miss a day and it resets!',
  },
  {
    icon: <Trophy size={26} />,
    title: 'Compete & Win',
    desc: 'Join weekly leagues, compete with friends and earn top ranks on the global leaderboard.',
  },
  {
    icon: <Globe size={26} />,
    title: '30+ Languages',
    desc: 'Choose from a wide variety of languages with structured paths from beginner to advanced.',
  },
];

const steps = [
  'Create your free account',
  'Pick a language you want to learn',
  'Set your daily goal',
  'Complete bite-sized lessons',
  'Track your progress and earn rewards',
];

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="h_home_page">
      {/* Hero */}
      <section className="h_hero_section">
        <Container style={{ maxWidth: 'var(--container-wide)' }}>
          <Row className="align-items-center g-5">
            <Col lg={6} className="h_hero_text order-lg-1 order-2 text-center text-lg-start">
              <div className="h_courses_label">
                <BookOpen size={16} /> Free language learning
              </div>
              <h1 className="h_hero_title">
                Learn a language <span className="h_highlight">for free</span>
              </h1>
              <p className="h_hero_subtitle mx-auto mx-lg-0">
                The effective, bite-sized way to learn a new language. Join millions of learners and start your journey today.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                <Button
                  size="lg"
                  className="h_btn_get_started"
                  onClick={() => navigate('/signup')}
                >
                  Get Started — It's Free
                </Button>
                <Button
                  size="lg"
                  variant="outline-secondary"
                  className="h_btn_login_hero"
                  onClick={() => navigate('/login')}
                >
                  I Have an Account
                </Button>
              </div>
            </Col>
            <Col lg={6} className="h_hero_visual order-lg-2 order-1">
              <div className="h_hero_card_stack">
                <div className="h_hero_preview_card">
                  <div className="h_preview_header">
                    <span className="fw-bold" style={{ color: 'var(--text)' }}>My Courses</span>
                    <span className="h_preview_badge">3 active</span>
                  </div>
                  <div className="h_preview_progress">
                    <div className="h_preview_progress_fill" style={{ width: '68%' }} />
                  </div>
                  <small className="text-muted d-block mb-3">Daily goal: 68 / 100 XP</small>
                  {languages.slice(0, 3).map((lang) => (
                    <div className="h_preview_lang_row" key={lang.name}>
                      <span className="h_preview_flag">{lang.flag}</span>
                      <div>
                        <div className="h_preview_lang_name">{lang.name}</div>
                        <div className="h_preview_lang_meta">{lang.learners} learners</div>
                      </div>
                      <Zap size={18} style={{ color: 'var(--primary)', marginLeft: 'auto' }} />
                    </div>
                  ))}
                </div>
                <div className="h_hero_preview_card" aria-hidden="true" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats */}
      <section className="h_stats_banner">
        <Container style={{ maxWidth: 'var(--container-wide)' }}>
          <Row className="text-center g-3">
            {[
              { value: '500M+', label: 'Learners' },
              { value: '30+', label: 'Languages' },
              { value: '100M', label: 'Lessons Daily' },
              { value: '#1', label: 'Education App' },
            ].map((stat, i) => (
              <Col xs={6} md={3} key={i}>
                <div className="h_stat_box">
                  <div className="h_stat_number">{stat.value}</div>
                  <div className="h_stat_label">{stat.label}</div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Courses Grid — Duolingo-style */}
      <section className="h_section_alt" id="courses">
        <Container style={{ maxWidth: 'var(--container-wide)' }}>
          <div className="text-center mb-5">
            <div className="h_courses_label mx-auto">
              <Globe size={16} /> Language courses
            </div>
            <h2 className="h_section_title mb-2">I want to learn...</h2>
            <p className="h_section_sub mb-0">Choose a language and start learning for free</p>
          </div>
          <Row className="g-3 g-md-4 justify-content-center">
            {languages.map((lang, i) => (
              <Col xs={6} sm={4} md={3} lg={3} xl={2} key={i}>
                <Card className="h_lang_card" onClick={() => navigate('/signup')}>
                  <div className="h_lang_card_top">
                    <span className="h_lang_flag">{lang.flag}</span>
                    <div className="h_lang_name">{lang.name}</div>
                    <div className="h_lang_native">{lang.native}</div>
                  </div>
                  <div className="h_lang_card_body">
                    <span className="h_lang_learners mb-0">
                      <Users size={12} className="me-1" style={{ verticalAlign: '-2px' }} />
                      {lang.learners}
                    </span>
                    <span className="h_lang_cta">Start <ArrowRight size={14} /></span>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-5">
            <Button variant="outline-secondary" className="h_btn_more_langs px-4 py-2" onClick={() => navigate('/signup')}>
              View All Languages <ArrowRight className="ms-1" size={16} />
            </Button>
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="h_features_section py-5">
        <Container style={{ maxWidth: 'var(--container-wide)' }}>
          <h2 className="h_section_title text-center mb-2">Why VocabLearn?</h2>
          <p className="h_section_sub text-center mb-5">Science-backed methods in a clean, focused experience</p>
          <Row className="g-4">
            {features.map((f, i) => (
              <Col xs={12} sm={6} lg={3} key={i}>
                <Card className="h_feature_card h-100 border-0">
                  <Card.Body className="p-4 text-center">
                    <div className="h_feature_icon mb-3">{f.icon}</div>
                    <h5 className="h_feature_title">{f.title}</h5>
                    <p className="h_feature_desc mb-0">{f.desc}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* How It Works */}
      <section className="h_how_section py-5">
        <Container style={{ maxWidth: 'var(--container-wide)' }}>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <h2 className="h_section_title mb-4">How It Works</h2>
              <div className="h_steps_list">
                {steps.map((step, i) => (
                  <div className="h_step_item d-flex align-items-start gap-3 mb-3" key={i}>
                    <div className="h_step_number">{i + 1}</div>
                    <div className="h_step_text">{step}</div>
                  </div>
                ))}
              </div>
              <Button className="h_btn_get_started mt-4 px-4 py-2" size="lg" onClick={() => navigate('/signup')}>
                Start Learning Now <ArrowRight className="ms-1" size={16} />
              </Button>
            </Col>
            <Col lg={6} className="text-center">
              <div className="h_mockup_phone">
                <div className="h_mockup_screen">
                  <div className="h_mockup_header">Daily Goal</div>
                  <div className="h_mockup_progress mb-1">
                    <div className="h_mockup_bar">
                      <div className="h_mockup_fill" style={{ width: '65%' }} />
                    </div>
                    <span className="h_mockup_xp">65 / 100 XP</span>
                  </div>
                  <div className="h_mockup_lesson_card">
                    <span>🔤</span>
                    <span>Vocabulary</span>
                    <span className="h_mockup_badge">+10 XP</span>
                  </div>
                  <div className="h_mockup_lesson_card">
                    <span>🎧</span>
                    <span>Listening</span>
                    <span className="h_mockup_badge">+15 XP</span>
                  </div>
                  <div className="h_mockup_streak">
                    <Flame className="h_icon_fire" size={18} style={{ verticalAlign: '-3px' }} /> 7 day streak!
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA */}
      <section className="h_cta_section text-center">
        <Container style={{ maxWidth: 'var(--container-wide)' }}>
          <h2 className="h_cta_title">Start your journey today</h2>
          <p className="h_cta_sub">Free forever. No credit card required.</p>
          <Button size="lg" className="h_btn_get_started px-5 py-2" onClick={() => navigate('/signup')}>
            Get Started for Free
          </Button>
        </Container>
      </section>

      {/* Footer */}
      <footer className="h_footer">
        <Container style={{ maxWidth: 'var(--container-wide)' }}>
          <Row className="align-items-center">
            <Col xs={12} md={6} className="text-center text-md-start mb-2 mb-md-0">
              <span className="h_footer_brand">VocabLearn</span>
              <span className="h_footer_copy ms-2">© 2025 All rights reserved</span>
            </Col>
            <Col xs={12} md={6} className="text-center text-md-end">
              <span className="h_footer_link me-3">About</span>
              <span className="h_footer_link me-3">Privacy</span>
              <span className="h_footer_link">Terms</span>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default Home;

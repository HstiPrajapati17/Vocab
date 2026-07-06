import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Globe, Users, Target, Rocket, Heart, Award, ArrowRight, Star, Zap, Lightbulb, Shield, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../style/info_pages.css';

const AboutUs = () => {
  const navigate = useNavigate();

  const stats = [
    { value: '500M+', label: 'Learners', icon: <Globe size={24} /> },
    { value: '30+',   label: 'Languages', icon: <Users size={24} /> },
    { value: '4.9',   label: 'App Rating', icon: <Star size={24} /> },
    { value: '100M',  label: 'Lessons',   icon: <Zap size={24} /> },
  ];

  const team = [
    { name: 'Sarah Johnson',  role: 'CEO & Founder',    image: '👩‍💼' },
    { name: 'Michael Chen',   role: 'CTO',               image: '👨‍💻' },
    { name: 'Emma Williams',  role: 'Head of Content',   image: '👩‍🏫' },
    { name: 'David Park',     role: 'Lead Developer',    image: '👨‍🔬' },
  ];

  const features = [
    { icon: <Lightbulb size={28} />, title: 'AI-Powered Learning',  desc: 'Personalized lessons that adapt to your progress and learning style.' },
    { icon: <Shield size={28} />,    title: 'Certified Content',    desc: 'Industry-recognized curriculum to validate your language skills.' },
    { icon: <MessageCircle size={28} />, title: 'Community Support', desc: 'Connect with native speakers and fellow learners for practice.' },
  ];

  return (
    <div className="about-page-unique">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="about-hero-unique">
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={7}>
              <div className="hero-content-unique">
                <div className="hero-badge-unique">
                  <Globe size={16} /> About VocabLearn
                </div>
                <h1 className="hero-title-unique">
                  Making language learning{' '}
                  <span className="highlight">accessible</span> to everyone
                </h1>
                <p className="hero-desc-unique">
                  We're on a mission to break down language barriers and connect
                  people across the globe through innovative, personalized education.
                </p>
                <div className="hero-buttons-unique">
                  <Button className="btn-primary-unique" onClick={() => navigate('/signup')}>
                    Start Learning <ArrowRight size={16} className="ms-1" />
                  </Button>
                  <Button className="btn-secondary-unique" onClick={() => navigate('/help')}>
                    Learn More
                  </Button>
                </div>
              </div>
            </Col>
            <Col lg={5} className="d-none d-lg-flex justify-content-center">
              <div className="d-flex flex-column gap-3" style={{ width: '100%', maxWidth: 320 }}>
                {[
                  { icon: <Target size={28} />, label: 'Our Mission' },
                  { icon: <Rocket size={28} />, label: 'Our Vision' },
                  { icon: <Heart size={28} />,  label: 'Our Passion' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="d-flex align-items-center gap-3"
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '14px 20px',
                      backdropFilter: 'blur(8px)',
                      color: 'var(--text-light)',
                      fontWeight: 700,
                      fontSize: '1rem',
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── Stats ───────────────────────────────────────── */}
      <section className="stats-banner-unique">
        <Container>
          <Row className="g-3">
            {stats.map((s, i) => (
              <Col xs={6} md={3} key={i}>
                <div className="stat-item-unique">
                  <div className="stat-icon-unique">{s.icon}</div>
                  <div className="stat-value-unique">{s.value}</div>
                  <div className="stat-label-unique">{s.label}</div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── Story ───────────────────────────────────────── */}
      <section className="story-section-unique">
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={6}>
              <div className="story-content-unique">
                <h2 className="section-title-unique">Our Story</h2>
                <p className="story-text-unique">
                  VocabLearn was founded in 2024 with a simple idea: language learning
                  should be accessible, enjoyable, and effective for everyone.
                </p>
                <p className="story-text-unique">
                  Our founders experienced the frustrations of traditional methods
                  first-hand, so they built a platform that adapts to each learner
                  with personalized, results-driven education.
                </p>
                <p className="story-text-unique">
                  Today we serve over 500 million learners in 30+ languages and keep
                  pushing the boundaries of what's possible.
                </p>
              </div>
            </Col>
            <Col lg={6}>
              <div className="story-visual-unique">
                <div className="story-timeline">
                  {[
                    { year: '2024', desc: 'Founded' },
                    { year: '2024', desc: '1M Users' },
                    { year: '2025', desc: '30 Languages' },
                    { year: '2025', desc: '500M Learners' },
                  ].map((t, i) => (
                    <React.Fragment key={i}>
                      <div className="timeline-point">
                        <div className="timeline-year">{t.year}</div>
                        <div className="timeline-desc">{t.desc}</div>
                      </div>
                      {i < 3 && <div className="timeline-line" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── Features ────────────────────────────────────── */}
      <section className="features-section-unique">
        <Container>
          <div className="section-header-unique">
            <h2 className="section-title-unique">What Makes Us Different</h2>
            <p className="section-subtitle-unique">Innovative features designed for your success</p>
          </div>
          <Row className="g-4">
            {features.map((f, i) => (
              <Col md={4} key={i}>
                <div className="feature-card-unique">
                  <div className="feature-icon-circle">{f.icon}</div>
                  <h3 className="feature-title-unique">{f.title}</h3>
                  <p className="feature-desc-unique">{f.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── Team ────────────────────────────────────────── */}
      <section className="team-section-unique">
        <Container>
          <div className="section-header-unique">
            <h2 className="section-title-unique">Meet Our Team</h2>
            <p className="section-subtitle-unique">The passionate people behind VocabLearn</p>
          </div>
          <Row className="g-3 justify-content-center">
            {team.map((m, i) => (
              <Col xs={6} sm={4} md={3} key={i}>
                <div className="team-card-unique">
                  <div className="team-avatar">{m.image}</div>
                  <h3 className="team-name">{m.name}</h3>
                  <p className="team-role">{m.role}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="cta-section-unique">
        <Container>
          <div className="cta-content-unique">
            <Award size={48} />
            <h2 className="cta-title-unique">Ready to Start Your Journey?</h2>
            <p className="cta-desc-unique">
              Join millions of learners and unlock new opportunities through language mastery.
            </p>
            <Button className="btn-primary-unique" onClick={() => navigate('/signup')}>
              Get Started Free <ArrowRight size={16} className="ms-1" />
            </Button>
          </div>
        </Container>
      </section>

    </div>
  );
};

export default AboutUs;

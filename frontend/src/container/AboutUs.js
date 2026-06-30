import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Globe, Users, Target, Rocket, Heart, Award, ArrowRight, Star, Zap, Lightbulb, Shield, MessageCircle, icons } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../style/info_pages.css';

const AboutUs = () => {
  const navigate = useNavigate();

  const stats = [
    { value: '500M+', label: 'Learners Worldwide', icon: <Globe size={32} /> },
    { value: '30+', label: 'Languages', icon: <Users size={32} /> },
    { value: '4.9', label: 'App Rating', icon: <Star size={32} /> },
    { value: '100M', label: 'Lessons', icon: <Zap size={32} /> }
  ];

  const team = [
    { name: 'Sarah Johnson', role: 'CEO & Founder', image: '👩‍💼' },
    { name: 'Michael Chen', role: 'CTO', image: '👨‍💻' },
    { name: 'Emma Williams', role: 'Head of Content', image: '�‍🏫' },
    { name: 'David Park', role: 'Lead Developer', image: '👨‍🔬' },
  ];

  return (
    <div className="about-page-unique">
      {/* Hero Section */}
      <section className="about-hero-unique">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <div className="hero-content-unique">
                <div className="hero-badge-unique">
                  <Globe size={20} /> About VocabLearn
                </div>
                <h1 className="hero-title-unique">
                  Making language learning <span className="highlight">accessible</span> to everyone
                </h1>
                <p className="hero-desc-unique">
                  We're on a mission to break down language barriers and connect people across the globe through innovative, personalized language education.
                </p>
                <div className="hero-buttons-unique">
                  <Button className="btn-primary-unique" onClick={() => navigate('/signup')}>
                    Start Learning <ArrowRight className="ms-2" size={18} />
                  </Button>
                  <Button className="btn-secondary-unique" onClick={() => navigate('/help')}>
                    Learn More
                  </Button>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="hero-visual-unique">
                <div className="floating-card card-1">
                  <Target size={48} />
                  <span>Our Mission</span>
                </div>
                <div className="floating-card card-2">
                  <Rocket size={48} />
                  <span>Our Vision</span>
                </div>
                <div className="floating-card card-3">
                  <Heart size={48} />
                  <span>Our Passion</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Banner */}
      <section className="stats-banner-unique">
        <Container>
          <Row>
            {stats.map((stat, i) => (
              <Col xs={6} md={3} key={i}>
                <div className="stat-item-unique">
                  <div className="stat-icon-unique">{stat.icon}</div>
                  <div className="stat-value-unique">{stat.value}</div>
                  <div className="stat-label-unique">{stat.label}</div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Story Section */}
      <section className="story-section-unique">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <div className="story-content-unique">
                <h2 className="section-title-unique">Our Story</h2>
                <p className="story-text-unique">
                  VocabLearn was founded in 2024 with a simple yet powerful idea: language learning should be accessible, enjoyable, and effective for everyone, regardless of their background or budget.
                </p>
                <p className="story-text-unique">
                  Our founders, having experienced the challenges of traditional language learning methods, set out to create a platform that leverages technology to provide personalized, engaging, and results-driven language education.
                </p>
                <p className="story-text-unique">
                  Today, we're proud to serve over 500 million learners worldwide, offering courses in 30+ languages and continuously innovating to make language learning more effective and enjoyable.
                </p>
              </div>
            </Col>
            <Col lg={6}>
              <div className="story-visual-unique">
                <div className="story-timeline">
                  <div className="timeline-point">
                    <div className="timeline-year">2024</div>
                    <div className="timeline-desc">Founded</div>
                  </div>
                  <div className="timeline-line"></div>
                  <div className="timeline-point">
                    <div className="timeline-year">2024</div>
                    <div className="timeline-desc">1M Users</div>
                  </div>
                  <div className="timeline-line"></div>
                  <div className="timeline-point">
                    <div className="timeline-year">2025</div>
                    <div className="timeline-desc">30 Languages</div>
                  </div>
                  <div className="timeline-line"></div>
                  <div className="timeline-point">
                    <div className="timeline-year">2025</div>
                    <div className="timeline-desc">500M Learners</div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Grid */}
      <section className="features-section-unique">
        <Container>
          <div className="section-header-unique">
            <h2 className="section-title-unique">What Makes Us Different</h2>
            <p className="section-subtitle-unique">Innovative features designed for your success</p>
          </div>
          <Row className="g-4">
            <Col md={6} lg={4}>
              <div className="feature-card-unique">
                <div className="feature-icon-circle">
                  <Lightbulb size={40} />
                </div>
                <h3 className="feature-title-unique">AI-Powered Learning</h3>
                <p className="feature-desc-unique">Personalized lessons that adapt to your progress and learning style for optimal results.</p>
              </div>
            </Col>
            <Col md={6} lg={4}>
              <div className="feature-card-unique">
                <div className="feature-icon-circle">
                  <Shield size={40} />
                </div>
                <h3 className="feature-title-unique">Certified Content</h3>
                <p className="feature-desc-unique">Industry-recognized curriculum and assessments to validate your language skills.</p>
              </div>
            </Col>
            <Col md={6} lg={4}>
              <div className="feature-card-unique">
                <div className="feature-icon-circle">
                  <MessageCircle size={40} />
                </div>
                <h3 className="feature-title-unique">Community Support</h3>
                <p className="feature-desc-unique">Connect with native speakers and fellow learners for practice and support.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Team Section */}
      <section className="team-section-unique">
        <Container>
          <div className="section-header-unique">
            <h2 className="section-title-unique">Meet Our Team</h2>
            <p className="section-subtitle-unique">The passionate people behind VocabLearn</p>
          </div>
          <Row className="g-4">
            {team.map((member, i) => (
              <Col xs={6} md={3} key={i}>
                <div className="team-card-unique">
                  <div className="team-avatar">{member.image}</div>
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section-unique">
        <Container>
          <div className="cta-content-unique">
            <Award size={64} />
            <h2 className="cta-title-unique">Ready to Start Your Journey?</h2>
            <p className="cta-desc-unique">Join millions of learners and unlock new opportunities through language mastery.</p>
            <Button className="btn-primary-unique btn-lg" onClick={() => navigate('/signup')}>
              Get Started Free <ArrowRight className="ms-2" size={18} />
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default AboutUs;

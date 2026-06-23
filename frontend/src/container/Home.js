import React from 'react';

import { Container, Row, Col, Button, Card } from 'react-bootstrap';

import { Globe, Star, Flame, Trophy, ArrowRight } from 'lucide-react';



const languages = [

  { flag: '🇪🇸', name: 'Spanish', learners: '32M' },

  { flag: '🇫🇷', name: 'French', learners: '18M' },

  { flag: '🇩🇪', name: 'German', learners: '12M' },

  { flag: '🇯🇵', name: 'Japanese', learners: '15M' },

  { flag: '🇮🇳', name: 'Hindi', learners: '9M' },

  { flag: '🇵🇹', name: 'Portuguese', learners: '11M' },

];



const features = [

  {

    icon: <Star size={32} className="text-warning" />,

    title: 'Earn XP & Rewards',

    desc: 'Complete lessons to earn experience points, unlock achievements and climb the leaderboard.',

  },

  {

    icon: <Flame size={32} className="text-danger" />,

    title: 'Daily Streaks',

    desc: 'Build a habit by maintaining your daily learning streak. Miss a day and it resets!',

  },

  {

    icon: <Trophy size={32} className="text-warning" />,

    title: 'Compete & Win',

    desc: 'Join weekly leagues, compete with friends and earn top ranks on the global leaderboard.',

  },

  {

    icon: <Globe size={32} className="text-success" />,

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



const Home = ({ navigate }) => {

  return (

    <div className="h_home_page">

      {/* Hero Section */}

      <section className="h_hero_section">

        <Container>

          <Row className="align-items-center min-vh-75 py-5">

            <Col lg={6} className="h_hero_text order-lg-1 order-2 text-center text-lg-start">

              <h1 className="h_hero_title">

                Learn a language <span className="h_highlight">for free</span>

              </h1>

              <p className="h_hero_subtitle">

                The fun, effective, and free way to learn a new language. Join over 500 million learners worldwide.

              </p>

              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start mt-4">

                <Button

                  size="lg"

                  className="h_btn_get_started fw-bold"

                  onClick={() => navigate('signup')}

                >

                  Get Started — It's Free!

                </Button>

                <Button

                  size="lg"

                  variant="outline-success"

                  className="h_btn_login_hero"

                  onClick={() => navigate('login')}

                >

                  I Already Have an Account

                </Button>

              </div>

            </Col>

            <Col lg={6} className="h_hero_visual order-lg-2 order-1 text-center mb-4 mb-lg-0">

              <div className="h_hero_owl">🦉</div>

              <div className="h_hero_bubbles">

                <div className="h_bubble h_bubble_1">¡Hola!</div>

                <div className="h_bubble h_bubble_2">Bonjour!</div>

                <div className="h_bubble h_bubble_3">こんにちは</div>

                <div className="h_bubble h_bubble_4">नमस्ते</div>

              </div>

            </Col>

          </Row>

        </Container>

      </section>



      {/* Stats Banner */}

      <section className="h_stats_banner py-4">

        <Container>

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



      {/* Language Grid */}

      <section className="h_section py-5">

        <Container>

          <h2 className="h_section_title text-center mb-2">Choose Your Language</h2>

          <p className="h_section_sub text-center mb-5">Start learning any of our popular language courses today</p>

          <Row className="g-3 justify-content-center">

            {languages.map((lang, i) => (

              <Col xs={6} sm={4} md={3} lg={2} key={i}>

                <Card

                  className="h_lang_card text-center"

                  onClick={() => navigate('signup')}

                >

                  <Card.Body className="p-3">

                    <div className="h_lang_flag">{lang.flag}</div>

                    <div className="h_lang_name">{lang.name}</div>

                    <div className="h_lang_learners">{lang.learners} learners</div>

                  </Card.Body>

                </Card>

              </Col>

            ))}

          </Row>

          <div className="text-center mt-4">

            <Button

              variant="outline-success"

              className="h_btn_more_langs"

              onClick={() => navigate('signup')}

            >

              View All Languages <ArrowRight className="ms-1" size={16} />

            </Button>

          </div>

        </Container>

      </section>



      {/* Features */}

      <section className="h_features_section py-5">

        <Container>

          <h2 className="h_section_title text-center mb-2">Why LinguaLeap?</h2>

          <p className="h_section_sub text-center mb-5">Science-backed methods wrapped in fun gameplay</p>

          <Row className="g-4">

            {features.map((f, i) => (

              <Col xs={12} sm={6} lg={3} key={i}>

                <Card className="h_feature_card h-100 text-center border-0">

                  <Card.Body className="p-4">

                    <div className="h_feature_icon mb-3">{f.icon}</div>

                    <h5 className="h_feature_title">{f.title}</h5>

                    <p className="h_feature_desc text-muted small">{f.desc}</p>

                  </Card.Body>

                </Card>

              </Col>

            ))}

          </Row>

        </Container>

      </section>



      {/* How It Works */}

      <section className="h_how_section py-5">

        <Container>

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

              <Button

                className="h_btn_get_started mt-4 fw-bold"

                size="lg"

                onClick={() => navigate('signup')}

              >

                Start Learning Now <ArrowRight className="ms-1" size={16} />

              </Button>

            </Col>

            <Col lg={6} className="text-center">

              <div className="h_mockup_phone">

                <div className="h_mockup_screen">

                  <div className="h_mockup_header">Daily Goal</div>

                  <div className="h_mockup_progress">

                    <div className="h_mockup_bar">

                      <div className="h_mockup_fill" style={{ width: '65%' }}></div>

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

                    <Flame className="text-danger" size={20} /> 7 day streak!

                  </div>

                </div>

              </div>

            </Col>

          </Row>

        </Container>

      </section>



      {/* CTA */}

      <section className="h_cta_section py-5 text-center">

        <Container>

          <div className="h_cta_owl">🦉</div>

          <h2 className="h_cta_title">Start your journey today</h2>

          <p className="h_cta_sub mb-4">Free forever. No credit card required.</p>

          <Button

            size="lg"

            className="h_btn_get_started fw-bold px-5"

            onClick={() => navigate('signup')}

          >

            Get Started for Free

          </Button>

        </Container>

      </section>



      {/* Footer */}

      <footer className="h_footer py-4">

        <Container>

          <Row className="align-items-center">

            <Col xs={12} md={6} className="text-center text-md-start mb-2 mb-md-0">

              <span className="h_footer_brand">🦉 LinguaLeap</span>

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


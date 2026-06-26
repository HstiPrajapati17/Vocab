import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaGlobe, FaUsers, FaLightbulb, FaHeart, FaRocket, FaAward } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="h_about_page">
      <Container fluid className="h_about_hero">
        <Row className="justify-content-center text-center">
          <Col lg={8}>
            <h1 className="h_about_title">About Vocab</h1>
            <p className="h_about_subtitle">Empowering language learners worldwide through innovative technology</p>
          </Col>
        </Row>
      </Container>

      <Container className="py-5">
        <Row className="mb-5">
          <Col lg={12} className="text-center mb-4">
            <h2 className="h_section_title">Our Mission</h2>
            <p className="h_section_subtitle text-muted">Making language learning accessible, engaging, and effective for everyone</p>
          </Col>
          <Col lg={8} className="mx-auto">
            <Card className="h_about_card border-0 shadow-sm">
              <Card.Body className="p-4">
                <p className="h_about_text">
                  At Vocab, we believe that language learning should be a joyful journey, not a tedious task. 
                  Our platform combines cutting-edge technology with proven pedagogical methods to create 
                  an immersive learning experience that adapts to your unique learning style and pace.
                </p>
                <p className="h_about_text">
                  Founded in 2024, we've helped thousands of learners across the globe unlock new opportunities 
                  through language mastery. From Spanish to Chinese, from French to Arabic, we're committed to 
                  breaking down language barriers and connecting cultures.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col lg={12} className="text-center mb-4">
            <h2 className="h_section_title">What We Offer</h2>
            <p className="h_section_subtitle text-muted">Comprehensive language learning solutions</p>
          </Col>
          {[
            { icon: <FaGlobe size={40} />, title: '12+ Languages', desc: 'Learn from a diverse selection of world languages' },
            { icon: <FaUsers size={40} />, title: 'Community Driven', desc: 'Connect with fellow learners and native speakers' },
            { icon: <FaLightbulb size={40} />, title: 'Smart Learning', desc: 'AI-powered lessons that adapt to your progress' },
            { icon: <FaHeart size={40} />, title: 'Gamified Experience', desc: 'Earn points, streaks, and achievements as you learn' },
            { icon: <FaRocket size={40} />, title: 'Quick Progress', desc: 'See measurable improvement in weeks, not years' },
            { icon: <FaAward size={40} />, title: 'Certified Courses', desc: 'Industry-recognized curriculum and assessments' },
          ].map((feature, index) => (
            <Col md={6} lg={4} key={index} className="mb-4">
              <Card className="h_feature_card border-0 shadow-sm h-100">
                <Card.Body className="p-4 text-center">
                  <div className="h_feature_icon mb-3 text-primary">{feature.icon}</div>
                  <h5 className="h_feature_title mb-2">{feature.title}</h5>
                  <p className="h_feature_desc text-muted">{feature.desc}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="mb-5">
          <Col lg={12} className="text-center mb-4">
            <h2 className="h_section_title">Our Values</h2>
            <p className="h_section_subtitle text-muted">The principles that guide everything we do</p>
          </Col>
          <Col lg={10} className="mx-auto">
            <Row>
              {[
                { title: 'Accessibility', desc: 'Language learning should be available to everyone, regardless of background or budget.' },
                { title: 'Quality', desc: 'We maintain the highest standards in content creation and educational methodology.' },
                { title: 'Innovation', desc: 'Continuously improving our platform with the latest in educational technology.' },
                { title: 'Community', desc: 'Building a supportive global network of language enthusiasts.' },
              ].map((value, index) => (
                <Col md={6} key={index} className="mb-4">
                  <Card className="h_value_card border-0 shadow-sm">
                    <Card.Body className="p-4">
                      <h5 className="h_value_title mb-2">{value.title}</h5>
                      <p className="h_value_desc text-muted">{value.desc}</p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col lg={12} className="text-center mb-4">
            <h2 className="h_section_title">Contact Us</h2>
            <p className="h_section_subtitle text-muted">We'd love to hear from you</p>
          </Col>
          <Col lg={8} className="mx-auto">
            <Card className="h_contact_card border-0 shadow-sm">
              <Card.Body className="p-4 text-center">
                <p className="h_contact_text mb-3">
                  Have questions, suggestions, or just want to say hello? Reach out to our team!
                </p>
                <div className="h_contact_info">
                  <p className="mb-2"><strong>Email:</strong> support@vocab.com</p>
                  <p className="mb-2"><strong>Address:</strong> 123 Learning Street, Education City, EC 12345</p>
                  <p className="mb-0"><strong>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AboutUs;

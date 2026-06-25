import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaFileAlt, FaUserCheck, FaBan, FaGavel, FaShieldAlt, FaCookieBite } from 'react-icons/fa';

const Terms = () => {
  return (
    <div className="h_terms_page">
      <Container fluid className="h_terms_hero">
        <Row className="justify-content-center text-center">
          <Col lg={8}>
            <h1 className="h_terms_title">Terms of Service</h1>
            <p className="h_terms_subtitle">Please read these terms carefully before using Vocab</p>
          </Col>
        </Row>
      </Container>

      <Container className="py-5">
        <Row className="mb-4">
          <Col lg={12}>
            <Card className="h_terms_intro_card border-0 shadow-sm">
              <Card.Body className="p-4">
                <p className="h_terms_intro_text">
                  Welcome to Vocab. By accessing or using our language learning platform, you agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, please do not use our service.
                </p>
                <p className="h_terms_intro_text">
                  Last updated: January 2024
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col lg={12} className="mb-4">
            <h2 className="h_section_title">Key Terms</h2>
          </Col>
          {[
            { 
              icon: <FaUserCheck size={32} />, 
              title: 'Account Registration', 
              content: 'You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.'
            },
            { 
              icon: <FaBan size={32} />, 
              title: 'Acceptable Use', 
              content: 'You agree not to use Vocab for any illegal purposes, to harass others, or to violate any intellectual property rights. You may not attempt to gain unauthorized access to our systems or interfere with service operation.'
            },
            { 
              icon: <FaGavel size={32} />, 
              title: 'Intellectual Property', 
              content: 'All content on Vocab, including lessons, exercises, audio recordings, and visual materials, is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without permission.'
            },
            { 
              icon: <FaShieldAlt size={32} />, 
              title: 'Privacy Policy', 
              content: 'Your use of Vocab is also governed by our Privacy Policy, which describes how we collect, use, and protect your personal information. Please review our Privacy Policy carefully.'
            },
            { 
              icon: <FaCookieBite size={32} />, 
              title: 'Cookies and Tracking', 
              content: 'We use cookies and similar technologies to improve your experience, analyze usage patterns, and personalize content. By using our service, you consent to our use of cookies as described in our Privacy Policy.'
            },
          ].map((term, index) => (
            <Col lg={12} key={index} className="mb-4">
              <Card className="h_term_card border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex gap-3">
                    <div className="h_term_icon flex-shrink-0 text-primary">
                      {term.icon}
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="h_term_title mb-2">{term.title}</h5>
                      <p className="h_term_content text-muted">{term.content}</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="mb-5">
          <Col lg={12} className="mb-4">
            <h2 className="h_section_title">Service Terms</h2>
          </Col>
          <Col lg={12}>
            <Card className="h_service_terms_card border-0 shadow-sm">
              <Card.Body className="p-4">
                <h5 className="h_subsection_title mb-3">1. Subscription and Payment</h5>
                <p className="h_terms_text mb-4">
                  Vocab offers both free and premium subscription plans. Premium subscriptions are billed on a recurring basis 
                  (monthly or annually). You agree to provide accurate payment information and authorize us to charge your 
                  chosen payment method. You may cancel your subscription at any time through your account settings.
                </p>

                <h5 className="h_subsection_title mb-3">2. Service Availability</h5>
                <p className="h_terms_text mb-4">
                  We strive to maintain high service availability but cannot guarantee uninterrupted access. We reserve the 
                  right to suspend or terminate the service for maintenance, updates, or other operational reasons. We are not 
                  liable for any losses resulting from service interruptions.
                </p>

                <h5 className="h_subsection_title mb-3">3. User Content</h5>
                <p className="h_terms_text mb-4">
                  Any content you submit to Vocab, including forum posts, reviews, or learning progress, remains your property. 
                  However, you grant us a license to use, display, and distribute such content for the purpose of providing and 
                  improving our services. You represent that you have the right to grant this license.
                </p>

                <h5 className="h_subsection_title mb-3">4. Termination</h5>
                <p className="h_terms_text mb-4">
                  We reserve the right to terminate or suspend your account at our discretion, with or without notice, for 
                  violation of these terms or for any other reason. Upon termination, your right to use the service will immediately 
                  cease. You may also terminate your account at any time by contacting us.
                </p>

                <h5 className="h_subsection_title mb-3">5. Limitation of Liability</h5>
                <p className="h_terms_text">
                  To the maximum extent permitted by law, Vocab shall not be liable for any indirect, incidental, special, 
                  consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other 
                  intangible losses, resulting from your use of the service.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col lg={12} className="mb-4">
            <h2 className="h_section_title">Changes to Terms</h2>
          </Col>
          <Col lg={10} className="mx-auto">
            <Card className="h_changes_card border-0 shadow-sm">
              <Card.Body className="p-4">
                <p className="h_terms_text">
                  We may modify these terms at any time. We will notify users of significant changes by posting the new terms 
                  on our platform and sending an email notification. Your continued use of the service after such modifications 
                  constitutes your acceptance of the updated terms.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col lg={12} className="mb-4">
            <h2 className="h_section_title">Contact Us</h2>
          </Col>
          <Col lg={8} className="mx-auto">
            <Card className="h_contact_card border-0 shadow-sm">
              <Card.Body className="p-4 text-center">
                <p className="h_terms_text mb-3">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="h_contact_info">
                  <p className="mb-2"><strong>Email:</strong> legal@vocab.com</p>
                  <p className="mb-0"><strong>Address:</strong> 123 Learning Street, Education City, EC 12345</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Terms;

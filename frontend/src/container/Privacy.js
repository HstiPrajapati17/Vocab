import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaShieldAlt, FaUserSecret, FaDatabase, FaEye, FaLock, FaUserCog } from 'react-icons/fa';

const Privacy = () => {
  return (
    <div className="h_privacy_page">
      <Container fluid className="h_privacy_hero">
        <Row className="justify-content-center text-center">
          <Col lg={8}>
            <h1 className="h_privacy_title">Privacy Policy</h1>
            <p className="h_privacy_subtitle">Your privacy is our priority - learn how we protect your data</p>
          </Col>
        </Row>
      </Container>

      <Container className="py-5">
        <Row className="mb-4">
          <Col lg={12}>
            <Card className="h_privacy_intro_card border-0 shadow-sm">
              <Card.Body className="p-4">
                <p className="h_privacy_intro_text">
                  At Vocab, we are committed to protecting your personal information and respecting your privacy. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our language learning platform.
                </p>
                <p className="h_privacy_intro_text">
                  Last updated: January 2024
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col lg={12} className="mb-4">
            <h2 className="h_section_title">Information We Collect</h2>
          </Col>
          {[
            { 
              icon: <FaUserSecret size={32} />, 
              title: 'Personal Information', 
              content: 'We collect information you provide directly, such as your name, email address, and profile picture when you create an account. This information is used to create and manage your account.'
            },
            { 
              icon: <FaDatabase size={32} />, 
              title: 'Learning Data', 
              content: 'We collect data about your learning progress, including completed lessons, quiz scores, practice time, and language preferences. This helps us personalize your learning experience.'
            },
            { 
              icon: <FaEye size={32} />, 
              title: 'Usage Information', 
              content: 'We automatically collect information about how you use our service, including pages visited, features used, time spent, and device information. This helps us improve our platform.'
            },
            { 
              icon: <FaLock size={32} />, 
              title: 'Cookies and Tracking', 
              content: 'We use cookies and similar technologies to enhance your experience, remember your preferences, and analyze usage patterns. You can manage cookie preferences through your browser settings.'
            },
          ].map((item, index) => (
            <Col lg={12} key={index} className="mb-4">
              <Card className="h_privacy_item_card border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex gap-3">
                    <div className="h_privacy_item_icon flex-shrink-0 text-primary">
                      {item.icon}
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="h_privacy_item_title mb-2">{item.title}</h5>
                      <p className="h_privacy_item_content text-muted">{item.content}</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="mb-5">
          <Col lg={12} className="mb-4">
            <h2 className="h_section_title">How We Use Your Information</h2>
          </Col>
          <Col lg={12}>
            <Card className="h_usage_card border-0 shadow-sm">
              <Card.Body className="p-4">
                <h5 className="h_subsection_title mb-3">1. Service Provision</h5>
                <p className="h_privacy_text mb-4">
                  We use your information to provide, maintain, and improve our language learning services. This includes personalizing lessons, 
                  tracking progress, and delivering content tailored to your learning level and preferences.
                </p>

                <h5 className="h_subsection_title mb-3">2. Communication</h5>
                <p className="h_privacy_text mb-4">
                  We may use your contact information to send you important updates about your account, service changes, learning tips, 
                  and promotional materials. You can opt out of marketing communications at any time.
                </p>

                <h5 className="h_subsection_title mb-3">3. Analytics and Improvement</h5>
                <p className="h_privacy_text mb-4">
                  We analyze usage data to understand how users interact with our platform, identify popular features, and areas for improvement. 
                  This helps us enhance the overall user experience and develop new features.
                </p>

                <h5 className="h_subsection_title mb-3">4. Security and Fraud Prevention</h5>
                <p className="h_privacy_text">
                  We use your information to detect and prevent fraudulent activity, protect against unauthorized access, and ensure the 
                  security of our platform and all users.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col lg={12} className="mb-4">
            <h2 className="h_section_title">Data Protection</h2>
          </Col>
          <Col lg={10} className="mx-auto">
            <Card className="h_protection_card border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex gap-3 mb-4">
                  <div className="h_protection_icon flex-shrink-0 text-success">
                    <FaShieldAlt size={32} />
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="h_protection_title mb-2">Security Measures</h5>
                    <p className="h_privacy_text">
                      We implement industry-standard security measures to protect your information, including encryption, secure servers, 
                      regular security audits, and access controls. However, no method of transmission over the internet is 100% secure.
                    </p>
                  </div>
                </div>
                <div className="d-flex gap-3 mb-4">
                  <div className="h_protection_icon flex-shrink-0 text-success">
                    <FaUserCog size={32} />
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="h_protection_title mb-2">Your Rights</h5>
                    <p className="h_privacy_text">
                      You have the right to access, correct, or delete your personal information. You can also object to processing of your data 
                      and request data portability. To exercise these rights, please contact us at privacy@vocab.com.
                    </p>
                  </div>
                </div>
                <div className="d-flex gap-3">
                  <div className="h_protection_icon flex-shrink-0 text-success">
                    <FaLock size={32} />
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="h_protection_title mb-2">Data Retention</h5>
                    <p className="h_privacy_text">
                      We retain your information only as long as necessary to provide our services and comply with legal obligations. 
                      When you delete your account, we will delete or anonymize your personal information.
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col lg={12} className="mb-4">
            <h2 className="h_section_title">Third-Party Services</h2>
          </Col>
          <Col lg={10} className="mx-auto">
            <Card className="h_thirdparty_card border-0 shadow-sm">
              <Card.Body className="p-4">
                <p className="h_privacy_text mb-3">
                  We may use third-party services to help operate our platform, including:
                </p>
                <ul className="h_privacy_list">
                  <li>Cloud hosting and storage providers</li>
                  <li>Analytics and tracking services</li>
                  <li>Payment processing services</li>
                  <li>Email and communication services</li>
                </ul>
                <p className="h_privacy_text mt-3">
                  These third parties have access to your information only to perform specific tasks on our behalf and are obligated to 
                  protect your information. We do not sell your personal information to third parties.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col lg={12} className="mb-4">
            <h2 className="h_section_title">Changes to This Policy</h2>
          </Col>
          <Col lg={10} className="mx-auto">
            <Card className="h_changes_card border-0 shadow-sm">
              <Card.Body className="p-4">
                <p className="h_privacy_text">
                  We may update this Privacy Policy from time to time. We will notify users of significant changes by posting the new policy 
                  on our platform and sending an email notification. Your continued use of the service after such changes constitutes your 
                  acceptance of the updated policy.
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
                <p className="h_privacy_text mb-3">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="h_contact_info">
                  <p className="mb-2"><strong>Email:</strong> privacy@vocab.com</p>
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

export default Privacy;

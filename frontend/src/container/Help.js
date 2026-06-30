import React, { useState } from 'react';
import { Container, Row, Col, Button, Accordion, Form } from 'react-bootstrap';
import { Search, Headset, Book, Video, ArrowRight, HelpCircle, MessageSquare, Phone, Mail, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../style/info_pages.css';

const Help = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const quickActions = [
    { icon: <Book size={32} />, title: 'Getting Started', desc: 'Learn the basics', color: '#2F855A' },
    { icon: <Video size={32} />, title: 'Video Tutorials', desc: 'Watch guides', color: '#9AD4B5' },
    { icon: <Headset size={32} />, title: 'Live Support', desc: 'Chat with us', color: '#F2A541' },
  ];

  const faqData = [
    {
      id: 1,
      question: 'How do I change my language?',
      answer: 'To change your language, go to the Courses page from the main menu. Select your desired language from the available options. Your progress will be saved for each language separately.'
    },
    {
      id: 2,
      question: 'What are XP and how do I earn them?',
      answer: 'XP (Experience Points) are earned by completing lessons, quizzes, and daily quests. The more you practice, the more XP you earn. XP helps you track your progress and unlock achievements.'
    },
    {
      id: 3,
      question: 'How does the streak system work?',
      answer: 'Your streak counts consecutive days of learning. Complete at least one lesson each day to maintain your streak. Longer streaks earn you bonus XP and special achievements!'
    },
    {
      id: 4,
      question: 'Can I learn multiple languages at once?',
      answer: 'Yes! You can switch between languages anytime. Each language has its own learning path and progress. Your XP and streak are shared across all languages.'
    },
  ];

  const supportChannels = [
    { icon: <MessageSquare size={40} />, title: 'Live Chat', desc: 'Instant support from our team', time: 'Available 24/7' },
    { icon: <Mail size={40} />, title: 'Email Support', desc: 'Send detailed inquiries', time: 'Response within 24h' },
    { icon: <Phone size={40} />, title: 'Phone Support', desc: 'Call our support hotline', time: 'Mon-Fri 9AM-6PM' },
  ];

  const filteredFAQ = faqData.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="help-page-unique">
      {/* Hero Section */}
      <section className="help-hero-unique">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <div className="help-hero-content">
                <div className="help-badge">
                  <HelpCircle size={20} /> Help Center
                </div>
                <h1 className="help-hero-title">
                  How can we <span className="help-highlight">help you</span> today?
                </h1>
                <p className="help-hero-desc">
                  Get the help you need to make the most of your language learning journey.
                </p>
                <div className="help-search-hero">
                  <Search size={20} />
                  <input 
                    type="text" 
                    placeholder="Search for answers..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="help-search-input"
                  />
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="help-hero-visual">
                <div className="help-icon-large">
                  <Headset size={120} />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions-unique">
        <Container>
          <Row className="g-4">
            {quickActions.map((action, i) => (
              <Col md={4} key={i}>
                <div className="quick-action-card" style={{ '--action-color': action.color }}>
                  <div className="quick-action-icon" style={{ background: action.color }}>
                    {action.icon}
                  </div>
                  <h3 className="quick-action-title">{action.title}</h3>
                  <p className="quick-action-desc">{action.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="faq-section-unique">
        <Container>
          <div className="section-header-unique">
            <h2 className="section-title-unique">Frequently Asked Questions</h2>
            <p className="section-subtitle-unique">Find quick answers to common questions</p>
          </div>
          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="faq-container-unique">
                {filteredFAQ.map((faq) => (
                  <div className="faq-item-unique" key={faq.id}>
                    <Accordion>
                      <Accordion.Item eventKey={faq.id}>
                        <Accordion.Header className="faq-question-unique">
                          {faq.question}
                        </Accordion.Header>
                        <Accordion.Body className="faq-answer-unique">
                          {faq.answer}
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  </div>
                ))}
                {filteredFAQ.length === 0 && (
                  <div className="faq-empty-unique">
                    <HelpCircle size={48} />
                    <p>No results found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Support Channels */}
      <section className="support-channels-unique">
        <Container>
          <div className="section-header-unique">
            <h2 className="section-title-unique">Contact Support</h2>
            <p className="section-subtitle-unique">Can't find what you're looking for? Reach out to us</p>
          </div>
          <Row className="g-4">
            {supportChannels.map((channel, i) => (
              <Col md={4} key={i}>
                <div className="support-channel-card">
                  <div className="support-channel-icon">
                    {channel.icon}
                  </div>
                  <h3 className="support-channel-title">{channel.title}</h3>
                  <p className="support-channel-desc">{channel.desc}</p>
                  <div className="support-channel-time">
                    <Clock size={16} /> {channel.time}
                  </div>
                  <Button className="btn-contact-channel">
                    {channel.title} <ArrowRight size={16} />
                  </Button>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Resources Section */}
      <section className="resources-unique">
        <Container>
          <div className="resources-content">
            <CheckCircle size={64} />
            <h2 className="resources-title">Self-Service Resources</h2>
            <p className="resources-desc">
              Explore our comprehensive guides and documentation to find answers at your own pace.
            </p>
            <div className="resources-buttons">
              <Button className="btn-resource">
                <Book size={18} /> User Guide
              </Button>
              <Button className="btn-resource">
                <Video size={18} /> Video Tutorials
              </Button>
              <Button className="btn-resource">
                <Headset size={18} /> Community Forum
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Help;

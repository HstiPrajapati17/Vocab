import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { BookOpen, Clock, Heart, MessageCircle, ArrowRight, TrendingUp, Calendar, User, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../style/info_pages.css';

const Blog = () => {
  const navigate = useNavigate();

  const featuredPost = {
    title: '10 Tips to Master Spanish Vocabulary',
    excerpt: 'Discover effective strategies to expand your Spanish vocabulary and remember words for longer.',
    author: 'Maria Garcia',
    date: 'June 15, 2024',
    category: 'Learning Tips',
    image: '🇪🇸',
    readTime: '8 min read'
  };

  const blogPosts = [
    {
      id: 1,
      title: 'The Science Behind Language Learning',
      excerpt: 'Learn how your brain processes new languages and optimizes your learning routine.',
      author: 'Dr. James Wilson',
      date: 'June 10, 2024',
      category: 'Research',
      image: '🧠',
      readTime: '12 min read'
    },
    {
      id: 2,
      title: 'German Grammar Made Simple',
      excerpt: 'Break down complex German grammar rules into easy-to-understand concepts.',
      author: 'Hans Mueller',
      date: 'June 5, 2024',
      category: 'German',
      image: '🇩🇪',
      readTime: '10 min read'
    },
    {
      id: 3,
      title: 'French Pronunciation Guide',
      excerpt: 'Master the tricky sounds of French with our comprehensive pronunciation guide.',
      author: 'Sophie Martin',
      date: 'May 28, 2024',
      category: 'French',
      image: '🇫🇷',
      readTime: '15 min read'
    },
    {
      id: 4,
      title: 'Stay Motivated: Building Habits',
      excerpt: 'How to create sustainable habits that keep you motivated throughout your journey.',
      author: 'Alex Chen',
      date: 'May 20, 2024',
      category: 'Motivation',
      image: '🎯',
      readTime: '7 min read'
    },
  ];

  return (
    <div className="blog-page-unique">
      {/* Hero Section */}
      <section className="blog-hero-unique">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <div className="hero-content-blog">
                <div className="blog-badge">
                  <BookOpen size={20} /> VocabLearn Blog
                </div>
                <h1 className="blog-hero-title">
                  Expert insights for <span className="blog-highlight">language mastery</span>
                </h1>
                <p className="blog-hero-desc">
                  Discover proven strategies, tips, and success stories from language learners worldwide.
                </p>
                <div className="blog-hero-stats">
                  <div className="blog-stat">
                    <BookOpen size={24} />
                    <span>50+ Articles</span>
                  </div>
                  <div className="blog-stat">
                    <TrendingUp size={24} />
                    <span>10K+ Readers</span>
                  </div>
                  <div className="blog-stat">
                    <Clock size={24} />
                    <span>Weekly Updates</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="blog-hero-visual">
                <div className="featured-card-large">
                  <div className="featured-flag">{featuredPost.image}</div>
                  <div className="featured-content">
                    <span className="featured-tag">{featuredPost.category}</span>
                    <h3>{featuredPost.title}</h3>
                    <p>{featuredPost.excerpt}</p>
                    <div className="featured-meta">
                      <span><User size={14} /> {featuredPost.author}</span>
                      <span><Calendar size={14} /> {featuredPost.date}</span>
                      <span><Clock size={14} /> {featuredPost.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Filter Bar */}
      <section className="filter-bar-unique">
        <Container>
          <div className="filter-content">
            <div className="filter-label">
              <Filter size={20} /> Filter by:
            </div>
            <div className="filter-tags">
              <span className="filter-tag active">All</span>
              <span className="filter-tag">Learning Tips</span>
              <span className="filter-tag">Research</span>
              <span className="filter-tag">German</span>
              <span className="filter-tag">French</span>
              <span className="filter-tag">Motivation</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Blog Grid */}
      <section className="blog-grid-unique">
        <Container>
          <Row className="g-4">
            {blogPosts.map((post) => (
              <Col md={6} lg={4} key={post.id}>
                <div className="blog-card-unique">
                  <div className="blog-card-image">
                    <span className="blog-flag">{post.image}</span>
                  </div>
                  <div className="blog-card-body">
                    <span className="blog-category">{post.category}</span>
                    <h3 className="blog-card-title">{post.title}</h3>
                    <p className="blog-card-excerpt">{post.excerpt}</p>
                    <div className="blog-card-meta">
                      <span className="meta-item">
                        <User size={14} /> {post.author}
                      </span>
                      <span className="meta-item">
                        <Calendar size={14} /> {post.date}
                      </span>
                      <span className="meta-item">
                        <Clock size={14} /> {post.readTime}
                      </span>
                    </div>
                    <div className="blog-card-footer">
                      <div className="blog-actions">
                        <span className="blog-action">
                          <Heart size={16} /> 156
                        </span>
                        <span className="blog-action">
                          <MessageCircle size={16} /> 28
                        </span>
                      </div>
                      <Button className="btn-read-more">
                        Read <ArrowRight size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-unique">
        <Container>
          <div className="newsletter-content">
            <BookOpen size={48} />
            <h2 className="newsletter-title">Stay Updated</h2>
            <p className="newsletter-desc">
              Subscribe to our newsletter and get the latest language learning tips delivered to your inbox.
            </p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" className="newsletter-input" />
              <Button className="btn-subscribe">
                Subscribe <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Blog;

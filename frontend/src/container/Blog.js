import React, { useState } from 'react';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import {
  BookOpen,
  Clock,
  Heart,
  MessageCircle,
  ArrowRight,
  TrendingUp,
  Calendar,
  User,
  Filter,
} from 'lucide-react';
import '../style/info_pages.css';

const Blog = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const featuredPost = {
    title: '10 Tips to Master Spanish Vocabulary',
    excerpt:
      'Discover effective strategies to expand your Spanish vocabulary and remember words for longer.',
    author: 'Maria Garcia',
    date: 'June 15, 2024',
    category: 'Learning Tips',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&auto=format&fit=crop&q=80',
    readTime: '8 min read',
  };

  const blogPosts = [
    {
      id: 1,
      title: 'The Science of Learning',
      excerpt:
        'Learn how your brain processes new languages and optimise your routine.',
      author: 'Dr. James Wilson',
      date: 'June 10, 2024',
      category: 'Research',
      image:
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
      readTime: '12 min',
    },
    {
      id: 2,
      title: 'German Grammar Made Simple',
      excerpt:
        'Break complex German grammar rules into easy-to-understand concepts.',
      author: 'Hans Mueller',
      date: 'June 5, 2024',
      category: 'German',
      image:
        'https://images.unsplash.com/photo-1527866959252-deab85ef7d1b?w=600&auto=format&fit=crop&q=80',
      readTime: '10 min',
    },
    {
      id: 3,
      title: 'French Pronunciation Guide',
      excerpt:
        'Master the tricky sounds of French with our comprehensive guide.',
      author: 'Sophie Martin',
      date: 'May 28, 2024',
      category: 'French',
      image:
        'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&auto=format&fit=crop&q=80',
      readTime: '15 min',
    },
    {
      id: 4,
      title: 'Stay Motivated: Building Habits',
      excerpt:
        'Create sustainable habits that keep you motivated throughout your journey.',
      author: 'Alex Chen',
      date: 'May 20, 2024',
      category: 'Motivation',
      image:
        'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&auto=format&fit=crop&q=80',
      readTime: '7 min',
    },
  ];

  const filters = [
    'All',
    'Learning Tips',
    'Research',
    'German',
    'French',
    'Motivation',
  ];

  const filteredPosts =
    selectedFilter === "All"
      ? blogPosts
      : blogPosts.filter(
        (post) => post.category === selectedFilter
      );

  return (
    <div className="blog-page-unique">

      {/* Hero */}
      <section className="blog-hero-unique">

        <div className="hero-bg-circle hero-circle-1"></div>
        <div className="hero-bg-circle hero-circle-2"></div>

        <Container>
          <Row className="align-items-center">

            <Col lg={6}>
              <div className="hero-content-blog">

                <span className="blog-badge">
                  <BookOpen size={17} />
                  VocabLearn Blog
                </span>

                <h1 className="blog-hero-title">
                  Learn Languages
                  <br />
                  Smarter With
                  <span className="blog-highlight">
                    {" "}Expert Advice
                  </span>
                </h1>

                <p className="blog-hero-desc">
                  Explore vocabulary hacks, grammar guides, study
                  techniques, and inspiring learner success stories
                  written by language experts.
                </p>

                <div className="hero-buttons">

                  <button className="hero-btn-primary">
                    Explore Articles
                  </button>

                  <button className="hero-btn-outline">
                    Latest Posts
                  </button>

                </div>

                <div className="blog-hero-stats">

                  <div className="blog-stat">
                    <BookOpen size={20} />
                    <div>
                      <h4>50+</h4>
                      <p>Articles</p>
                    </div>
                  </div>

                  <div className="blog-stat">
                    <TrendingUp size={20} />
                    <div>
                      <h4>10K+</h4>
                      <p>Readers</p>
                    </div>
                  </div>
                  <div className="blog-stat">
                    <Clock size={20} />
                    <div>
                      <h4>Weekly</h4>
                      <p>Updates</p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={6}>
              <div className="blog-hero-visual">
                <div className="featured-card-large">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="featured-image"
                  />
                  {/* <div className="floating-tag">
                            ⭐ Featured Article
                        </div> */}
                  <div className="featured-content">
                    <span className="featured-tag">
                      {featuredPost.category}
                    </span>
                    <h3>{featuredPost.title}</h3>
                    <p>{featuredPost.excerpt}</p>
                    <div className="featured-meta">
                      <span>
                        <User size={14} />
                        {featuredPost.author}
                      </span>
                      <span>
                        <Calendar size={14} />
                        {featuredPost.date}
                      </span>
                      <span>
                        <Clock size={14} />
                        {featuredPost.readTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Filter */}
      <section className="filter-bar-unique">
        <Container>
          <div className="filter-content">
            <div className="filter-label">
              <Filter size={16} /> Filter:
            </div>
            <div className="filter-tags">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setSelectedFilter(filter)}
                  className={`filter-tag ${selectedFilter === filter ? "active" : ""
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Blog Cards */}
      <section className="blog-grid-unique">
        <Container>
          <Row className="g-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <Col sm={6} lg={3} key={post.id}>
                  <div className="blog-card-unique">
                    <div className="blog-card-image">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="blog-image"
                      />
                    </div>
                    <div className="blog-card-body">
                      <span className="blog-category">
                        {post.category}
                      </span>
                      <h3 className="blog-card-title">
                        {post.title}
                      </h3>
                      <p className="blog-card-excerpt">
                        {post.excerpt}
                      </p>
                      <div className="blog-card-meta">
                        <span className="meta-item">
                          <User size={12} /> {post.author}
                        </span>
                        <span className="meta-item">
                          <Clock size={12} /> {post.readTime}
                        </span>
                      </div>
                      <div className="blog-card-footer">
                        <div className="blog-actions">
                          <span className="blog-action">
                            <Heart size={14} /> 156
                          </span>

                          <span className="blog-action">
                            <MessageCircle size={14} /> 28
                          </span>
                        </div>

                        {/* <Button className="btn-read-more">
                          Read <ArrowRight size={13} />
                        </Button> */}
                        <Button
                          className="btn-read-more"
                          onClick={() => {
                            setSelectedPost(post);
                            setShowModal(true);
                          }}
                        >
                          Read <ArrowRight size={13} />
                        </Button>
                      </div>
                    </div>

                  </div>
                </Col>
              ))
            ) : (
              <Col xs={12}>
                <div className="text-center py-5">
                  <h4>No blogs found.</h4>
                </div>
              </Col>
            )}
          </Row>
        </Container>
      </section>

      {/* Newsletter */}
      <section className="newsletter-unique">
        <Container>
          <div className="newsletter-content">
            <BookOpen size={40} />

            <h2 className="newsletter-title">
              Stay Updated
            </h2>

            <p className="newsletter-desc">
              Subscribe and get the latest language learning tips delivered to your inbox.
            </p>

            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
              />

              <Button className="btn-subscribe">
                Subscribe <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </Container>
      </section>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="xl"
        className="blog-detail-modal"
      >

        {selectedPost && (

          <>
            <Modal.Header closeButton>
              <Modal.Title>
                {selectedPost.title}
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>

              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="modal-blog-image"
              />

              <div className="modal-meta">

                <span>
                  <User size={15} /> {selectedPost.author}
                </span>

                <span>
                  <Calendar size={15} /> {selectedPost.date}
                </span>

                <span>
                  <Clock size={15} /> {selectedPost.readTime}
                </span>

              </div>

              <p className="modal-blog-content">

                {selectedPost.excerpt}

                <br /><br />

                Learning a language is one of the most rewarding journeys.
                Consistent practice, reading articles, speaking with native
                speakers and expanding your vocabulary daily will help you
                become fluent faster.

                <br /><br />

                Make learning a habit instead of a task. Spend at least
                15-20 minutes every day practicing listening, reading,
                writing and speaking.

                <br /><br />

                Remember that mistakes are part of the learning process.
                Every mistake helps you improve and brings you one step
                closer to fluency.

              </p>

            </Modal.Body>

          </>

        )}

      </Modal>

    </div>
  );
};

export default Blog;

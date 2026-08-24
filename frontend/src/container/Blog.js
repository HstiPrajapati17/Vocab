import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Spinner } from 'react-bootstrap';
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
import {
  getBlogPosts,
  getBlogFilters,
  getFeaturedPost,
  getBlogHeroStats,
} from '../api';

const ICON_MAP = {
  BookOpen,
  TrendingUp,
  Clock,
};

const getStatIcon = (key) => ICON_MAP[key] || BookOpen;

const Blog = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [filters, setFilters] = useState([]);
  const [heroStats, setHeroStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getBlogPosts(),
      getBlogFilters(),
      getFeaturedPost(),
      getBlogHeroStats(),
    ])
      .then(([posts, filts, feat, stats]) => {
        setBlogPosts(Array.isArray(posts) ? posts : []);
        setFilters(Array.isArray(filts) ? filts.map(f => f.name) : []);
        setFeaturedPost(feat || null);
        setHeroStats(
          Array.isArray(stats)
            ? stats.map((s) => ({
                ...s,
                icon: React.createElement(getStatIcon(s.iconKey), { size: 20 }),
              }))
            : [],
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredPosts =
    selectedFilter === "All"
      ? blogPosts
      : blogPosts.filter(
        (post) => post.category === selectedFilter
      );

  if (loading) {
    return (
      <div className="blog-page-unique">
        <div className="text-center py-5">
          <Spinner animation="border" variant="success" />
          <p className="text-muted mt-2">Loading blog…</p>
        </div>
      </div>
    );
  }

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
                  {heroStats.map((s, i) => (
                    <div className="blog-stat" key={i}>
                      {s.icon}
                      <div>
                        <h4>{s.value}</h4>
                        <p>{s.label}</p>
                      </div>
                    </div>
                  ))}
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
                            <Heart size={14} /> {post.likes ?? 0}
                          </span>

                          <span className="blog-action">
                            <MessageCircle size={14} /> {post.comments ?? 0}
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

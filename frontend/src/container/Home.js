import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Navbar, Spinner } from "react-bootstrap";
import {
  Globe,
  Star,
  Flame,
  Trophy,
  ArrowRight,
  BookOpen,
  Users,
  Zap,
  CheckCircle,
  TrendingUp,
  Award,
} from "lucide-react";
import flag_1 from "../assets/USFlag.webp";
import flag_2 from "../assets/FranceFlag.png";
import flag_3 from "../assets/GermanyFlag.jpg";
import flag_4 from "../assets/PolandFlag.png";
import {
  getLanguages,
  getHomeFeatures,
  getHomeSteps,
  getHomeStats,
} from "../api";

const ICON_MAP = {
  Star: Star,
  Flame: Flame,
  Trophy: Trophy,
  Globe: Globe,
  Users: Users,
  BookOpen: BookOpen,
  Award: Award,
};

const FLAG_MAP = {
  "USFlag.webp": flag_1,
  "FranceFlag.png": flag_2,
  "GermanyFlag.jpg": flag_3,
  "PolandFlag.png": flag_4,
};

const getIcon = (key) => ICON_MAP[key] || Star;

const Home = () => {
  const navigate = useNavigate();
  const [languages, setLanguages] = useState([]);
  const [features, setFeatures] = useState([]);
  const [steps, setSteps] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getLanguages(),
      getHomeFeatures(),
      getHomeSteps(),
      getHomeStats(),
    ])
      .then(([lang, feat, stp, stat]) => {
        setLanguages(
          lang.map((l) => ({ ...l, flag: FLAG_MAP[l.flagImg] || flag_1 })),
        );
        setFeatures(
          feat.map((f) => ({ ...f, icon: React.createElement(getIcon(f.iconKey), { size: 24 }) })),
        );
        setSteps(stp);
        setStats(
          stat.map((s) => ({
            ...s,
            icon: React.createElement(getIcon(s.iconKey), { size: 20 }),
          })),
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="hp_page">
        <div className="text-center py-5">
          <Spinner animation="border" variant="success" />
          <p className="text-muted mt-2">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hp_page">
      {/* ── HERO ── */}
      <section className="hp_hero ">
        {/* background blobs */}
        <div className="hp_hero_blob hp_hero_blob_1" aria-hidden="true" />
        <div className="hp_hero_blob hp_hero_blob_2" aria-hidden="true" />

        <Container
          style={{
            maxWidth: "var(--container-wide)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Row className="align-items-center g-5">
            {/* Text */}
            <Col lg={6} className="order-lg-1 order-2">
              <div className="hp_hero_pill">
                <BookOpen size={14} />
                <span>Free language learning</span>
              </div>
              <h1 className="hp_hero_title">
                The smarter way to learn a&nbsp;
                <span className="hp_hero_accent">language</span>
              </h1>
              <p className="hp_hero_sub">
                Bite‑sized lessons, daily streaks and real rewards. Join
                millions of learners and start your journey today — completely
                free.
              </p>

              {/* trust row */}
              <div className="hp_trust_row">
                {["No credit card", "Free forever", "Start in 60 s"].map(
                  (t) => (
                    <span className="hp_trust_chip" key={t}>
                      <CheckCircle size={13} /> {t}
                    </span>
                  ),
                )}
              </div>

              <div className="hp_hero_actions">
                <Button
                  className="hp_btn_primary"
                  onClick={() => navigate("/onboarding")}
                >
                  Get Started — It's Free <ArrowRight size={16} />
                </Button>
                <Button
                  className="hp_btn_ghost"
                  onClick={() => navigate("/login")}
                >
                  I have an account
                </Button>
              </div>
            </Col>

            {/* Visual card */}
            <Col
              lg={6}
              className="order-lg-2 order-1 d-flex justify-content-center"
            >
              <div className="hp_card_wrap">
                {/* ghost card behind */}
                <div className="hp_card hp_card_ghost" aria-hidden="true" />

                {/* main card */}
                <div className="hp_card hp_card_main">
                  <div className="hp_card_header">
                    <div>
                      <p className="hp_card_header_label">My Courses</p>
                      <p className="hp_card_header_sub">
                        Daily goal: 68 / 100 XP
                      </p>
                    </div>
                    <span className="hp_badge_active">4 active</span>
                  </div>

                  {/* progress bar */}
                  <div className="hp_xp_track">
                    <div className="hp_xp_fill" style={{ width: "68%" }} />
                  </div>

                  {/* language rows */}
                  <div className="hp_lang_list">
                    {languages.map((lang) => (
                      <div className="hp_lang_row" key={lang.name}>
                        <div className="hp_lang_flag_wrap">
                          <img
                            src={lang.flag}
                            alt={lang.name}
                            className="hp_lang_flag_img"
                          />
                        </div>
                        <div className="hp_lang_info">
                          <span className="hp_lang_name">{lang.name}</span>
                          <span className="hp_lang_sub">
                            {lang.learners} learners
                          </span>
                        </div>
                        <Zap size={16} className="hp_lang_zap" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* floating XP badge */}
                <div className="hp_float_badge hp_float_xp">
                  <TrendingUp size={14} /> +20 XP earned
                </div>
                {/* floating streak badge */}
                <div className="hp_float_badge hp_float_streak">
                  <Flame size={14} /> 7 day streak 🔥
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── STATS RIBBON ── */}
      <section className="hp_stats_ribbon">
        <Container style={{ maxWidth: "var(--container-wide)" }}>
          <div className="hp_stats_grid">
            {stats.map((s, i) => (
              <div className="hp_stat_item" key={i}>
                <div className="hp_stat_icon">{s.icon}</div>
                <div className="hp_stat_value">{s.value}</div>
                <div className="hp_stat_label">{s.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── LANGUAGES ── */}
      <section className="hp_section hp_section_white" id="courses">
        <Container style={{ maxWidth: "var(--container-wide)" }}>
          <div className="hp_section_head">
            <div className="hp_section_pill">
              <Globe size={14} /> Language courses
            </div>
            <h2 className="hp_section_title">I want to learn…</h2>
            <p className="hp_section_sub">
              Choose a language and start for free
            </p>
          </div>

          <div className="hp_lang_cards_grid" role="list">
            {languages.map((lang, i) => (
              <div
                className="hp_lang_card"
                key={i}
                onClick={() => navigate("/signup")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate("/signup");
                  }
                }}
                role="listitem"
                aria-label={`Learn ${lang.name} - Start language course`}
                tabIndex={0}
              >
                <div className="hp_lang_card_flag_wrap">
                  <img
                    src={lang.flag}
                    alt={`${lang.name} flag`}
                    className="hp_lang_card_flag"
                    loading="lazy"
                  />
                </div>
                <div className="hp_lang_card_body">
                  <p className="hp_lang_card_name">{lang.name}</p>
                  <p className="hp_lang_card_native">{lang.native}</p>
                  <div className="hp_lang_card_foot">
                    <span className="hp_lang_card_learners">
                      <Users size={11} aria-hidden="true" /> {lang.learners}
                    </span>
                    <span className="hp_lang_card_cta" aria-hidden="true">
                      Start <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <Button
              className="hp_btn_outline"
              onClick={() => navigate("/signup")}
            >
              View All Languages <ArrowRight size={15} className="ms-1" />
            </Button>
          </div>
        </Container>
      </section>

      {/* ── FEATURES ── */}
      <section className="hp_section hp_section_tinted">
        <Container style={{ maxWidth: "var(--container-wide)" }}>
          <div className="hp_section_head">
            <h2 className="hp_section_title">Why VocabLearn?</h2>
            <p className="hp_section_sub">
              Science-backed methods in a clean, focused experience
            </p>
          </div>

          <div className="hp_features_grid">
            {features.map((f, i) => (
              <div className="hp_feature_card" key={i}>
                <div
                  className="hp_feature_icon_wrap"
                  style={{ "--f-accent": f.accent }}
                >
                  {f.icon}
                </div>
                <h3 className="hp_feature_title">{f.title}</h3>
                <p className="hp_feature_desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="hp_section hp_section_white">
        <Container style={{ maxWidth: "var(--container-wide)" }}>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <div className="hp_section_pill" style={{ marginBottom: 16 }}>
                <CheckCircle size={14} /> How it works
              </div>
              <h2 className="hp_section_title mb-4">Five steps to fluency</h2>
              <div className="hp_steps">
                {steps.map((s, i) => (
                  <div className="hp_step" key={i}>
                    <div className="hp_step_num">{i + 1}</div>
                    <div className="hp_step_icon">{s.icon}</div>
                    <p className="hp_step_text">{s.text}</p>
                    {i < steps.length - 1 && (
                      <div className="hp_step_connector" aria-hidden="true" />
                    )}
                  </div>
                ))}
              </div>
              <Button
                className="hp_btn_primary mt-4"
                onClick={() => navigate("/signup")}
              >
                Start Learning Now <ArrowRight size={16} />
              </Button>
            </Col>

            {/* App mockup */}
            <Col lg={6} className="d-flex justify-content-center">
              <div className="hp_mockup">
                <div className="hp_mockup_notch" aria-hidden="true" />
                <div className="hp_mockup_inner">
                  <div className="hp_mk_header">
                    <span className="hp_mk_title">Daily Goal</span>
                    <span className="hp_mk_streak">
                      <Flame size={14} /> 7 days
                    </span>
                  </div>

                  <div className="hp_mk_progress_wrap">
                    <div className="hp_mk_progress_bar">
                      <div
                        className="hp_mk_progress_fill"
                        style={{ width: "65%" }}
                      />
                    </div>
                    <span className="hp_mk_xp_label">65 / 100 XP</span>
                  </div>

                  <div className="hp_mk_card">
                    <span className="hp_mk_card_emoji">🔤</span>
                    <span className="hp_mk_card_label">Vocabulary</span>
                    <span className="hp_mk_badge">+10 XP</span>
                  </div>
                  <div className="hp_mk_card">
                    <span className="hp_mk_card_emoji">🎧</span>
                    <span className="hp_mk_card_label">Listening</span>
                    <span className="hp_mk_badge">+15 XP</span>
                  </div>
                  <div className="hp_mk_card">
                    <span className="hp_mk_card_emoji">✍️</span>
                    <span className="hp_mk_card_label">Writing</span>
                    <span className="hp_mk_badge hp_mk_badge_locked">
                      Locked
                    </span>
                  </div>

                  <div className="hp_mk_footer">
                    <span>🔥 Keep your streak!</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── CTA / NEWSLETTER ── */}
      <section className="hp_cta">
        <div className="hp_cta_glow hp_cta_glow_tl" aria-hidden="true" />
        <div className="hp_cta_glow hp_cta_glow_br" aria-hidden="true" />

        <Container
          style={{ maxWidth: "860px", position: "relative", zIndex: 2 }}
        >
          <div className="hp_cta_inner">
            <div className="hp_cta_eyebrow">
              <span className="hp_cta_eyebrow_dot" />
              Join 500M+ learners worldwide
            </div>

            <h2 className="hp_cta_title">
              Ready to speak a new&nbsp;
              <span className="hp_cta_title_accent">language?</span>
            </h2>

            <p className="hp_cta_sub">
              Drop your email and we'll send you a personalised study plan —
              free forever.
            </p>

            {/* newsletter input row */}
            <form
              className="hp_nl_form"
              onSubmit={(e) => {
                e.preventDefault();
                navigate("/signup");
              }}
            >
              <div className="hp_nl_input_wrap">
                <input
                  type="email"
                  className="hp_nl_input"
                  placeholder="Enter your email address…"
                  aria-label="Email address"
                />
              </div>
              <button type="submit" className="hp_nl_btn">
                Get My Free Plan <ArrowRight size={16} />
              </button>
            </form>

            <div className="hp_cta_trust">
              {["⚡ Free forever", "🌍 03+ languages"].map(
                (t) => (
                  <span key={t} className="hp_cta_trust_item">
                    {t}
                  </span>
                ),
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ── FOOTER ── */}
      <footer className="hp_footer">
        <Container style={{ maxWidth: "var(--container-wide)" }}>
          {/* top row */}
          <div className="hp_footer_top">
            <div className="hp_footer_brand_col">
              <div className="hp_footer_brand">
                <Navbar.Brand
                  className="h_navbar_brand d-flex align-items-center"
                  style={{ cursor: "pointer" }}
                >
                  <div className="h_brand_logo_img">
                    <img src="https://png.pngtree.com/png-vector/20260128/ourlarge/pngtree-a-small-green-bird-flying-with-spread-wings-on-black-background-png-image_18307190.webp" />
                  </div>
                </Navbar.Brand>
                {/* <span className="hp_footer_logo">V</span> */}
                <span className="hp_footer_name">VocabLearn</span>
              </div>
              <p className="hp_footer_tagline">
                The smarter, faster, free way to learn a new language.
              </p>
            </div>

            <div className="hp_footer_nav_cols">
              <div className="hp_footer_col">
                <p className="hp_footer_col_title">Product</p>
                {["Courses", "Leaderboard", "Quests", "Shop"].map((l) => (
                  <span className="hp_footer_link" key={l}>
                    {l}
                  </span>
                ))}
              </div>
              <div className="hp_footer_col">
                <p className="hp_footer_col_title">Company</p>
                {["About", "Blog", "Help"].map((l) => (
                  <span className="hp_footer_link" key={l}>
                    {l}
                  </span>
                ))}
              </div>
              <div className="hp_footer_col">
                <p className="hp_footer_col_title">Legal</p>
                {["Privacy", "Terms"].map((l) => (
                  <span className="hp_footer_link" key={l}>
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* divider */}
          <div className="hp_footer_divider" />

          {/* bottom row */}
          <div className="hp_footer_bottom">
            <p className="hp_footer_copy">
              © 2025 VocabLearn. All rights reserved.
            </p>
            <div className="hp_footer_badges">
              <span className="hp_footer_badge">🌍 03+ Languages</span>
              <span className="hp_footer_badge">⭐ #1 Education App</span>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Home;

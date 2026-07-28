import React, { useState, useRef } from "react";
import { Container } from "react-bootstrap";
import { ChevronDown, ChevronRight, Send } from "lucide-react";
import "../style/info_pages.css";
import { Link } from "react-router-dom";

/* ── FAQ data grouped by category ───────────────────────── */
const faqGroups = [
  {
    id: "using",
    label: "Using VocabLearn",
    items: [
      {
        q: "Why did my course change?",
        a: "We occasionally update course content to improve quality and add new lessons. Your progress is always preserved when changes occur.",
      },
      {
        q: "What is a streak?",
        a: "A streak counts the number of consecutive days you have completed at least one lesson. Maintaining your streak earns bonus XP and special rewards!",
      },
      {
        q: "What are leaderboards and leagues?",
        a: "Each week you compete with learners in your league. Earn XP to climb the ranks and get promoted to a higher league at the end of the week.",
      },
      {
        q: "How do I earn XP?",
        a: "XP is earned by completing lessons, quizzes, daily quests, and streak bonuses. The harder the exercise, the more XP you receive.",
      },
    ],
  },
  {
    id: "account",
    label: "Account Management",
    items: [
      {
        q: "How do I change my username or email address?",
        a: "Go to Settings → Profile. You can update your display name and email address from there. Changes take effect immediately.",
      },
      {
        q: "How do I find, follow, and block users?",
        a: "Visit the Leaderboard or another user's Profile page. Use the menu icon next to their name to follow, unfollow, or block them.",
      },
      {
        q: "How do I remove or reset a course?",
        a: 'Open Courses, select the language you want to reset, and tap "Reset progress". This cannot be undone, so make sure you are certain before confirming.',
      },
      {
        q: "I'm having trouble accessing my account.",
        a: "Try resetting your password first. If you still can't log in, clear your browser cache or try a different browser. Contact support if the issue persists.",
      },
      {
        q: "How do I delete my account and access my data?",
        a: "Go to Settings → Account → Delete Account. You can also request a copy of your data before deleting. Deletion is permanent after a 30-day grace period.",
      },
    ],
  },
  {
    id: "subscription",
    label: "Subscription & Payments",
    items: [
      {
        q: "What is VocabLearn Plus and how do I subscribe?",
        a: "VocabLearn Plus removes ads, adds offline mode, and unlocks streak repair. Subscribe from the Shop page or your account settings.",
      },
      {
        q: "Family Plan",
        a: "The Family Plan lets up to 6 members share a Plus subscription at a reduced per-person cost. Invite family members from your account settings.",
      },
      {
        q: "How do I cancel my subscription?",
        a: "Cancel anytime from Settings → Subscription. Your Plus benefits continue until the end of the current billing period.",
      },
      {
        q: "How do I request a refund?",
        a: "Refund eligibility depends on your platform. iOS refunds go through Apple, Android through Google Play. Web subscribers can contact our support team directly.",
      },
      {
        q: "How do I use a promo code?",
        a: "Go to Settings → Subscription → Redeem Code, enter your promo code, and tap Apply. Discounts are applied to your next billing cycle.",
      },
    ],
  },
  {
    id: "languages",
    label: "Languages & Courses",
    items: [
      {
        q: "How do I switch to a different language?",
        a: "Open the Courses page and tap the language you want to switch to. Your progress for each language is stored separately.",
      },
      {
        q: "Can I learn multiple languages at once?",
        a: "Yes! You can have as many active courses as you like. XP and streaks are shared across all your languages.",
      },
      {
        q: "What languages are available?",
        a: "We currently offer English, French, German, and Polish with more coming soon. Check the Courses page for the full up-to-date list.",
      },
    ],
  },
];

const issueTypes = [
  "Please select one…",
  "Login / Account issue",
  "Billing / Payment",
  "Course content error",
  "App not working",
  "Streak / XP issue",
  "Other",
];

/* ── Accordion group ─────────────────────────────────────── */
const FaqGroup = ({ group }) => {
  const [openItems, setOpenItems] = useState([]);

  const toggle = (idx) =>
    setOpenItems((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
 v
  return (
    <div className="hlp2_group">
      <div className="hlp2_group_header">{group.label}</div>
      {group.items.map((item, idx) => {
        const isOpen = openItems.includes(idx);
        return (
          <div
            key={idx}
            className={`hlp2_ item ${isOpen ? "hlp2_item_open" : ""}`}
          >
            <button
              className="hlp2_item_q"
              onClick={() => toggle(idx)}
              aria-expanded={isOpen}
            >
              <span>{item.q}</span>
              <ChevronDown
                size={18}
                className={`hlp2_chevron ${isOpen ? "hlp2_chevron_open" : ""}`}
              />
            </button>
            {isOpen && <div className="hlp2_item_a">{item.a}</div>}
          </div>
        );
      })}
    </div>
  );
};

/* ── Feedback form ───────────────────────────────────────── */
const FeedbackForm = ({ onBack }) => {
  const [form, setForm] = useState({
    email: "",
    subject: "",
    description: "",
    type: "",
    file: null,
  });
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef();

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !form.email ||
      !form.subject ||
      !form.description ||
      !form.type ||
      form.type === issueTypes[0]
    )
      return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="hlp2_page">
        <Container>
          <div className="hlp2_breadcrumb">
            <button className="hlp2_bc_link" onClick={onBack}>
              HELP CENTER
            </button>
            <ChevronRight size={13} />
            <span className="hlp2_bc_current">FEEDBACK</span>
          </div>
          <div className="hlp2_submitted">
            <div className="hlp2_submitted_icon">✅</div>
            <h2 className="hlp2_form_title">Message sent!</h2>
            <p className="hlp2_submitted_sub">
              We'll get back to you within 24 hours.
            </p>
            <button
              className="hlp2_submit_btn"
              style={{ marginTop: 24 }}
              onClick={onBack}
            >
              Back to Help Center
            </button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="hlp2_page">
      <Container>
        <div className="hlp2_breadcrumb">
          <button className="hlp2_bc_link" onClick={onBack}>
            HELP CENTER
          </button>
          <ChevronRight size={13} />
          <span className="hlp2_bc_current">FEEDBACK</span>
        </div>

        <h1 className="hlp2_page_title">What can we help you with?</h1>

        <div className="hlp2_form_card">
          <form onSubmit={handleSubmit} className="hlp2_form_grid">
            {/* left description */}
            <div className="hlp2_form_left">
              <h3 className="hlp2_form_section_title">Describe your issue</h3>
              <p className="hlp2_form_section_sub">
                Please describe the issue you are experiencing in as much detail
                as possible. This will help us understand what's going on.
              </p>
            </div>

            {/* right fields */}
            <div className="hlp2_form_right">
              <div className="hlp2_field">
                <label className="hlp2_label">
                  Your Email Address <span className="hlp2_required">*</span>
                </label>
                <input
                  type="email"
                  className="hlp2_input"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="hlp2_field">
                <label className="hlp2_label">
                  Subject <span className="hlp2_required">*</span>
                </label>
                <input
                  type="text"
                  className="hlp2_input"
                  value={form.subject}
                  onChange={(e) => set("subject", e.target.value)}
                  required
                />
              </div>

              <div className="hlp2_field">
                <label className="hlp2_label">
                  Description <span className="hlp2_required">*</span>
                </label>
                <textarea
                  className="hlp2_input hlp2_textarea"
                  rows={4}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  required
                />
              </div>

              <div className="hlp2_field">
                <label className="hlp2_label">
                  Type of issue <span className="hlp2_required">*</span>
                </label>
                <div className="hlp2_select_wrap">
                  <select
                    className="hlp2_input hlp2_select"
                    value={form.type}
                    onChange={(e) => set("type", e.target.value)}
                    required
                  >
                    {issueTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="hlp2_select_arrow" />
                </div>
              </div>

              <div className="hlp2_field">
                <label className="hlp2_label">Attachments</label>
                <div
                  className="hlp2_drop_zone"
                  onClick={() => fileRef.current.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    set("file", e.dataTransfer.files[0]);
                  }}
                >
                  {form.file ? (
                    <span className="hlp2_file_name">{form.file.name}</span>
                  ) : (
                    <>
                      <span className="hlp2_drop_link">Add file</span> or drop
                      files here
                    </>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    style={{ display: "none" }}
                    onChange={(e) => set("file", e.target.files[0])}
                  />
                </div>
              </div>

              <div className="hlp2_form_footer">
                <button type="submit" className="hlp2_submit_btn">
                  <Send size={15} /> SUBMIT
                </button>
              </div>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
};

/* ── Main Help page ──────────────────────────────────────── */
const Help = () => {
  const [view, setView] = useState("faq"); // 'faq' | 'feedback'

  if (view === "feedback") {
    return <FeedbackForm onBack={() => setView("faq")} />;
  }

  return (
    <div className="hlp2_page">
      <Container>
        {/* breadcrumb */}
        <div className="hlp2_breadcrumb">
          <span className="hlp2_bc_dim text-decoration-none">
            <Link to={"/dashboard"}>HOME</Link>
          </span>
          <ChevronRight size={13} />
          <span className="hlp2_bc_current">HELP CENTER</span>
        </div>

        <h1 className="hlp2_page_title">Frequently Asked Questions</h1>

        <div className="hlp2_faq_container">
          {faqGroups.map((group) => (
            <FaqGroup key={group.id} group={group} />
          ))}
        </div>

        {/* bottom CTA */}
        <div className="hlp2_bottom_cta">
          <p className="hlp2_bottom_text">Still unsure about something?</p>
          <button
            className="hlp2_feedback_btn"
            onClick={() => setView("feedback")}
          >
            SEND FEEDBACK
          </button>
        </div>
      </Container>
    </div>
  );
};

export default Help;

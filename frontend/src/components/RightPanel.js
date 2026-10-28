import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ProgressBar } from 'react-bootstrap';
import { Flame, Heart, BookOpen } from 'lucide-react';

const langFlags = {
  English: 'E🇸', French: '🇫🇷', German: '🇩🇪', Polish: '�',
};

const langMeta = {
  English: { learners: '1.5B', level: 'Global language' },
  French: { learners: '18M', level: 'Popular choice' },
  German: { learners: '12M', level: 'Structured path' },
  Polish: { learners: '8M', level: 'Slavic language' },
  default: { learners: '5M+', level: 'Start learning today' },
};

const RightPanel = ({ user, previewLanguage, currentPage, navigate, lessonCount = 0, completedCount = 0 }) => {
  const activeLang = previewLanguage || user?.language || 'English';
  const flag = langFlags[activeLang] || '🌍';
  const meta = langMeta[activeLang] || langMeta.default;

  const progress = lessonCount > 0 ? Math.round((completedCount / lessonCount) * 100) : 0;

  const showCoursePreview = currentPage === 'courses' && previewLanguage;

  // Hover states
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [tooltipSize, setTooltipSize] = useState({ w: 280, h: 120 });
  const closeTimeoutRef = useRef(null);
  const tooltipRef = useRef(null);
  const lastTriggerRect = useRef(null);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const measureTooltip = () => {
    if (tooltipRef.current) {
      const r = tooltipRef.current.getBoundingClientRect();
      const w = r.width || 280;
      const h = r.height || 120;
      if (Math.abs(w - tooltipSize.w) > 1 || Math.abs(h - tooltipSize.h) > 1) {
        setTooltipSize({ w, h });
      }
    }
  };

  useEffect(() => {
    if (hoveredItem && tooltipRef.current) {
      const t = setTimeout(measureTooltip, 10);
      return () => clearTimeout(t);
    }
  }, [hoveredItem]);

  const computePositionFromRect = (rect, tw, th) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const gap = 12;
    const margin = 12;

    const elementCenterX = rect.left + rect.width / 2;
    let x = elementCenterX - tw / 2;

    if (x < margin) x = margin;
    if (x + tw > vw - margin) {
      x = vw - margin - tw;
    }

    let y = rect.bottom + gap;
    if (y + th > vh - margin) {
      y = rect.top - gap - th;
      if (y < margin) {
        y = vh - margin - th;
      }
    }

    return { x, y };
  };

  const recalcPositionNow = () => {
    if (hoveredItem && lastTriggerRect.current) {
      const rect = lastTriggerRect.current;
      const pos = computePositionFromRect(rect, tooltipSize.w, tooltipSize.h);
      setHoverPosition(pos);
    }
  };

  const handleMouseEnter = (item, event) => {
    clearCloseTimeout();
    if (event) {
      const rect = event.currentTarget.getBoundingClientRect();
      lastTriggerRect.current = rect;
    }
    setHoveredItem(item);
    requestAnimationFrame(() => {
      if (lastTriggerRect.current) {
        const pos = computePositionFromRect(lastTriggerRect.current, tooltipSize.w, tooltipSize.h);
        setHoverPosition(pos);
      }
    });
  };

  useEffect(() => {
    if (hoveredItem && lastTriggerRect.current) {
      const pos = computePositionFromRect(lastTriggerRect.current, tooltipSize.w, tooltipSize.h);
      setHoverPosition(pos);
    }
  }, [tooltipSize, hoveredItem]);

  const handleMouseLeave = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredItem(null);
    }, 200);
  };

  const handleTooltipMouseEnter = () => {
    clearCloseTimeout();
  };

  const handleTooltipMouseLeave = () => {
    handleMouseLeave();
  };

  useEffect(() => {
    return () => clearCloseTimeout();
  }, []);

  useEffect(() => {
    const handleScrollOrResize = () => {
      recalcPositionNow();
    };
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);
    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [hoveredItem, tooltipSize]);

  return (
    <aside className="h_right_panel">
      {/* Stats bar */}
      <div className="h_rp_stats">
        <button 
          type="button" 
          className="h_rp_stat h_rp_lang_btn" 
          onClick={() => navigate('/courses')} 
          title="Change language"
          onMouseEnter={(e) => handleMouseEnter('language', e)}
          onMouseLeave={handleMouseLeave}
        >
          <span className="h_rp_flag">{flag}</span>
        </button>
        <div 
          className="h_rp_stat"
          onMouseEnter={(e) => handleMouseEnter('streak', e)}
          onMouseLeave={handleMouseLeave}
        >
          <Flame className="h_icon_fire" size={20} />
          <span>{user?.streak || 0}</span>
        </div>
        <div 
          className="h_rp_stat"
          onMouseEnter={(e) => handleMouseEnter('hearts', e)}
          onMouseLeave={handleMouseLeave}
        >
          <Heart className="h_icon_heart" size={20} />
          <span>{user?.hearts ?? 5}</span>
        </div>
      </div>

      {/* Hover Tooltip - mounted at document.body via Portal */}
      {hoveredItem && typeof document !== 'undefined' && createPortal(
        <div 
          ref={tooltipRef}
          className="h_rp_tooltip"
          style={{
            position: 'fixed',
            left: `${hoverPosition.x}px`,
            top: `${hoverPosition.y}px`,
            zIndex: 9999
          }}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
        >
          {hoveredItem === 'language' && (
            <div className="h_rp_tooltip_content">
              <h6 className="fw-bold mb-1">{activeLang}</h6>
              <p className="small text-muted mb-0">{meta.learners} learners · {meta.level}</p>
            </div>
          )}
          {hoveredItem === 'streak' && (
            <div className="h_rp_tooltip_content">
              <h6 className="fw-bold mb-1">Day Streak</h6>
              <p className="small text-muted mb-0">You have a {user?.streak || 0} day streak!</p>
            </div>
          )}
          {hoveredItem === 'hearts' && (
            <div className="h_rp_tooltip_content">
              <h6 className="fw-bold mb-1">Hearts</h6>
              <p className="small text-muted mb-0">You have {user?.hearts ?? 5} hearts</p>
            </div>
          )}
          {hoveredItem === 'course' && (
            <div className="h_rp_tooltip_content">
              <h6 className="fw-bold mb-1">{activeLang} Course</h6>
              <p className="small text-muted mb-0">{meta.learners} learners · {progress}% complete</p>
            </div>
          )}
        </div>,
        document.body
      )}

      {/* Language preview when selecting courses */}
      {showCoursePreview && (
        <div className="h_rp_card h_rp_lang_preview">
          <div className="h_rp_lang_preview_flag">{flag}</div>
          <h6 className="fw-bold mb-1">{activeLang}</h6>
          <p className="text-muted small mb-2">{meta.learners} learners · {meta.level}</p>
          <p className="small mb-0">Switch to this course to update your learning path.</p>
        </div>
      )}

      {/* Current course progress */}
      <div 
        className="h_rp_card"
        onMouseEnter={(e) => handleMouseEnter('course', e)}
        onMouseLeave={handleMouseLeave}
      >
        <div className="d-flex align-items-center gap-2 mb-2">
          <BookOpen size={18} style={{ color: 'var(--primary)' }} />
          <h6 className="fw-bold mb-0">{activeLang}</h6>
        </div>
        <p className="text-muted small mb-2">{user?.level || 'Beginner'} · {completedCount}/{lessonCount || '—'} lessons</p>
        <ProgressBar now={progress} className="h_course_bar" />
        <p className="small text-muted mt-2 mb-0">{progress}% complete</p>
      </div>

      {/* Footer links */}
      <div className="h_rp_footer">
        <button className="h_rp_footer_link" style={{ opacity: 0.8 }} onClick={() => navigate('/about')}>ABOUT</button>
        <button className="h_rp_footer_link" style={{ opacity: 0.8 }} onClick={() => navigate('/blog')}>BLOG</button>
        {/* <span className="h_rp_footer_link" style={{ opacity: 0.8 }}>STORE</span> */}
        <button className="h_rp_footer_link" style={{ opacity: 0.8 }} onClick={() => navigate('/terms')}>TERMS</button>
        <button className="h_rp_footer_link" style={{ opacity: 0.8 }} onClick={() => navigate('/privacy')}>PRIVACY</button>
        <button className="h_rp_footer_link" style={{ opacity: 0.8 }} onClick={() => navigate('/help')}>HELP</button>
      </div>
    </aside>
  );
};

export default RightPanel;

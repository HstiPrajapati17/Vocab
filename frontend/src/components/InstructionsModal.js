import React from 'react';
import { Modal } from 'react-bootstrap';
import { BookOpen, Check, Circle } from 'lucide-react';

const InstructionsModal = ({ show, onHide, sections = [] }) => {
  const populatedSections = sections.filter((section) =>
    (Array.isArray(section.points) && section.points.length > 0) || section.description
  );

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      scrollable
      size="lg"
      className="h_instructions_modal h_guidebook_modal"
    >
      <Modal.Header closeButton className="h_modal_header">
        <div className="d-flex align-items-center gap-2">
          <BookOpen size={24} className="mt-1" style={{ color: 'var(--primary-dark)' }} />
          <Modal.Title className="h_modal_title">Journey Guidebook</Modal.Title>
        </div>
      </Modal.Header>
      <Modal.Body className="h_modal_body h_guidebook_body">
        {populatedSections.length ? populatedSections.map((section) => {
          const points = Array.isArray(section.points) ? section.points : [];
          const completed = points.filter((point) => typeof point === 'object' && point?.isCompleted).length;
          const progress = section.progressPercent ?? (points.length ? Math.round((completed / points.length) * 100) : 0);

          return (
            <section className="h_guidebook_section" key={section.id || section._id || section.title}>
              <h3 className="h_guidebook_section_title">{section.title || section.name}</h3>
              {points.length > 0 ? (
                <>
                  <div className="h_guidebook_progress" aria-label={`${progress}% complete`}>
                    <span style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} />
                  </div>
                  <ul className="h_guidebook_points">
                    {points.map((point, index) => {
                      const text = typeof point === 'string' ? point : point?.text;
                      if (!text) return null;
                      const isCompleted = typeof point === 'object' && point?.isCompleted;
                      return (
                        <li key={`${index}-${text}`} className={isCompleted ? 'h_guidebook_point_done' : ''}>
                          {isCompleted ? <Check size={17} /> : <Circle size={17} />}
                          <span>{text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </>
              ) : (
                <p className="h_guidebook_description">{section.description}</p>
              )}
            </section>
          );
        }) : (
          <p className="h_guidebook_empty">There are no guidebook points for this journey yet.</p>
        )}
      </Modal.Body>
      <Modal.Footer className="h_modal_footer">
        <button type="button" className="h_modal_close_btn" onClick={onHide}>Got it!</button>
      </Modal.Footer>
    </Modal>
  );
};

export default InstructionsModal;

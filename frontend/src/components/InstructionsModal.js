import React from 'react';
import { Modal } from 'react-bootstrap';
import { BookOpen, X, Check, ArrowRight, Target, Star } from 'lucide-react';

const InstructionsModal = ({ show, onHide }) => {
  const instructions = [
    {
      icon: <Target size={24} />,
      title: 'Complete Lessons',
      description: 'Click on lesson nodes to start learning. Complete lessons to unlock new content and earn XP.'
    },
    {
      icon: <Star size={24} />,
      title: 'Earn XP',
      description: 'Gain experience points for completing lessons. Track your progress and level up your language skills.'
    },
    {
      icon: <Check size={24} />,
      title: 'Track Progress',
      description: 'Your completed lessons are marked with checkmarks. Continue your journey from where you left off.'
    },
    {
      icon: <ArrowRight size={24} />,
      title: 'Follow the Path',
      description: 'Lessons are organized in a learning path. Start from the beginning and work your way through each unit.'
    }
  ];

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered
      size="lg"
      className="h_instructions_modal"
    >
      <Modal.Header closeButton className="h_modal_header">
        <div className="d-flex align-items-center gap-2">
          <BookOpen size={25} className="mt-1" style={{color:"var(--primary-dark)"}}/>
          <Modal.Title className="h_modal_title">Guidebook Instructions</Modal.Title>
        </div>
      </Modal.Header>
      <Modal.Body className="h_modal_body">
        <div className="h_instructions_content">
          <p className="h_instructions_intro mb-4">
            Welcome to your language learning journey! Follow these steps to make the most of your experience:
          </p>
          <div className="h_instructions_list">
            {instructions.map((instruction, index) => (
              <div key={index} className="h_instruction_item">
                <div className="h_instruction_icon">
                  {instruction.icon}
                </div>
                <div className="h_instruction_content">
                  <h5 className="h_instruction_title">{instruction.title}</h5>
                  <p className="h_instruction_desc">{instruction.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="h_instructions_tips mt-4 p-3 bg-light rounded">
            <h6 className="fw-bold mb-2">💡 Tips for Success:</h6>
            <ul className="mb-0">
              <li>Practice daily to maintain your learning streak</li>
              <li>Review previous lessons to reinforce your knowledge</li>
              <li>Use the pronunciation feature to improve your accent</li>
              <li>Complete all exercises in each lesson for maximum XP</li>
            </ul>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="h_modal_footer">
        <button 
          type="button" 
          className="h_modal_close_btn"
          onClick={onHide}
        >
          Got it!
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default InstructionsModal;

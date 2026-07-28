import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';
import BottomNav from './BottomNav';
import { Modal, Button } from 'react-bootstrap';
import { LogOut } from 'lucide-react';
import { useApp } from '../App';

const AppShell = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, handleLogout, previewLanguage, lessonStats } = useApp();
  const currentPage = location.pathname.replace('/', '') || 'dashboard';

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const openLogoutModal = () => setShowLogoutModal(true);
  const closeLogoutModal = () => {
    if (!isLoggingOut) setShowLogoutModal(false);
  };
  const confirmLogout = async () => {
    try {
      setIsLoggingOut(true);
      await Promise.resolve(handleLogout?.());
      navigate('/signin', { replace: true });
      setShowLogoutModal(false);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="h_app_shell">
      <Sidebar
        currentPage={currentPage}
        navigate={navigate}
        onRequestLogout={openLogoutModal}
      />

      <div className="h_shell_body">
        <main className="h_shell_center">
          {children}
        </main>

        <RightPanel
          user={user}
          previewLanguage={previewLanguage}
          currentPage={currentPage}
          navigate={navigate}
          lessonCount={lessonStats.total}
          completedCount={lessonStats.completed}
        />
      </div>

      <BottomNav
        currentPage={currentPage}
        navigate={navigate}
        onRequestLogout={openLogoutModal}
      />

      {/* =============================================
          CENTRALIZED RESPONSIVE LOGOUT MODAL
          Works for:
            - Large screens (via Sidebar)
            - Tablet & Mobile (via BottomNav)
          ============================================= */}
      <Modal
        show={showLogoutModal}
        onHide={closeLogoutModal}
        centered
        className="h_logout_modal"
        contentClassName="h_logout_modal_content"
        dialogClassName="h_logout_modal_dialog"
        backdrop={isLoggingOut ? 'static' : true}
        keyboard={!isLoggingOut}
      >
        <Modal.Header closeButton className="h_logout_modal_header">
          <Modal.Title className="h_logout_modal_title">
            ⚠️ Confirm Logout
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="h_logout_modal_body">
          <p className="h_logout_modal_text">
            Are you sure you want to logout?
          </p>
          <p className="h_logout_modal_subtext">
            You will need to login again to continue your learning journey!
          </p>
        </Modal.Body>

        <Modal.Footer className="h_logout_modal_footer">
          <Button
            variant="secondary"
            onClick={closeLogoutModal}
            disabled={isLoggingOut}
            className="h_logout_modal_btn h_logout_modal_btn_cancel"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={confirmLogout}
            disabled={isLoggingOut}
            className="h_logout_modal_btn h_logout_modal_btn_danger"
          >
            <LogOut size={16} className="me-2" />
            {isLoggingOut ? 'Logging out...' : 'Yes, Logout'}
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        .h_logout_modal_dialog {
          max-width: min(92vw, 440px);
          margin: 1rem auto;
        }
        .h_logout_modal_content {
          border-radius: var(--radius-xl) !important;
          border: 1px solid var(--primary-border) !important;
          box-shadow: var(--shadow-lg) !important;
          overflow: hidden;
          background: var(--bg-white);
        }
        .h_logout_modal_header {
          background: var(--danger-soft);
          border-bottom: 2px solid rgba(196, 92, 92, 0.2) !important;
          padding: 1rem 1.25rem;
        }
        .h_logout_modal_title {
          font-weight: 800;
          color: var(--danger);
          font-size: 1.2rem;
          line-height: 1.2;
        }
        .h_logout_modal_body {
          padding: 1.5rem 1.25rem;
          background: var(--bg-white);
        }
        .h_logout_modal_text {
          font-size: 1rem;
          color: var(--text);
          margin-bottom: 0.35rem;
          font-weight: 600;
        }
        .h_logout_modal_subtext {
          font-size: 0.88rem;
          color: var(--text-muted);
          margin-bottom: 0;
          line-height: 1.6;
        }
        .h_logout_modal_footer {
          border-top: 1px solid var(--primary-border) !important;
          padding: 1rem 1.25rem !important;
          background: var(--bg-card);
          gap: 0.75rem;
        }
        .h_logout_modal_btn {
          min-width: 132px;
          border: none !important;
          border-radius: var(--radius-md) !important;
          font-weight: 700 !important;
          padding: 0.7rem 1.25rem !important;
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          transition: transform 0.1s ease-in-out;
        }
        .h_logout_modal_btn_cancel {
          background: var(--bg-muted) !important;
          color: var(--text-muted) !important;
        }
        .h_logout_modal_btn_danger {
          background: var(--danger) !important;
          box-shadow: 0 3px 0 rgba(196, 92, 92, 0.5);
        }
        .h_logout_modal .btn-close {
          filter: none !important;
        }
        .h_logout_modal_btn:disabled {
          opacity: 0.75;
          cursor: not-allowed;
          box-shadow: none !important;
        }
        @media (min-width: 992px) {
          .h_logout_modal_btn:hover {
            transform: translateY(-1px);
          }
          .h_logout_modal_btn:active {
            transform: translateY(1px);
          }
        }
        @media (max-width: 575.98px) {
          .h_logout_modal_dialog {
            max-width: calc(100vw - 1rem);
            margin: 0.5rem auto;
          }
          .h_logout_modal_header {
            padding: 0.9rem 1rem;
          }
          .h_logout_modal_title {
            font-size: 1.02rem;
            max-width: calc(100% - 1.5rem);
          }
          .h_logout_modal_body {
            padding: 1.15rem 1rem;
          }
          .h_logout_modal_footer {
            padding: 0.9rem 1rem !important;
            flex-direction: column-reverse;
          }
          .h_logout_modal_btn {
            width: 100%;
            min-width: 100%;
            min-height: 46px;
            font-size: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AppShell;

import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Offcanvas, Modal } from 'react-bootstrap';
import { Flame, Heart, Star, User, Trophy, BookOpen, LogOut, Menu } from 'lucide-react';

const AppNavbar = ({ navigate, isLoggedIn, onLogout, user, currentPage }) => {
  const [expanded, setExpanded] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleNav = (page) => {
    navigate(`/${page}`);
    setExpanded(false);
  };

  const openLogoutModal = () => {
    setExpanded(false);
    setShowLogoutModal(true);
  };
  const closeLogoutModal = () => {
    if (!isLoggingOut) setShowLogoutModal(false);
  };
  const confirmLogout = async () => {
    try {
      setIsLoggingOut(true);
      await Promise.resolve(typeof onLogout === 'function' ? onLogout() : null);
      navigate('/home', { replace: true });
      setShowLogoutModal(false);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Navbar
      className="h_navbar_main"
      sticky="top"
    >
      <Container fluid="xl" className="d-flex align-items-center justify-content-between">
        <Navbar.Brand
          onClick={() => handleNav(isLoggedIn ? 'dashboard' : 'home')}
          className="h_navbar_brand d-flex align-items-center"
          style={{ cursor: 'pointer' }}
        >
          <div className="h_brand_logo_img">
            <img src="https://png.pngtree.com/png-vector/20260128/ourlarge/pngtree-a-small-green-bird-flying-with-spread-wings-on-black-background-png-image_18307190.webp" />
          </div>
          {/* <span className="h_brand_icon">V</span> */}
          <span className="h_brand_text">VocabLearn</span>
        </Navbar.Brand>

        {/* Desktop Navigation */}
        <div className="d-none d-lg-flex align-items-center gap-3">
          <Nav className="h_nav_links gap-2">
            {isLoggedIn ? (
              <>
                <Nav.Link
                  onClick={() => handleNav('dashboard')}
                  className={`h_nav_link ${currentPage === 'dashboard' ? 'h_nav_active' : ''}`}
                >
                  <BookOpen className="me-1" size={16} /> Learn
                </Nav.Link>
                <Nav.Link
                  onClick={() => handleNav('leaderboard')}
                  className={`h_nav_link ${currentPage === 'leaderboard' ? 'h_nav_active' : ''}`}
                >
                  <Trophy className="me-1" size={16} /> Leaderboard
                </Nav.Link>
                <Nav.Link
                  onClick={() => handleNav('profile')}
                  className={`h_nav_link ${currentPage === 'profile' ? 'h_nav_active' : ''}`}
                >
                  <User className="me-1" size={16} /> Profile
                </Nav.Link>
              </>
            ) : (
              <>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => handleNav('login')}
                  className="h_btn_login"
                >
                  Log In
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleNav('onboarding')}
                  className="h_btn_signup"
                >
                  Get Started
                </Button>
              </>
            )}
          </Nav>

          {isLoggedIn && (
            <>
              <div className="d-flex align-items-center gap-3 h_stats_bar">
                <div className="h_stat_item">
                  <Flame className="h_icon_fire" size={18} />
                  <span>{user?.streak || 0}</span>
                </div>
                <div className="h_stat_item">
                  <Heart className="h_icon_heart" size={18} />
                  <span>{user?.hearts ?? 5}</span>
                </div>
                <div className="h_stat_item">
                  <Star className="h_icon_xp" size={18} />
                  <span>{user?.xp || 0} XP</span>
                </div>
              </div>

              <Button
                variant="outline-danger"
                size="sm"
                onClick={openLogoutModal}
                className="h_logout_btn d-flex align-items-center gap-1"
              >
                <LogOut size={16} /> Logout
              </Button>
            </>
          )}
        </div>

        {/* Mobile Elements */}
        <div className="d-flex d-lg-none align-items-center gap-2">
          {isLoggedIn && (
            <div className="d-flex align-items-center h_mobile_stats">
              <span className="h_stat_pill">
                <Flame className="h_icon_fire" size={16} />
                <span>{user?.streak || 0}</span>
              </span>
              <span className="h_stat_pill">
                <Heart className="h_icon_heart" size={16} />
                <span>{user?.hearts ?? 5}</span>
              </span>
            </div>
          )}

          <Button
            aria-controls="offcanvasNavbar"
            onClick={() => setExpanded(true)}
            className="h_navbar_toggle border-0 p-2"
          >
            <Menu size={20} style={{ color: 'var(--primary-dark)' }} />
          </Button>
        </div>

        <Offcanvas
          show={expanded}
          onHide={() => setExpanded(false)}
          placement="start"
          className="h_offcanvas"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {isLoggedIn ? (
              <>
                <Nav className="flex-column h_nav_links mb-4">
                  <Nav.Link
                    onClick={() => handleNav('dashboard')}
                    className={`h_nav_link ${currentPage === 'dashboard' ? 'h_nav_active' : ''}`}
                  >
                    <BookOpen className="me-2" size={16} /> Learn
                  </Nav.Link>
                  {user?.language === 'English' && (
                    <Nav.Link
                      onClick={() => handleNav('letters')}
                      className={`h_nav_link ${currentPage === 'letters' ? 'h_nav_active' : ''}`}
                    >
                      <Star className="me-2" size={16} /> Letters
                    </Nav.Link>
                  )}
                  <Nav.Link
                    onClick={() => handleNav('leaderboard')}
                    className={`h_nav_link ${currentPage === 'leaderboard' ? 'h_nav_active' : ''}`}
                  >
                    <Trophy className="me-2" size={16} /> Leaderboard
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => handleNav('profile')}
                    className={`h_nav_link ${currentPage === 'profile' ? 'h_nav_active' : ''}`}
                  >
                    <User className="me-2" size={16} /> Profile
                  </Nav.Link>
                </Nav>

                <div className="d-flex align-items-center gap-3 mt-4 mb-3 h_stats_bar">
                  <div className="h_stat_item">
                    <Flame className="h_icon_fire" size={18} />
                    <span>{user?.streak || 0}</span>
                  </div>
                  <div className="h_stat_item">
                    <Heart className="h_icon_heart" size={18} />
                    <span>{user?.hearts ?? 5}</span>
                  </div>
                  <div className="h_stat_item">
                    <Star className="h_icon_xp" size={18} />
                    <span>{user?.xp || 0} XP</span>
                  </div>
                </div>

                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={openLogoutModal}
                  className="h_logout_btn d-flex align-items-center gap-1 w-100"
                >
                  <LogOut size={16} /> Logout
                </Button>
              </>
            ) : (
              <Nav className="flex-column h_nav_links gap-2">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => handleNav('login')}
                  className="h_btn_login w-100"
                >
                  Log In
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleNav('onboarding')}
                  className="h_btn_signup w-100"
                >
                  Get Started
                </Button>
              </Nav>
            )}
          </Offcanvas.Body>
        </Offcanvas>

        {/* ========== Logout Confirm Modal ========== */}
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
      </Container>
    </Navbar>
  );
};

export default AppNavbar;

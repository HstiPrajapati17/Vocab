import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Offcanvas } from 'react-bootstrap';
import { Flame, Heart, Star, User, Trophy, BookOpen, LogOut, Menu } from 'lucide-react';

const AppNavbar = ({ navigate, isLoggedIn, onLogout, user, currentPage }) => {
  const [expanded, setExpanded] = useState(false);

  const handleNav = (page) => {
    navigate(`/${page}`);
    setExpanded(false);
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
                onClick={() => {
                  onLogout();
                  setExpanded(false);
                }}
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
                  onClick={() => {
                    onLogout();
                    setExpanded(false);
                  }}
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
      </Container>
    </Navbar>
  );
};

export default AppNavbar;

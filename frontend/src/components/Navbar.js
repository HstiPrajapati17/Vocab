import React, { useState } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Flame, Heart, Star, User, Trophy, Book, LogOut, Menu } from 'lucide-react';

const AppNavbar = ({ navigate, isLoggedIn, onLogout, user, currentPage }) => {
  const [expanded, setExpanded] = useState(false);

  const handleNav = (page) => {
    navigate(page);
    setExpanded(false);
  };

  return (
    <Navbar
      expand="lg"
      className="h_navbar_main"
      expanded={expanded}
      onToggle={(val) => setExpanded(val)}
      sticky="top"
    >
      <Container fluid="xl">
        {/* Brand */}
        <Navbar.Brand
          onClick={() => handleNav(isLoggedIn ? 'dashboard' : 'home')}
          className="h_navbar_brand d-flex align-items-center gap-2"
          style={{ cursor: 'pointer' }}
        >
          <span className="h_brand_icon">🦉</span>
          <span className="h_brand_text">LinguaLeap</span>
        </Navbar.Brand>


        <Navbar.Toggle aria-controls="main-nav" className="h_navbar_toggle border-0">
          <Menu size={20} />
        </Navbar.Toggle>

        <Navbar.Collapse id="main-nav">
          {isLoggedIn ? (
            <>
              <Nav className="me-auto h_nav_links">
                <Nav.Link
                  onClick={() => handleNav('dashboard')}
                  className={`h_nav_link ${currentPage === 'dashboard' ? 'h_nav_active' : ''}`}
                >
                  <Book className="me-1" size={16} /> Learn
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
              </Nav>

              {/* Desktop stats */}
              <div className="d-none d-lg-flex align-items-center gap-3 me-3 h_stats_bar">
                <div className="h_stat_item">
                  <Flame className="h_icon_fire" size={20} />
                  <span className="h_stat_value">{user?.streak || 7}</span>
                </div>
                <div className="h_stat_item">
                  <Heart className="h_icon_heart" size={20} />
                  <span className="h_stat_value">{user?.hearts || 5}</span>
                </div>
                <div className="h_stat_item">
                  <Star className="h_icon_xp" size={20} />
                  <span className="h_stat_value">{user?.xp || 340} XP</span>
                </div>
              </div>

              <Button
                variant="outline-light"
                size="sm"
                onClick={onLogout}
                className="h_logout_btn d-flex align-items-center gap-1"
              >
                <LogOut size={16} /> Logout
              </Button>
            </>
          ) : (
            <Nav className="ms-auto h_nav_links gap-2">
              <Button
                variant="outline-light"
                size="sm"
                onClick={() => handleNav('login')}
                className="h_btn_login"
              >
                Log In
              </Button>
              <Button
                variant="warning"
                size="sm"
                onClick={() => handleNav('signup')}
                className="h_btn_signup fw-bold"
              >
                Get Started
              </Button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;

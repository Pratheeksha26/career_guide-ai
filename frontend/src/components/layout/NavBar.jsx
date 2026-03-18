import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaRobot, FaBook, FaGraduationCap, FaHome, FaBrain,
  FaBars, FaTimes, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaChevronDown, FaDesktop, FaVideo
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './NavBar.css';

const NavLink = ({ to, icon, text, mobile, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`nav-link ${isActive ? 'active' : ''} ${mobile ? 'mobile' : ''}`}
      onClick={onClick}
    >
      <span className="nav-icon">{icon}</span>
      <span className="nav-text">{text}</span>
    </Link>
  );
};

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-content">
        <Link to="/" className="logo">
          <div className="logo-icon-container">
            <FaBrain className="logo-icon" />
            <div className="logo-pulse"></div>
          </div>
          <div className="logo-text">
            <span className="logo-title">CareerGuide</span>
            <span className="logo-subtitle">AI</span>
          </div>
        </Link>

        <div className="nav-links">
          <NavLink to="/" icon={<FaHome />} text="Home" />
          <NavLink to="/chat" icon={<FaRobot />} text="AI Assistant" />

          <div className="nav-dropdown" ref={dropdownRef}>
            <button className="nav-dropdown-btn" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <span className="nav-icon"><FaDesktop /></span>
              <span className="nav-text">Mock Interfaces</span>
              <FaChevronDown style={{ fontSize: '0.8em', marginLeft: '4px', transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'var(--transition)' }} />
            </button>
            <div className={`nav-dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
              <Link to="/aptitude" className="dropdown-link" onClick={() => setIsDropdownOpen(false)}>
                <FaGraduationCap /> Aptitude
              </Link>
              <Link to="/resume" className="dropdown-link" onClick={() => setIsDropdownOpen(false)}>
                <FaBook /> Resume
              </Link>
              <Link to="/interview" className="dropdown-link" onClick={() => setIsDropdownOpen(false)}>
                <FaVideo /> Mock Interview
              </Link>
            </div>
          </div>

          {isAuthenticated ? (
            <div className="auth-links">
              <Link to="/profile" className="auth-link">
                <FaUser className="auth-icon" />
                <span className="auth-text">{user?.username}</span>
              </Link>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="auth-link">
                <FaSignInAlt className="auth-icon" />
                <span className="auth-text">Login</span>
              </Link>
              <Link to="/register" className="register-button">
                <FaUserPlus className="auth-icon" />
                <span className="auth-text">Sign Up</span>
              </Link>
            </div>
          )}
        </div>

        <button
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <NavLink to="/" icon={<FaHome />} text="Home" mobile onClick={closeMenu} />
          <NavLink to="/chat" icon={<FaRobot />} text="AI Assistant" mobile onClick={closeMenu} />
          
          <div className="mobile-dropdown-header">Mock Interfaces</div>
          <NavLink to="/aptitude" icon={<FaGraduationCap />} text="Aptitude Training" mobile onClick={closeMenu} />
          <NavLink to="/resume" icon={<FaBook />} text="Resume Builder" mobile onClick={closeMenu} />
          <NavLink to="/interview" icon={<FaVideo />} text="Mock Interview" mobile onClick={closeMenu} />

          {isAuthenticated ? (
            <>
              <NavLink to="/profile" icon={<FaUser />} text="Profile" mobile onClick={closeMenu} />
              <button onClick={() => { logout(); closeMenu(); }} className="mobile-logout-button">
                <FaSignOutAlt className="auth-icon" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" icon={<FaSignInAlt />} text="Login" mobile onClick={closeMenu} />
              <NavLink to="/register" icon={<FaUserPlus />} text="Sign Up" mobile onClick={closeMenu} />
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;

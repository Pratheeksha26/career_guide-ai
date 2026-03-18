import React from 'react';
import { Link } from 'react-router-dom';
import { FaBrain } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './Footer.css';

const Footer = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-grid">
          <div className="footer-section">
            <div className="footer-logo">
              <FaBrain className="footer-logo-icon" />
              <div>
                <h3 className="footer-title">CareerGuide AI</h3>
                <p className="footer-subtitle">Your intelligent career partner</p>
              </div>
            </div>
            <p className="footer-description">
              Empowering students with AI-driven career guidance
              and aptitude training for a successful future.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/chat" className="footer-link">AI Assistant</Link></li>
              <li><Link to="/aptitude" className="footer-link">Aptitude Training</Link></li>
              <li><Link to="/resources" className="footer-link">Career Resources</Link></li>
              {!isAuthenticated && (
                <>
                  <li><Link to="/login" className="footer-link">Login</Link></li>
                  <li><Link to="/register" className="footer-link">Register</Link></li>
                </>
              )}
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Contact</h4>
            <p className="footer-contact">
              <span className="contact-label">Email:</span> support@careerguide.ai
            </p>
            <p className="footer-contact">
              <span className="contact-label">Hours:</span> 24/7 Available
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 CareerGuide AI. All rights reserved.</p>
          <div className="footer-stats">
            {isAuthenticated && (
              <span className="welcome-text">👋 Welcome, {user?.username}</span>
            )}
            <span>🤖 Powered by AI</span>
            <span>🎯 10,000+ Students Helped</span>
            <span>🚀 95% Success Rate</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaRobot,
  FaGraduationCap,
  FaBriefcase,
  FaChartLine,
  FaUniversity
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Home.css';

const Home = () => {
  const features = [
    { icon: <FaRobot color="white" />, title: 'AI Career Assistant', description: 'Get personalized career guidance and instant answers to your queries', color: 'var(--primary)' },
    { icon: <FaGraduationCap color="white" />, title: 'Education Pathways', description: 'Complete guidance from UG to PG to PhD for all streams', color: 'var(--primary)' },
    { icon: <FaBriefcase color="white" />, title: 'Job & Internship Info', description: 'Detailed information on 500+ companies and their recruitment', color: 'var(--primary)' },
    { icon: <FaChartLine color="white" />, title: 'Career Progression', description: 'Clear career paths from entry level to senior roles', color: 'var(--primary)' },
    { icon: <FaUniversity color="white" />, title: 'College & Exam Info', description: 'Top colleges and entrance exam details', color: 'var(--primary)' }
  ];

  const stats = [
    { value: '500+', label: 'Companies' },
    { value: '1000+', label: 'Job Roles' },
    { value: '50+', label: 'Entrance Exams' },
    { value: '10000+', label: 'Data Points' },
  ];

  return (
    <div className="home-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="home-hero"
      >
        <div className="home-hero-content">
          <h1 className="home-hero-title">
            Your Intelligent
            <span className="home-highlight"> Career Guidance</span>
            {' '}Platform
          </h1>
          <p className="home-hero-subtitle">
            Get personalized guidance for jobs, education, exams, and career development.
            Powered by AI with comprehensive data from 500+ companies.
          </p>
          <div className="home-hero-buttons">
            <Link to="/chat" className="home-btn-primary"><FaRobot /> Start Chatting</Link>
          </div>
        </div>
      </motion.div>

      <div className="home-stats">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="home-stat-card"
          >
            <div className="home-stat-value">{stat.value}</div>
            <div className="home-stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="home-section">
        <h2 className="home-section-title">What We Offer</h2>
        <p className="home-section-subtitle">Comprehensive career guidance across all domains</p>
        <div className="home-features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="home-feature-card"
            >
              <div className="home-feature-icon" style={{ background: feature.color }}>
                {feature.icon}
              </div>
              <h3 className="home-feature-title">{feature.title}</h3>
              <p className="home-feature-desc">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="home-section">
        <h2 className="home-section-title">How It Works</h2>
        <div className="home-steps">
          {[
            { n: 1, t: 'Ask Your Question', d: 'Ask about jobs, exams, or career paths' },
            { n: 2, t: 'Get AI Analysis', d: 'Our AI understands your query and analyzes the best options' },
            { n: 3, t: 'Receive Detailed Guidance', d: 'Get comprehensive information with data from 500+ companies' },
            { n: 4, t: 'Plan Your Career', d: 'Use the insights to make informed career decisions' },
          ].map(({ n, t, d }) => (
            <div key={n} className="home-step">
              <div className="home-step-number">{n}</div>
              <h3 className="home-feature-title">{t}</h3>
              <p className="home-feature-desc">{d}</p>
            </div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="home-cta"
      >
        <h2 className="home-cta-title">Ready to Plan Your Career?</h2>
        <p className="home-cta-text">
          Join thousands of students and professionals who have found their perfect career path with our guidance.
        </p>
        <Link to="/chat" className="home-cta-btn">
          <FaRobot /> Start Your Career Journey
        </Link>
      </motion.div>
    </div>
  );
};

export default Home;

import React from 'react';
import { FaExternalLinkAlt, FaDownload, FaYoutube, FaBookOpen, FaLaptopCode, FaGraduationCap } from 'react-icons/fa';
import './Resources.css';

const Resources = () => {
  const resources = {
    'Aptitude Preparation': [
      {
        title: 'IndiaBIX',
        description: 'Thousands of aptitude questions with solutions',
        link: 'https://www.indiabix.com',
        type: 'website'
      },
      {
        title: 'PrepInsta',
        description: 'Company-specific aptitude preparation',
        link: 'https://www.prepinsta.com',
        type: 'website'
      },
      {
        title: 'GeeksforGeeks',
        description: 'Programming and technical aptitude resources',
        link: 'https://www.geeksforgeeks.org',
        type: 'website'
      }
    ],
    'Coding Practice': [
      {
        title: 'LeetCode',
        description: 'Coding interview preparation platform',
        link: 'https://leetcode.com',
        type: 'platform'
      },
      {
        title: 'HackerRank',
        description: 'Practice coding skills and participate in contests',
        link: 'https://www.hackerrank.com',
        type: 'platform'
      },
      {
        title: 'CodeChef',
        description: 'Competitive programming platform',
        link: 'https://www.codechef.com',
        type: 'platform'
      }
    ],
    'Entrance Exam Prep': [
      {
        title: 'Byju\'s Exam Prep',
        description: 'Comprehensive exam preparation for all major exams',
        link: 'https://byjusexamprep.com',
        type: 'app'
      },
      {
        title: 'Unacademy',
        description: 'Live classes and study material for various exams',
        link: 'https://unacademy.com',
        type: 'app'
      },
      {
        title: 'Gradeup',
        description: 'Exam preparation community and resources',
        link: 'https://gradeup.co',
        type: 'app'
      }
    ],
    'YouTube Channels': [
      {
        title: 'Apna College',
        description: 'Complete programming and DSA tutorials',
        link: 'https://youtube.com/@ApnaCollegeOfficial',
        type: 'video'
      },
      {
        title: 'Gate Smashers',
        description: 'Engineering subjects and GATE preparation',
        link: 'https://youtube.com/@GateSmashers',
        type: 'video'
      },
      {
        title: 'Aman Dhattarwal',
        description: 'Career guidance and placement preparation',
        link: 'https://youtube.com/@AmanDhattarwal',
        type: 'video'
      }
    ],
    'Books & PDFs': [
      {
        title: 'NCERT Books',
        description: 'Official NCERT textbooks for all subjects',
        link: 'https://ncert.nic.in/textbook.php',
        type: 'book'
      },
      {
        title: 'RS Aggarwal - Quantitative Aptitude',
        description: 'Best book for aptitude preparation',
        link: '#',
        type: 'book'
      },
      {
        title: 'HC Verma - Physics',
        description: 'Must-have book for engineering entrance',
        link: '#',
        type: 'book'
      }
    ],
    'Mock Test Platforms': [
      {
        title: 'Testbook',
        description: 'Mock tests for various competitive exams',
        link: 'https://testbook.com',
        type: 'test'
      },
      {
        title: 'Oliveboard',
        description: 'Online test series and mock exams',
        link: 'https://oliveboard.in',
        type: 'test'
      },
      {
        title: 'Career Launcher',
        description: 'CAT and other MBA entrance mock tests',
        link: 'https://www.careerlauncher.com',
        type: 'test'
      }
    ]
  };

  return (
    <div className="res-container">
      <div className="res-header">
        <h1 className="res-title">Career Preparation Resources</h1>
        <p className="res-subtitle">
          Curated resources and tools to help you prepare for exams, interviews, and career development.
        </p>
      </div>

      <div className="res-section">
        <h2 className="res-section-title">Online Resources</h2>
        <div className="res-resources-grid">
          {Object.entries(resources).map(([category, items]) => (
            <div key={category} className="res-category-card">
              <h3 className="res-category-title">{category}</h3>
              <div className="res-items-list">
                {items.map((item, index) => (
                  <a
                    key={index}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="res-resource-item"
                  >
                    <div className="res-resource-header">
                      <div className="res-resource-icon">
                        {item.type === 'website' && <FaLaptopCode />}
                        {item.type === 'platform' && <FaLaptopCode />}
                        {item.type === 'app' && <FaGraduationCap />}
                        {item.type === 'video' && <FaYoutube />}
                        {item.type === 'book' && <FaBookOpen />}
                        {item.type === 'test' && <FaBookOpen />}
                      </div>
                      <div className="res-resource-info">
                        <h4 className="res-resource-title">{item.title}</h4>
                        <p className="res-resource-description">{item.description}</p>
                      </div>
                    </div>
                    <FaExternalLinkAlt className="res-external-icon" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="res-section">
        <h2 className="res-section-title">Downloadable Materials</h2>
        <div className="res-downloads-grid">
          {[
            { title: 'Aptitude Formula Sheet', type: 'PDF', size: '2.4 MB' },
            { title: 'Company-wise Previous Papers', type: 'ZIP', size: '15.2 MB' },
            { title: 'Interview Question Bank', type: 'PDF', size: '3.1 MB' },
            { title: 'Resume Templates', type: 'DOC', size: '1.8 MB' },
            { title: 'Preparation Planner Template', type: 'XLS', size: '0.9 MB' },
            { title: 'Vocabulary Builder', type: 'PDF', size: '1.2 MB' }
          ].map((item, index) => (
            <div key={index} className="res-download-card">
              <div className="res-download-info">
                <h4>{item.title}</h4>
                <div className="res-download-meta">
                  <span className="res-file-type">{item.type}</span>
                  <span className="res-file-size">{item.size}</span>
                </div>
              </div>
              <button className="res-download-btn">
                <FaDownload />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="res-tips-section">
        <h2 className="res-section-title">Preparation Tips</h2>
        <div className="res-tips-grid">
          <div className="res-tip-card">
            <h3>📅 Time Management</h3>
            <ul>
              <li>Create a realistic preparation schedule</li>
              <li>Break down topics into manageable chunks</li>
              <li>Allocate time for revision</li>
              <li>Take regular breaks</li>
            </ul>
          </div>
          <div className="res-tip-card">
            <h3>📝 Effective Practice</h3>
            <ul>
              <li>Focus on quality over quantity</li>
              <li>Analyze your mistakes</li>
              <li>Time your practice sessions</li>
              <li>Maintain a error log</li>
            </ul>
          </div>
          <div className="res-tip-card">
            <h3>🧠 Revision Strategy</h3>
            <ul>
              <li>Create summary notes</li>
              <li>Use flashcards for quick revision</li>
              <li>Teach concepts to others</li>
              <li>Regular formula revision</li>
            </ul>
          </div>
          <div className="res-tip-card">
            <h3>🎯 Exam Strategy</h3>
            <ul>
              <li>Understand the exam pattern</li>
              <li>Practice with time limits</li>
              <li>Develop question selection strategy</li>
              <li>Learn to manage exam stress</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
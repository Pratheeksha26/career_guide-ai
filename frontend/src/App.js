import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { FaRobot } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';

import NavBar from './components/layout/NavBar';
import Footer from './components/layout/Footer';

import Home from './pages/Home/Home';
import AIAssistantPage from './pages/AIAssistant/AIAssistantPage';
import AptitudePage from './pages/Aptitude/AptitudePage';
import ResourcesPage from './pages/ResourcesPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import UserProfilePage from './pages/Profile/UserProfilePage';
import ResumePage from './pages/Resume/ResumePage';
import MockInterviewPage from './pages/Interview/MockInterviewPage';

import './styles/animations.css';
import './styles.css';

const FloatingActionButton = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  if (location.pathname === '/chat' || !isAuthenticated) return null;
  return (
    <Link to="/chat" className="fab fab-pulse">
      <FaRobot className="fab-icon" />
      <span className="fab-text">Ask AI</span>
    </Link>
  );
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isChatPage = location.pathname === '/chat';

  return (
    <div className={`app ${isChatPage ? 'chat-layout' : ''}`}>
      <Toaster position="top-right" />
      <NavBar />

      <main className={`main ${isChatPage ? 'main-full' : ''}`}>
        <div className={isChatPage ? 'content-full' : 'content-wrapper'}>
          <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />} />
            <Route path="/profile" element={<PrivateRoute><UserProfilePage /></PrivateRoute>} />
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/chat" element={<PrivateRoute><AIAssistantPage /></PrivateRoute>} />
            <Route path="/aptitude" element={<PrivateRoute><AptitudePage /></PrivateRoute>} />
            <Route path="/resume" element={<PrivateRoute><ResumePage /></PrivateRoute>} />
            <Route path="/interview" element={<PrivateRoute><MockInterviewPage /></PrivateRoute>} />
            <Route path="/resources" element={<PrivateRoute><ResourcesPage /></PrivateRoute>} />
          </Routes>
        </div>
      </main>

      {!isChatPage && <Footer />}
      <FloatingActionButton />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;

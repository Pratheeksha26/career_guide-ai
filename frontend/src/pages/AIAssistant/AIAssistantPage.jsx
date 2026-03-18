import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Chatbot from './Chatbot';
import './AIAssistantPage.css';

const AIAssistantPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="aip-container-fluid">
      <Chatbot initialQuery={initialQuery} />
    </div>
  );
};

export default AIAssistantPage;


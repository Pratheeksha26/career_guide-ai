import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaBars, FaTimes } from 'react-icons/fa';
import api from '../../api/axiosConfig';
import ChatSidebar from './ChatSidebar';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import './Chatbot.css';

const INITIAL_MESSAGE = {
  id: 1,
  text: "Hello! I'm your Career Guidance Assistant. 🤖\n\nI can help you with:\n• Career guidance\n• Aptitude problem solving\n• Document analysis\n\nAsk me anything or upload documents for analysis!",
  sender: 'bot',
  timestamp: new Date(),
  source: 'system',
};

const QUICK_QUESTIONS = [
  'Which stream should I choose?',
  'How to prepare for JEE?',
  'What are career options in Computer Science?',
  'How to improve my resume?',
  'What skills are needed for data science?',
];

const Chatbot = () => {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatSessions, setChatSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [pendingFiles, setPendingFiles] = useState([]);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => { loadChatSessions(true); }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const loadChatSessions = async (autoLoadFirst = false) => {
    try {
      const response = await api.get('/chat/sessions');
      if (response.data.success) {
        setChatSessions(response.data.sessions);
        if (autoLoadFirst && response.data.sessions.length > 0 && !activeSession) {
          loadSession(response.data.sessions[0]._id);
        }
      }
    } catch (error) {
      console.error('Failed to load chat sessions:', error);
    }
  };

  const loadSession = async (sessionId) => {
    try {
      const response = await api.get(`/chat/sessions/${sessionId}`);
      if (response.data.success) {
        setActiveSession(sessionId);
        let sessionMessages = response.data.session.messages || [];
        if (sessionMessages.length === 0) {
          sessionMessages = [INITIAL_MESSAGE];
        } else {
          sessionMessages = sessionMessages.map(msg => ({
            ...msg,
            timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp),
          }));
        }
        setMessages(sessionMessages);
        setPendingFiles([]);
        setInput('');
      }
    } catch (error) {
      console.error('Failed to load session:', error);
      setActiveSession(sessionId);
      setMessages([INITIAL_MESSAGE]);
    }
  };

  const createNewSession = () => {
    setMessages([INITIAL_MESSAGE]);
    setActiveSession(null);
    setPendingFiles([]);
    setInput('');
  };

  const deleteSession = async (sessionId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this chat?')) return;
    try {
      const response = await api.delete(`/chat/sessions/${sessionId}`);
      if (response.data.success) {
        setChatSessions(prev => prev.filter(s => s._id !== sessionId));
        if (activeSession === sessionId) {
          const next = chatSessions.find(s => s._id !== sessionId);
          if (next) loadSession(next._id);
          else createNewSession();
        }
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  const handleFileSelect = (event) => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/jpg',
    ];
    const files = Array.from(event.target.files).filter(f => validTypes.includes(f.type));
    setPendingFiles(prev => [...prev, ...files]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePendingFile = (index) => {
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const sendMessage = async () => {
    if (!input.trim() && pendingFiles.length === 0) return;
    setIsLoading(true);

    try {
      const messageToSend = input;

      const userMessage = {
        id: Date.now(),
        text: input || `📁 Uploaded ${pendingFiles.length} file(s)`,
        sender: 'user',
        timestamp: new Date(),
        files: pendingFiles.map(f => ({ name: f.name, type: f.type })),
      };

      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setPendingFiles([]);

      let sessionIdToUse = activeSession;
      if (!activeSession) {
        try {
          let titleText = messageToSend.trim().substring(0, 50);
          const lastSpace = titleText.lastIndexOf(' ');
          if (messageToSend.trim().length > 50 && lastSpace > 0) titleText = titleText.substring(0, lastSpace) + '...';

          const sessionRes = await api.post(
            '/chat/sessions',
            { title: titleText }
          );
          if (sessionRes.data.success) {
            const newSession = sessionRes.data.session;
            sessionIdToUse = newSession._id;
            setActiveSession(newSession._id);
            setChatSessions(prev => [newSession, ...prev]);
          }
        } catch (err) {
          console.error('Failed to create session:', err);
        }
      }

      const formData = new FormData();
      formData.append('message', messageToSend);
      if (sessionIdToUse) {
        formData.append('sessionId', sessionIdToUse);
      }
      
      pendingFiles.forEach(file => {
        formData.append('files', file);
      });

      const response = await api.post(
        '/chat/message',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: response.data.response,
          sender: 'bot',
          timestamp: new Date(),
          source: response.data.source || 'ai',
        }]);
        loadChatSessions();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
        source: 'error',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleCopyMessage = (text) => {
    navigator.clipboard.writeText(text);
    alert('Message copied to clipboard!');
  };

  const handleQuickQuestion = (q) => {
    setInput(q);
    setTimeout(() => sendMessage(), 100);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="chatbot-header-left">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="chatbot-menu-btn"
            title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <div className="chatbot-avatar"><FaRobot /></div>
          <div>
            <h2 className="chatbot-title">Career Guidance Assistant</h2>
            <div className="chatbot-subtitle">
              <span>
                {messages.length} messages • {chatSessions.length} chats
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="chatbot-body">
        {sidebarOpen && (
          <div className="chatbot-sidebar-panel">
            <ChatSidebar
              sessions={chatSessions}
              activeSession={activeSession}
              onNewChat={createNewSession}
              onLoadSession={loadSession}
              onDeleteSession={deleteSession}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        )}

        <div className="chatbot-chat-area">
          <div className="chatbot-messages">
            {messages.map(msg => (
              <ChatMessage key={msg.id} message={msg} onCopy={handleCopyMessage} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <ChatInput
            input={input}
            onInputChange={(e) => setInput(e.target.value)}
            onSend={sendMessage}
            onKeyPress={handleKeyPress}
            pendingFiles={pendingFiles}
            onRemoveFile={removePendingFile}
            onFileSelect={handleFileSelect}
            isLoading={isLoading}
            quickQuestions={QUICK_QUESTIONS}
            onQuickQuestion={handleQuickQuestion}
            fileInputRef={fileInputRef}
          />
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

import React from 'react';
import { FaPlus, FaTrash, FaHistory, FaTimes } from 'react-icons/fa';
import './ChatSidebar.css';

// Strip markdown symbols for clean preview text
const stripMarkdown = (text) => {
  if (!text) return '';
  return text
    .replace(/#{1,6}\s*/g, '')        // headings ###
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1') // bold/italic **text**
    .replace(/`{1,3}[^`]*`{1,3}/g, '') // inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
    .replace(/^\s*[-*+]\s+/gm, '')    // bullet points
    .replace(/\n+/g, ' ')             // collapse newlines
    .trim();
};

const ChatSidebar = ({ sessions, activeSession, onNewChat, onLoadSession, onDeleteSession, onClose }) => (
  <div className="csb-root">
    <div className="csb-header">
      <h3 className="csb-title">
        <FaHistory /> Chat History
      </h3>
    </div>

    <div className="csb-content">
      <button onClick={onNewChat} className="csb-new-btn">
        <FaPlus /> New Chat
      </button>

      <div className="csb-sessions">
        {sessions.map((session) => (
          <div
            key={session._id}
            className={`csb-session-item ${activeSession === session._id ? 'csb-session-active' : ''}`}
            onClick={() => onLoadSession(session._id)}
          >
            <div className="csb-session-info">
              <div className="csb-session-title">{session.title || 'New Chat'}</div>
              <div className="csb-session-meta">
                <span className="csb-session-date">
                  {new Date(session.updatedAt).toLocaleDateString()}
                </span>
                <span className="csb-session-count">{session.messageCount || 0} msgs</span>
              </div>
              {session.lastMessage && (
                <div className="csb-session-preview">{stripMarkdown(session.lastMessage)}</div>
              )}
            </div>
            <button
              onClick={(e) => onDeleteSession(session._id, e)}
              className="csb-delete-btn"
              title="Delete chat"
            >
              <FaTrash />
            </button>
          </div>
        ))}

        {sessions.length === 0 && (
          <div className="csb-empty">No chat sessions yet.<br />Start a new chat!</div>
        )}
      </div>
    </div>
  </div>
);

export default ChatSidebar;

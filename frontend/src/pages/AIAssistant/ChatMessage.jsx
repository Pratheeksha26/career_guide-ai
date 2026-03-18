import React from 'react';
import { FaRobot, FaUser, FaRegCopy, FaRegThumbsUp, FaRegThumbsDown, FaFilePdf, FaImage, FaFile } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './ChatMessage.css';

const ChatMessage = ({ message, onCopy }) => {
  const isBot = message.sender === 'bot';
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const sourceLabel =
    message.source === 'aptitude' ? '🧮 Aptitude Solver' :
    message.source === 'structured' ? '📊 Career Data' : '🤖 AI Assistant';

  return (
    <div className={`cmsg-wrapper ${isBot ? 'cmsg-bot' : 'cmsg-user'}`} id={`msg-${message.id}`}>
      <div className={`cmsg-bubble ${isBot ? 'cmsg-bubble-bot' : 'cmsg-bubble-user'}`}>
        <div className="cmsg-header">
          <div className="cmsg-avatar">
            {isBot ? <FaRobot /> : <FaUser />}
          </div>
          <div className="cmsg-info">
            <strong className="cmsg-name">{isBot ? 'Career Assistant' : 'You'}</strong>
            {isBot && <span className="cmsg-source">{sourceLabel}</span>}
          </div>
        </div>

        <div className="cmsg-text">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
        </div>

        {message.files && message.files.length > 0 && (
          <div className="cmsg-attachments">
            <div className="cmsg-attachment-header">📎 Attachments ({message.files.length}):</div>
            <div className="cmsg-attachment-list">
              {message.files.map((file, idx) => {
                const fileName = file.originalname || file.name || 'File';
                const fileType = file.mimetype || file.type || '';
                const downloadUrl = file.filename ? `http://localhost:8080/uploads/chat_files/${file.filename}` : null;
                
                return (
                  <div key={idx} className="cmsg-attachment-item">
                    <span className="cmsg-attachment-icon">
                      {fileType.includes('pdf') ? <FaFilePdf /> : 
                       fileType.includes('image') ? <FaImage /> : <FaFile />}
                    </span>
                    {downloadUrl ? (
                      <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="cmsg-attachment-link">
                        {fileName}
                      </a>
                    ) : (
                      <span className="cmsg-attachment-name">{fileName}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="cmsg-footer">
          <span className="cmsg-timestamp">{time}</span>
          {isBot && (
            <div className="cmsg-actions">
              <button className="cmsg-action-btn" onClick={() => onCopy(message.text)} title="Copy">
                <FaRegCopy />
              </button>
              <button className="cmsg-action-btn" title="Like"><FaRegThumbsUp /></button>
              <button className="cmsg-action-btn" title="Dislike"><FaRegThumbsDown /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;

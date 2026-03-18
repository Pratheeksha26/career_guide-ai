import React from 'react';
import {
  FaPaperPlane, FaSpinner, FaFileUpload,
  FaFilePdf, FaFileWord, FaImage, FaTimesCircle
} from 'react-icons/fa';
import './ChatInput.css';

const ChatInput = ({
  input,
  onInputChange,
  onSend,
  onKeyPress,
  pendingFiles,
  onRemoveFile,
  onFileSelect,
  isLoading,
  quickQuestions,
  onQuickQuestion,
  fileInputRef,
}) => {
  const [isQuickOpen, setIsQuickOpen] = React.useState(true);

  return (
    <div className="cinput-root">
      {pendingFiles.length > 0 && (
        <div className="cinput-pending-files">
          <div className="cinput-pending-header">
            <span>📁 Pending Upload ({pendingFiles.length})</span>
          </div>
          <div className="cinput-pending-list">
            {pendingFiles.map((file, index) => (
              <div key={index} className="cinput-pending-item">
                <div className="cinput-file-icon">
                  {file.type.includes('pdf') ? <FaFilePdf /> :
                    file.type.includes('image') ? <FaImage /> : <FaFileWord />}
                </div>
                <div className="cinput-file-info">
                  <span className="cinput-file-name">{file.name}</span>
                  <small className="cinput-file-size">{Math.round(file.size / 1024)} KB</small>
                </div>
                <button
                  onClick={() => onRemoveFile(index)}
                  className="cinput-remove-file"
                  title="Remove file"
                >
                  <FaTimesCircle />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`cinput-quick-section ${!isQuickOpen ? 'collapsed' : ''}`}>
        <div className="cinput-quick-header" onClick={() => setIsQuickOpen(!isQuickOpen)}>
          <h4 className="cinput-quick-title">Quick Questions:</h4>
          <span className="cinput-toggle-icon">{isQuickOpen ? '▼' : '▲'}</span>
        </div>
        <div className="cinput-quick-list">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => onQuickQuestion(q)}
              className="cinput-quick-btn"
              disabled={isLoading}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div className="cinput-row">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="cinput-upload-btn"
          title="Add files"
          disabled={isLoading}
        >
          <FaFileUpload />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileSelect}
          multiple
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
          style={{ display: 'none' }}
        />
        <textarea
          className="cinput-textarea"
          value={input}
          onChange={onInputChange}
          onKeyPress={onKeyPress}
          placeholder="Ask me anything about your career..."
          disabled={isLoading}
        />
        <button
          onClick={onSend}
          className="cinput-send-btn"
          style={{
            opacity: (!input.trim() && pendingFiles.length === 0) || isLoading ? 0.6 : 1,
          }}
          disabled={(!input.trim() && pendingFiles.length === 0) || isLoading}
        >
          {isLoading ? (
            <FaSpinner className="cinput-spin" />
          ) : (
            <FaPaperPlane />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;


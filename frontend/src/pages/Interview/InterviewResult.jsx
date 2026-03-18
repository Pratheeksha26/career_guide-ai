import React from 'react';
import { FaTrophy, FaRedo, FaCheckCircle, FaExclamationCircle, FaUserTie, FaUserCheck } from 'react-icons/fa';
import './InterviewResult.css';

const InterviewResult = ({ data, onReset }) => {
    const { 
        overallScores = {}, 
        questions = [], 
        generalFeedback = '', 
        jobRole = '' 
    } = data || {};

    const ScoreCard = ({ label, score, icon: Icon }) => (
        <div className="res-score-item">
            <div className="res-score-header">
                <Icon className="res-icon" />
                <span>{label}</span>
                <span className="res-num">{score}%</span>
            </div>
            <div className="res-progress-bg">
                <div className="res-progress-fill" style={{ width: `${score}%` }}></div>
            </div>
        </div>
    );

    return (
        <div className="res-container iv-fade-in">
            <div className="res-header">
                <div className="res-main-score">
                    <FaTrophy className="res-trophy" />
                    <div className="res-overall">
                        <h2>Overall Performance</h2>
                        <span className="res-big-num">{overallScores?.overall || 0}%</span>
                    </div>
                </div>
                <div className="res-summary">
                    <h3>Interview for {jobRole}</h3>
                    <p>{generalFeedback}</p>
                </div>
            </div>

            <div className="res-grid">
                <div className="res-card">
                    <h3>Core Metrics</h3>
                    <ScoreCard label="Answer Quality" score={overallScores?.answerQuality || 0} icon={FaCheckCircle} />
                    <ScoreCard label="Confidence Level" score={overallScores?.confidence || 0} icon={FaUserCheck} />
                    <ScoreCard label="Posture & Body Language" score={overallScores?.posture || 0} icon={FaUserCheck} />
                    <ScoreCard label="Attire & Professionalism" score={overallScores?.attire || 0} icon={FaUserTie} />
                </div>

                <div className="res-card questions-card">
                    <h3>Detailed Breakdown</h3>
                    <div className="res-q-list">
                        {questions.map((q, i) => (
                            <div key={i} className="res-q-item">
                                <div className="res-q-header">
                                    <span className="res-q-num">{i + 1}</span>
                                    <h4>{q.question}</h4>
                                    <span className="res-q-score">{q.score || 0}%</span>
                                </div>
                                <p className="res-q-feedback">{q.feedback}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="res-footer">
                <button className="iv-btn-practice" onClick={onReset}>
                    <FaRedo /> Practice Again
                </button>
            </div>
        </div>
    );
};

export default InterviewResult;

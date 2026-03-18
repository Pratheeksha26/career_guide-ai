import React, { useState, useEffect } from 'react';
import { FaCalculator, FaLightbulb, FaClock, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import './AptitudeTraining.css';

const AptitudeTraining = () => {
    const [selectedTopic, setSelectedTopic] = useState('Quantitative');
    const [difficulty, setDifficulty] = useState('Easy');
    const [questionsList, setQuestionsList] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    const [timer, setTimer] = useState(60);
    const [isTestActive, setIsTestActive] = useState(false);

    const API_BASE = '';

    const topics = [
        { id: 'Quantitative', name: 'Quantitative Aptitude', icon: '🧮' },
        { id: 'Logical', name: 'Logical Reasoning', icon: '🧩' },
        { id: 'Verbal', name: 'Verbal Ability', icon: '📚' },
        { id: 'DI', name: 'Data Interpretation', icon: '📊' },
    ];

    const difficultyLevels = ['Easy', 'Medium', 'Hard'];

    const sampleQuestions = {
        Quantitative: [
            {
                id: 1,
                topic: 'Quantitative',
                difficulty: 'Easy',
                question: 'A train running at 54 kmph takes 20 seconds to pass a platform. If it takes 12 seconds to pass a man walking at 6 kmph in the same direction, what is the length of the train?',
                options: ['140 m', '150 m', '160 m', '170 m'],
                answer: '150 m',
                explanation: 'Convert speeds to m/s and use relative speed concepts'
            },
            {
                id: 2,
                topic: 'Quantitative',
                difficulty: 'Easy',
                question: 'If 20% of x = 30% of y, then what percent of x is y?',
                options: ['66.67%', '70%', '75%', '80%'],
                answer: '66.67%',
                explanation: '20x/100 = 30y/100 => x = 1.5y => y = (2/3)x = 66.67%'
            }
        ],
        Logical: [
            {
                id: 1,
                topic: 'Logical',
                difficulty: 'Easy',
                question: 'Find the missing number: 2, 3, 5, 7, 11, ?',
                options: ['13', '15', '17', '19'],
                answer: '13',
                explanation: 'Series of prime numbers'
            }
        ],
        Verbal: [
            {
                id: 1,
                topic: 'Verbal',
                difficulty: 'Easy',
                question: 'Choose the correct synonym for "EPHEMERAL":',
                options: ['Eternal', 'Temporary', 'Permanent', 'Ancient'],
                answer: 'Temporary',
                explanation: 'Ephemeral means lasting for a very short time'
            }
        ],
        DI: [
            {
                id: 1,
                topic: 'DI',
                difficulty: 'Easy',
                question: 'If the average of 5 numbers is 20, what is their sum?',
                options: ['100', '80', '120', '90'],
                answer: '100',
                explanation: 'Average = Sum/Count => Sum = Average × Count = 20 × 5 = 100'
            }
        ]
    };

    useEffect(() => {
        let interval;
        if (isTestActive && timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            handleTimeUp();
        }
        return () => clearInterval(interval);
    }, [isTestActive, timer]);

    const fetchQuestion = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/study/aptitude/questions?topic=${selectedTopic}&difficulty=${difficulty}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const questions = await response.json();
            
            if (questions && questions.length > 0) {
                setQuestionsList(questions);
                setCurrentQuestionIndex(0);
                setCurrentQuestion(questions[0]);
                
                setTimer(60);
                setIsTestActive(true);
                setShowExplanation(false);
                setUserAnswer('');
            } else {
                useSampleQuestion();
            }
            
        } catch (error) {
            console.error('Error fetching question:', error);
            useSampleQuestion();
        }
    };

    const useSampleQuestion = () => {
        const questions = sampleQuestions[selectedTopic];
        if (questions && questions.length > 0) {
            setQuestionsList(questions);
            setCurrentQuestionIndex(0);
            setCurrentQuestion(questions[0]);
            
            setTimer(60);
            setIsTestActive(true);
            setShowExplanation(false);
            setUserAnswer('');
        } else {
            const defaultQ = [{
                id: 1,
                topic: selectedTopic,
                difficulty: difficulty,
                question: 'Sample question for ' + selectedTopic,
                options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
                answer: 'Option 1',
                explanation: 'This is a sample explanation'
            }];
            setQuestionsList(defaultQ);
            setCurrentQuestionIndex(0);
            setCurrentQuestion(defaultQ[0]);
            
            setTimer(60);
            setIsTestActive(true);
            setShowExplanation(false);
            setUserAnswer('');
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questionsList.length - 1) {
            const nextIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIndex);
            setCurrentQuestion(questionsList[nextIndex]);
            
            setTimer(60);
            setIsTestActive(true);
            setShowExplanation(false);
            setUserAnswer('');
        } else {
            alert(`You have completed all available questions! Your final score is: ${score} / ${questionsList.length}`);
            setScore(0);
            setCurrentQuestion(null);
            setQuestionsList([]);
        }
    };

    const handleSubmitAnswer = () => {
        if (!currentQuestion) return;

        if (userAnswer === currentQuestion.answer) {
            setScore(prev => prev + 1);
            alert('Correct! 🎉');
        } else {
            alert(`Incorrect. The correct answer is: ${currentQuestion.answer}`);
        }

        setShowExplanation(true);
        setIsTestActive(false);
        setUserAnswer('');
    };

    const handleTimeUp = () => {
        setIsTestActive(false);
        alert('Time is up! ⏰');
        setShowExplanation(true);
    };


    return (
        <div className="apt-container">
            <div className="apt-header">
                <h1 className="apt-title">Aptitude Training</h1>
                <p className="apt-subtitle">Practice quantitative, logical reasoning, and verbal ability questions</p>
            </div>

            <div className="apt-content">
                <div className="apt-section">
                    <h2 className="apt-section-title">Select Topic</h2>
                    <div className="apt-topic-grid">
                        {topics.map(topic => (
                            <button
                                key={topic.id}
                                className={`apt-topic-btn ${selectedTopic === topic.id ? 'active' : ''}`}
                                onClick={() => setSelectedTopic(topic.id)}
                            >
                                <span className="apt-topic-icon">{topic.icon}</span>
                                <span>{topic.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="apt-section">
                    <h2 className="apt-section-title">Select Difficulty</h2>
                    <div className="apt-difficulty-row">
                        {difficultyLevels.map(level => (
                            <button
                                key={level}
                                className={`apt-diff-btn ${difficulty === level ? 'active' : ''}`}
                                onClick={() => setDifficulty(level)}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="apt-practice-area">
                    <div className="apt-stats">
                        <div className="apt-stat">
                            <FaCheckCircle className="apt-stat-icon" />
                            <div className="apt-stat-info">
                                <div className="apt-stat-value">{score}</div>
                                <div className="apt-stat-label">Correct</div>
                            </div>
                        </div>
                        <div className="apt-stat">
                            <FaClock className="apt-stat-icon" />
                            <div className="apt-stat-info">
                                <div className="apt-stat-value">{timer}s</div>
                                <div className="apt-stat-label">Time Left</div>
                            </div>
                        </div>
                    </div>

                    {currentQuestion ? (
                        <div className="apt-question-card">
                            <div className="apt-q-header">
                                <h3>Question {currentQuestionIndex + 1} of {questionsList.length}</h3>
                                {isTestActive && (
                                    <div className="apt-timer">
                                        <FaClock /> {timer}s
                                    </div>
                                )}
                            </div>
                            <p className="apt-q-text">{currentQuestion.question}</p>
                            
                            <div className="apt-options">
                                {currentQuestion.options?.map((option, index) => (
                                    <label key={index} className="apt-option">
                                        <input
                                            type="radio"
                                            name="answer"
                                            value={option}
                                            checked={userAnswer === option}
                                            onChange={(e) => setUserAnswer(e.target.value)}
                                            disabled={!isTestActive}
                                        />
                                        <span>{option}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="apt-actions">
                                <button
                                    className="apt-submit-btn"
                                    onClick={handleSubmitAnswer}
                                    disabled={!userAnswer || !isTestActive}
                                >
                                    Submit Answer
                                </button>
                                <button
                                    className="apt-next-btn"
                                    onClick={handleNextQuestion}
                                >
                                    {currentQuestionIndex < questionsList.length - 1 ? 'Next Question' : 'Finish Practice'} <FaArrowRight />
                                </button>
                            </div>

                            {showExplanation && currentQuestion.explanation && (
                                <div className="apt-explanation">
                                    <h4><FaLightbulb /> Explanation:</h4>
                                    <p>{currentQuestion.explanation}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="apt-start-card">
                            <FaCalculator className="apt-start-icon" />
                            <h3>Ready to Practice?</h3>
                            <p>Click below to start solving aptitude questions</p>
                            <button className="apt-start-btn" onClick={fetchQuestion}>
                                Start Practice Session
                            </button>
                        </div>
                    )}

                </div>

                <div className="apt-tips-area">
                    <h2 className="apt-section-title">Tips & Tricks</h2>
                    <div className="apt-tips-grid">
                        <div className="apt-tip-card">
                            <h4>⏰ Time Management</h4>
                            <ul className="apt-tip-list">
                                <li className="apt-tip-item">Allocate time per question</li>
                                <li className="apt-tip-item">Skip difficult questions initially</li>
                                <li className="apt-tip-item">Keep last 5 minutes for review</li>
                            </ul>
                        </div>
                        <div className="apt-tip-card">
                            <h4>📝 Problem Solving</h4>
                            <ul className="apt-tip-list">
                                <li className="apt-tip-item">Understand the question first</li>
                                <li className="apt-tip-item">Look for shortcuts</li>
                                <li className="apt-tip-item">Double-check calculations</li>
                            </ul>
                        </div>
                        <div className="apt-tip-card">
                            <h4>🎯 Accuracy</h4>
                            <ul className="apt-tip-list">
                                <li className="apt-tip-item">Read options carefully</li>
                                <li className="apt-tip-item">Eliminate wrong answers</li>
                                <li className="apt-tip-item">Maintain error log</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AptitudeTraining;
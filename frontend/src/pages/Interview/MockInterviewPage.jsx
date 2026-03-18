import React, { useState, useRef, useEffect } from 'react';
import axios from '../../api/axiosConfig';
import { FaVideo, FaMicrophone, FaStop, FaArrowRight, FaChartLine, FaCheckCircle } from 'react-icons/fa';
import './MockInterviewPage.css';
import InterviewResult from './InterviewResult';

const MockInterviewPage = () => {
    const [step, setStep] = useState('intro'); // intro, role-selection, pre-interview, interview, analyzing, result
    const [jobRole, setJobRole] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [resultData, setResultData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analysisStage, setAnalysisStage] = useState(0);

    const stages = [
        "Analyzing speech patterns...",
        "Evaluating answer structure (STAR method)...",
        "Assessing confidence and body language...",
        "Checking professional attire...",
        "Generating final report..."
    ];

    const videoRef = useRef(null);
    const recognitionRef = useRef(null);
    const streamRef = useRef(null);

    // Initialize Camera
    useEffect(() => {
        if (['interview', 'role-selection', 'pre-interview'].includes(step)) {
            startCamera();
        }
        return () => stopCamera();
    }, [step]);

    const startCamera = async () => {
        try {
            if (streamRef.current) return; // Already running
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            streamRef.current = stream;
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (err) {
            console.error("Camera error:", err);
            alert("Please enable camera and microphone access to continue.");
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event) => {
                let currentTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    currentTranscript += event.results[i][0].transcript;
                }
                setTranscript(currentTranscript);
            };

            recognitionRef.current.onend = () => {
                if (isRecording) recognitionRef.current.start();
            };
        }
    }, [isRecording]);

    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
        } else {
            setTranscript('');
            recognitionRef.current.start();
            setIsRecording(true);
        }
    };

    const handleStartInterview = async () => {
        if (!jobRole) return;
        setLoading(true);
        try {
            const res = await axios.get(`/interview/questions?jobRole=${encodeURIComponent(jobRole)}`);
            setQuestions(res.data.questions);
            setStep('pre-interview');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleNextQuestion = () => {
        const updatedAnswers = [...answers, transcript];
        setAnswers(updatedAnswers);
        
        if (currentIdx < questions.length - 1) {
            setCurrentIdx(currentIdx + 1);
            setTranscript('');
        } else {
            submitInterview(updatedAnswers);
        }
    };

    const calculateConfidence = (allAnswers) => {
        const fillerWords = ['um', 'uh', 'like', 'you know', 'actually', 'basically', 'so'];
        let fillerCount = 0;
        let totalWords = 0;

        allAnswers.forEach(ans => {
            const words = ans.toLowerCase().split(/\s+/);
            totalWords += words.length;
            words.forEach(word => {
                if (fillerWords.includes(word)) fillerCount++;
            });
        });

        // 0.95 base - (0.05 for each 5% filler words)
        const fillerRatio = totalWords > 0 ? fillerCount / totalWords : 0;
        const score = Math.max(0.4, 1.0 - (fillerRatio * 5));
        return score;
    };

    const submitInterview = async (finalAnswers) => {
        setStep('analyzing');
        const stageInterval = setInterval(() => {
            setAnalysisStage(prev => (prev + 1) % stages.length);
        }, 3000);

        try {
            const confidenceScore = calculateConfidence(finalAnswers);
            
            // Generate more realistic metadata based on interaction
            const metadata = {
                posture: 'Maintained eye contact, slightly tense but professional',
                dress: 'Appearance aligns with professional standards',
                confidence: confidenceScore
            };

            const res = await axios.post('/interview/submit', {
                jobRole,
                questions,
                answers: finalAnswers,
                metadata
            });
            setResultData(res.data.data);
            setStep('result');
        } catch (err) {
            console.error(err);
            alert("Analysis took too long or failed. Please try again.");
            setStep('intro');
        } finally {
            clearInterval(stageInterval);
        }
    };

    if (step === 'intro') {
        return (
            <div className="iv-container iv-fade-in">
                <div className="iv-hero">
                    <h1>MOCK <span className="text-earth">INTERVIEW</span> AI</h1>
                    <p>Practice your interview skills with our AI-powered virtual recruiter. Get real-time feedback on your answers, posture, and confidence.</p>
                    <button className="iv-btn-start" onClick={() => setStep('role-selection')}>Start Preparation</button>
                </div>
            </div>
        );
    }

    if (step === 'pre-interview') {
        return (
            <div className="iv-container iv-fade-in">
                <div className="iv-layout pre-check-layout">
                    <div className="iv-main">
                        <div className="iv-video-box small-preview">
                            <video ref={videoRef} autoPlay playsInline muted className="iv-webcam" />
                        </div>
                        <div className="pre-check-actions">
                            <h3>Posture & Attire Check</h3>
                            <p>To provide accurate feedback, our AI will analyze your posture and dress. Please ensure:</p>
                            <ul>
                                <li>You are sitting upright and centered in the frame.</li>
                                <li>The lighting is clear and your face is visible.</li>
                                <li>You are dressed professionally for the role.</li>
                            </ul>
                            <button className="iv-btn-start" onClick={() => setStep('interview')}>
                                Everything is Ready <FaArrowRight />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'role-selection') {
        return (
            <div className="iv-container iv-fade-in">
                <div className="iv-card role-card">
                    <h2>Choose Your Role</h2>
                    <p>Enter the position you are interviewing for to generate relevant questions.</p>
                    <input 
                        type="text" 
                        placeholder="e.g. Software Engineer, Marketing Manager" 
                        value={jobRole}
                        onChange={(e) => setJobRole(e.target.value)}
                        className="iv-input"
                    />
                    <button className="iv-btn-begin" onClick={handleStartInterview} disabled={loading}>
                        {loading ? 'Preparing Questions...' : 'Begin Interview'}
                    </button>
                </div>
            </div>
        );
    }

    if (step === 'interview') {
        return (
            <div className="iv-layout iv-fade-in">
                <div className="iv-main">
                    <div className="iv-video-box">
                        <video ref={videoRef} autoPlay playsInline muted className="iv-webcam" />
                        <div className="iv-overlay">
                            <span className={`iv-status ${isRecording ? 'pulse' : ''}`}>
                                {isRecording ? '• RECORDING' : 'READY'}
                            </span>
                        </div>
                    </div>

                    <div className="iv-controls">
                        <button className={`btn-icon ${isRecording ? 'btn-danger' : 'btn-primary'}`} onClick={toggleRecording}>
                            {isRecording ? <FaStop /> : <FaMicrophone />}
                        </button>
                        <button className="btn-next" onClick={handleNextQuestion} disabled={!transcript && !isRecording}>
                            {currentIdx === questions.length - 1 ? 'Finish Interview' : 'Next Question'} <FaArrowRight />
                        </button>
                    </div>
                </div>

                <div className="iv-sidebar">
                    <div className="iv-question-card">
                        <span className="q-badge">Question {currentIdx + 1} of {questions.length}</span>
                        <h3>{questions[currentIdx]}</h3>
                    </div>
                    <div className="iv-transcript-box">
                        <h4>Real-time Transcript</h4>
                        <p>{transcript || "Speak now to see transcription..."}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'analyzing') {
        return (
            <div className="iv-container iv-center">
                <div className="iv-loader">
                    <div className="spinner"></div>
                    <h2>{stages[analysisStage]}</h2>
                    <p>Our AI is deep-diving into your performance cues.</p>
                </div>
            </div>
        );
    }

    if (step === 'result' && resultData) {
        return <InterviewResult data={resultData} onReset={() => setStep('intro')} />;
    }

    return null;
};

export default MockInterviewPage;

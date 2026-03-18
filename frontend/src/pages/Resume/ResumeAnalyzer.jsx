import React, { useState } from 'react';
import axios from 'axios';
import { FaCloudUploadAlt, FaCheckCircle, FaExclamationTriangle, FaLightbulb } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ResumeAnalyzer = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) {
                toast.error('File size too large (max 5MB)');
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error('Please select a file first');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('resume', file);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/api/resume/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setAnalysis(response.data.analysis);
                toast.success('Analysis complete!');
            }
        } catch (error) {
            console.error('Analysis error:', error);
            toast.error(error.response?.data?.message || 'Analysis failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="analyzer-card">
            {!analysis ? (
                <>
                    <div className="upload-zone" onClick={() => document.getElementById('resume-upload').click()}>
                        <FaCloudUploadAlt className="upload-icon" />
                        <h3>Upload your Resume</h3>
                        <p>PDF or DOCX (Max 5MB)</p>
                        <input 
                            type="file" 
                            id="resume-upload" 
                            hidden 
                            accept=".pdf,.docx"
                            onChange={handleFileChange} 
                        />
                        {file && <p className="selected-file">Selected: {file.name}</p>}
                    </div>
                    <button 
                        className="btn btn-primary" 
                        onClick={handleUpload}
                        disabled={loading || !file}
                    >
                        {loading ? 'Analyzing...' : 'Start Analysis'}
                    </button>
                    <p className="mt-3 text-muted">Powered by AI Analysis for ATS compatibility</p>
                </>
            ) : (
                <div className="analysis-results">
                    <div className="score-section mb-5">
                        <div className="score-circle">
                            {analysis.score}
                        </div>
                        <h3 className="mt-3">ATS Compatibility Score</h3>
                    </div>

                    <div className="results-grid">
                        <div className="pros-list">
                            <h3><FaCheckCircle /> Strengths</h3>
                            <ul>
                                {analysis.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                            </ul>
                        </div>
                        <div className="cons-list">
                            <h3><FaExclamationTriangle /> Areas for Improvement</h3>
                            <ul>
                                {analysis.cons.map((con, i) => <li key={i}>{con}</li>)}
                            </ul>
                        </div>
                    </div>

                    <div className="keywords-section mt-4 text-left p-4 bg-light rounded shadow-sm">
                        <h3 className="mb-4"><FaLightbulb className="text-warning mr-2" /> Resume Keywords</h3>
                        <div className="mb-4 pt-2">
                            <strong className="d-block mb-3">Found Skills:</strong>
                            <div className="d-flex flex-wrap gap-2">
                                {analysis.keywords.found.map((kw, i) => (
                                    <span key={i} className="badge bg-success">{kw}</span>
                                ))}
                            </div>
                        </div>
                        <div className="pt-4 border-top">
                            <strong className="d-block mb-3">Missing Keywords:</strong>
                            <div className="d-flex flex-wrap gap-2">
                                {analysis.keywords.missing.map((kw, i) => (
                                    <span key={i} className="badge bg-danger">{kw}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="recommendation-section mt-4 text-left p-4 bg-stone rounded">
                        <h3>Recommendation</h3>
                        <p>{analysis.recommendation}</p>
                    </div>

                    <button className="btn btn-outline mt-4" onClick={() => setAnalysis(null)}>
                        Analyze Another Resume
                    </button>
                </div>
            )}
        </div>
    );
};

export default ResumeAnalyzer;

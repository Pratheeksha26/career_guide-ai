import React, { useState } from 'react';
import ResumeBuilder from './ResumeBuilder';
import ResumeAnalyzer from './ResumeAnalyzer';
import './Resume.css';

const ResumePage = () => {
    const [activeTab, setActiveTab] = useState('builder');

    return (
        <div className="resume-container">
            <div className="resume-header no-print">
                <h1>AI Resume Studio</h1>
                <p>Build an ATS-optimized resume or analyze your existing one with AI</p>
            </div>

            <div className="resume-tabs no-print">
                <button 
                    className={`resume-tab ${activeTab === 'builder' ? 'active' : ''}`}
                    onClick={() => setActiveTab('builder')}
                >
                    Resume Builder
                </button>
                <button 
                    className={`resume-tab ${activeTab === 'analyzer' ? 'active' : ''}`}
                    onClick={() => setActiveTab('analyzer')}
                >
                    ATS Analyzer
                </button>
            </div>

            <div className="resume-content">
                {activeTab === 'builder' ? <ResumeBuilder /> : <ResumeAnalyzer />}
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    .no-print { display: none !important; }
                    .app { background: white !important; }
                    .main { padding: 0 !important; margin: 0 !important; }
                    .content-wrapper { padding: 0 !important; max-width: none !important; }
                    .resume-container { margin: 0 !important; padding: 0 !important; max-width: none !important; }
                    .builder-layout { display: block !important; }
                    .builder-preview { box-shadow: none !important; border: none !important; padding: 0 !important; }
                    nav, footer, .fab { display: none !important; }
                }
            `}} />
        </div>
    );
};

export default ResumePage;

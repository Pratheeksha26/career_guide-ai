import React, { useState } from 'react';
import { FaDownload, FaUser, FaBriefcase, FaGraduationCap, FaTools, FaProjectDiagram, FaCertificate, FaTrash, FaPlus } from 'react-icons/fa';

const ResumeBuilder = () => {
    const [data, setData] = useState({
        personal: { name: '', email: '', phone: '', location: '', linkedin: '', github: '', website: '' },
        summary: '',
        experience: [{ company: '', role: '', location: '', startDate: '', endDate: '', desc: '' }],
        education: [{ school: '', degree: '', location: '', startDate: '', endDate: '' }],
        projects: [{ name: '', link: '', desc: '' }],
        certifications: [{ name: '', issuer: '', date: '' }],
        technicalSkills: '',
        softSkills: ''
    });

    const handleChange = (section, field, value, index = null) => {
        const newData = { ...data };
        if (index !== null) {
            newData[section][index][field] = value;
        } else if (field) {
            newData[section][field] = value;
        } else {
            newData[section] = value;
        }
        setData(newData);
    };

    const addEntry = (section) => {
        const entryTemplates = {
            experience: { company: '', role: '', location: '', startDate: '', endDate: '', desc: '' },
            education: { school: '', degree: '', location: '', startDate: '', endDate: '' },
            projects: { name: '', link: '', desc: '' },
            certifications: { name: '', issuer: '', date: '' }
        };
        setData({
            ...data,
            [section]: [...data[section], entryTemplates[section]]
        });
    };

    const removeEntry = (section, index) => {
        const newData = { ...data };
        newData[section] = newData[section].filter((_, i) => i !== index);
        setData(newData);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="builder-layout">
            <div className="builder-form no-print">
                <h3 className="mb-4">ATS Resume Builder</h3>
                
                {/* Personal Info */}
                <section className="form-section">
                    <h4><FaUser /> Personal Information</h4>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" placeholder="Johnathan Doe" value={data.personal.name} onChange={(e) => handleChange('personal', 'name', e.target.value)} />
                    </div>
                    <div className="row">
                        <div className="col-md-6 form-group">
                            <label>Email</label>
                            <input type="email" placeholder="john.doe@email.com" value={data.personal.email} onChange={(e) => handleChange('personal', 'email', e.target.value)} />
                        </div>
                        <div className="col-md-6 form-group">
                            <label>Phone</label>
                            <input type="text" placeholder="(555) 000-0000" value={data.personal.phone} onChange={(e) => handleChange('personal', 'phone', e.target.value)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Location</label>
                        <input type="text" placeholder="City, State" value={data.personal.location} onChange={(e) => handleChange('personal', 'location', e.target.value)} />
                    </div>
                    <div className="row">
                        <div className="col-md-6 form-group">
                            <label>LinkedIn URL</label>
                            <input type="text" placeholder="linkedin.com/in/johndoe" value={data.personal.linkedin} onChange={(e) => handleChange('personal', 'linkedin', e.target.value)} />
                        </div>
                        <div className="col-md-6 form-group">
                            <label>Portfolio/Website</label>
                            <input type="text" placeholder="johndoe.com" value={data.personal.website} onChange={(e) => handleChange('personal', 'website', e.target.value)} />
                        </div>
                    </div>
                </section>

                {/* Professional Summary */}
                <section className="form-section">
                    <h4><FaTools /> Professional Summary</h4>
                    <div className="form-group">
                        <label>Briefly describe your career goals and highlights</label>
                        <textarea 
                            placeholder="Results-oriented professional with X years of experience..." 
                            value={data.summary} 
                            onChange={(e) => handleChange('summary', null, e.target.value)} 
                            rows="4" 
                        />
                    </div>
                </section>

                {/* Experience */}
                <section className="form-section">
                    <h4><FaBriefcase /> Work Experience</h4>
                    {data.experience.map((exp, i) => (
                        <div key={i} className="experience-entry mb-4 p-3 border rounded bg-white position-relative">
                            {data.experience.length > 1 && (
                                <button className="remove-btn" onClick={() => removeEntry('experience', i)}><FaTrash /></button>
                            )}
                            <div className="form-group">
                                <label>Company Name</label>
                                <input type="text" value={exp.company} onChange={(e) => handleChange('experience', 'company', e.target.value, i)} />
                            </div>
                            <div className="form-group">
                                <label>Job Title</label>
                                <input type="text" value={exp.role} onChange={(e) => handleChange('experience', 'role', e.target.value, i)} />
                            </div>
                            <div className="row">
                                <div className="col-md-6 form-group">
                                    <label>Start Date</label>
                                    <input type="text" placeholder="MM/YYYY" value={exp.startDate} onChange={(e) => handleChange('experience', 'startDate', e.target.value, i)} />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label>End Date</label>
                                    <input type="text" placeholder="MM/YYYY or Present" value={exp.endDate} onChange={(e) => handleChange('experience', 'endDate', e.target.value, i)} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input type="text" value={exp.location} onChange={(e) => handleChange('experience', 'location', e.target.value, i)} />
                            </div>
                            <div className="form-group">
                                <label>Key Achievements (Bullet points)</label>
                                <textarea placeholder="• Increased efficiency by 20%..." value={exp.desc} onChange={(e) => handleChange('experience', 'desc', e.target.value, i)} rows="4" />
                            </div>
                        </div>
                    ))}
                    <button className="btn btn-outline w-100" onClick={() => addEntry('experience')}><FaPlus /> Add Work Experience</button>
                </section>

                {/* Education */}
                <section className="form-section">
                    <h4><FaGraduationCap /> Education</h4>
                    {data.education.map((edu, i) => (
                        <div key={i} className="experience-entry mb-4 p-3 border rounded bg-white position-relative">
                            {data.education.length > 1 && (
                                <button className="remove-btn" onClick={() => removeEntry('education', i)}><FaTrash /></button>
                            )}
                            <div className="form-group">
                                <label>Institution Name</label>
                                <input type="text" value={edu.school} onChange={(e) => handleChange('education', 'school', e.target.value, i)} />
                            </div>
                            <div className="form-group">
                                <label>Degree</label>
                                <input type="text" value={edu.degree} onChange={(e) => handleChange('education', 'degree', e.target.value, i)} />
                            </div>
                            <div className="row">
                                <div className="col-md-6 form-group">
                                    <label>Start Date</label>
                                    <input type="text" value={edu.startDate} onChange={(e) => handleChange('education', 'startDate', e.target.value, i)} />
                                </div>
                                <div className="col-md-6 form-group">
                                    <label>Graduation Date</label>
                                    <input type="text" value={edu.endDate} onChange={(e) => handleChange('education', 'endDate', e.target.value, i)} />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button className="btn btn-outline w-100" onClick={() => addEntry('education')}><FaPlus /> Add Education</button>
                </section>

                {/* Projects */}
                <section className="form-section">
                    <h4><FaProjectDiagram /> Projects</h4>
                    {data.projects.map((proj, i) => (
                        <div key={i} className="experience-entry mb-4 p-3 border rounded bg-white position-relative">
                            <button className="remove-btn" onClick={() => removeEntry('projects', i)}><FaTrash /></button>
                            <div className="form-group">
                                <label>Project Name</label>
                                <input type="text" value={proj.name} onChange={(e) => handleChange('projects', 'name', e.target.value, i)} />
                            </div>
                            <div className="form-group">
                                <label>Project Link</label>
                                <input type="text" value={proj.link} onChange={(e) => handleChange('projects', 'link', e.target.value, i)} />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea value={proj.desc} onChange={(e) => handleChange('projects', 'desc', e.target.value, i)} rows="3" />
                            </div>
                        </div>
                    ))}
                    <button className="btn btn-outline w-100" onClick={() => addEntry('projects')}><FaPlus /> Add Project</button>
                </section>

                {/* Skills */}
                <section className="form-section">
                    <h4><FaTools /> Skills</h4>
                    <div className="form-group">
                        <label>Technical Skills (Comma separated)</label>
                        <textarea 
                            className="w-100" 
                            placeholder="React, Java, Python, SQL..." 
                            value={data.technicalSkills} 
                            onChange={(e) => handleChange('technicalSkills', null, e.target.value)} 
                            rows="2" 
                        />
                    </div>
                    <div className="form-group">
                        <label>Soft Skills (Comma separated)</label>
                        <textarea 
                            className="w-100" 
                            placeholder="Communication, Leadership, Problem Solving..." 
                            value={data.softSkills} 
                            onChange={(e) => handleChange('softSkills', null, e.target.value)} 
                            rows="2" 
                        />
                    </div>
                </section>

                {/* Certifications */}
                <section className="form-section">
                    <h4><FaCertificate /> Certifications</h4>
                    {data.certifications.map((cert, i) => (
                        <div key={i} className="experience-entry mb-4 p-3 border rounded bg-white position-relative">
                            <button className="remove-btn" onClick={() => removeEntry('certifications', i)}><FaTrash /></button>
                            <div className="row">
                                <div className="col-md-6 form-group">
                                    <label>Certification Name</label>
                                    <input type="text" value={cert.name} onChange={(e) => handleChange('certifications', 'name', e.target.value, i)} />
                                </div>
                                <div className="col-md-3 form-group">
                                    <label>Issuer</label>
                                    <input type="text" value={cert.issuer} onChange={(e) => handleChange('certifications', 'issuer', e.target.value, i)} />
                                </div>
                                <div className="col-md-3 form-group">
                                    <label>Date</label>
                                    <input type="text" value={cert.date} onChange={(e) => handleChange('certifications', 'date', e.target.value, i)} />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button className="btn btn-outline w-100" onClick={() => addEntry('certifications')}><FaPlus /> Add Certification</button>
                </section>

                <button className="btn btn-primary btn-lg w-100 mt-4 mb-5" onClick={handlePrint}>
                    <FaDownload /> Download ATS Optimized PDF
                </button>
            </div>

            {/* ATS PREVIEW - Strictly Minimal and Structured */}
            <div className="builder-preview" id="resume-preview">
                {/* Header */}
                <div className="ats-header">
                    <h1 className="preview-name">{data.personal.name || 'YOUR NAME'}</h1>
                    <div className="preview-contact">
                        {data.personal.location && <span>{data.personal.location} | </span>}
                        {data.personal.phone && <span>{data.personal.phone} | </span>}
                        {data.personal.email && <span>{data.personal.email}</span>}
                    </div>
                    {(data.personal.linkedin || data.personal.website || data.personal.github) && (
                        <div className="preview-contact" style={{ borderBottom: 'none', paddingBottom: 0, marginTop: '-20px' }}>
                            {data.personal.linkedin && <span>LinkedIn: {data.personal.linkedin} | </span>}
                            {data.personal.website && <span>{data.personal.website}</span>}
                        </div>
                    )}
                </div>

                {/* Summary */}
                {data.summary && (
                    <div className="preview-section">
                        <div className="section-title">Professional Summary</div>
                        <p>{data.summary}</p>
                    </div>
                )}

                {/* Experience */}
                <div className="preview-section">
                    <div className="section-title">Work Experience</div>
                    {data.experience.map((exp, i) => (
                        <div key={i} className="mb-4">
                            <div className="d-flex justify-content-between font-weight-bold">
                                <strong>{exp.company} {exp.startDate && ` | ${exp.startDate} – ${exp.endDate}`}</strong>
                            </div>
                            <div className="italic">
                                <em>{exp.role}{exp.location && ` | ${exp.location}`}</em>
                            </div>
                            <ul className="mt-2 preview-list">
                                {exp.desc.split('\n').filter(l => l.trim()).map((line, j) => (
                                    <li key={j}>{line.startsWith('•') ? line.substring(1).trim() : line.trim()}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Education */}
                <div className="preview-section">
                    <div className="section-title">Education</div>
                    {data.education.map((edu, i) => (
                        <div key={i} className="mb-3">
                            <div className="d-flex justify-content-between align-items-baseline">
                                <strong>{edu.school} {edu.startDate && ` | ${edu.startDate} – ${edu.endDate}`}</strong>
                            </div>
                            <div>{edu.degree} {edu.location && `| ${edu.location}`}</div>
                        </div>
                    ))}
                </div>

                {/* Projects */}
                {data.projects.length > 0 && data.projects[0].name && (
                    <div className="preview-section">
                        <div className="section-title">Projects</div>
                        {data.projects.map((proj, i) => (
                            <div key={i} className="mb-3">
                                <div><strong>{proj.name}</strong> {proj.link && `| ${proj.link}`}</div>
                                <p style={{ margin: 0 }}>{proj.desc}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Skills */}
                <div className="preview-section">
                    <div className="section-title">Skills</div>
                    {data.technicalSkills && (
                        <div className="mb-2">
                            <strong>Technical Skills: </strong>{data.technicalSkills}
                        </div>
                    )}
                    {data.softSkills && (
                        <div className="mb-2">
                            <strong>Soft Skills: </strong>{data.softSkills}
                        </div>
                    )}
                </div>

                {/* Certifications */}
                {data.certifications.length > 0 && data.certifications[0].name && (
                    <div className="preview-section">
                        <div className="section-title">Certifications</div>
                        {data.certifications.map((cert, i) => (
                            <div key={i} className="" style={{ marginBottom: '5px' }}>
                                <strong>{cert.name}</strong> – {cert.issuer} ({cert.date})
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                .remove-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: #ffeded;
                    color: #d32f2f;
                    border: none;
                    padding: 8px;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10;
                }
                .remove-btn:hover {
                    background: #d32f2f;
                    color: white;
                }
                .preview-list {
                    list-style-type: disc;
                    padding-left: 20px;
                }
                .preview-list li {
                    margin-bottom: 5px;
                }
                .ats-header {
                    margin-bottom: 30px;
                }
                .font-weight-bold { font-weight: 700; }
                
                @media print {
                    .preview-section { page-break-inside: avoid; }
                    .section-title { margin-top: 20px !important; }
                }
            `}} />
        </div>
    );
};

export default ResumeBuilder;

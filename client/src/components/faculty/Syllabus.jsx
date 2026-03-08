import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Sidebar from '../shared/Sidebar';
import { BookOpen, Search, FileText } from 'lucide-react';

const FacultySyllabus = () => {
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [syllabus, setSyllabus] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Mock subjects/classes - ideally fetched from API based on Faculty's assigned classes
    const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Physics', 'Chemistry', 'Biology'];
    const classes = ['10th Grade A', '10th Grade B', '11th Grade A', '11th Grade B', '12th Grade A'];

    const fetchSyllabus = async () => {
        if (!selectedClass || !selectedSubject) return;

        try {
            setLoading(true);
            const response = await api.get(`/syllabus?class=${encodeURIComponent(selectedClass)}&subject=${encodeURIComponent(selectedSubject)}`);
            const data = response.data;

            if (Array.isArray(data) && data.length > 0) {
                setSyllabus(data[0]);
            } else {
                setSyllabus({});
            }
            setError(null);
        } catch (err) {
            console.error('Error fetching syllabus:', err);
            setError('Failed to load syllabus');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSyllabus();
    }, [selectedClass, selectedSubject]);

    return (
        <div className="admin-layout">
            <Sidebar role="faculty" />
            <div className="admin-main">
                <div className="admin-content">
                    <div className="page-header">
                        <div className="header-content">
                            <div className="header-icon">
                                <BookOpen size={32} />
                            </div>
                            <div>
                                <h1>Syllabus Viewer</h1>
                                <p className="text-secondary">Review syllabus for your assigned classes</p>
                            </div>
                        </div>
                    </div>

                    <div className="controls-card">
                        <div className="control-group">
                            <label className="control-label">
                                <Search size={16} />
                                Select Class
                            </label>
                            <select
                                className="control-select"
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                            >
                                <option value="">Select Class</option>
                                {classes.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className="control-group">
                            <label className="control-label">
                                <FileText size={16} />
                                Select Subject
                            </label>
                            <select
                                className="control-select"
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                            >
                                <option value="">Select Subject</option>
                                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    {loading && <div className="loading-spinner">Loading syllabus...</div>}

                    {!loading && selectedSubject && selectedClass && (
                        <div className="syllabus-container">
                            {(!syllabus.chapters || syllabus.chapters.length === 0) ? (
                                <div className="empty-state">
                                    <p>No syllabus found for this class and subject.</p>
                                </div>
                            ) : (
                                <div className="chapters-list">
                                    {syllabus.chapters.map((chapter, idx) => (
                                        <div key={idx} className="chapter-card">
                                            <div className="chapter-header">
                                                <span className="chapter-number">{idx + 1}</span>
                                                <h3>{chapter.title}</h3>
                                            </div>
                                            <div className="topics-list">
                                                {chapter.topics && chapter.topics.map((topic, tIdx) => (
                                                    <div key={tIdx} className="topic-item">
                                                        <span className="topic-bullet">•</span>
                                                        <span className="topic-title">{topic.title || topic.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .admin-layout {
                    display: flex;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                }
                .admin-main { flex: 1; }
                .admin-content { padding: 2rem; max-width: 1200px; margin: 0 auto; }
                
                .page-header { margin-bottom: 2rem; }
                .header-content { display: flex; gap: 1rem; align-items: center; }
                .header-icon {
                    width: 50px; height: 50px;
                    background: linear-gradient(135deg, #6366f1, #818cf8);
                    color: white; border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                }
                h1 { margin: 0; font-size: 1.8rem; color: #1e293b; }
                .text-secondary { color: #64748b; margin: 0; }

                .controls-card {
                    background: white; padding: 1.5rem; border-radius: 16px;
                    display: flex; gap: 1.5rem; margin-bottom: 2rem;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                }
                .control-group { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
                .control-label { font-weight: 600; color: #475569; display: flex; align-items: center; gap: 0.5rem; }
                .control-select {
                    padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px;
                    font-size: 1rem; outline: none;
                }
                .control-select:focus { border-color: #6366f1; box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2); }

                .chapters-list { display: flex; flex-direction: column; gap: 1.5rem; }
                .chapter-card {
                    background: white; border-radius: 12px; padding: 1.5rem;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;
                }
                .chapter-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
                .chapter-number {
                    background: #6366f1; color: white; width: 30px; height: 30px;
                    display: flex; align-items: center; justify-content: center;
                    border-radius: 8px; font-weight: bold;
                }
                .chapter-card h3 { margin: 0; font-size: 1.2rem; color: #334155; }

                .topic-item {
                    padding: 0.5rem 0.5rem 0.5rem 3rem;
                    display: flex; align-items: center; gap: 0.5rem;
                    color: #475569;
                }
                .topic-bullet { color: #6366f1; font-weight: bold; }
                
                .empty-state {
                    text-align: center; padding: 3rem; color: #94a3b8;
                    background: white; border-radius: 12px; border: 2px dashed #e2e8f0;
                }
                .loading-spinner { text-align: center; color: #64748b; padding: 2rem; }
            `}</style>
        </div>
    );
};

export default FacultySyllabus;

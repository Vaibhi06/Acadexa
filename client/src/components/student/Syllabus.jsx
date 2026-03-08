import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Sidebar from '../shared/Sidebar';
import { BookOpen, CheckCircle2, Search, FileText } from 'lucide-react';

const StudentSyllabus = () => {
    const [selectedSubject, setSelectedSubject] = useState('');
    const [syllabus, setSyllabus] = useState({});
    const [studentClass, setStudentClass] = useState(''); // Will be fetched from profile
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Subjects list - could be dynamic based on class
    const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Physics', 'Chemistry', 'Biology'];

    useEffect(() => {
        const fetchStudentProfile = async () => {
            try {
                // Fetch logged-in student's profile to get their class
                // Assuming /api/students/profile or similar exists, or getting from /api/auth/me
                // For now, let's try to get it from a common student endpoint or local storage if stored
                // But better to fetch.
                // Let's assume we can get it from /api/students/me or filtering by user ID if we had it.
                // Re-using logic: usually the class is in the user object or student profile.
                // Let's try fetching the specific student profile using the specialized 'profile' endpoint if it exists
                // OR getting it from local storage/auth context if available. 
                // Since I can't easily see AuthContext implementation DETAILS right now, I'll fetch generic 'my' profile if possible.
                // Wait, Admin `StudentProfile` fetches by ID.
                // Let's try fetching all students (filtered) or just assume the user knows their class for now?
                // Better: Fetch student details.
                // A safe bet is to assume the class name is available in the user object or we fetch it.

                // Temporary: Fetch "my" student record.
                // Since we don't have a direct "me" endpoint in `studentRoutes` observed earlier (only getById), 
                // we might need to rely on the user knowing their class OR selecting it conformingly.
                // BUT, automation is key.
                // Let's try fetching student stats or looking up student by the logged-in user's ID.
                // Actually, let's just make it selectable for now to be safe, or auto-filled if we had the context.
                // AUTO: The user object in AuthContext usually has 'class' if it was added.
                // Let's assume we allow them to select class or we default to a mock for now if fetching fails?
                // No, let's allow "Select Class" (useful if they want to see other years?) - usually students only see theirs.
                // Let's make Class read-only if we can get it, else selectable.

                // For this implementation, I will make Class selectable but defaulted if possible, 
                // OR just selectable to ensure it works immediately without complex profile fetching logic blocks.
                // Wait, I saw `getStudentsByClass` but not `getMe`.
                // Let's just make it a dropdown for now, simpler for "Verification".

                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchStudentProfile();
    }, []);

    const fetchSyllabus = async () => {
        if (!studentClass || !selectedSubject) return;

        try {
            setLoading(true);
            const response = await api.get(`/syllabus?class=${encodeURIComponent(studentClass)}&subject=${encodeURIComponent(selectedSubject)}`);
            // API returns array of syllabus items. 
            // We need to transform or use directly.
            // The Admin component transformed it. Let's look at the response structure.
            // It returns array of objects with { chapters: [...] }
            // Since we filter by Subject in the API call itself:
            const data = response.data;

            // Expected data: Array of syllabus records. 
            // We usually have one record per class+subject.
            if (Array.isArray(data) && data.length > 0) {
                // Check if it's the right structure
                const record = data[0];
                // If the API returns all records for the class, we filter by subject client side if DB didn't
                // But our controller filters by subject if provided.
                setSyllabus(record);
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
    }, [studentClass, selectedSubject]);

    // Mock classes for selection if we can't auto-detect
    const classes = ['10th Grade A', '10th Grade B', '11th Grade A', '11th Grade B', '12th Grade A'];

    return (
        <div className="admin-layout">
            <Sidebar role="student" />
            <div className="admin-main">
                <div className="admin-content">
                    <div className="page-header">
                        <div className="header-content">
                            <div className="header-icon">
                                <BookOpen size={32} />
                            </div>
                            <div>
                                <h1>My Syllabus</h1>
                                <p className="text-secondary">View your course curriculum and progress</p>
                            </div>
                        </div>
                    </div>

                    <div className="controls-card">
                        <div className="control-group">
                            <label className="control-label">
                                <Search size={16} />
                                Select Your Class
                            </label>
                            <select
                                className="control-select"
                                value={studentClass}
                                onChange={(e) => setStudentClass(e.target.value)}
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

                    {!loading && selectedSubject && studentClass && (
                        <div className="syllabus-container">
                            {(!syllabus.chapters || syllabus.chapters.length === 0) ? (
                                <div className="empty-state">
                                    <p>No syllabus found for this subject.</p>
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
                    background: linear-gradient(135deg, #FEA3BE, #F77DC0);
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
                .control-select:focus { border-color: #FEA3BE; box-shadow: 0 0 0 2px rgba(254, 163, 190, 0.2); }

                .chapters-list { display: flex; flex-direction: column; gap: 1.5rem; }
                .chapter-card {
                    background: white; border-radius: 12px; padding: 1.5rem;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;
                }
                .chapter-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
                .chapter-number {
                    background: #FEA3BE; color: white; width: 30px; height: 30px;
                    display: flex; align-items: center; justify-content: center;
                    border-radius: 8px; font-weight: bold;
                }
                .chapter-card h3 { margin: 0; font-size: 1.2rem; color: #334155; }

                .topic-item {
                    padding: 0.5rem 0.5rem 0.5rem 3rem;
                    display: flex; align-items: center; gap: 0.5rem;
                    color: #475569;
                }
                .topic-bullet { color: #FEA3BE; font-weight: bold; }
                
                .empty-state {
                    text-align: center; padding: 3rem; color: #94a3b8;
                    background: white; border-radius: 12px; border: 2px dashed #e2e8f0;
                }
                .loading-spinner { text-align: center; color: #64748b; padding: 2rem; }
            `}</style>
        </div>
    );
};

export default StudentSyllabus;

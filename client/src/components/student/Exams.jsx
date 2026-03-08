import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import {
    Calendar,
    Clock,
    BookOpen,
    MapPin,
    FileText,
    X,
    Award,
    TrendingUp,
    AlertCircle,
    CheckCircle
} from 'lucide-react';

const Exams = () => {
    const [selectedExam, setSelectedExam] = useState(null);
    const [activeTab, setActiveTab] = useState('upcoming');

    // Upcoming exams data
    const upcomingExams = [
        {
            id: 1,
            subject: 'Mathematics',
            date: 'January 15, 2026',
            time: '09:00 AM - 12:00 PM',
            duration: '3 hours',
            type: 'Mid-Term',
            room: 'Hall A',
            syllabus: ['Calculus', 'Algebra', 'Trigonometry', 'Statistics'],
            totalMarks: 100,
            passingMarks: 35
        },
        {
            id: 2,
            subject: 'Physics',
            date: 'January 16, 2026',
            time: '09:00 AM - 12:00 PM',
            duration: '3 hours',
            type: 'Mid-Term',
            room: 'Hall B',
            syllabus: ['Mechanics', 'Thermodynamics', 'Waves', 'Optics'],
            totalMarks: 100,
            passingMarks: 35
        },
        {
            id: 3,
            subject: 'Chemistry',
            date: 'January 18, 2026',
            time: '09:00 AM - 11:00 AM',
            duration: '2 hours',
            type: 'Practical',
            room: 'Chemistry Lab',
            syllabus: ['Organic Reactions', 'Titration', 'Salt Analysis'],
            totalMarks: 50,
            passingMarks: 18
        },
        {
            id: 4,
            subject: 'English',
            date: 'January 20, 2026',
            time: '02:00 PM - 05:00 PM',
            duration: '3 hours',
            type: 'Mid-Term',
            room: 'Hall A',
            syllabus: ['Grammar', 'Literature', 'Writing', 'Comprehension'],
            totalMarks: 100,
            passingMarks: 35
        },
    ];

    // Results data
    const results = [
        { subject: 'Mathematics', obtained: 92, total: 100, grade: 'A+', remarks: 'Excellent' },
        { subject: 'Physics', obtained: 85, total: 100, grade: 'A', remarks: 'Very Good' },
        { subject: 'Chemistry', obtained: 78, total: 100, grade: 'B+', remarks: 'Good' },
        { subject: 'English', obtained: 88, total: 100, grade: 'A', remarks: 'Very Good' },
        { subject: 'Biology', obtained: 72, total: 100, grade: 'B', remarks: 'Satisfactory' },
        { subject: 'Computer Science', obtained: 95, total: 100, grade: 'A+', remarks: 'Outstanding' },
    ];

    const totalObtained = results.reduce((sum, r) => sum + r.obtained, 0);
    const totalMaxMarks = results.reduce((sum, r) => sum + r.total, 0);
    const overallPercentage = ((totalObtained / totalMaxMarks) * 100).toFixed(1);

    const getGradeColor = (grade) => {
        const colors = {
            'A+': '#22c55e',
            'A': '#16a34a',
            'B+': '#84cc16',
            'B': '#eab308',
            'C': '#f59e0b',
            'D': '#ef4444',
            'F': '#dc2626'
        };
        return colors[grade] || '#64748b';
    };

    const getRemarkIcon = (remarks) => {
        if (remarks === 'Outstanding' || remarks === 'Excellent') {
            return <Award size={16} />;
        } else if (remarks === 'Very Good' || remarks === 'Good') {
            return <CheckCircle size={16} />;
        } else if (remarks === 'Satisfactory') {
            return <TrendingUp size={16} />;
        }
        return <AlertCircle size={16} />;
    };

    const getDaysRemaining = (dateStr) => {
        const examDate = new Date(dateStr);
        const today = new Date();
        const diffTime = examDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <div className="admin-layout">
            <Sidebar role="student" />
            <div className="admin-main">
                <Navbar />
                <div className="exams-page">
                    {/* Page Header */}
                    <div className="page-header">
                        <h1>📝 Exams & Results</h1>
                        <p>10th Grade A - Academic Year 2025-26</p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="tab-nav">
                        <button
                            className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
                            onClick={() => setActiveTab('upcoming')}
                        >
                            <Calendar size={18} />
                            Upcoming Exams
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
                            onClick={() => setActiveTab('results')}
                        >
                            <FileText size={18} />
                            Results
                        </button>
                    </div>

                    {/* Upcoming Exams Tab */}
                    {activeTab === 'upcoming' && (
                        <div className="upcoming-section">
                            <div className="exams-grid">
                                {upcomingExams.map((exam) => {
                                    const daysLeft = getDaysRemaining(exam.date);
                                    return (
                                        <div
                                            key={exam.id}
                                            className="exam-card"
                                            onClick={() => setSelectedExam(exam)}
                                        >
                                            <div className="exam-header">
                                                <span className="exam-type">{exam.type}</span>
                                                <span className={`days-badge ${daysLeft <= 3 ? 'urgent' : ''}`}>
                                                    {daysLeft} days left
                                                </span>
                                            </div>
                                            <h3 className="exam-subject">{exam.subject}</h3>
                                            <div className="exam-details">
                                                <div className="detail-item">
                                                    <Calendar size={16} />
                                                    <span>{exam.date}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <Clock size={16} />
                                                    <span>{exam.time}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <MapPin size={16} />
                                                    <span>{exam.room}</span>
                                                </div>
                                            </div>
                                            <div className="exam-footer">
                                                <span className="marks-info">
                                                    Total: {exam.totalMarks} marks
                                                </span>
                                                <button className="view-btn">View Details</button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Results Tab */}
                    {activeTab === 'results' && (
                        <div className="results-section">
                            {/* Overall Summary */}
                            <div className="results-summary">
                                <div className="summary-circle">
                                    <svg viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="42"
                                            fill="none"
                                            stroke="#22c55e"
                                            strokeWidth="10"
                                            strokeDasharray={`${overallPercentage * 2.64} ${264 - overallPercentage * 2.64}`}
                                            strokeDashoffset="66"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="circle-text">
                                        <span className="percentage">{overallPercentage}%</span>
                                        <span className="label">Overall</span>
                                    </div>
                                </div>
                                <div className="summary-stats">
                                    <div className="summary-item">
                                        <span className="stat-label">Total Obtained</span>
                                        <span className="stat-value">{totalObtained}/{totalMaxMarks}</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="stat-label">Overall Grade</span>
                                        <span className="stat-value grade">A</span>
                                    </div>
                                    <div className="summary-item">
                                        <span className="stat-label">Class Rank</span>
                                        <span className="stat-value">#5</span>
                                    </div>
                                </div>
                            </div>

                            {/* Subject-wise Results */}
                            <h2 className="section-title">📊 Subject-wise Marks</h2>
                            <div className="results-grid">
                                {results.map((result, idx) => (
                                    <div key={idx} className="result-card">
                                        <div className="result-header">
                                            <div className="subject-info">
                                                <BookOpen size={20} />
                                                <span>{result.subject}</span>
                                            </div>
                                            <div
                                                className="grade-badge"
                                                style={{ background: getGradeColor(result.grade) }}
                                            >
                                                {result.grade}
                                            </div>
                                        </div>
                                        <div className="result-body">
                                            <div className="marks-display">
                                                <span className="obtained">{result.obtained}</span>
                                                <span className="separator">/</span>
                                                <span className="total">{result.total}</span>
                                            </div>
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-fill"
                                                    style={{
                                                        width: `${(result.obtained / result.total) * 100}%`,
                                                        background: getGradeColor(result.grade)
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="remarks">
                                                {getRemarkIcon(result.remarks)}
                                                <span>{result.remarks}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Exam Detail Popup */}
                    {selectedExam && (
                        <div className="popup-overlay" onClick={() => setSelectedExam(null)}>
                            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                                <button className="close-btn" onClick={() => setSelectedExam(null)}>
                                    <X size={20} />
                                </button>
                                <div className="popup-header">
                                    <span className="popup-type">{selectedExam.type}</span>
                                    <h2>{selectedExam.subject}</h2>
                                </div>
                                <div className="popup-body">
                                    <div className="popup-info-grid">
                                        <div className="popup-info-item">
                                            <Calendar size={18} />
                                            <div>
                                                <span className="info-label">Date</span>
                                                <span className="info-value">{selectedExam.date}</span>
                                            </div>
                                        </div>
                                        <div className="popup-info-item">
                                            <Clock size={18} />
                                            <div>
                                                <span className="info-label">Time</span>
                                                <span className="info-value">{selectedExam.time}</span>
                                            </div>
                                        </div>
                                        <div className="popup-info-item">
                                            <MapPin size={18} />
                                            <div>
                                                <span className="info-label">Venue</span>
                                                <span className="info-value">{selectedExam.room}</span>
                                            </div>
                                        </div>
                                        <div className="popup-info-item">
                                            <FileText size={18} />
                                            <div>
                                                <span className="info-label">Total Marks</span>
                                                <span className="info-value">{selectedExam.totalMarks}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="syllabus-section">
                                        <h3>Syllabus Covered</h3>
                                        <ul className="syllabus-list">
                                            {selectedExam.syllabus.map((topic, idx) => (
                                                <li key={idx}>{topic}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="popup-footer">
                                        <span className="passing-info">
                                            Passing Marks: {selectedExam.passingMarks}
                                        </span>
                                        <span className="duration-info">
                                            Duration: {selectedExam.duration}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .exams-page {
                    padding: 2rem;
                    background: #f8fafc;
                    min-height: 100vh;
                }

                .page-header h1 {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0 0 0.25rem 0;
                }

                .page-header p {
                    color: #64748b;
                    margin: 0 0 1.5rem 0;
                }

                /* Tab Navigation */
                .tab-nav {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 2rem;
                    background: white;
                    padding: 0.5rem;
                    border-radius: 12px;
                    width: fit-content;
                }

                .tab-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.875rem 1.5rem;
                    border: none;
                    background: transparent;
                    border-radius: 10px;
                    font-weight: 600;
                    color: #64748b;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .tab-btn:hover {
                    background: #f1f5f9;
                    color: #1e293b;
                }

                .tab-btn.active {
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    color: white;
                }

                /* Exams Grid */
                .exams-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1.5rem;
                }

                .exam-card {
                    background: white;
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 2px solid transparent;
                }

                .exam-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.08);
                    border-color: #FEA3BE;
                }

                .exam-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.75rem;
                }

                .exam-type {
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    color: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: 6px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .days-badge {
                    background: #dcfce7;
                    color: #16a34a;
                    padding: 0.25rem 0.75rem;
                    border-radius: 6px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .days-badge.urgent {
                    background: #fef2f2;
                    color: #dc2626;
                }

                .exam-subject {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0 0 1rem 0;
                }

                .exam-details {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                }

                .detail-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #64748b;
                    font-size: 0.9rem;
                }

                .exam-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 1rem;
                    border-top: 1px solid #f1f5f9;
                }

                .marks-info {
                    font-size: 0.875rem;
                    color: #64748b;
                }

                .view-btn {
                    background: #f8fafc;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    font-weight: 600;
                    color: #FEA3BE;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .view-btn:hover {
                    background: #fef7f9;
                }

                /* Results Section */
                .results-summary {
                    background: white;
                    border-radius: 20px;
                    padding: 2rem;
                    display: flex;
                    align-items: center;
                    gap: 3rem;
                    margin-bottom: 2rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                    flex-wrap: wrap;
                }

                .summary-circle {
                    position: relative;
                    width: 140px;
                    height: 140px;
                }

                .summary-circle svg {
                    width: 100%;
                    height: 100%;
                    transform: rotate(-90deg);
                }

                .circle-text {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                }

                .circle-text .percentage {
                    display: block;
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: #1e293b;
                }

                .circle-text .label {
                    font-size: 0.8rem;
                    color: #64748b;
                }

                .summary-stats {
                    display: flex;
                    gap: 2rem;
                    flex-wrap: wrap;
                }

                .summary-item {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .stat-label {
                    font-size: 0.875rem;
                    color: #64748b;
                }

                .stat-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #1e293b;
                }

                .stat-value.grade {
                    color: #22c55e;
                }

                .section-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0 0 1.25rem 0;
                }

                .results-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 1rem;
                }

                .result-card {
                    background: white;
                    border-radius: 16px;
                    padding: 1.25rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                .result-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .subject-info {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 600;
                    color: #1e293b;
                }

                .grade-badge {
                    padding: 0.375rem 0.75rem;
                    border-radius: 8px;
                    color: white;
                    font-weight: 700;
                    font-size: 0.9rem;
                }

                .result-body {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .marks-display {
                    display: flex;
                    align-items: baseline;
                    gap: 0.25rem;
                }

                .marks-display .obtained {
                    font-size: 2rem;
                    font-weight: 800;
                    color: #1e293b;
                }

                .marks-display .separator {
                    font-size: 1.25rem;
                    color: #94a3b8;
                }

                .marks-display .total {
                    font-size: 1.25rem;
                    color: #94a3b8;
                }

                .progress-bar {
                    height: 8px;
                    background: #e2e8f0;
                    border-radius: 4px;
                    overflow: hidden;
                }

                .progress-fill {
                    height: 100%;
                    border-radius: 4px;
                    transition: width 0.5s ease;
                }

                .remarks {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.9rem;
                    color: #64748b;
                    padding: 0.5rem 0.75rem;
                    background: #f8fafc;
                    border-radius: 8px;
                    width: fit-content;
                }

                /* Popup */
                .popup-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 1rem;
                }

                .popup-content {
                    background: white;
                    border-radius: 20px;
                    width: 100%;
                    max-width: 500px;
                    max-height: 90vh;
                    overflow-y: auto;
                    position: relative;
                    animation: slideUp 0.3s ease;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .close-btn {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: #f1f5f9;
                    border: none;
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: #64748b;
                    transition: all 0.2s;
                }

                .close-btn:hover {
                    background: #e2e8f0;
                    color: #1e293b;
                }

                .popup-header {
                    padding: 2rem 2rem 1rem;
                    border-bottom: 1px solid #f1f5f9;
                }

                .popup-type {
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    color: white;
                    padding: 0.375rem 1rem;
                    border-radius: 8px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    display: inline-block;
                    margin-bottom: 0.75rem;
                }

                .popup-header h2 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0;
                }

                .popup-body {
                    padding: 1.5rem 2rem 2rem;
                }

                .popup-info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                .popup-info-item {
                    display: flex;
                    gap: 0.75rem;
                    padding: 1rem;
                    background: #f8fafc;
                    border-radius: 12px;
                }

                .popup-info-item svg {
                    color: #FEA3BE;
                    flex-shrink: 0;
                    margin-top: 2px;
                }

                .popup-info-item div {
                    display: flex;
                    flex-direction: column;
                }

                .info-label {
                    font-size: 0.75rem;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .info-value {
                    font-weight: 600;
                    color: #1e293b;
                }

                .syllabus-section {
                    margin-bottom: 1.5rem;
                }

                .syllabus-section h3 {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #1e293b;
                    margin: 0 0 0.75rem 0;
                }

                .syllabus-list {
                    margin: 0;
                    padding-left: 1.25rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .syllabus-list li {
                    color: #64748b;
                }

                .popup-footer {
                    display: flex;
                    justify-content: space-between;
                    padding-top: 1rem;
                    border-top: 1px solid #f1f5f9;
                    font-size: 0.9rem;
                    color: #64748b;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .exams-page {
                        padding: 1rem;
                    }

                    .results-summary {
                        flex-direction: column;
                        gap: 1.5rem;
                    }

                    .popup-info-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default Exams;

import React, { useState, useRef } from 'react';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import {
    Calendar,
    BookOpen,
    Upload,
    FileText,
    Clock,
    CheckCircle,
    Users,
    TrendingUp,
    Award,
    ChevronDown,
    ChevronUp,
    Download,
    Eye,
    AlertCircle
} from 'lucide-react';

const FacultyExams = () => {
    const [expandedExam, setExpandedExam] = useState(null);
    const [uploadingFor, setUploadingFor] = useState(null);
    const [uploadedPapers, setUploadedPapers] = useState({});
    const fileInputRef = useRef(null);

    // Exam data with student marks for completed exams
    const [exams, setExams] = useState([
        {
            id: 1,
            name: 'Mid-Term Mathematics',
            subject: 'Mathematics',
            class: '10th Grade A',
            date: '2026-01-15',
            time: '10:00 AM',
            duration: '2 hours',
            totalMarks: 100,
            status: 'upcoming',
            questionPaper: null
        },
        {
            id: 2,
            name: 'Unit Test Physics',
            subject: 'Physics',
            class: '11th Grade B',
            date: '2026-01-20',
            time: '11:00 AM',
            duration: '1.5 hours',
            totalMarks: 50,
            status: 'upcoming',
            questionPaper: null
        },
        {
            id: 3,
            name: 'Chapter Test - Algebra',
            subject: 'Mathematics',
            class: '10th Grade B',
            date: '2026-01-25',
            time: '09:00 AM',
            duration: '1 hour',
            totalMarks: 30,
            status: 'upcoming',
            questionPaper: null
        },
        {
            id: 4,
            name: 'Final Exam Mathematics',
            subject: 'Mathematics',
            class: '10th Grade A',
            date: '2025-12-20',
            time: '09:00 AM',
            duration: '3 hours',
            totalMarks: 100,
            status: 'completed',
            questionPaper: 'math_final.pdf',
            students: [
                { id: 'STU001', name: 'Rahul Sharma', marks: 95, grade: 'A+' },
                { id: 'STU002', name: 'Priya Patel', marks: 92, grade: 'A+' },
                { id: 'STU003', name: 'Amit Kumar', marks: 88, grade: 'A' },
                { id: 'STU004', name: 'Sneha Gupta', marks: 85, grade: 'A' },
                { id: 'STU005', name: 'Vikram Singh', marks: 78, grade: 'B+' },
                { id: 'STU006', name: 'Anita Desai', marks: 75, grade: 'B+' },
                { id: 'STU007', name: 'Ravi Verma', marks: 70, grade: 'B' },
                { id: 'STU008', name: 'Neha Mishra', marks: 65, grade: 'C+' },
            ].sort((a, b) => b.marks - a.marks)
        },
        {
            id: 5,
            name: 'Mid-Term Physics',
            subject: 'Physics',
            class: '11th Grade A',
            date: '2025-12-15',
            time: '10:00 AM',
            duration: '2 hours',
            totalMarks: 100,
            status: 'completed',
            questionPaper: 'physics_midterm.pdf',
            students: [
                { id: 'STU011', name: 'Arjun Reddy', marks: 98, grade: 'A+' },
                { id: 'STU012', name: 'Kavya Nair', marks: 90, grade: 'A+' },
                { id: 'STU013', name: 'Rohit Menon', marks: 82, grade: 'A' },
                { id: 'STU014', name: 'Deepa Iyer', marks: 76, grade: 'B+' },
                { id: 'STU015', name: 'Suresh Pillai', marks: 68, grade: 'C+' },
                { id: 'STU016', name: 'Meera Krishnan', marks: 62, grade: 'C' },
            ].sort((a, b) => b.marks - a.marks)
        },
    ]);

    const upcomingExams = exams.filter(e => e.status === 'upcoming');
    const completedExams = exams.filter(e => e.status === 'completed');

    const handleUploadClick = (examId) => {
        setUploadingFor(examId);
        fileInputRef.current?.click();
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && uploadingFor) {
            setUploadedPapers(prev => ({
                ...prev,
                [uploadingFor]: file.name
            }));
            setExams(prev => prev.map(exam =>
                exam.id === uploadingFor
                    ? { ...exam, questionPaper: file.name }
                    : exam
            ));
            alert(`✅ Question paper "${file.name}" uploaded successfully!`);
        }
        setUploadingFor(null);
    };

    const toggleExpandExam = (examId) => {
        setExpandedExam(expandedExam === examId ? null : examId);
    };

    const getGradeColor = (grade) => {
        if (grade.startsWith('A')) return '#22c55e';
        if (grade.startsWith('B')) return '#0ea5e9';
        if (grade.startsWith('C')) return '#f59e0b';
        return '#ef4444';
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    // Calculate stats
    const totalUpcoming = upcomingExams.length;
    const totalCompleted = completedExams.length;
    const avgMarks = completedExams.length > 0
        ? Math.round(completedExams.reduce((sum, exam) => {
            const examAvg = exam.students?.reduce((s, st) => s + st.marks, 0) / (exam.students?.length || 1);
            return sum + examAvg;
        }, 0) / completedExams.length)
        : 0;

    return (
        <div className="admin-layout">
            <Sidebar role="faculty" />
            <div className="admin-main">
                <Navbar />
                <div className="exam-management-page">
                    {/* Hidden file input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx"
                        hidden
                    />

                    {/* Page Header */}
                    <div className="page-header-section">
                        <div className="header-content">
                            <h1>Exam Management</h1>
                            <p className="page-subtitle">Manage exams for your subjects</p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="exam-stats-grid">
                        <div className="exam-stat-card">
                            <div className="stat-icon-box upcoming">
                                <Clock size={24} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-number">{totalUpcoming}</span>
                                <span className="stat-label">Upcoming Exams</span>
                            </div>
                        </div>

                        <div className="exam-stat-card">
                            <div className="stat-icon-box completed">
                                <CheckCircle size={24} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-number">{totalCompleted}</span>
                                <span className="stat-label">Completed</span>
                            </div>
                        </div>

                        <div className="exam-stat-card">
                            <div className="stat-icon-box avg">
                                <TrendingUp size={24} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-number">{avgMarks}%</span>
                                <span className="stat-label">Avg Score</span>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Exams Section */}
                    <div className="section-card">
                        <div className="section-header">
                            <div className="header-left">
                                <Clock size={22} />
                                <h2>Upcoming Exams</h2>
                            </div>
                            <span className="count-badge">{totalUpcoming} exams</span>
                        </div>

                        <div className="exams-list">
                            {upcomingExams.map(exam => (
                                <div key={exam.id} className="exam-card upcoming">
                                    <div className="exam-main">
                                        <div className="exam-info">
                                            <div className="exam-header-row">
                                                <h3>{exam.name}</h3>
                                                <span className="status-badge upcoming">Upcoming</span>
                                            </div>
                                            <div className="exam-meta">
                                                <span><BookOpen size={14} /> {exam.subject}</span>
                                                <span><Users size={14} /> {exam.class}</span>
                                                <span><Calendar size={14} /> {formatDate(exam.date)}</span>
                                                <span><Clock size={14} /> {exam.time}</span>
                                            </div>
                                            <div className="exam-details">
                                                <span className="detail-chip">Duration: {exam.duration}</span>
                                                <span className="detail-chip">Total Marks: {exam.totalMarks}</span>
                                            </div>
                                        </div>
                                        <div className="exam-actions">
                                            {exam.questionPaper || uploadedPapers[exam.id] ? (
                                                <div className="paper-uploaded">
                                                    <FileText size={16} />
                                                    <span>{exam.questionPaper || uploadedPapers[exam.id]}</span>
                                                    <button
                                                        className="change-btn"
                                                        onClick={() => handleUploadClick(exam.id)}
                                                    >
                                                        Change
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    className="upload-btn"
                                                    onClick={() => handleUploadClick(exam.id)}
                                                >
                                                    <Upload size={18} />
                                                    Upload Question Paper
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {upcomingExams.length === 0 && (
                                <div className="empty-state">
                                    <AlertCircle size={48} />
                                    <p>No upcoming exams scheduled</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Completed Exams Section */}
                    <div className="section-card">
                        <div className="section-header">
                            <div className="header-left">
                                <CheckCircle size={22} />
                                <h2>Completed Exams</h2>
                            </div>
                            <span className="count-badge">{totalCompleted} exams</span>
                        </div>

                        <div className="exams-list">
                            {completedExams.map(exam => (
                                <div key={exam.id} className="exam-card completed">
                                    <div
                                        className="exam-main clickable"
                                        onClick={() => toggleExpandExam(exam.id)}
                                    >
                                        <div className="exam-info">
                                            <div className="exam-header-row">
                                                <h3>{exam.name}</h3>
                                                <span className="status-badge completed">Completed</span>
                                            </div>
                                            <div className="exam-meta">
                                                <span><BookOpen size={14} /> {exam.subject}</span>
                                                <span><Users size={14} /> {exam.class}</span>
                                                <span><Calendar size={14} /> {formatDate(exam.date)}</span>
                                            </div>
                                            <div className="exam-summary">
                                                <span className="summary-item">
                                                    <Users size={14} />
                                                    {exam.students?.length || 0} Students
                                                </span>
                                                <span className="summary-item">
                                                    <Award size={14} />
                                                    Top: {exam.students?.[0]?.marks || 0}/{exam.totalMarks}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="expand-btn">
                                            {expandedExam === exam.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                        </div>
                                    </div>

                                    {/* Expanded Student Marks Section */}
                                    {expandedExam === exam.id && (
                                        <div className="marks-section">
                                            <div className="marks-header">
                                                <h4>Student Marks (Descending Order)</h4>
                                                <span className="marks-note">Total: {exam.totalMarks} marks</span>
                                            </div>
                                            <div className="marks-table">
                                                <div className="table-header">
                                                    <span className="col-rank">Rank</span>
                                                    <span className="col-name">Student Name</span>
                                                    <span className="col-id">ID</span>
                                                    <span className="col-marks">Marks</span>
                                                    <span className="col-grade">Grade</span>
                                                </div>
                                                {exam.students?.map((student, idx) => (
                                                    <div key={student.id} className={`table-row ${idx < 3 ? 'top-rank' : ''}`}>
                                                        <span className="col-rank">
                                                            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                                                        </span>
                                                        <span className="col-name">{student.name}</span>
                                                        <span className="col-id">{student.id}</span>
                                                        <span className="col-marks">
                                                            <span className="marks-value">{student.marks}</span>
                                                            <span className="marks-total">/{exam.totalMarks}</span>
                                                        </span>
                                                        <span
                                                            className="col-grade"
                                                            style={{ color: getGradeColor(student.grade) }}
                                                        >
                                                            {student.grade}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {completedExams.length === 0 && (
                                <div className="empty-state">
                                    <AlertCircle size={48} />
                                    <p>No completed exams yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .exam-management-page {
                    padding: 2rem;
                    background: var(--bg-primary, #f8fafc);
                    min-height: 100vh;
                }
                
                .page-header-section {
                    margin-bottom: 2rem;
                }
                
                .header-content h1 {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: var(--text-primary, #1e293b);
                    margin: 0 0 0.5rem 0;
                }
                
                .page-subtitle {
                    color: var(--text-secondary, #64748b);
                    font-size: 0.95rem;
                    margin: 0;
                }
                
                /* Stats Grid */
                .exam-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }
                
                .exam-stat-card {
                    background: var(--bg-card, white);
                    border-radius: 16px;
                    padding: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                    border: 1px solid var(--border-color, #e2e8f0);
                }
                
                .stat-icon-box {
                    width: 52px;
                    height: 52px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }
                
                .stat-icon-box.upcoming { background: linear-gradient(135deg, #f59e0b, #d97706); }
                .stat-icon-box.completed { background: linear-gradient(135deg, #22c55e, #16a34a); }
                .stat-icon-box.avg { background: linear-gradient(135deg, #FEA3BE, #FBA2AB); }
                
                .stat-info {
                    display: flex;
                    flex-direction: column;
                }
                
                .stat-number {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: var(--text-primary, #1e293b);
                }
                
                .stat-label {
                    font-size: 0.8rem;
                    color: var(--text-secondary, #64748b);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                /* Section Card */
                .section-card {
                    background: var(--bg-card, white);
                    border-radius: 20px;
                    padding: 1.5rem;
                    margin-bottom: 1.5rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                    border: 1px solid var(--border-color, #e2e8f0);
                }
                
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    padding-bottom: 1rem;
                    border-bottom: 2px solid var(--border-color, #f1f5f9);
                }
                
                .header-left {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    color: #FEA3BE;
                }
                
                .header-left h2 {
                    margin: 0;
                    font-size: 1.2rem;
                    color: var(--text-primary, #1e293b);
                }
                
                .count-badge {
                    padding: 0.375rem 0.75rem;
                    background: #f1f5f9;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    color: var(--text-secondary, #64748b);
                    font-weight: 600;
                }
                
                /* Exam Cards */
                .exams-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .exam-card {
                    background: #f8fafc;
                    border-radius: 16px;
                    border: 2px solid transparent;
                    overflow: hidden;
                    transition: all 0.2s;
                }
                
                .exam-card.upcoming {
                    border-color: #fbbf24;
                    background: linear-gradient(135deg, #fffbeb, #fef3c7);
                }
                
                .exam-card.completed {
                    border-color: #22c55e;
                    background: linear-gradient(135deg, #f0fdf4, #dcfce7);
                }
                
                .exam-main {
                    padding: 1.5rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 1rem;
                }
                
                .exam-main.clickable {
                    cursor: pointer;
                }
                
                .exam-main.clickable:hover {
                    background: rgba(0,0,0,0.02);
                }
                
                .exam-info {
                    flex: 1;
                }
                
                .exam-header-row {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 0.75rem;
                    flex-wrap: wrap;
                }
                
                .exam-header-row h3 {
                    margin: 0;
                    font-size: 1.1rem;
                    color: var(--text-primary, #1e293b);
                }
                
                .status-badge {
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                }
                
                .status-badge.upcoming {
                    background: #fbbf24;
                    color: #78350f;
                }
                
                .status-badge.completed {
                    background: #22c55e;
                    color: white;
                }
                
                .exam-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1rem;
                    margin-bottom: 0.75rem;
                }
                
                .exam-meta span {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    font-size: 0.9rem;
                    color: var(--text-secondary, #64748b);
                }
                
                .exam-details {
                    display: flex;
                    gap: 0.75rem;
                    flex-wrap: wrap;
                }
                
                .detail-chip {
                    padding: 0.375rem 0.75rem;
                    background: rgba(0,0,0,0.05);
                    border-radius: 6px;
                    font-size: 0.8rem;
                    color: var(--text-primary, #1e293b);
                    font-weight: 500;
                }
                
                .exam-summary {
                    display: flex;
                    gap: 1rem;
                }
                
                .summary-item {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    font-size: 0.9rem;
                    color: var(--text-secondary, #64748b);
                }
                
                /* Upload Button */
                .exam-actions {
                    display: flex;
                    align-items: center;
                }
                
                .upload-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.25rem;
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    border: none;
                    border-radius: 10px;
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    white-space: nowrap;
                }
                
                .upload-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(254, 163, 190, 0.4);
                }
                
                .paper-uploaded {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    background: #dcfce7;
                    border-radius: 8px;
                    color: #166534;
                    font-size: 0.9rem;
                }
                
                .change-btn {
                    padding: 0.25rem 0.5rem;
                    background: #16a34a;
                    border: none;
                    border-radius: 4px;
                    color: white;
                    font-size: 0.75rem;
                    cursor: pointer;
                    margin-left: 0.5rem;
                }
                
                .expand-btn {
                    color: var(--text-secondary, #64748b);
                    padding: 0.5rem;
                }
                
                /* Marks Section */
                .marks-section {
                    border-top: 2px solid #22c55e;
                    padding: 1.5rem;
                    background: white;
                }
                
                .marks-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }
                
                .marks-header h4 {
                    margin: 0;
                    color: var(--text-primary, #1e293b);
                }
                
                .marks-note {
                    font-size: 0.85rem;
                    color: var(--text-secondary, #64748b);
                }
                
                .marks-table {
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    overflow: hidden;
                }
                
                .table-header {
                    display: grid;
                    grid-template-columns: 60px 1fr 100px 100px 80px;
                    padding: 1rem;
                    background: #f1f5f9;
                    font-weight: 600;
                    font-size: 0.85rem;
                    color: var(--text-secondary, #64748b);
                }
                
                .table-row {
                    display: grid;
                    grid-template-columns: 60px 1fr 100px 100px 80px;
                    padding: 1rem;
                    border-bottom: 1px solid #f1f5f9;
                    transition: background 0.2s;
                }
                
                .table-row:last-child {
                    border-bottom: none;
                }
                
                .table-row:hover {
                    background: #f8fafc;
                }
                
                .table-row.top-rank {
                    background: #fef3c7;
                }
                
                .col-rank {
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                }
                
                .col-name {
                    color: var(--text-primary, #1e293b);
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                }
                
                .col-id {
                    color: var(--text-secondary, #64748b);
                    font-size: 0.85rem;
                    display: flex;
                    align-items: center;
                }
                
                .col-marks {
                    display: flex;
                    align-items: center;
                }
                
                .marks-value {
                    font-weight: 700;
                    font-size: 1.1rem;
                    color: var(--text-primary, #1e293b);
                }
                
                .marks-total {
                    color: var(--text-secondary, #64748b);
                    font-size: 0.85rem;
                }
                
                .col-grade {
                    font-weight: 700;
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                }
                
                .empty-state {
                    text-align: center;
                    padding: 3rem;
                    color: var(--text-secondary, #64748b);
                }
                
                .empty-state svg {
                    margin-bottom: 1rem;
                    opacity: 0.5;
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    .exam-management-page {
                        padding: 1rem;
                    }
                    
                    .exam-main {
                        flex-direction: column;
                    }
                    
                    .exam-actions {
                        width: 100%;
                    }
                    
                    .upload-btn {
                        width: 100%;
                        justify-content: center;
                    }
                    
                    .table-header,
                    .table-row {
                        grid-template-columns: 40px 1fr 80px 80px 60px;
                        font-size: 0.8rem;
                        padding: 0.75rem;
                    }
                    
                    .marks-value {
                        font-size: 1rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default FacultyExams;

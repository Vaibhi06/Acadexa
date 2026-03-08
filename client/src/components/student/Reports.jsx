import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import {
    TrendingUp,
    Users,
    BookOpen,
    Calendar,
    Award,
    ArrowUp,
    ArrowDown,
    Minus,
    UserCheck,
    BarChart3,
    Download
} from 'lucide-react';

const Reports = () => {
    const navigate = useNavigate();
    const [selectedExam, setSelectedExam] = useState('all');

    // Class-wise performance data
    const classPerformance = {
        className: '10th Grade A',
        totalStudents: 45,
        classAverage: 78.5,
        yourRank: 5,
        yourPercentage: 85.0,
        topperPercentage: 96.2
    };

    // Exam-wise progress
    const examResults = [
        { exam: 'Unit Test 1', date: 'Aug 2025', percentage: 82, rank: 8 },
        { exam: 'Mid Term', date: 'Oct 2025', percentage: 78, rank: 12 },
        { exam: 'Unit Test 2', date: 'Nov 2025', percentage: 85, rank: 6 },
        { exam: 'Pre-Final', date: 'Dec 2025', percentage: 88, rank: 5 },
    ];

    // Subject-wise performance for trend
    const subjectTrends = [
        { subject: 'Mathematics', scores: [75, 80, 85, 92], trend: 'up', color: '#FF6B6B' },
        { subject: 'Physics', scores: [70, 75, 78, 85], trend: 'up', color: '#4ECDC4' },
        { subject: 'Chemistry', scores: [82, 78, 75, 78], trend: 'down', color: '#45B7D1' },
        { subject: 'English', scores: [85, 88, 86, 88], trend: 'stable', color: '#96CEB4' },
        { subject: 'Biology', scores: [68, 72, 70, 72], trend: 'stable', color: '#FFEAA7' },
        { subject: 'Computer Science', scores: [90, 92, 94, 95], trend: 'up', color: '#DDA0DD' },
    ];

    // Attendance report
    const attendanceReport = {
        overall: 94.5,
        monthly: [
            { month: 'Jul', percentage: 92 },
            { month: 'Aug', percentage: 96 },
            { month: 'Sep', percentage: 88 },
            { month: 'Oct', percentage: 100 },
            { month: 'Nov', percentage: 92 },
            { month: 'Dec', percentage: 95 },
        ]
    };

    const getTrendIcon = (trend) => {
        if (trend === 'up') return <ArrowUp size={16} className="trend-up" />;
        if (trend === 'down') return <ArrowDown size={16} className="trend-down" />;
        return <Minus size={16} className="trend-stable" />;
    };

    const getPerformanceLevel = (percentage) => {
        if (percentage >= 90) return { label: 'Excellent', color: '#22c55e' };
        if (percentage >= 75) return { label: 'Good', color: '#84cc16' };
        if (percentage >= 60) return { label: 'Average', color: '#f59e0b' };
        return { label: 'Needs Improvement', color: '#ef4444' };
    };

    return (
        <div className="admin-layout">
            <Sidebar role="student" />
            <div className="admin-main">
                <Navbar />
                <div className="reports-page">
                    {/* Page Header */}
                    <div className="page-header">
                        <div className="header-info">
                            <h1>📈 Academic Reports</h1>
                            <p>Track your performance over time</p>
                        </div>
                        <button className="download-btn">
                            <Download size={18} />
                            Download Report
                        </button>
                    </div>

                    {/* Class-wise Performance */}
                    <div className="performance-overview">
                        <h2><Users size={20} /> Overall Class Performance</h2>
                        <div className="overview-grid">
                            <div className="overview-card highlight">
                                <span className="card-label">Your Percentage</span>
                                <span className="card-value">{classPerformance.yourPercentage}%</span>
                                <span className="card-badge" style={{ background: getPerformanceLevel(classPerformance.yourPercentage).color }}>
                                    {getPerformanceLevel(classPerformance.yourPercentage).label}
                                </span>
                            </div>
                            <div className="overview-card">
                                <span className="card-label">Class Rank</span>
                                <span className="card-value">#{classPerformance.yourRank}</span>
                                <span className="card-sub">out of {classPerformance.totalStudents} students</span>
                            </div>
                            <div className="overview-card">
                                <span className="card-label">Class Average</span>
                                <span className="card-value">{classPerformance.classAverage}%</span>
                                <span className="card-sub above">+{(classPerformance.yourPercentage - classPerformance.classAverage).toFixed(1)}% above avg</span>
                            </div>
                            <div className="overview-card">
                                <span className="card-label">Topper Score</span>
                                <span className="card-value">{classPerformance.topperPercentage}%</span>
                                <span className="card-sub">{classPerformance.className}</span>
                            </div>
                        </div>
                    </div>

                    {/* Exam-wise Progress */}
                    <div className="exam-progress">
                        <h2><BookOpen size={20} /> Exam-wise Progress</h2>
                        <div className="exam-timeline">
                            {examResults.map((exam, idx) => (
                                <div key={idx} className="timeline-item">
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-card">
                                        <div className="timeline-header">
                                            <span className="exam-name">{exam.exam}</span>
                                            <span className="exam-date">{exam.date}</span>
                                        </div>
                                        <div className="timeline-body">
                                            <div className="score-display">
                                                <span className="score">{exam.percentage}%</span>
                                                <span className="rank">Rank #{exam.rank}</span>
                                            </div>
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-fill"
                                                    style={{
                                                        width: `${exam.percentage}%`,
                                                        background: getPerformanceLevel(exam.percentage).color
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Performance Trend Visualization */}
                    <div className="trend-section">
                        <h2><TrendingUp size={20} /> Performance Trend</h2>
                        <div className="trend-grid">
                            {subjectTrends.map((subject, idx) => (
                                <div key={idx} className="trend-card">
                                    <div className="trend-header">
                                        <div className="subject-dot" style={{ background: subject.color }}></div>
                                        <span className="subject-name">{subject.subject}</span>
                                        <div className={`trend-indicator ${subject.trend}`}>
                                            {getTrendIcon(subject.trend)}
                                        </div>
                                    </div>
                                    <div className="trend-body">
                                        <div className="mini-chart">
                                            {subject.scores.map((score, i) => (
                                                <div
                                                    key={i}
                                                    className="chart-bar"
                                                    style={{
                                                        height: `${score}%`,
                                                        background: subject.color,
                                                        opacity: 0.3 + (i * 0.2)
                                                    }}
                                                ></div>
                                            ))}
                                        </div>
                                        <div className="trend-stats">
                                            <span className="current-score">{subject.scores[subject.scores.length - 1]}%</span>
                                            <span className="score-change">
                                                {subject.scores[subject.scores.length - 1] - subject.scores[0] >= 0 ? '+' : ''}
                                                {subject.scores[subject.scores.length - 1] - subject.scores[0]}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Attendance Report Integration */}
                    <div className="attendance-section">
                        <div className="attendance-header">
                            <h2><UserCheck size={20} /> Attendance Report</h2>
                            <button className="view-more-btn" onClick={() => navigate('/student/attendance')}>
                                View Full Report
                            </button>
                        </div>
                        <div className="attendance-content">
                            <div className="attendance-summary">
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
                                            strokeDasharray={`${attendanceReport.overall * 2.64} ${264 - attendanceReport.overall * 2.64}`}
                                            strokeDashoffset="66"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="circle-text">
                                        <span className="value">{attendanceReport.overall}%</span>
                                        <span className="label">Overall</span>
                                    </div>
                                </div>
                            </div>
                            <div className="monthly-chart">
                                {attendanceReport.monthly.map((month, idx) => (
                                    <div key={idx} className="month-bar">
                                        <div
                                            className="bar-fill"
                                            style={{
                                                height: `${month.percentage}%`,
                                                background: month.percentage >= 90 ? '#22c55e' : month.percentage >= 75 ? '#f59e0b' : '#ef4444'
                                            }}
                                        >
                                            <span className="bar-value">{month.percentage}%</span>
                                        </div>
                                        <span className="month-label">{month.month}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .reports-page {
                    padding: 2rem;
                    background: #f8fafc;
                    min-height: 100vh;
                }

                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .header-info h1 {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0 0 0.25rem 0;
                }

                .header-info p {
                    color: #64748b;
                    margin: 0;
                }

                .download-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.5rem;
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .download-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(254, 163, 190, 0.4);
                }

                /* Section Titles */
                h2 {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0 0 1.25rem 0;
                }

                /* Performance Overview */
                .performance-overview {
                    background: white;
                    border-radius: 20px;
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                .overview-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                }

                .overview-card {
                    background: #f8fafc;
                    border-radius: 16px;
                    padding: 1.25rem;
                    text-align: center;
                }

                .overview-card.highlight {
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    color: white;
                }

                .card-label {
                    font-size: 0.875rem;
                    opacity: 0.8;
                    display: block;
                    margin-bottom: 0.5rem;
                }

                .card-value {
                    font-size: 2rem;
                    font-weight: 800;
                    display: block;
                }

                .overview-card:not(.highlight) .card-value {
                    color: #1e293b;
                }

                .card-badge {
                    display: inline-block;
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    margin-top: 0.5rem;
                }

                .card-sub {
                    font-size: 0.8rem;
                    color: #64748b;
                    display: block;
                    margin-top: 0.25rem;
                }

                .card-sub.above {
                    color: #22c55e;
                    font-weight: 600;
                }

                /* Exam Progress */
                .exam-progress {
                    background: white;
                    border-radius: 20px;
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                .exam-timeline {
                    position: relative;
                    padding-left: 2rem;
                }

                .exam-timeline::before {
                    content: '';
                    position: absolute;
                    left: 6px;
                    top: 0;
                    bottom: 0;
                    width: 2px;
                    background: linear-gradient(to bottom, #FEA3BE, #FBA2AB);
                }

                .timeline-item {
                    position: relative;
                    margin-bottom: 1rem;
                }

                .timeline-item:last-child {
                    margin-bottom: 0;
                }

                .timeline-dot {
                    position: absolute;
                    left: -2rem;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 14px;
                    height: 14px;
                    background: white;
                    border: 3px solid #FEA3BE;
                    border-radius: 50%;
                }

                .timeline-card {
                    background: #f8fafc;
                    border-radius: 12px;
                    padding: 1rem 1.25rem;
                }

                .timeline-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.75rem;
                }

                .exam-name {
                    font-weight: 600;
                    color: #1e293b;
                }

                .exam-date {
                    font-size: 0.875rem;
                    color: #64748b;
                }

                .timeline-body {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .score-display {
                    display: flex;
                    justify-content: space-between;
                }

                .score {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #1e293b;
                }

                .rank {
                    font-size: 0.875rem;
                    color: #64748b;
                    font-weight: 600;
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

                /* Trend Section */
                .trend-section {
                    background: white;
                    border-radius: 20px;
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                .trend-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 1rem;
                }

                .trend-card {
                    background: #f8fafc;
                    border-radius: 14px;
                    padding: 1.25rem;
                }

                .trend-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1rem;
                }

                .subject-dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                }

                .subject-name {
                    flex: 1;
                    font-weight: 600;
                    color: #1e293b;
                }

                .trend-indicator {
                    width: 28px;
                    height: 28px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .trend-indicator.up {
                    background: #dcfce7;
                    color: #22c55e;
                }

                .trend-indicator.down {
                    background: #fef2f2;
                    color: #ef4444;
                }

                .trend-indicator.stable {
                    background: #fef3c7;
                    color: #f59e0b;
                }

                .trend-body {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 1rem;
                }

                .mini-chart {
                    display: flex;
                    align-items: flex-end;
                    gap: 4px;
                    height: 50px;
                    flex: 1;
                }

                .chart-bar {
                    flex: 1;
                    border-radius: 4px 4px 0 0;
                    min-width: 20px;
                }

                .trend-stats {
                    text-align: right;
                }

                .current-score {
                    display: block;
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #1e293b;
                }

                .score-change {
                    font-size: 0.8rem;
                    color: #22c55e;
                    font-weight: 600;
                }

                /* Attendance Section */
                .attendance-section {
                    background: white;
                    border-radius: 20px;
                    padding: 1.5rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                .attendance-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }

                .attendance-header h2 {
                    margin: 0;
                }

                .view-more-btn {
                    background: #f8fafc;
                    border: 2px solid #FEA3BE;
                    padding: 0.5rem 1rem;
                    border-radius: 10px;
                    font-weight: 600;
                    color: #FEA3BE;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .view-more-btn:hover {
                    background: #fef7f9;
                }

                .attendance-content {
                    display: flex;
                    align-items: center;
                    gap: 3rem;
                    flex-wrap: wrap;
                }

                .attendance-summary {
                    flex-shrink: 0;
                }

                .summary-circle {
                    position: relative;
                    width: 120px;
                    height: 120px;
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

                .circle-text .value {
                    display: block;
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #1e293b;
                }

                .circle-text .label {
                    font-size: 0.75rem;
                    color: #64748b;
                }

                .monthly-chart {
                    display: flex;
                    align-items: flex-end;
                    gap: 1rem;
                    height: 120px;
                    flex: 1;
                }

                .month-bar {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    height: 100%;
                }

                .month-bar .bar-fill {
                    width: 100%;
                    border-radius: 6px 6px 0 0;
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    padding-top: 0.25rem;
                    min-height: 30px;
                }

                .bar-value {
                    font-size: 0.7rem;
                    font-weight: 700;
                    color: white;
                }

                .month-label {
                    font-size: 0.8rem;
                    color: #64748b;
                    font-weight: 600;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .reports-page {
                        padding: 1rem;
                    }

                    .overview-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .attendance-content {
                        flex-direction: column;
                        gap: 1.5rem;
                    }

                    .monthly-chart {
                        width: 100%;
                        height: 100px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Reports;

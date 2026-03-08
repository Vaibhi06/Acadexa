import React, { useState, useMemo } from 'react';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import { useAttendance } from '../../contexts/AttendanceContext';
import { useAuth } from '../../contexts/AuthContext';
import {
    UserCheck,
    Calendar,
    TrendingUp,
    CheckCircle,
    XCircle,
    Clock,
    BookOpen
} from 'lucide-react';

const MyAttendance = () => {
    const [selectedMonth, setSelectedMonth] = useState('January');
    const { user } = useAuth();
    const { getStudentAttendance, calculateStudentPercentage } = useAttendance();

    // Get student's attendance records from context
    const studentRecords = useMemo(() => {
        if (user?.id) {
            return getStudentAttendance(user.id);
        }
        return [];
    }, [user?.id, getStudentAttendance]);

    // Calculate attendance statistics
    const attendanceStats = useMemo(() => {
        const totalDays = studentRecords.length;
        const present = studentRecords.filter(r => r.status === 'present').length;
        const absent = studentRecords.filter(r => r.status === 'absent').length;
        const leave = studentRecords.filter(r => r.status === 'late' || r.status === 'leave').length;
        const percentage = totalDays > 0 ? ((present / totalDays) * 100).toFixed(1) : 0;

        return {
            percentage: parseFloat(percentage),
            totalDays,
            present,
            absent,
            leave
        };
    }, [studentRecords]);

    // Get today's and yesterday's attendance
    const recentAttendance = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        const todayRecord = studentRecords.find(r => r.date === today);
        const yesterdayRecord = studentRecords.find(r => r.date === yesterday);

        return {
            today: {
                status: todayRecord ? (todayRecord.status === 'present' ? 'Present' : todayRecord.status === 'absent' ? 'Absent' : 'Late') : 'No Record',
                time: todayRecord ? '08:45 AM' : '-',
                date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
            },
            yesterday: {
                status: yesterdayRecord ? (yesterdayRecord.status === 'present' ? 'Present' : yesterdayRecord.status === 'absent' ? 'Absent' : 'Late') : 'No Record',
                time: yesterdayRecord ? '08:30 AM' : '-',
                date: new Date(Date.now() - 86400000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
            }
        };
    }, [studentRecords]);

    // Calculate month-wise attendance
    const monthlyData = useMemo(() => {
        const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const monthlyStats = {};

        studentRecords.forEach(record => {
            const date = new Date(record.date);
            const monthKey = months[date.getMonth()];
            if (!monthlyStats[monthKey]) {
                monthlyStats[monthKey] = { total: 0, present: 0 };
            }
            monthlyStats[monthKey].total++;
            if (record.status === 'present') {
                monthlyStats[monthKey].present++;
            }
        });

        return months
            .filter(month => monthlyStats[month])
            .map(month => ({
                month,
                total: monthlyStats[month].total,
                present: monthlyStats[month].present,
                percentage: Math.round((monthlyStats[month].present / monthlyStats[month].total) * 100)
            }));
    }, [studentRecords]);

    // Subject-wise attendance (fallback to static for now since subjects aren't tracked)
    const subjectAttendance = [
        { subject: 'Mathematics', attended: 45, total: 48, percentage: 93.8, color: '#FF6B6B' },
        { subject: 'Physics', attended: 42, total: 44, percentage: 95.5, color: '#4ECDC4' },
        { subject: 'Chemistry', attended: 38, total: 42, percentage: 90.5, color: '#45B7D1' },
        { subject: 'English', attended: 40, total: 40, percentage: 100, color: '#96CEB4' },
        { subject: 'Biology', attended: 35, total: 38, percentage: 92.1, color: '#FFEAA7' },
        { subject: 'Computer Science', attended: 20, total: 22, percentage: 90.9, color: '#DDA0DD' },
    ];

    const getStatusColor = (status) => {
        return status === 'Present' ? '#22c55e' : status === 'Absent' ? '#ef4444' : status === 'No Record' ? '#94a3b8' : '#f59e0b';
    };

    const getPercentageColor = (percentage) => {
        if (percentage >= 90) return '#22c55e';
        if (percentage >= 75) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className="admin-layout">
            <Sidebar role="student" />
            <div className="admin-main">
                <Navbar />
                <div className="attendance-page">
                    {/* Page Header */}
                    <div className="page-header">
                        <div className="header-info">
                            <h1>📊 My Attendance</h1>
                            <p>10th Grade A - Academic Year 2025-26</p>
                        </div>
                    </div>

                    {/* Overall Attendance Card */}
                    <div className="overall-card">
                        <div className="attendance-circle">
                            <svg viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="42"
                                    fill="none"
                                    stroke={getPercentageColor(attendanceStats.percentage)}
                                    strokeWidth="12"
                                    strokeDasharray={`${attendanceStats.percentage * 2.64} ${264 - attendanceStats.percentage * 2.64}`}
                                    strokeDashoffset="66"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="circle-content">
                                <span className="percentage">{attendanceStats.percentage}%</span>
                                <span className="label">Overall</span>
                            </div>
                        </div>
                        <div className="stats-grid">
                            <div className="stat-item">
                                <div className="stat-icon total">
                                    <Calendar size={20} />
                                </div>
                                <div className="stat-info">
                                    <span className="stat-value">{attendanceStats.totalDays}</span>
                                    <span className="stat-label">Total Days</span>
                                </div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-icon present">
                                    <CheckCircle size={20} />
                                </div>
                                <div className="stat-info">
                                    <span className="stat-value">{attendanceStats.present}</span>
                                    <span className="stat-label">Present</span>
                                </div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-icon absent">
                                    <XCircle size={20} />
                                </div>
                                <div className="stat-info">
                                    <span className="stat-value">{attendanceStats.absent}</span>
                                    <span className="stat-label">Absent</span>
                                </div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-icon leave">
                                    <Clock size={20} />
                                </div>
                                <div className="stat-info">
                                    <span className="stat-value">{attendanceStats.leave}</span>
                                    <span className="stat-label">Leave</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Today & Yesterday Status */}
                    <div className="recent-section">
                        <h2>Recent Attendance</h2>
                        <div className="recent-cards">
                            <div className="recent-card today">
                                <div className="recent-header">
                                    <span className="day-label">Today</span>
                                    <span className="date">{recentAttendance.today.date}</span>
                                </div>
                                <div className="recent-body">
                                    <div
                                        className="status-badge"
                                        style={{ background: getStatusColor(recentAttendance.today.status) }}
                                    >
                                        {recentAttendance.today.status === 'Present' ?
                                            <CheckCircle size={20} /> : <XCircle size={20} />}
                                        {recentAttendance.today.status}
                                    </div>
                                    <span className="check-time">Check-in: {recentAttendance.today.time}</span>
                                </div>
                            </div>

                            <div className="recent-card yesterday">
                                <div className="recent-header">
                                    <span className="day-label">Yesterday</span>
                                    <span className="date">{recentAttendance.yesterday.date}</span>
                                </div>
                                <div className="recent-body">
                                    <div
                                        className="status-badge"
                                        style={{ background: getStatusColor(recentAttendance.yesterday.status) }}
                                    >
                                        {recentAttendance.yesterday.status === 'Present' ?
                                            <CheckCircle size={20} /> : <XCircle size={20} />}
                                        {recentAttendance.yesterday.status}
                                    </div>
                                    <span className="check-time">Check-in: {recentAttendance.yesterday.time}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Month-wise Bar Graph */}
                    <div className="monthly-section">
                        <h2>📈 Month-wise Attendance</h2>
                        <div className="bar-chart">
                            {monthlyData.map((month, idx) => (
                                <div key={idx} className="bar-item">
                                    <div className="bar-container">
                                        <div
                                            className="bar-fill"
                                            style={{
                                                height: `${month.percentage}%`,
                                                background: getPercentageColor(month.percentage)
                                            }}
                                        >
                                            <span className="bar-value">{month.percentage}%</span>
                                        </div>
                                    </div>
                                    <span className="bar-label">{month.month}</span>
                                    <span className="bar-details">{month.present}/{month.total}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Subject-wise Breakdown */}
                    <div className="subject-section">
                        <h2>📚 Subject-wise Attendance</h2>
                        <div className="subject-grid">
                            {subjectAttendance.map((subject, idx) => (
                                <div key={idx} className="subject-card">
                                    <div className="subject-header">
                                        <div
                                            className="subject-icon"
                                            style={{ background: subject.color }}
                                        >
                                            <BookOpen size={18} />
                                        </div>
                                        <span className="subject-name">{subject.subject}</span>
                                    </div>
                                    <div className="subject-body">
                                        <div className="subject-percentage">
                                            <span
                                                className="percentage-value"
                                                style={{ color: getPercentageColor(subject.percentage) }}
                                            >
                                                {subject.percentage}%
                                            </span>
                                            <span className="classes-info">
                                                {subject.attended}/{subject.total} classes
                                            </span>
                                        </div>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{
                                                    width: `${subject.percentage}%`,
                                                    background: subject.color
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .attendance-page {
                    padding: 2rem;
                    background: #f8fafc;
                    min-height: 100vh;
                }

                .page-header {
                    margin-bottom: 2rem;
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

                /* Overall Card */
                .overall-card {
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

                .attendance-circle {
                    position: relative;
                    width: 160px;
                    height: 160px;
                    flex-shrink: 0;
                }

                .attendance-circle svg {
                    width: 100%;
                    height: 100%;
                    transform: rotate(-90deg);
                }

                .circle-content {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                }

                .circle-content .percentage {
                    display: block;
                    font-size: 2rem;
                    font-weight: 800;
                    color: #1e293b;
                }

                .circle-content .label {
                    font-size: 0.875rem;
                    color: #64748b;
                }

                .stats-grid {
                    display: flex;
                    gap: 2rem;
                    flex-wrap: wrap;
                    flex: 1;
                }

                .stat-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem 1.5rem;
                    background: #f8fafc;
                    border-radius: 12px;
                    min-width: 140px;
                }

                .stat-icon {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }

                .stat-icon.total { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
                .stat-icon.present { background: linear-gradient(135deg, #22c55e, #16a34a); }
                .stat-icon.absent { background: linear-gradient(135deg, #ef4444, #dc2626); }
                .stat-icon.leave { background: linear-gradient(135deg, #f59e0b, #d97706); }

                .stat-info {
                    display: flex;
                    flex-direction: column;
                }

                .stat-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #1e293b;
                }

                .stat-label {
                    font-size: 0.875rem;
                    color: #64748b;
                }

                /* Recent Section */
                .recent-section {
                    margin-bottom: 2rem;
                }

                .recent-section h2,
                .monthly-section h2,
                .subject-section h2 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0 0 1.25rem 0;
                }

                .recent-cards {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 1.5rem;
                }

                .recent-card {
                    background: white;
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                .recent-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .day-label {
                    font-weight: 700;
                    color: #1e293b;
                    font-size: 1.1rem;
                }

                .date {
                    font-size: 0.875rem;
                    color: #64748b;
                }

                .recent-body {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.25rem;
                    border-radius: 10px;
                    color: white;
                    font-weight: 600;
                    width: fit-content;
                }

                .check-time {
                    font-size: 0.875rem;
                    color: #64748b;
                }

                /* Monthly Section */
                .monthly-section {
                    background: white;
                    border-radius: 20px;
                    padding: 2rem;
                    margin-bottom: 2rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                .bar-chart {
                    display: flex;
                    align-items: flex-end;
                    gap: 1rem;
                    height: 250px;
                    padding: 1rem 0;
                }

                .bar-item {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                }

                .bar-container {
                    width: 100%;
                    height: 180px;
                    background: #f1f5f9;
                    border-radius: 8px 8px 0 0;
                    display: flex;
                    align-items: flex-end;
                    overflow: hidden;
                }

                .bar-fill {
                    width: 100%;
                    border-radius: 8px 8px 0 0;
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    padding-top: 0.5rem;
                    transition: height 0.5s ease;
                    min-height: 30px;
                }

                .bar-value {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: white;
                }

                .bar-label {
                    font-weight: 600;
                    color: #1e293b;
                    font-size: 0.9rem;
                }

                .bar-details {
                    font-size: 0.75rem;
                    color: #64748b;
                }

                /* Subject Section */
                .subject-section {
                    margin-bottom: 2rem;
                }

                .subject-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1rem;
                }

                .subject-card {
                    background: white;
                    border-radius: 16px;
                    padding: 1.25rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                .subject-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1rem;
                }

                .subject-icon {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }

                .subject-name {
                    font-weight: 600;
                    color: #1e293b;
                }

                .subject-body {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .subject-percentage {
                    display: flex;
                    justify-content: space-between;
                    align-items: baseline;
                }

                .percentage-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                }

                .classes-info {
                    font-size: 0.875rem;
                    color: #64748b;
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

                /* Responsive */
                @media (max-width: 768px) {
                    .attendance-page {
                        padding: 1rem;
                    }

                    .overall-card {
                        flex-direction: column;
                        gap: 1.5rem;
                    }

                    .stats-grid {
                        width: 100%;
                        justify-content: center;
                    }

                    .stat-item {
                        flex: 1;
                        min-width: 120px;
                    }

                    .bar-chart {
                        height: 200px;
                        gap: 0.5rem;
                    }

                    .bar-container {
                        height: 140px;
                    }
                }
            `}</style>
        </div>
    );
};

export default MyAttendance;

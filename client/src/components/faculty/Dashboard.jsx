import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import {
    Calendar,
    UserCheck,
    BookOpen,
    Bell,
    Clock,
    Users,
    CheckCircle,
    XCircle,
    TrendingUp,
    FileText,
    ChevronRight,
    Sparkles,
    User,
    AlertCircle
} from 'lucide-react';

const FacultyDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Get greeting based on time
    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    // Faculty data (would come from context/API in real app)
    const facultyData = {
        name: user?.name || 'Faculty Member',
        id: 'FAC001',
        department: 'Mathematics',
        designation: 'Senior Teacher',
        subjects: ['Mathematics', 'Physics'],
        assignedClasses: ['10th Grade A', '10th Grade B', '11th Grade A']
    };

    // Today's attendance status
    const [attendanceStatus, setAttendanceStatus] = useState(() => {
        const stored = localStorage.getItem('facultyTodayAttendance');
        return stored ? JSON.parse(stored) : null;
    });

    const markAttendance = (status) => {
        const record = {
            status,
            time: new Date().toLocaleTimeString(),
            date: new Date().toLocaleDateString()
        };
        setAttendanceStatus(record);
        localStorage.setItem('facultyTodayAttendance', JSON.stringify(record));
    };

    // Today's classes (timetable)
    const todayClasses = [
        { time: '09:00 AM', subject: 'Mathematics', class: '10th Grade A', room: 'Room 101', status: 'completed' },
        { time: '10:30 AM', subject: 'Mathematics', class: '10th Grade B', room: 'Room 102', status: 'completed' },
        { time: '12:00 PM', subject: 'Physics', class: '11th Grade A', room: 'Lab 1', status: 'ongoing' },
        { time: '02:00 PM', subject: 'Mathematics', class: '11th Grade A', room: 'Room 103', status: 'upcoming' },
        { time: '03:30 PM', subject: 'Physics', class: '10th Grade A', room: 'Lab 2', status: 'upcoming' },
    ];

    // Upcoming exams for assigned subjects
    const upcomingExams = [
        { subject: 'Mathematics', class: '10th Grade A', date: '2026-01-15', type: 'Unit Test', totalMarks: 50 },
        { subject: 'Physics', class: '11th Grade A', date: '2026-01-18', type: 'Practical', totalMarks: 30 },
        { subject: 'Mathematics', class: '11th Grade A', date: '2026-01-20', type: 'Mid Term', totalMarks: 100 },
    ];

    // Sample notifications
    const sampleNotifications = [
        { id: 1, message: 'Staff meeting tomorrow at 10 AM', type: 'info', time: '2 hours ago' },
        { id: 2, message: 'Submit progress reports by Friday', type: 'warning', time: '5 hours ago' },
        { id: 3, message: 'New curriculum updates available', type: 'info', time: '1 day ago' },
    ];

    // Quick stats
    const stats = {
        totalClasses: todayClasses.length,
        completedClasses: todayClasses.filter(c => c.status === 'completed').length,
        totalStudents: 156,
        attendancePercentage: 94.5
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return '#22c55e';
            case 'ongoing': return '#FEA3BE';
            case 'upcoming': return '#64748b';
            default: return '#64748b';
        }
    };

    const getDaysUntil = (dateStr) => {
        const examDate = new Date(dateStr);
        const today = new Date();
        const diffTime = examDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <div className="admin-layout">
            <Sidebar role="faculty" />

            <div className="admin-main">
                <Navbar />

                <div className="faculty-dashboard">
                    {/* Header Section with Greeting */}
                    <div className="dashboard-header-section">
                        <div className="greeting-section">
                            <div className="greeting-content">
                                <div className="greeting-icon">
                                    <Sparkles size={32} />
                                </div>
                                <div className="greeting-text">
                                    <h1>{getGreeting()}, {facultyData.name.split(' ')[0]}! 👋</h1>
                                    <p className="date-text">{formatDate(currentTime)}</p>
                                </div>
                            </div>

                            {/* Profile & Notification Icons */}
                            <div className="header-actions">
                                <div className="notification-wrapper">
                                    <button
                                        className="action-icon-btn"
                                        onClick={() => setShowNotifications(!showNotifications)}
                                    >
                                        <Bell size={22} />
                                        <span className="notification-badge">{sampleNotifications.length}</span>
                                    </button>

                                    {showNotifications && (
                                        <div className="notification-dropdown">
                                            <div className="dropdown-header">
                                                <h4>Notifications</h4>
                                            </div>
                                            {sampleNotifications.map(notif => (
                                                <div key={notif.id} className="notif-item">
                                                    <AlertCircle size={16} className={`notif-icon ${notif.type}`} />
                                                    <div className="notif-content">
                                                        <p>{notif.message}</p>
                                                        <span className="notif-time">{notif.time}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button
                                    className="profile-icon-btn"
                                    onClick={() => navigate('/faculty/profile')}
                                >
                                    <div className="profile-avatar-small">
                                        {facultyData.name[0]}
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Faculty Info Badge */}
                        <div className="faculty-badge">
                            <div className="badge-icon">
                                <User size={20} />
                            </div>
                            <div className="badge-info">
                                <span className="badge-id">{facultyData.id}</span>
                                <span className="badge-dept">{facultyData.department} Dept.</span>
                            </div>
                        </div>
                    </div>

                    {/* Daily Attendance Status */}
                    <div className="attendance-status-card">
                        <div className="attendance-header">
                            <UserCheck size={24} />
                            <h3>Today's Attendance</h3>
                        </div>

                        {attendanceStatus ? (
                            <div className="attendance-marked">
                                <div className={`status-indicator ${attendanceStatus.status}`}>
                                    {attendanceStatus.status === 'present' ? (
                                        <CheckCircle size={32} />
                                    ) : (
                                        <XCircle size={32} />
                                    )}
                                </div>
                                <div className="status-details">
                                    <h4>Marked {attendanceStatus.status === 'present' ? 'Present' : 'Absent'}</h4>
                                    <p>at {attendanceStatus.time}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="attendance-buttons">
                                <button
                                    className="attendance-btn present"
                                    onClick={() => markAttendance('present')}
                                >
                                    <CheckCircle size={20} />
                                    Mark Present
                                </button>
                                <button
                                    className="attendance-btn absent"
                                    onClick={() => markAttendance('absent')}
                                >
                                    <XCircle size={20} />
                                    Mark Absent
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Quick Stats */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon classes">
                                <BookOpen size={24} />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Today's Classes</p>
                                <h3 className="stat-value">{stats.completedClasses}/{stats.totalClasses}</h3>
                                <span className="stat-sub">Completed</span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon students">
                                <Users size={24} />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Total Students</p>
                                <h3 className="stat-value">{stats.totalStudents}</h3>
                                <span className="stat-sub">Across all classes</span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon attendance">
                                <TrendingUp size={24} />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">My Attendance</p>
                                <h3 className="stat-value">{stats.attendancePercentage}%</h3>
                                <span className="stat-sub">This month</span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon exams">
                                <FileText size={24} />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Upcoming Exams</p>
                                <h3 className="stat-value">{upcomingExams.length}</h3>
                                <span className="stat-sub">For your subjects</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="dashboard-content-grid">
                        {/* Today's Timetable */}
                        <div className="content-card timetable-card">
                            <div className="card-header">
                                <div className="header-left">
                                    <Calendar size={22} />
                                    <h3>Today's Timetable</h3>
                                </div>
                                <button className="view-all-btn" onClick={() => navigate('/faculty/timetable')}>
                                    View Full <ChevronRight size={16} />
                                </button>
                            </div>

                            <div className="timetable-list">
                                {todayClasses.map((cls, idx) => (
                                    <div key={idx} className={`timetable-item ${cls.status}`}>
                                        <div className="time-column">
                                            <Clock size={14} />
                                            <span>{cls.time}</span>
                                        </div>
                                        <div className="class-details">
                                            <h4>{cls.subject}</h4>
                                            <p>{cls.class} • {cls.room}</p>
                                        </div>
                                        <div
                                            className="status-badge"
                                            style={{ background: getStatusColor(cls.status) }}
                                        >
                                            {cls.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upcoming Exams */}
                        <div className="content-card exams-card">
                            <div className="card-header">
                                <div className="header-left">
                                    <FileText size={22} />
                                    <h3>Upcoming Exams</h3>
                                </div>
                                <button className="view-all-btn" onClick={() => navigate('/faculty/exams')}>
                                    View All <ChevronRight size={16} />
                                </button>
                            </div>

                            <div className="exams-list">
                                {upcomingExams.map((exam, idx) => {
                                    const daysLeft = getDaysUntil(exam.date);
                                    return (
                                        <div key={idx} className="exam-item">
                                            <div className="exam-icon">
                                                <BookOpen size={20} />
                                            </div>
                                            <div className="exam-details">
                                                <h4>{exam.subject}</h4>
                                                <p>{exam.class} • {exam.type}</p>
                                                <span className="exam-date">
                                                    {new Date(exam.date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <div className={`days-badge ${daysLeft <= 3 ? 'urgent' : ''}`}>
                                                {daysLeft} days
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>



                </div>
            </div>

            <style>{`
                .faculty-dashboard {
                    padding: 2rem;
                    background: #f8fafc;
                    min-height: 100vh;
                }

                /* Header Section */
                .dashboard-header-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                    gap: 1.5rem;
                }

                .greeting-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    flex: 1;
                    min-width: 300px;
                }

                .greeting-content {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                }

                .greeting-icon {
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }

                .greeting-text h1 {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0 0 0.5rem 0;
                }

                .date-text {
                    color: #64748b;
                    font-size: 0.95rem;
                    margin: 0;
                }

                .header-actions {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .action-icon-btn {
                    width: 44px;
                    height: 44px;
                    background: white;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    position: relative;
                    color: #64748b;
                    transition: all 0.2s;
                }

                .action-icon-btn:hover {
                    border-color: #FEA3BE;
                    color: #FEA3BE;
                }

                .notification-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    width: 20px;
                    height: 20px;
                    background: #ef4444;
                    color: white;
                    border-radius: 50%;
                    font-size: 0.7rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .notification-wrapper {
                    position: relative;
                }

                .notification-dropdown {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    width: 320px;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                    margin-top: 0.5rem;
                    z-index: 100;
                    overflow: hidden;
                }

                .dropdown-header {
                    padding: 1rem;
                    border-bottom: 1px solid #f1f5f9;
                }

                .dropdown-header h4 {
                    margin: 0;
                    font-size: 1rem;
                    color: #1e293b;
                }

                .notif-item {
                    display: flex;
                    gap: 0.75rem;
                    padding: 1rem;
                    border-bottom: 1px solid #f1f5f9;
                    transition: background 0.2s;
                }

                .notif-item:hover {
                    background: #f8fafc;
                }

                .notif-icon {
                    flex-shrink: 0;
                    margin-top: 2px;
                }

                .notif-icon.info { color: #0ea5e9; }
                .notif-icon.warning { color: #f59e0b; }

                .notif-content p {
                    margin: 0 0 0.25rem 0;
                    font-size: 0.9rem;
                    color: #1e293b;
                }

                .notif-time {
                    font-size: 0.8rem;
                    color: #94a3b8;
                }

                .profile-icon-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                }

                .profile-avatar-small {
                    width: 44px;
                    height: 44px;
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 700;
                    font-size: 1.1rem;
                }

                .faculty-badge {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem 1.5rem;
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    border-radius: 16px;
                    color: white;
                }

                .badge-icon {
                    width: 40px;
                    height: 40px;
                    background: rgba(255,255,255,0.2);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .badge-info {
                    display: flex;
                    flex-direction: column;
                }

                .badge-id {
                    font-size: 1.1rem;
                    font-weight: 700;
                }

                .badge-dept {
                    font-size: 0.85rem;
                    opacity: 0.9;
                }

                /* Attendance Status Card */
                .attendance-status-card {
                    background: white;
                    border-radius: 20px;
                    padding: 1.5rem;
                    margin-bottom: 1.5rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                .attendance-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1rem;
                    color: #1e293b;
                }

                .attendance-header h3 {
                    margin: 0;
                    font-size: 1.1rem;
                }

                .attendance-marked {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: #f0fdf4;
                    border-radius: 12px;
                }

                .status-indicator {
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .status-indicator.present {
                    background: linear-gradient(135deg, #22c55e, #16a34a);
                    color: white;
                }

                .status-indicator.absent {
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    color: white;
                }

                .status-details h4 {
                    margin: 0 0 0.25rem 0;
                    color: #1e293b;
                }

                .status-details p {
                    margin: 0;
                    color: #64748b;
                    font-size: 0.9rem;
                }

                .attendance-buttons {
                    display: flex;
                    gap: 1rem;
                }

                .attendance-btn {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 1rem;
                    border: none;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .attendance-btn.present {
                    background: linear-gradient(135deg, #22c55e, #16a34a);
                    color: white;
                }

                .attendance-btn.present:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
                }

                .attendance-btn.absent {
                    background: #f1f5f9;
                    color: #64748b;
                    border: 2px solid #e2e8f0;
                }

                .attendance-btn.absent:hover {
                    border-color: #ef4444;
                    color: #ef4444;
                }

                /* Stats Grid */
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .stat-card {
                    background: white;
                    border-radius: 16px;
                    padding: 1.5rem;
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                    transition: all 0.2s;
                }

                .stat-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
                }

                .stat-icon {
                    width: 52px;
                    height: 52px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }

                .stat-icon.classes { background: linear-gradient(135deg, #FEA3BE, #FBA2AB); }
                .stat-icon.students { background: linear-gradient(135deg, #0ea5e9, #0284c7); }
                .stat-icon.attendance { background: linear-gradient(135deg, #22c55e, #16a34a); }
                .stat-icon.exams { background: linear-gradient(135deg, #f59e0b, #d97706); }

                .stat-content {
                    flex: 1;
                }

                .stat-label {
                    margin: 0 0 0.25rem 0;
                    font-size: 0.85rem;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .stat-value {
                    margin: 0 0 0.25rem 0;
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: #1e293b;
                }

                .stat-sub {
                    font-size: 0.8rem;
                    color: #94a3b8;
                }

                /* Content Grid */
                .dashboard-content-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .content-card {
                    background: white;
                    border-radius: 20px;
                    padding: 1.5rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    padding-bottom: 1rem;
                    border-bottom: 2px solid #f1f5f9;
                }

                .header-left {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    color: #FEA3BE;
                }

                .header-left h3 {
                    margin: 0;
                    font-size: 1.1rem;
                    color: #1e293b;
                }

                .view-all-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    background: none;
                    border: none;
                    color: #FEA3BE;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 0.9rem;
                }

                .view-all-btn:hover {
                    color: #FBA2AB;
                }

                /* Timetable List */
                .timetable-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .timetable-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: #f8fafc;
                    border-radius: 12px;
                    border-left: 4px solid;
                    transition: all 0.2s;
                }

                .timetable-item.completed { border-left-color: #22c55e; }
                .timetable-item.ongoing { border-left-color: #FEA3BE; background: #fef7f9; }
                .timetable-item.upcoming { border-left-color: #e2e8f0; }

                .time-column {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #64748b;
                    font-size: 0.9rem;
                    min-width: 100px;
                }

                .class-details {
                    flex: 1;
                }

                .class-details h4 {
                    margin: 0 0 0.25rem 0;
                    font-size: 1rem;
                    color: #1e293b;
                }

                .class-details p {
                    margin: 0;
                    font-size: 0.85rem;
                    color: #64748b;
                }

                .status-badge {
                    padding: 0.375rem 0.75rem;
                    border-radius: 20px;
                    color: white;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: capitalize;
                }

                /* Exams List */
                .exams-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .exam-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: #f8fafc;
                    border-radius: 12px;
                    transition: all 0.2s;
                }

                .exam-item:hover {
                    background: #f1f5f9;
                }

                .exam-icon {
                    width: 44px;
                    height: 44px;
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }

                .exam-details {
                    flex: 1;
                }

                .exam-details h4 {
                    margin: 0 0 0.25rem 0;
                    font-size: 1rem;
                    color: #1e293b;
                }

                .exam-details p {
                    margin: 0;
                    font-size: 0.85rem;
                    color: #64748b;
                }

                .exam-date {
                    font-size: 0.8rem;
                    color: #94a3b8;
                }

                .days-badge {
                    padding: 0.5rem 1rem;
                    background: #f1f5f9;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #64748b;
                }

                .days-badge.urgent {
                    background: #fef2f2;
                    color: #ef4444;
                }

                /* Salary Summary Card */
                .salary-summary-card {
                    background: white;
                    border-radius: 20px;
                    padding: 1.5rem;
                    margin-bottom: 1.5rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                .salary-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 1.5rem;
                }

                .salary-stat-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1.25rem;
                    background: #f8fafc;
                    border-radius: 14px;
                }

                .salary-icon {
                    width: 52px;
                    height: 52px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }

                .salary-icon.monthly {
                    background: linear-gradient(135deg, #22c55e, #16a34a);
                }

                .salary-icon.annual {
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                }

                .salary-info {
                    flex: 1;
                }

                .salary-label {
                    margin: 0 0 0.25rem 0;
                    font-size: 0.85rem;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .salary-value {
                    margin: 0;
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #1e293b;
                }

                .payment-history {
                    border-top: 2px solid #f1f5f9;
                    padding-top: 1.5rem;
                }

                .payment-history h4 {
                    margin: 0 0 1rem 0;
                    font-size: 1rem;
                    color: #1e293b;
                }

                .payment-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .payment-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    background: #f8fafc;
                    border-radius: 12px;
                }

                .payment-details {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .payment-month {
                    font-weight: 600;
                    color: #1e293b;
                }

                .payment-date {
                    font-size: 0.85rem;
                    color: #64748b;
                }

                .payment-amount-section {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .payment-amount {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #1e293b;
                }

                .payment-status {
                    padding: 0.375rem 0.75rem;
                    background: #d1fae5;
                    color: #059669;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                }

                /* Quick Actions */
                .quick-actions-section {
                    background: white;
                    border-radius: 20px;
                    padding: 1.5rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                .quick-actions-section h3 {
                    margin: 0 0 1.5rem 0;
                    font-size: 1.1rem;
                    color: #1e293b;
                }

                .actions-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                }

                .quick-action-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem 1.5rem;
                    background: #f8fafc;
                    border: 2px solid transparent;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: #1e293b;
                    font-weight: 600;
                }

                .quick-action-btn:hover {
                    border-color: #FEA3BE;
                    background: #fef7f9;
                    color: #FEA3BE;
                }

                .quick-action-btn svg {
                    color: #FEA3BE;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .faculty-dashboard {
                        padding: 1rem;
                        max-width: 100vw;
                        overflow-x: hidden;
                    }

                    .dashboard-header-section {
                        flex-direction: column;
                        gap: 1rem;
                        max-width: 100%;
                    }

                    .greeting-section {
                        flex-direction: column;
                        gap: 1rem;
                        min-width: auto;
                        max-width: 100%;
                    }

                    .greeting-content {
                        max-width: 100%;
                        overflow: hidden;
                    }

                    .greeting-text {
                        max-width: 100%;
                    }

                    .greeting-text h1 {
                        font-size: 1.25rem;
                        word-wrap: break-word;
                        overflow-wrap: break-word;
                        white-space: normal;
                    }

                    .date-text {
                        font-size: 0.85rem;
                        word-wrap: break-word;
                    }

                    .greeting-icon {
                        width: 50px;
                        height: 50px;
                        flex-shrink: 0;
                    }

                    .header-actions {
                        width: 100%;
                        justify-content: flex-start;
                    }

                    .notification-dropdown {
                        right: auto;
                        left: 0;
                        width: calc(100vw - 2rem);
                        max-width: 320px;
                    }

                    .faculty-badge {
                        width: 100%;
                        max-width: 100%;
                        overflow: hidden;
                    }

                    .badge-info {
                        overflow: hidden;
                    }

                    .badge-id, .badge-dept {
                        font-size: 0.85rem;
                        word-wrap: break-word;
                        overflow-wrap: break-word;
                    }

                    .stats-grid {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }

                    .stat-card {
                        max-width: 100%;
                    }

                    .dashboard-content-grid {
                        grid-template-columns: 1fr;
                    }

                    .content-card {
                        max-width: 100%;
                        overflow: hidden;
                    }

                    .attendance-status-card {
                        max-width: 100%;
                    }

                    .attendance-marked {
                        flex-direction: column;
                        text-align: center;
                        align-items: center;
                    }

                    .status-details h4,
                    .status-details p {
                        word-wrap: break-word;
                        overflow-wrap: break-word;
                    }

                    .attendance-buttons {
                        flex-direction: column;
                        gap: 0.75rem;
                    }

                    .attendance-btn {
                        width: 100%;
                    }

                    .salary-stats {
                        grid-template-columns: 1fr;
                    }

                    .actions-grid {
                        grid-template-columns: 1fr;
                    }

                    .quick-action-btn {
                        justify-content: flex-start;
                        font-size: 0.9rem;
                    }

                    .card-header {
                        flex-wrap: wrap;
                    }

                    .timetable-list,
                    .exams-list {
                        max-width: 100%;
                    }

                    .timetable-item,
                    .exam-item {
                        max-width: 100%;
                        overflow: hidden;
                        flex-wrap: wrap;
                    }

                    .class-details h4,
                    .exam-details h4 {
                        font-size: 0.95rem;
                        word-wrap: break-word;
                    }

                    .class-details p,
                    .exam-details p {
                        font-size: 0.8rem;
                        word-wrap: break-word;
                    }
                }
            `}</style>
        </div>
    );
};

export default FacultyDashboard;

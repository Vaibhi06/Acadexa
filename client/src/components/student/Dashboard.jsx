import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../shared/Sidebar';
import Navbar from '../shared/Navbar';
import {
  Calendar,
  UserCheck,
  BookOpen,
  Bell,
  Clock,
  User
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Format time
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format date
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Mock data
  const studentData = {
    id: 'STU001',
    class: '10th Grade A',
    attendance: '94.5%',
    attendanceValue: 94.5
  };

  const todaySchedule = [
    { time: '09:00 AM', subject: 'Mathematics', faculty: 'Mr. Smith', room: 'Room 201' },
    { time: '10:30 AM', subject: 'Physics', faculty: 'Ms. Johnson', room: 'Lab 1' },
    { time: '12:00 PM', subject: 'English', faculty: 'Mr. Davis', room: 'Room 105' },
    { time: '02:00 PM', subject: 'Chemistry', faculty: 'Dr. Wilson', room: 'Lab 2' },
  ];

  const upcomingExams = [
    { subject: 'Mathematics', date: 'Jan 15, 2026', type: 'Mid-term' },
    { subject: 'Physics', date: 'Jan 16, 2026', type: 'Unit Test' },
    { subject: 'Chemistry', date: 'Jan 18, 2026', type: 'Practical' },
  ];

  const academicUpdates = [
    { title: 'Assignment Submission', message: 'Math assignment due tomorrow', time: '2 hours ago', type: 'warning' },
    { title: 'New Study Material', message: 'Physics chapter 5 notes uploaded', time: '5 hours ago', type: 'info' },
    { title: 'Exam Schedule Released', message: 'Mid-term exam timetable available', time: '1 day ago', type: 'info' },
  ];

  return (
    <div className="admin-layout">
      <Sidebar role="student" />

      <div className="admin-main">
        <Navbar />

        <div className="admin-content student-dashboard">
          {/* Header Section */}
          <div className="student-header">
            <div className="header-content">
              <div className="greeting-section">
                <h1>{getGreeting()}, {user?.name || 'Student'}! 👋</h1>
                <p className="student-class">{studentData.class}</p>
              </div>

              <div className="header-right">
                <div className="datetime-display">
                  <div className="time-display">
                    <Clock size={20} />
                    <span className="time">{formatTime(currentTime)}</span>
                  </div>
                  <p className="date-display">{formatDate(currentTime)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="dashboard-content">
            {/* Attendance Summary Card */}
            <div className="attendance-card">
              <div className="attendance-header">
                <h3>📊 Attendance Overview</h3>
                <UserCheck size={20} />
              </div>
              <div className="attendance-body">
                <div className="attendance-circle">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#f0f0f0" strokeWidth="10" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#FEA3BE"
                      strokeWidth="10"
                      strokeDasharray={`${studentData.attendanceValue * 2.827} ${282.7 - studentData.attendanceValue * 2.827}`}
                      strokeDashoffset="0"
                      transform="rotate(-90 50 50)"
                      style={{ transition: 'stroke-dasharray 1s ease' }}
                    />
                  </svg>
                  <div className="percentage-text">
                    <span className="percentage">{studentData.attendance}</span>
                    <span className="label">Present</span>
                  </div>
                </div>
                <div className="attendance-stats">
                  <div className="stat-item">
                    <span className="stat-label">Total Days</span>
                    <span className="stat-value">180</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Present</span>
                    <span className="stat-value">170</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Absent</span>
                    <span className="stat-value">10</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Timetable */}
            <div className="timetable-card">
              <div className="card-header">
                <h3>📅 Today's Classes</h3>
                <Calendar size={20} />
              </div>
              <div className="schedule-list">
                {todaySchedule.map((item, idx) => (
                  <div key={idx} className="schedule-item">
                    <div className="time-badge">{item.time}</div>
                    <div className="schedule-details">
                      <h4>{item.subject}</h4>
                      <div className="schedule-meta">
                        <span>{item.faculty}</span>
                        <span className="dot">•</span>
                        <span>{item.room}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Exams */}
            <div className="exams-card">
              <div className="card-header">
                <h3>📝 Upcoming Exams</h3>
                <Bell size={20} />
              </div>
              <div className="exams-list">
                {upcomingExams.map((exam, idx) => (
                  <div key={idx} className="exam-item">
                    <div className="exam-icon">
                      <BookOpen size={18} />
                    </div>
                    <div className="exam-details">
                      <h4>{exam.subject}</h4>
                      <p>{exam.date} • {exam.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Updates */}
            <div className="updates-card">
              <div className="card-header">
                <h3>🔔 Academic Updates</h3>
                <Bell size={20} />
              </div>
              <div className="updates-list">
                {academicUpdates.map((update, idx) => (
                  <div key={idx} className={`update-item ${update.type}`}>
                    <div className="update-content">
                      <h4>{update.title}</h4>
                      <p>{update.message}</p>
                    </div>
                    <span className="update-time">{update.time}</span>
                  </div>
                ))}
                <button className="view-all-btn" onClick={() => navigate('/student/notices')}>
                  📢 View All Notices
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .student-dashboard {
          background: #ffffff;
        }

        /* Header */
        .student-header {
          background: white;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.04);
          margin-bottom: 2rem;
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }

        .greeting-section h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 0.25rem 0;
        }

        .student-class {
          color: #64748b;
          font-size: 1rem;
          margin: 0;
          font-weight: 500;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .datetime-display {
          text-align: right;
        }

        .time-display {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #FEA3BE;
          font-weight: 600;
          font-size: 1.25rem;
        }

        .date-display {
          color: #64748b;
          font-size: 0.875rem;
          margin: 0.25rem 0 0 0;
        }

        .profile-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: transform 0.2s;
          flex-shrink: 0;
        }

        .profile-icon:hover {
          transform: scale(1.05);
        }

        /* Dashboard Content */
        .dashboard-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem 2rem 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        /* Attendance Card */
        .attendance-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          grid-column: span 1;
        }

        .attendance-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .attendance-header h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .attendance-body {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .attendance-circle {
          position: relative;
          width: 160px;
          height: 160px;
        }

        .attendance-circle svg {
          width: 100%;
          height: 100%;
        }

        .percentage-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .percentage {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
        }

        .label {
          display: block;
          font-size: 0.875rem;
          color: #64748b;
          margin-top: 0.25rem;
        }

        .attendance-stats {
          display: flex;
          gap: 2rem;
          width: 100%;
          justify-content: center;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
        }

        /* Cards */
        .timetable-card,
        .exams-card,
        .updates-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .card-header h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        /* Schedule List */
        .schedule-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .schedule-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 12px;
          border-left: 3px solid #FEA3BE;
        }

        .time-badge {
          background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
          color: white;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          white-space: nowrap;
          height: fit-content;
        }

        .schedule-details h4 {
          margin: 0 0 0.25rem 0;
          font-size: 1rem;
          color: #1e293b;
        }

        .schedule-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #64748b;
        }

        .dot {
          color: #cbd5e1;
        }

        /* Exams List */
        .exams-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .exam-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 12px;
          align-items: center;
        }

        .exam-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .exam-details h4 {
          margin: 0 0 0.25rem 0;
          font-size: 1rem;
          color: #1e293b;
        }

        .exam-details p {
          margin: 0;
          font-size: 0.875rem;
          color: #64748b;
        }

        /* Updates List */
        .updates-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .update-item {
          padding: 1rem;
          background: #f8fafc;
          border-radius: 12px;
          border-left: 3px solid #3b82f6;
        }

        .update-item.warning {
          border-left-color: #f59e0b;
          background: #fffbeb;
        }

        .update-item.info {
          border-left-color: #3b82f6;
        }

        .update-content h4 {
          margin: 0 0 0.25rem 0;
          font-size: 1rem;
          color: #1e293b;
        }

        .update-content p {
          margin: 0 0 0.5rem 0;
          font-size: 0.875rem;
          color: #64748b;
        }

        .update-time {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .view-all-btn {
          width: 100%;
          padding: 0.875rem;
          background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 0.5rem;
        }

        .view-all-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(254, 163, 190, 0.4);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .student-dashboard {
            background: #ffffff;
            max-width: 100vw;
            overflow-x: hidden;
          }

          .student-header {
            padding: 1rem;
            max-width: 100%;
          }

          .header-content {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
            max-width: 100%;
          }

          .greeting-section {
            max-width: 100%;
          }

          .greeting-section h1 {
            font-size: 1.3rem;
            word-wrap: break-word;
            overflow-wrap: break-word;
          }

          .student-class {
            font-size: 0.9rem;
            word-wrap: break-word;
          }

          .header-right {
            width: 100%;
            justify-content: space-between;
          }

          .datetime-display {
            text-align: left;
          }

          .time-display {
            font-size: 1.1rem;
          }

          .date-display {
            font-size: 0.8rem;
            word-wrap: break-word;
          }

          .dashboard-content {
            grid-template-columns: 1fr;
            padding: 0 1rem 2rem 1rem;
            max-width: 100%;
          }

          .attendance-card,
          .timetable-card,
          .exams-card,
          .updates-card {
            max-width: 100%;
            overflow: hidden;
          }

          .attendance-circle {
            width: 140px;
            height: 140px;
          }

          .percentage {
            font-size: 1.75rem;
          }

          .attendance-stats {
            gap: 1.5rem;
          }

          .schedule-item,
          .exam-item,
          .update-item {
            max-width: 100%;
            overflow: hidden;
            word-wrap: break-word;
          }

          .schedule-details h4,
          .exam-details h4,
          .update-content h4 {
            font-size: 0.95rem;
            word-wrap: break-word;
            overflow-wrap: break-word;
          }

          .schedule-meta,
          .exam-details p,
          .update-content p {
            font-size: 0.85rem;
            word-wrap: break-word;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentDashboard;

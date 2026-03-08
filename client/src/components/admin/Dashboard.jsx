import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';
import Sidebar from '../shared/Sidebar';
import {
  Users,
  BookOpen,
  HelpCircle,
  GraduationCap,
  DollarSign,
  Bell,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Cake,
  RefreshCw
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const [stats, setStats] = useState({
    counts: { students: 0, classes: 0, faculty: 0, inquiries: 0 },
    attendance: { present: 0, absent: 0, late: 0, total: 0 },
    fees: { totalAmount: 0, paidAmount: 0, pendingAmount: 0, paidCount: 0, pendingCount: 0 }
  });

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/dashboard/stats');
      if (response.data.success) {
        setStats(response.data.data.stats);
        setLastRefresh(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Refetch stats when navigating back to dashboard
  useEffect(() => {
    if (location.pathname === '/admin' || location.pathname === '/admin/dashboard') {
      fetchStats();
    }
  }, [location.pathname, fetchStats]);

  // Auto-refresh when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && (location.pathname === '/admin' || location.pathname === '/admin/dashboard')) {
        fetchStats();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fetchStats, location.pathname]);

  const totalStudents = stats.counts.students;
  const totalClasses = stats.counts.classes;
  const totalFaculty = stats.counts.faculty;
  const activeInquiries = stats.counts.inquiries;

  // Today's Attendance
  const todayAttendance = stats.attendance;

  // Fee Collection Summary
  const feeCollection = stats.fees;

  const statsCards = [
    { icon: Users, value: totalStudents, label: 'Total Students', color: '#FBA2AB', bgColor: '#FFE5E9', link: '/admin/students' },
    { icon: BookOpen, value: totalClasses, label: 'Active Classes', color: '#FFDFC3', bgColor: '#FFF5EB', link: '/admin/classes' },
    { icon: GraduationCap, value: totalFaculty, label: 'Total Faculty', color: '#F6E0D0', bgColor: '#FFF9F5', link: '/admin/faculty' },
    { icon: HelpCircle, value: activeInquiries, label: 'Active Inquiries', color: '#FEA3BE', bgColor: '#FFE9F1', link: '/admin/inquiries' }
  ];

  // Notifications (Placeholder - could be connected to NoticeBoard)
  const notifications = [
    { id: 1, type: 'info', message: 'Welcome to the new dashboard!', time: 'Just now' }
  ];

  // Upcoming Exams
  const upcomingExams = [
    { subject: 'Mathematics', class: 'Class 7-A', date: '2026-01-05', time: '10:00 AM' },
    { subject: 'Science', class: 'Class 7-B', date: '2026-01-07', time: '11:00 AM' }
  ];

  return (
    <div className="new-admin-layout">
      <Sidebar role="admin" />

      <div className="new-admin-main">
        <div className="new-admin-content">
          <div className="new-dashboard-header">
            <div className="header-top-row">
              <div className="header-left">
                <h1>Welcome, {user?.name || 'Admin'}!</h1>
                <button
                  className="refresh-btn"
                  onClick={fetchStats}
                  disabled={loading}
                  title="Refresh dashboard data"
                >
                  <RefreshCw size={18} className={loading ? 'spinning' : ''} />
                  Refresh
                </button>
              </div>
              <div className="header-quick-notifs">
                <span className="quick-notif-item highlight-orange">
                  <AlertCircle size={18} />
                  {feeCollection.pendingCount} Fees Pending
                </span>
              </div>
            </div>
            <p className="header-subtitle">Here's what's happening with your institute today</p>
          </div>

          {/* Stats Cards */}
          <div className="new-stats-grid">
            {statsCards.map((stat, idx) => (
              <div
                key={idx}
                className="new-stat-card clickable"
                onClick={() => navigate(stat.link)}
              >
                <div className="stat-icon-wrapper" style={{ background: stat.bgColor }}>
                  <stat.icon size={24} style={{ color: stat.color }} />
                </div>
                <div className="stat-content">
                  <h2>{stat.value}</h2>
                  <p>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>



          {/* Middle Section - Attendance, Fees, Notifications */}
          <div className="middle-sections-grid">
            {/* Today's Attendance */}
            <div className="section-card">
              <div className="section-header">
                <h3>Today's Attendance</h3>
                <span className="attendance-date">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="attendance-summary">
                <div className="attendance-stat present">
                  <CheckCircle2 size={20} />
                  <div>
                    <h4>{todayAttendance.present}</h4>
                    <p>Present</p>
                  </div>
                </div>
                <div className="attendance-stat absent">
                  <XCircle size={20} />
                  <div>
                    <h4>{todayAttendance.absent}</h4>
                    <p>Absent</p>
                  </div>
                </div>
                <div className="attendance-stat late">
                  <AlertCircle size={20} />
                  <div>
                    <h4>{todayAttendance.late}</h4>
                    <p>Late</p>
                  </div>
                </div>
              </div>
              <div className="attendance-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${todayAttendance.total > 0 ? (todayAttendance.present / todayAttendance.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <p className="progress-text">
                  {todayAttendance.total > 0 ? Math.round((todayAttendance.present / todayAttendance.total) * 100) : 0}% attendance rate
                </p>
              </div>
            </div>

            {/* Fee Collection Summary */}
            <div className="section-card">
              <div className="section-header">
                <h3>Fee Collection</h3>
                <DollarSign size={20} className="header-icon" />
              </div>
              <div className="fee-summary">
                <div className="fee-stat paid">
                  <div className="fee-amount">₹{feeCollection.paidAmount.toLocaleString()}</div>
                  <p>Collected ({feeCollection.paidCount} students)</p>
                </div>
                <div className="fee-stat pending">
                  <div className="fee-amount">₹{feeCollection.pendingAmount.toLocaleString()}</div>
                  <p>Pending ({feeCollection.pendingCount} students)</p>
                </div>
              </div>
              <div className="fee-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill fee-progress-fill"
                    style={{ width: `${feeCollection.totalAmount > 0 ? (feeCollection.paidAmount / feeCollection.totalAmount) * 100 : 0}%` }}
                  ></div>
                </div>
                <p className="progress-text">
                  {feeCollection.totalAmount > 0 ? Math.round((feeCollection.paidAmount / feeCollection.totalAmount) * 100) : 0}% collected
                </p>
              </div>
            </div>

            {/* Notifications & Alerts */}
            <div className="section-card">
              <div className="section-header">
                <h3>Notifications</h3>
                <Bell size={20} className="header-icon" />
              </div>
              <div className="notifications-list">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`notification-item ${notif.type}`}>
                    <div className="notif-icon">
                      {notif.type === 'success' && <CheckCircle2 size={18} />}
                      {notif.type === 'warning' && <AlertCircle size={18} />}
                      {notif.type === 'info' && <Bell size={18} />}
                    </div>
                    <div className="notif-content">
                      <p>{notif.message}</p>
                      <span>{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Three Sections */}
          <div className="bottom-sections-grid">
            {/* Your Tasks */}
            <div className="section-card">
              <div className="section-header">
                <h3>Your Tasks</h3>
                <select className="section-dropdown">
                  <option>All Tasks</option>
                  <option>Pending</option>
                  <option>Completed</option>
                </select>
              </div>
              <div className="empty-state">
                <div className="empty-icon">✓</div>
                <p>No tasks found. Enjoy your free time!</p>
              </div>
            </div>

            {/* Upcoming Fees */}
            <div className="section-card">
              <div className="section-header">
                <h3>Upcoming Fees</h3>
                <select className="section-dropdown">
                  <option>All Classes</option>
                  <option>Class 1</option>
                  <option>Class 2</option>
                </select>
              </div>
              <div className="empty-state">
                <div className="empty-icon fees-icon">💰</div>
                <p>No upcoming fees installments</p>
              </div>
            </div>

            {/* Upcoming Exams */}
            <div className="section-card">
              <div className="section-header">
                <h3>Upcoming Exams</h3>
                <select className="section-dropdown">
                  <option>Latest</option>
                  <option>This Week</option>
                  <option>This Month</option>
                </select>
              </div>
              {upcomingExams.length > 0 ? (
                <div className="exams-list">
                  {upcomingExams.map((exam, idx) => (
                    <div key={idx} className="exam-item">
                      <div className="exam-icon">📝</div>
                      <div className="exam-details">
                        <h4>{exam.subject}</h4>
                        <p>{exam.class}</p>
                        <span>{new Date(exam.date).toLocaleDateString()} • {exam.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon exam-icon">📅</div>
                  <p>No upcoming exams scheduled</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .new-admin-layout {
          display: flex;
          min-height: 100vh;
          background: #ffffff;
        }

        .new-admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          margin-left: 280px;
          transition: margin-left 0.3s ease;
        }

        .new-admin-content {
          flex: 1;
          padding: 2rem;
          max-width: 1600px;
          margin: 0 auto;
          width: 100%;
        }

        /* Header */
        .new-dashboard-header {
          margin-bottom: 2rem;
        }

        .new-dashboard-header h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #000000;
          margin-bottom: 0.5rem;
          background: none;
          -webkit-text-fill-color: #000000;
        }

        .header-subtitle {
          font-size: 1rem;
          color: #000000;
          margin: 0;
        }

        .header-top-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 0.5rem;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .refresh-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: linear-gradient(135deg, #FFE5E9, #FFDFC3);
            border: none;
            border-radius: 8px;
            color: #000;
            font-size: 0.875rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .refresh-btn:hover:not(:disabled) {
            background: linear-gradient(135deg, #FBA2AB, #FEA3BE);
            color: white;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(251, 162, 171, 0.3);
        }

        .refresh-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .refresh-btn svg.spinning {
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }

        .new-dashboard-header h1 {
            margin-bottom: 0;
        }

        .header-quick-notifs {
            display: flex;
            gap: 1rem;
        }

        .quick-notif-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
        }

        .quick-notif-item.highlight-pink {
            background: #FFE5E9;
            color: #FBA2AB;
        }

        .quick-notif-item.highlight-orange {
            background: #FFF5EB;
            color: #FB923C; /* Dark orange/amber for warning */
        }

        /* Stats Cards */
        .new-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .new-stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          border-left: 4px solid #FBA2AB;
          transition: all 0.3s ease;
        }

        .new-stat-card.clickable {
          cursor: pointer;
        }

        .new-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(254, 163, 190, 0.25);
        }

        .stat-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-content h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #000000;
          margin: 0 0 0.25rem 0;
          background: none;
          -webkit-text-fill-color: #000000;
        }

        .stat-content p {
          font-size: 0.9rem;
          color: #000000;
          margin: 0;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #000000;
          margin-bottom: 1.5rem;
          position: relative;
          padding-left: 1rem;
          background: none;
          -webkit-text-fill-color: #000000;
        }

        .section-title::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(135deg, #FBA2AB, #FEA3BE);
          border-radius: 2px;
        }



        /* Middle Sections */
        .middle-sections-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        /* Today's Attendance */
        .attendance-date {
          background: #f1f5f9;
          color: #000000;
          padding: 0.375rem 0.875rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .attendance-summary {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .attendance-stat {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 12px;
        }

        .attendance-stat.present {
          border-left: 3px solid #10b981;
        }

        .attendance-stat.absent {
          border-left: 3px solid #ef4444;
        }

        .attendance-stat.late {
          border-left: 3px solid #f59e0b;
        }

        .attendance-stat h4 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #000000;
          margin: 0;
          background: none;
          -webkit-text-fill-color: #000000;
        }

        .attendance-stat p {
          font-size: 0.875rem;
          color: #000000;
          margin: 0;
        }

        .attendance-stat.present svg {
          color: #10b981;
        }

        .attendance-stat.absent svg {
          color: #ef4444;
        }

        .attendance-stat.late svg {
          color: #f59e0b;
        }

        .attendance-progress,
        .fee-progress {
          margin-top: 1rem;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #FEA3BE, #FBA2AB);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .fee-progress-fill {
          background: linear-gradient(90deg, #FFDFC3, #F6E0D0);
        }

        .progress-text {
          font-size: 0.875rem;
          color: #000000;
          margin: 0.5rem 0 0 0;
          text-align: center;
        }

        /* Fee Collection */
        .fee-summary {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .fee-stat {
          padding: 1.25rem;
          border-radius: 12px;
          text-align: center;
        }

        .fee-stat.paid {
          background: linear-gradient(135deg, #d1fae5, #a7f3d0);
        }

        .fee-stat.pending {
          background: linear-gradient(135deg, #fef3c7, #fde68a);
        }

        .fee-amount {
          font-size: 1.5rem;
          font-weight: 700;
          color: #000000;
          margin-bottom: 0.5rem;
        }

        .fee-stat p {
          font-size: 0.875rem;
          color: #000000;
          margin: 0;
        }

        /* Notifications */
        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .notification-item {
          display: flex;
          gap: 0.75rem;
          padding: 1rem;
          border-radius: 12px;
          background: #f8fafc;
          border-left: 3px solid #cbd5e1;
        }

        .notification-item.success {
          border-left-color: #10b981;
          background: #f0fdf4;
        }

        .notification-item.warning {
          border-left-color: #f59e0b;
          background: #fffbeb;
        }

        .notification-item.info {
          border-left-color: #FBA2AB;
          background: #eef2ff;
        }

        .notif-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .notification-item.success .notif-icon {
          background: #d1fae5;
          color: #10b981;
        }

        .notification-item.warning .notif-icon {
          background: #fef3c7;
          color: #f59e0b;
        }

        .notification-item.info .notif-icon {
          background: #FFE5E9;
          color: #FBA2AB;
        }

        .notif-content p {
          font-size: 0.9rem;
          color: #000000;
          margin: 0 0 0.25rem 0;
        }

        .notif-content span {
          font-size: 0.8rem;
          color: #94a3b8;
        }

        /* Bottom Sections */
        .bottom-sections-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .section-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f1f5f9;
        }

        .section-header h3 {
          font-size: 1.125rem;
          font-weight: 700;
          color: #000000;
          margin: 0;
          background: none;
          -webkit-text-fill-color: #000000;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .header-icon {
          color: #FBA2AB;
        }

        .section-dropdown {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: #000000;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .section-dropdown:hover {
          border-color: #FBA2AB;
          color: #FBA2AB;
        }

        .section-dropdown:focus {
          outline: none;
          border-color: #FBA2AB;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 1.5rem;
        }

        .empty-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 1rem;
          border-radius: 50%;
          background: linear-gradient(135deg, #ffe4cc, #ffc896);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
        }

        .empty-icon.fees-icon {
          background: linear-gradient(135deg, #fed7aa, #fdba74);
        }

        .empty-icon.exam-icon {
          background: linear-gradient(135deg, #fce7f3, #fbcfe8);
        }

        .empty-state p {
          font-size: 0.95rem;
          color: #94a3b8;
          margin: 0;
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
          border-left: 3px solid #FBA2AB;
        }

        .exam-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #FFE5E9, #FFDFC3);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .exam-details h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #000000;
          margin: 0 0 0.25rem 0;
          background: none;
          -webkit-text-fill-color: #000000;
        }

        .exam-details p {
          font-size: 0.875rem;
          color: #000000;
          margin: 0 0 0.5rem 0;
        }

        .exam-details span {
          font-size: 0.8rem;
          color: #94a3b8;
        }

        /* Responsive */
        @media (max-width: 1280px) {
          .new-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }



          .attendance-summary {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .new-admin-content {
            padding: 1rem;
          }

          .new-stats-grid,
          .middle-sections-grid,
          .bottom-sections-grid {
            grid-template-columns: 1fr;
          }

          .new-dashboard-header h1 {
            font-size: 1.5rem;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
        }

        @media (max-width: 1024px) {
          .new-admin-main {
            margin-left: 0;
          }

          .new-admin-content {
            padding-top: 6.5rem;
            padding-left: 1rem;
            padding-right: 1rem;
          }

          .header-top-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .header-quick-notifs {
            width: 100%;
            justify-content: flex-start;
          }

          .section-dropdown {
            width: 100%;
          }

          .fee-summary {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;

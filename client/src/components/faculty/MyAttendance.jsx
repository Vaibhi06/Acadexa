import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import {
    Calendar,
    TrendingUp,
    CheckCircle,
    XCircle,
    Clock,
    ChevronLeft,
    ChevronRight,
    AlertCircle
} from 'lucide-react';

const FacultyAttendance = () => {
    const [selectedMonth, setSelectedMonth] = useState('current');
    const [currentDate] = useState(new Date());

    // Get current and previous month info
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    // Generate attendance data for a month
    const generateMonthData = (month, year) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        const attendanceData = [];

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayOfWeek = date.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const isPast = date < today;
            const isToday = date.toDateString() === today.toDateString();
            const isFuture = date > today;

            let status = 'weekend';
            if (!isWeekend) {
                if (isFuture) {
                    status = 'upcoming';
                } else if (isToday) {
                    // Check localStorage for today's attendance
                    const storedAttendance = localStorage.getItem('facultyTodayAttendance');
                    if (storedAttendance) {
                        const parsed = JSON.parse(storedAttendance);
                        status = parsed.status;
                    } else {
                        status = 'pending';
                    }
                } else {
                    // Random for past days (demo data) - 90% present rate
                    status = Math.random() > 0.1 ? 'present' : 'absent';
                }
            }

            attendanceData.push({
                day,
                date: date.toISOString().split('T')[0],
                dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek],
                status,
                isWeekend,
                isToday
            });
        }

        return attendanceData;
    };

    const [currentMonthData] = useState(() => generateMonthData(currentMonth, currentYear));
    const [previousMonthData] = useState(() => generateMonthData(prevMonth, prevYear));

    const activeData = selectedMonth === 'current' ? currentMonthData : previousMonthData;
    const activeMonthName = selectedMonth === 'current'
        ? `${monthNames[currentMonth]} ${currentYear}`
        : `${monthNames[prevMonth]} ${prevYear}`;

    // Calculate stats
    const workingDays = activeData.filter(d => !d.isWeekend && d.status !== 'upcoming').length;
    const presentDays = activeData.filter(d => d.status === 'present').length;
    const absentDays = activeData.filter(d => d.status === 'absent').length;
    const pendingDays = activeData.filter(d => d.status === 'pending').length;
    const percentage = workingDays > 0 ? ((presentDays / workingDays) * 100).toFixed(1) : 0;

    const getStatusColor = (status) => {
        switch (status) {
            case 'present': return { bg: '#dcfce7', color: '#16a34a', border: '#86efac' };
            case 'absent': return { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' };
            case 'pending': return { bg: '#fef3c7', color: '#d97706', border: '#fde68a' };
            case 'weekend': return { bg: '#f1f5f9', color: '#94a3b8', border: '#e2e8f0' };
            case 'upcoming': return { bg: '#f8fafc', color: '#cbd5e1', border: '#e2e8f0' };
            default: return { bg: '#f1f5f9', color: '#64748b', border: '#e2e8f0' };
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'present': return <CheckCircle size={14} />;
            case 'absent': return <XCircle size={14} />;
            case 'pending': return <Clock size={14} />;
            default: return null;
        }
    };

    return (
        <div className="admin-layout">
            <Sidebar role="faculty" />
            <div className="admin-main">
                <Navbar />
                <div className="attendance-page">
                    {/* Page Header */}
                    <div className="page-header-section">
                        <div className="header-content">
                            <h1>My Attendance</h1>
                            <p className="page-subtitle">Track your attendance records</p>
                        </div>
                    </div>

                    {/* Stats Summary */}
                    <div className="attendance-stats-grid">
                        <div className="attendance-stat-card">
                            <div className="stat-icon-box present">
                                <CheckCircle size={24} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-number">{presentDays}</span>
                                <span className="stat-label">Present Days</span>
                            </div>
                        </div>

                        <div className="attendance-stat-card">
                            <div className="stat-icon-box absent">
                                <XCircle size={24} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-number">{absentDays}</span>
                                <span className="stat-label">Absent Days</span>
                            </div>
                        </div>

                        <div className="attendance-stat-card">
                            <div className="stat-icon-box working">
                                <Calendar size={24} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-number">{workingDays}</span>
                                <span className="stat-label">Working Days</span>
                            </div>
                        </div>

                        <div className="attendance-stat-card">
                            <div className="stat-icon-box percentage">
                                <TrendingUp size={24} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-number">{percentage}%</span>
                                <span className="stat-label">Attendance Rate</span>
                            </div>
                        </div>
                    </div>

                    {/* Month Tabs */}
                    <div className="month-tabs-container">
                        <div className="month-tabs">
                            <button
                                className={`month-tab ${selectedMonth === 'current' ? 'active' : ''}`}
                                onClick={() => setSelectedMonth('current')}
                            >
                                Current Month
                            </button>
                            <button
                                className={`month-tab ${selectedMonth === 'previous' ? 'active' : ''}`}
                                onClick={() => setSelectedMonth('previous')}
                            >
                                Previous Month
                            </button>
                        </div>
                        <div className="active-month-label">
                            <Calendar size={18} />
                            <span>{activeMonthName}</span>
                        </div>
                    </div>

                    {/* Day-wise Calendar Grid */}
                    <div className="calendar-card">
                        <div className="calendar-header">
                            <h3>Day-wise Attendance</h3>
                            <div className="legend">
                                <div className="legend-item">
                                    <span className="legend-dot present"></span>
                                    <span>Present</span>
                                </div>
                                <div className="legend-item">
                                    <span className="legend-dot absent"></span>
                                    <span>Absent</span>
                                </div>
                                <div className="legend-item">
                                    <span className="legend-dot weekend"></span>
                                    <span>Weekend</span>
                                </div>
                            </div>
                        </div>

                        <div className="days-grid">
                            {activeData.map((day, idx) => {
                                const colors = getStatusColor(day.status);
                                return (
                                    <div
                                        key={idx}
                                        className={`day-card ${day.isToday ? 'today' : ''} ${day.status}`}
                                        style={{
                                            background: colors.bg,
                                            borderColor: colors.border
                                        }}
                                    >
                                        <span className="day-number" style={{ color: colors.color }}>
                                            {day.day}
                                        </span>
                                        <span className="day-name" style={{ color: colors.color }}>
                                            {day.dayName}
                                        </span>
                                        {!day.isWeekend && day.status !== 'upcoming' && (
                                            <div className="day-status" style={{ color: colors.color }}>
                                                {getStatusIcon(day.status)}
                                            </div>
                                        )}
                                        {day.isToday && (
                                            <span className="today-badge">Today</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Monthly Summary Card */}
                    <div className="summary-card">
                        <div className="summary-header">
                            <AlertCircle size={20} />
                            <h3>Monthly Summary</h3>
                        </div>
                        <div className="summary-content">
                            <p>
                                In <strong>{activeMonthName}</strong>, you were present for
                                <strong> {presentDays} out of {workingDays} working days</strong>,
                                maintaining an attendance rate of <strong>{percentage}%</strong>.
                                {absentDays > 0 && (
                                    <span> You were absent for {absentDays} day{absentDays > 1 ? 's' : ''}.</span>
                                )}
                            </p>
                            {parseFloat(percentage) >= 90 && (
                                <div className="good-attendance-badge">
                                    <CheckCircle size={16} />
                                    <span>Excellent Attendance!</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .attendance-page {
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
                .attendance-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }
                
                .attendance-stat-card {
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
                
                .stat-icon-box.present { background: linear-gradient(135deg, #22c55e, #16a34a); }
                .stat-icon-box.absent { background: linear-gradient(135deg, #ef4444, #dc2626); }
                .stat-icon-box.working { background: linear-gradient(135deg, #0ea5e9, #0284c7); }
                .stat-icon-box.percentage { background: linear-gradient(135deg, #FEA3BE, #FBA2AB); }
                
                .stat-info {
                    display: flex;
                    flex-direction: column;
                }
                
                .stat-number {
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: var(--text-primary, #1e293b);
                }
                
                .stat-label {
                    font-size: 0.85rem;
                    color: var(--text-secondary, #64748b);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                /* Month Tabs */
                .month-tabs-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                
                .month-tabs {
                    display: flex;
                    background: var(--bg-card, white);
                    border-radius: 12px;
                    padding: 4px;
                    border: 1px solid var(--border-color, #e2e8f0);
                }
                
                .month-tab {
                    padding: 0.75rem 1.5rem;
                    border: none;
                    background: transparent;
                    color: var(--text-secondary, #64748b);
                    font-weight: 600;
                    cursor: pointer;
                    border-radius: 8px;
                    transition: all 0.2s;
                }
                
                .month-tab.active {
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    color: white;
                }
                
                .month-tab:not(.active):hover {
                    background: var(--bg-secondary, #f1f5f9);
                }
                
                .active-month-label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--text-primary, #1e293b);
                    font-weight: 600;
                    font-size: 1.1rem;
                }
                
                .active-month-label svg {
                    color: #FEA3BE;
                }
                
                /* Calendar Card */
                .calendar-card {
                    background: var(--bg-card, white);
                    border-radius: 20px;
                    padding: 1.5rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                    border: 1px solid var(--border-color, #e2e8f0);
                    margin-bottom: 1.5rem;
                }
                
                .calendar-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    padding-bottom: 1rem;
                    border-bottom: 2px solid var(--border-color, #f1f5f9);
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                
                .calendar-header h3 {
                    margin: 0;
                    font-size: 1.1rem;
                    color: var(--text-primary, #1e293b);
                }
                
                .legend {
                    display: flex;
                    gap: 1.5rem;
                }
                
                .legend-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.85rem;
                    color: var(--text-secondary, #64748b);
                }
                
                .legend-dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 4px;
                }
                
                .legend-dot.present { background: #22c55e; }
                .legend-dot.absent { background: #ef4444; }
                .legend-dot.weekend { background: #94a3b8; }
                
                /* Days Grid */
                .days-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 0.75rem;
                }
                
                .day-card {
                    position: relative;
                    padding: 0.75rem;
                    border-radius: 12px;
                    border: 2px solid;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.25rem;
                    transition: all 0.2s;
                    min-height: 80px;
                }
                
                .day-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                
                .day-card.today {
                    box-shadow: 0 4px 12px rgba(254, 163, 190, 0.3);
                    border-color: #FEA3BE !important;
                }
                
                .day-number {
                    font-size: 1.25rem;
                    font-weight: 700;
                }
                
                .day-name {
                    font-size: 0.75rem;
                    font-weight: 500;
                    text-transform: uppercase;
                }
                
                .day-status {
                    margin-top: 0.25rem;
                }
                
                .today-badge {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    color: white;
                    font-size: 0.65rem;
                    font-weight: 700;
                    padding: 0.2rem 0.5rem;
                    border-radius: 20px;
                    text-transform: uppercase;
                }
                
                /* Summary Card */
                .summary-card {
                    background: var(--bg-card, white);
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                    border: 1px solid var(--border-color, #e2e8f0);
                }
                
                .summary-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1rem;
                    color: #FEA3BE;
                }
                
                .summary-header h3 {
                    margin: 0;
                    font-size: 1rem;
                    color: var(--text-primary, #1e293b);
                }
                
                .summary-content p {
                    color: var(--text-secondary, #64748b);
                    line-height: 1.6;
                    margin: 0;
                }
                
                .summary-content strong {
                    color: var(--text-primary, #1e293b);
                }
                
                .good-attendance-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-top: 1rem;
                    padding: 0.5rem 1rem;
                    background: linear-gradient(135deg, #dcfce7, #bbf7d0);
                    color: #16a34a;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 0.9rem;
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    .attendance-page {
                        padding: 1rem;
                    }
                    
                    .days-grid {
                        grid-template-columns: repeat(7, 1fr);
                        gap: 0.5rem;
                    }
                    
                    .day-card {
                        padding: 0.5rem;
                        min-height: 60px;
                    }
                    
                    .day-number {
                        font-size: 1rem;
                    }
                    
                    .day-name {
                        font-size: 0.6rem;
                    }
                    
                    .calendar-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    
                    .legend {
                        flex-wrap: wrap;
                        gap: 1rem;
                    }
                    
                    .month-tabs-container {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                }
            `}</style>
        </div>
    );
};

export default FacultyAttendance;

import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import {
    Clock,
    Calendar,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    MapPin,
    Users,
    Grid3X3,
    List
} from 'lucide-react';

const FacultyTimetable = () => {
    const [viewMode, setViewMode] = useState('week'); // 'week' or 'day'
    const [selectedDay, setSelectedDay] = useState(new Date().getDay() || 1); // Default to today or Monday

    // Faculty teaching schedule data
    const schedule = [
        {
            time: '09:00 AM - 09:45 AM',
            period: 1,
            monday: { subject: 'Mathematics', class: '10th Grade A', room: 'Room 101' },
            tuesday: { subject: null, class: 'Free Period', room: null },
            wednesday: { subject: 'Mathematics', class: '11th Grade B', room: 'Room 203' },
            thursday: { subject: 'Mathematics', class: '10th Grade A', room: 'Room 101' },
            friday: { subject: 'Mathematics', class: '11th Grade B', room: 'Room 203' },
            saturday: { subject: 'Mathematics', class: '10th Grade A', room: 'Room 101' },
            sunday: { subject: null, class: 'Free Period', room: null }
        },
        {
            time: '10:00 AM - 10:45 AM',
            period: 2,
            monday: { subject: 'Mathematics', class: '10th Grade B', room: 'Room 102' },
            tuesday: { subject: 'Mathematics', class: '10th Grade A', room: 'Room 101' },
            wednesday: { subject: null, class: 'Free Period', room: null },
            thursday: { subject: 'Mathematics', class: '11th Grade B', room: 'Room 203' },
            friday: { subject: 'Mathematics', class: '10th Grade A', room: 'Room 101' },
            saturday: { subject: 'Mathematics', class: '11th Grade B', room: 'Room 203' },
            sunday: { subject: null, class: 'Free Period', room: null }
        },
        {
            time: '11:00 AM - 11:45 AM',
            period: 3,
            monday: { subject: null, class: 'Free Period', room: null },
            tuesday: { subject: 'Mathematics', class: '11th Grade B', room: 'Room 203' },
            wednesday: { subject: 'Mathematics', class: '10th Grade A', room: 'Room 101' },
            thursday: { subject: null, class: 'Free Period', room: null },
            friday: { subject: 'Mathematics', class: '10th Grade B', room: 'Room 102' },
            saturday: { subject: 'Mathematics', class: '10th Grade A', room: 'Room 101' },
            sunday: { subject: null, class: 'Free Period', room: null }
        },
        {
            time: '12:00 PM - 12:45 PM',
            period: 4,
            monday: { subject: 'Mathematics', class: '11th Grade B', room: 'Room 203' },
            tuesday: { subject: 'Mathematics', class: '10th Grade B', room: 'Room 102' },
            wednesday: { subject: 'Mathematics', class: '10th Grade B', room: 'Room 102' },
            thursday: { subject: 'Mathematics', class: '10th Grade A', room: 'Room 101' },
            friday: { subject: null, class: 'Free Period', room: null },
            saturday: { subject: null, class: 'Free Period', room: null },
            sunday: { subject: null, class: 'Free Period', room: null }
        },
        {
            time: '02:00 PM - 02:45 PM',
            period: 5,
            monday: { subject: 'Mathematics', class: '10th Grade A', room: 'Room 101' },
            tuesday: { subject: null, class: 'Free Period', room: null },
            wednesday: { subject: null, class: 'Free Period', room: null },
            thursday: { subject: 'Mathematics', class: '10th Grade B', room: 'Room 102' },
            friday: { subject: 'Mathematics', class: '11th Grade A', room: 'Room 201' },
            saturday: { subject: null, class: 'Free Period', room: null },
            sunday: { subject: null, class: 'Free Period', room: null }
        },
        {
            time: '03:00 PM - 03:45 PM',
            period: 6,
            monday: { subject: null, class: 'Free Period', room: null },
            tuesday: { subject: 'Mathematics', class: '11th Grade A', room: 'Room 201' },
            wednesday: { subject: 'Mathematics', class: '11th Grade A', room: 'Room 201' },
            thursday: { subject: null, class: 'Free Period', room: null },
            friday: { subject: 'Mathematics', class: '10th Grade B', room: 'Room 102' },
            saturday: { subject: null, class: 'Free Period', room: null },
            sunday: { subject: null, class: 'Free Period', room: null }
        },
    ];

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayMap = { 1: 'monday', 2: 'tuesday', 3: 'wednesday', 4: 'thursday', 5: 'friday', 6: 'saturday', 0: 'sunday' };

    const getCurrentDayName = () => dayNames[selectedDay - 1] || dayNames[6];
    const getCurrentDayKey = () => dayMap[selectedDay] || 'sunday';

    const navigateDay = (direction) => {
        if (direction === 'prev' && selectedDay > 0) {
            setSelectedDay(selectedDay === 1 ? 0 : selectedDay - 1);
        } else if (direction === 'next' && selectedDay < 6) {
            setSelectedDay(selectedDay === 0 ? 1 : selectedDay + 1);
        }
    };

    // Calculate stats
    const getTotalClasses = () => {
        let count = 0;
        schedule.forEach(period => {
            days.forEach(day => {
                if (period[day].subject) count++;
            });
        });
        return count;
    };

    const getTodayClasses = () => {
        const today = getCurrentDayKey();
        return schedule.filter(period => period[today]?.subject).length;
    };

    return (
        <div className="admin-layout">
            <Sidebar role="faculty" />
            <div className="admin-main">
                <Navbar />
                <div className="timetable-page">
                    {/* Header */}
                    <div className="timetable-header">
                        <div className="header-content">
                            <div className="header-icon">
                                <Calendar size={28} />
                            </div>
                            <div>
                                <h1>My Teaching Schedule</h1>
                                <p>View your weekly and daily class schedule</p>
                            </div>
                        </div>

                        {/* View Toggle */}
                        <div className="view-toggle">
                            <button
                                className={`toggle-btn ${viewMode === 'week' ? 'active' : ''}`}
                                onClick={() => setViewMode('week')}
                            >
                                <Grid3X3 size={18} />
                                Week View
                            </button>
                            <button
                                className={`toggle-btn ${viewMode === 'day' ? 'active' : ''}`}
                                onClick={() => setViewMode('day')}
                            >
                                <List size={18} />
                                Day View
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="stats-row">
                        <div className="stat-card">
                            <div className="stat-icon classes">
                                <BookOpen size={22} />
                            </div>
                            <div className="stat-info">
                                <p className="stat-label">Total Weekly Classes</p>
                                <h3 className="stat-value">{getTotalClasses()}</h3>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon today">
                                <Calendar size={22} />
                            </div>
                            <div className="stat-info">
                                <p className="stat-label">Classes Today ({getCurrentDayName()})</p>
                                <h3 className="stat-value">{getTodayClasses()}</h3>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon rooms">
                                <MapPin size={22} />
                            </div>
                            <div className="stat-info">
                                <p className="stat-label">Assigned Rooms</p>
                                <h3 className="stat-value">4</h3>
                            </div>
                        </div>
                    </div>

                    {/* Week View */}
                    {viewMode === 'week' && (
                        <div className="week-view-card">
                            <h3>Weekly Timetable</h3>
                            <div className="table-wrapper">
                                <table className="timetable-table">
                                    <thead>
                                        <tr>
                                            <th className="time-header">
                                                <Clock size={16} />
                                                <span>Period</span>
                                            </th>
                                            {dayNames.map((day, idx) => (
                                                <th key={day} className={selectedDay === idx + 1 ? 'today-header' : ''}>
                                                    {day}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {schedule.map((period, idx) => (
                                            <tr key={idx}>
                                                <td className="time-cell">
                                                    <span className="period-num">P{period.period}</span>
                                                    <span className="period-time">{period.time}</span>
                                                </td>
                                                {days.map((day, dayIdx) => (
                                                    <td key={day} className={selectedDay === dayIdx + 1 ? 'today-cell' : ''}>
                                                        {period[day].subject ? (
                                                            <div className="class-cell has-class">
                                                                <span className="subject-name">{period[day].subject}</span>
                                                                <span className="class-name">{period[day].class}</span>
                                                                <span className="room-name">
                                                                    <MapPin size={12} />
                                                                    {period[day].room}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div className="class-cell free-period">
                                                                <span>Free</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Day View */}
                    {viewMode === 'day' && (
                        <div className="day-view-card">
                            <div className="day-header">
                                <button
                                    className="nav-btn"
                                    onClick={() => navigateDay('prev')}
                                    disabled={selectedDay === 1}
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <h3>{getCurrentDayName()}'s Schedule</h3>
                                <button
                                    className="nav-btn"
                                    onClick={() => navigateDay('next')}
                                    disabled={selectedDay === 5}
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>

                            <div className="day-selector">
                                {dayNames.map((day, idx) => (
                                    <button
                                        key={day}
                                        className={`day-btn ${selectedDay === idx + 1 ? 'active' : ''}`}
                                        onClick={() => setSelectedDay(idx + 1)}
                                    >
                                        {day.substring(0, 3)}
                                    </button>
                                ))}
                            </div>

                            <div className="period-list">
                                {schedule.map((period, idx) => {
                                    const dayKey = getCurrentDayKey();
                                    const classInfo = period[dayKey];

                                    return (
                                        <div
                                            key={idx}
                                            className={`period-card ${classInfo.subject ? 'has-class' : 'free'}`}
                                        >
                                            <div className="period-time-section">
                                                <span className="period-badge">P{period.period}</span>
                                                <span className="period-timing">{period.time}</span>
                                            </div>

                                            <div className="period-content">
                                                {classInfo.subject ? (
                                                    <>
                                                        <h4>{classInfo.subject}</h4>
                                                        <div className="period-details">
                                                            <span className="detail-item">
                                                                <Users size={14} />
                                                                {classInfo.class}
                                                            </span>
                                                            <span className="detail-item">
                                                                <MapPin size={14} />
                                                                {classInfo.room}
                                                            </span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <h4 className="free-text">Free Period</h4>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .timetable-page {
                    padding: 2rem;
                    background: #f8fafc;
                    min-height: 100vh;
                }

                .timetable-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .header-content {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .header-icon {
                    width: 56px;
                    height: 56px;
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }

                .timetable-header h1 {
                    margin: 0 0 0.25rem 0;
                    font-size: 1.75rem;
                    color: #1e293b;
                }

                .timetable-header p {
                    margin: 0;
                    color: #64748b;
                }

                .view-toggle {
                    display: flex;
                    gap: 0.5rem;
                    background: white;
                    padding: 0.5rem;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                .toggle-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.25rem;
                    border: none;
                    border-radius: 8px;
                    background: transparent;
                    color: #64748b;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .toggle-btn:hover {
                    background: #f1f5f9;
                }

                .toggle-btn.active {
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    color: white;
                }

                /* Stats Row */
                .stats-row {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .stat-card {
                    background: white;
                    border-radius: 16px;
                    padding: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                .stat-icon {
                    width: 50px;
                    height: 50px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }

                .stat-icon.classes { background: linear-gradient(135deg, #FEA3BE, #FBA2AB); }
                .stat-icon.today { background: linear-gradient(135deg, #22c55e, #16a34a); }
                .stat-icon.rooms { background: linear-gradient(135deg, #0ea5e9, #0284c7); }

                .stat-label {
                    margin: 0 0 0.25rem 0;
                    font-size: 0.85rem;
                    color: #64748b;
                }

                .stat-value {
                    margin: 0;
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #1e293b;
                }

                /* Week View */
                .week-view-card {
                    background: white;
                    border-radius: 20px;
                    padding: 1.5rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                .week-view-card h3 {
                    margin: 0 0 1.5rem 0;
                    font-size: 1.1rem;
                    color: #1e293b;
                }

                .table-wrapper {
                    overflow-x: auto;
                }

                .timetable-table {
                    width: 100%;
                    min-width: 900px;
                    border-collapse: collapse;
                }

                .timetable-table th {
                    padding: 1rem;
                    text-align: center;
                    font-weight: 600;
                    color: #64748b;
                    border-bottom: 2px solid #f1f5f9;
                    text-transform: uppercase;
                    font-size: 0.85rem;
                    letter-spacing: 0.5px;
                }

                .timetable-table th.time-header {
                    text-align: left;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .timetable-table th.today-header {
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    color: white;
                    border-radius: 8px 8px 0 0;
                }

                .timetable-table td {
                    padding: 0.75rem;
                    border-bottom: 1px solid #f1f5f9;
                    vertical-align: top;
                }

                .timetable-table td.today-cell {
                    background: #fef7f9;
                }

                .time-cell {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .period-num {
                    font-weight: 700;
                    color: #1e293b;
                    font-size: 0.9rem;
                }

                .period-time {
                    font-size: 0.8rem;
                    color: #94a3b8;
                }

                .class-cell {
                    padding: 0.75rem;
                    border-radius: 10px;
                    text-align: center;
                    min-height: 70px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    gap: 0.25rem;
                }

                .class-cell.has-class {
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    color: white;
                }

                .class-cell.free-period {
                    background: #f8fafc;
                    color: #94a3b8;
                    font-style: italic;
                }

                .subject-name {
                    font-weight: 700;
                    font-size: 0.9rem;
                }

                .class-name {
                    font-size: 0.8rem;
                    opacity: 0.9;
                }

                .room-name {
                    font-size: 0.75rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.25rem;
                    margin-top: 0.25rem;
                    opacity: 0.85;
                }

                /* Day View */
                .day-view-card {
                    background: white;
                    border-radius: 20px;
                    padding: 1.5rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                .day-header {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 2rem;
                    margin-bottom: 1.5rem;
                }

                .day-header h3 {
                    margin: 0;
                    font-size: 1.25rem;
                    color: #1e293b;
                }

                .nav-btn {
                    width: 40px;
                    height: 40px;
                    border: 2px solid #e2e8f0;
                    border-radius: 10px;
                    background: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #64748b;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .nav-btn:hover:not(:disabled) {
                    border-color: #FEA3BE;
                    color: #FEA3BE;
                }

                .nav-btn:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }

                .day-selector {
                    display: flex;
                    justify-content: center;
                    gap: 0.5rem;
                    margin-bottom: 2rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 2px solid #f1f5f9;
                }

                .day-btn {
                    padding: 0.75rem 1.5rem;
                    border: 2px solid #e2e8f0;
                    border-radius: 10px;
                    background: white;
                    color: #64748b;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .day-btn:hover {
                    border-color: #FEA3BE;
                    color: #FEA3BE;
                }

                .day-btn.active {
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    border-color: transparent;
                    color: white;
                }

                .period-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .period-card {
                    display: flex;
                    gap: 1.5rem;
                    padding: 1.25rem;
                    border-radius: 14px;
                    transition: all 0.2s;
                }

                .period-card.has-class {
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    color: white;
                }

                .period-card.free {
                    background: #f8fafc;
                    border: 2px dashed #e2e8f0;
                }

                .period-time-section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    min-width: 100px;
                }

                .period-badge {
                    padding: 0.375rem 0.75rem;
                    border-radius: 8px;
                    font-weight: 700;
                    font-size: 0.9rem;
                }

                .period-card.has-class .period-badge {
                    background: rgba(255,255,255,0.2);
                }

                .period-card.free .period-badge {
                    background: #e2e8f0;
                    color: #64748b;
                }

                .period-timing {
                    font-size: 0.8rem;
                    text-align: center;
                }

                .period-card.free .period-timing {
                    color: #94a3b8;
                }

                .period-content {
                    flex: 1;
                }

                .period-content h4 {
                    margin: 0 0 0.5rem 0;
                    font-size: 1.1rem;
                }

                .period-content .free-text {
                    color: #94a3b8;
                    font-style: italic;
                }

                .period-details {
                    display: flex;
                    gap: 1.5rem;
                    flex-wrap: wrap;
                }

                .detail-item {
                    display: flex;
                    align-items: center;
                    gap: 0.375rem;
                    font-size: 0.9rem;
                    opacity: 0.9;
                }

                @media (max-width: 768px) {
                    .timetable-page {
                        padding: 1rem;
                        max-width: 100vw;
                        overflow-x: hidden;
                    }

                    .timetable-header {
                        flex-direction: column;
                        align-items: flex-start;
                        max-width: 100%;
                    }

                    .timetable-header h1 {
                        font-size: 1.5rem;
                        word-wrap: break-word;
                    }

                    .header-content {
                        max-width: 100%;
                    }

                    .stats-row {
                        grid-template-columns: 1fr;
                        max-width: 100%;
                    }

                    .stat-card {
                        max-width: 100%;
                    }

                    .day-selector {
                        flex-wrap: wrap;
                        max-width: 100%;
                    }

                    .day-btn {
                        padding: 0.5rem 1rem;
                        font-size: 0.85rem;
                    }

                    .week-view-card,
                    .day-view-card {
                        max-width: 100%;
                        overflow: hidden;
                    }

                    .period-card {
                        flex-direction: column;
                        gap: 1rem;
                        max-width: 100%;
                    }

                    .period-time-section {
                        flex-direction: row;
                        justify-content: flex-start;
                    }

                    .period-content h4 {
                        font-size: 1rem;
                        word-wrap: break-word;
                    }

                    .table-wrapper {
                        max-width: 100%;
                        overflow-x: auto;
                    }
                }
            `}</style>
        </div>
    );
};

export default FacultyTimetable;

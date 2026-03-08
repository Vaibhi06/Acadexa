import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import { Calendar, Download, Clock, User, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

const StudentTimetable = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const [selectedDay, setSelectedDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);

    // Comprehensive timetable data with faculty info
    const timetableData = {
        Monday: [
            { period: 1, time: '09:00 - 09:45', subject: 'Mathematics', faculty: 'Mr. Rajesh Kumar', room: 'Room 201' },
            { period: 2, time: '09:45 - 10:30', subject: 'Mathematics', faculty: 'Mr. Rajesh Kumar', room: 'Room 201' },
            { period: 3, time: '10:45 - 11:30', subject: 'Physics', faculty: 'Dr. Priya Sharma', room: 'Lab 1' },
            { period: 4, time: '11:30 - 12:15', subject: 'Physics', faculty: 'Dr. Priya Sharma', room: 'Lab 1' },
            { period: 5, time: '01:00 - 01:45', subject: 'English', faculty: 'Mrs. Anjali Verma', room: 'Room 105' },
            { period: 6, time: '01:45 - 02:30', subject: 'Chemistry', faculty: 'Mr. Suresh Patel', room: 'Lab 2' },
            { period: 7, time: '02:45 - 03:30', subject: 'Computer Science', faculty: 'Ms. Neha Gupta', room: 'Computer Lab' },
        ],
        Tuesday: [
            { period: 1, time: '09:00 - 09:45', subject: 'Physics', faculty: 'Dr. Priya Sharma', room: 'Lab 1' },
            { period: 2, time: '09:45 - 10:30', subject: 'Chemistry', faculty: 'Mr. Suresh Patel', room: 'Lab 2' },
            { period: 3, time: '10:45 - 11:30', subject: 'Mathematics', faculty: 'Mr. Rajesh Kumar', room: 'Room 201' },
            { period: 4, time: '11:30 - 12:15', subject: 'English', faculty: 'Mrs. Anjali Verma', room: 'Room 105' },
            { period: 5, time: '01:00 - 01:45', subject: 'Biology', faculty: 'Dr. Kavita Reddy', room: 'Room 302' },
            { period: 6, time: '01:45 - 02:30', subject: 'Biology', faculty: 'Dr. Kavita Reddy', room: 'Room 302' },
            { period: 7, time: '02:45 - 03:30', subject: 'Physical Education', faculty: 'Mr. Vikram Singh', room: 'Ground' },
        ],
        Wednesday: [
            { period: 1, time: '09:00 - 09:45', subject: 'English', faculty: 'Mrs. Anjali Verma', room: 'Room 105' },
            { period: 2, time: '09:45 - 10:30', subject: 'English', faculty: 'Mrs. Anjali Verma', room: 'Room 105' },
            { period: 3, time: '10:45 - 11:30', subject: 'Chemistry', faculty: 'Mr. Suresh Patel', room: 'Lab 2' },
            { period: 4, time: '11:30 - 12:15', subject: 'Chemistry', faculty: 'Mr. Suresh Patel', room: 'Lab 2' },
            { period: 5, time: '01:00 - 01:45', subject: 'Mathematics', faculty: 'Mr. Rajesh Kumar', room: 'Room 201' },
            { period: 6, time: '01:45 - 02:30', subject: 'Physics', faculty: 'Dr. Priya Sharma', room: 'Lab 1' },
            { period: 7, time: '02:45 - 03:30', subject: 'Art', faculty: 'Ms. Meera Joshi', room: 'Art Room' },
        ],
        Thursday: [
            { period: 1, time: '09:00 - 09:45', subject: 'Biology', faculty: 'Dr. Kavita Reddy', room: 'Room 302' },
            { period: 2, time: '09:45 - 10:30', subject: 'Physics', faculty: 'Dr. Priya Sharma', room: 'Lab 1' },
            { period: 3, time: '10:45 - 11:30', subject: 'Physics', faculty: 'Dr. Priya Sharma', room: 'Lab 1' },
            { period: 4, time: '11:30 - 12:15', subject: 'Mathematics', faculty: 'Mr. Rajesh Kumar', room: 'Room 201' },
            { period: 5, time: '01:00 - 01:45', subject: 'Computer Science', faculty: 'Ms. Neha Gupta', room: 'Computer Lab' },
            { period: 6, time: '01:45 - 02:30', subject: 'Computer Science', faculty: 'Ms. Neha Gupta', room: 'Computer Lab' },
            { period: 7, time: '02:45 - 03:30', subject: 'English', faculty: 'Mrs. Anjali Verma', room: 'Room 105' },
        ],
        Friday: [
            { period: 1, time: '09:00 - 09:45', subject: 'Chemistry', faculty: 'Mr. Suresh Patel', room: 'Lab 2' },
            { period: 2, time: '09:45 - 10:30', subject: 'Mathematics', faculty: 'Mr. Rajesh Kumar', room: 'Room 201' },
            { period: 3, time: '10:45 - 11:30', subject: 'Mathematics', faculty: 'Mr. Rajesh Kumar', room: 'Room 201' },
            { period: 4, time: '11:30 - 12:15', subject: 'Biology', faculty: 'Dr. Kavita Reddy', room: 'Room 302' },
            { period: 5, time: '01:00 - 01:45', subject: 'English', faculty: 'Mrs. Anjali Verma', room: 'Room 105' },
            { period: 6, time: '01:45 - 02:30', subject: 'Physical Education', faculty: 'Mr. Vikram Singh', room: 'Ground' },
            { period: 7, time: '02:45 - 03:30', subject: 'Library', faculty: 'Ms. Sunita Rao', room: 'Library' },
        ],
        Saturday: [
            { period: 1, time: '09:00 - 09:45', subject: 'Mathematics', faculty: 'Mr. Rajesh Kumar', room: 'Room 201' },
            { period: 2, time: '09:45 - 10:30', subject: 'Physics', faculty: 'Dr. Priya Sharma', room: 'Lab 1' },
            { period: 3, time: '10:45 - 11:30', subject: 'Chemistry', faculty: 'Mr. Suresh Patel', room: 'Lab 2' },
            { period: 4, time: '11:30 - 12:15', subject: 'English', faculty: 'Mrs. Anjali Verma', room: 'Room 105' },
        ],
        Sunday: [
            { period: 1, time: '09:00 - 12:00', subject: 'Holiday', faculty: 'No Classes', room: '-' },
        ],
    };

    const getSubjectColor = (subject) => {
        const colors = {
            'Mathematics': '#FF6B6B',
            'Physics': '#4ECDC4',
            'Chemistry': '#45B7D1',
            'English': '#96CEB4',
            'Biology': '#FFEAA7',
            'Computer Science': '#DDA0DD',
            'Physical Education': '#98D8C8',
            'Art': '#F7DC6F',
            'Library': '#BB8FCE',
        };
        return colors[subject] || '#FEA3BE';
    };

    const currentDaySchedule = timetableData[days[selectedDay]];

    return (
        <div className="admin-layout">
            <Sidebar role="student" />
            <div className="admin-main">
                <Navbar />
                <div className="admin-content timetable-page">
                    {/* Page Header */}
                    <div className="page-header-section">
                        <div className="header-info">
                            <h1>📅 My Timetable</h1>
                            <p>10th Grade A - Weekly Schedule</p>
                        </div>
                        <button className="download-btn">
                            <Download size={18} />
                            Download PDF
                        </button>
                    </div>

                    {/* Day Selector */}
                    <div className="day-selector">
                        <button
                            className="nav-arrow"
                            onClick={() => setSelectedDay(prev => prev === 0 ? days.length - 1 : prev - 1)}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div className="days-container">
                            {days.map((day, idx) => (
                                <button
                                    key={day}
                                    className={`day-btn ${selectedDay === idx ? 'active' : ''}`}
                                    onClick={() => setSelectedDay(idx)}
                                >
                                    <span className="day-short">{day.slice(0, 3)}</span>
                                    <span className="day-full">{day}</span>
                                </button>
                            ))}
                        </div>
                        <button
                            className="nav-arrow"
                            onClick={() => setSelectedDay(prev => prev === days.length - 1 ? 0 : prev + 1)}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {/* Schedule Cards */}
                    <div className="schedule-container">
                        <h2 className="schedule-title">
                            <Calendar size={20} />
                            {days[selectedDay]}'s Schedule
                        </h2>
                        <div className="periods-grid">
                            {currentDaySchedule.map((period, idx) => (
                                <div
                                    key={idx}
                                    className="period-card"
                                    style={{ '--accent-color': getSubjectColor(period.subject) }}
                                >
                                    <div className="period-header">
                                        <span className="period-number">Period {period.period}</span>
                                        <span className="period-time">
                                            <Clock size={14} />
                                            {period.time}
                                        </span>
                                    </div>
                                    <div className="period-body">
                                        <div className="subject-info">
                                            <div className="subject-icon" style={{ background: getSubjectColor(period.subject) }}>
                                                <BookOpen size={20} />
                                            </div>
                                            <div className="subject-details">
                                                <h3>{period.subject}</h3>
                                                <p className="room-info">{period.room}</p>
                                            </div>
                                        </div>
                                        <div className="faculty-info">
                                            <User size={16} />
                                            <span>{period.faculty}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Weekly Overview Table */}
                    <div className="weekly-overview">
                        <h2 className="section-title">📊 Weekly Overview</h2>
                        <div className="table-wrapper">
                            <table className="timetable-table">
                                <thead>
                                    <tr>
                                        <th>Period</th>
                                        <th>Time</th>
                                        {days.map(day => (
                                            <th key={day}>{day.slice(0, 3)}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[1, 2, 3, 4, 5, 6, 7].map(periodNum => (
                                        <tr key={periodNum}>
                                            <td className="period-cell">{periodNum}</td>
                                            <td className="time-cell">
                                                {timetableData.Monday[periodNum - 1]?.time || '-'}
                                            </td>
                                            {days.map(day => {
                                                const period = timetableData[day][periodNum - 1];
                                                return (
                                                    <td key={day} className="subject-cell">
                                                        {period ? (
                                                            <div
                                                                className="subject-chip"
                                                                style={{ background: getSubjectColor(period.subject) }}
                                                            >
                                                                {period.subject.slice(0, 4)}
                                                            </div>
                                                        ) : '-'}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .timetable-page {
                    background: #f8fafc;
                    padding: 2rem;
                }

                .page-header-section {
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

                /* Day Selector */
                .day-selector {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 2rem;
                    background: white;
                    padding: 1rem;
                    border-radius: 16px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                .nav-arrow {
                    width: 40px;
                    height: 40px;
                    border: none;
                    background: #f1f5f9;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: #64748b;
                }

                .nav-arrow:hover {
                    background: #FEA3BE;
                    color: white;
                }

                .days-container {
                    display: flex;
                    gap: 0.5rem;
                    flex: 1;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .day-btn {
                    padding: 0.75rem 1.5rem;
                    border: 2px solid transparent;
                    background: #f8fafc;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-weight: 600;
                    color: #64748b;
                }

                .day-btn:hover {
                    border-color: #FEA3BE;
                    color: #FEA3BE;
                }

                .day-btn.active {
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    color: white;
                    border-color: transparent;
                }

                .day-full { display: inline; }
                .day-short { display: none; }

                @media (max-width: 768px) {
                    .day-full { display: none; }
                    .day-short { display: inline; }
                    .day-btn { padding: 0.75rem 1rem; }
                }

                /* Schedule Cards */
                .schedule-container {
                    margin-bottom: 2rem;
                }

                .schedule-title {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #1e293b;
                    margin: 0 0 1.5rem 0;
                }

                .periods-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 1rem;
                }

                .period-card {
                    background: white;
                    border-radius: 16px;
                    padding: 1.25rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                    border-left: 4px solid var(--accent-color);
                    transition: all 0.2s;
                }

                .period-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
                }

                .period-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                    padding-bottom: 0.75rem;
                    border-bottom: 1px solid #f1f5f9;
                }

                .period-number {
                    font-weight: 700;
                    color: #1e293b;
                    font-size: 0.9rem;
                }

                .period-time {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    color: #64748b;
                    font-size: 0.875rem;
                }

                .period-body {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .subject-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .subject-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    flex-shrink: 0;
                }

                .subject-details h3 {
                    margin: 0 0 0.25rem 0;
                    font-size: 1.1rem;
                    color: #1e293b;
                }

                .room-info {
                    margin: 0;
                    color: #64748b;
                    font-size: 0.875rem;
                }

                .faculty-info {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #64748b;
                    font-size: 0.9rem;
                    padding: 0.75rem;
                    background: #f8fafc;
                    border-radius: 10px;
                }

                /* Weekly Overview */
                .weekly-overview {
                    background: white;
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                .section-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #1e293b;
                    margin: 0 0 1.5rem 0;
                }

                .table-wrapper {
                    overflow-x: auto;
                }

                .timetable-table {
                    width: 100%;
                    min-width: 700px;
                    border-collapse: collapse;
                }

                .timetable-table th,
                .timetable-table td {
                    padding: 1rem;
                    text-align: center;
                    border-bottom: 1px solid #f1f5f9;
                }

                .timetable-table th {
                    background: #f8fafc;
                    font-weight: 600;
                    color: #64748b;
                    font-size: 0.875rem;
                }

                .period-cell {
                    font-weight: 700;
                    color: #1e293b;
                }

                .time-cell {
                    color: #64748b;
                    font-size: 0.875rem;
                    white-space: nowrap;
                }

                .subject-chip {
                    display: inline-block;
                    padding: 0.5rem 0.75rem;
                    border-radius: 8px;
                    color: white;
                    font-weight: 600;
                    font-size: 0.8rem;
                }

                @media (max-width: 768px) {
                    .timetable-page {
                        padding: 1rem;
                        max-width: 100vw;
                        overflow-x: hidden;
                    }

                    .page-header-section {
                        max-width: 100%;
                    }

                    .header-info h1 {
                        font-size: 1.5rem;
                        word-wrap: break-word;
                    }

                    .day-selector {
                        max-width: 100%;
                    }

                    .schedule-container,
                    .weekly-overview {
                        max-width: 100%;
                        overflow: hidden;
                    }

                    .periods-grid {
                        grid-template-columns: 1fr;
                        max-width: 100%;
                    }

                    .period-card {
                        max-width: 100%;
                        overflow: hidden;
                    }

                    .subject-details h3 {
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

export default StudentTimetable;

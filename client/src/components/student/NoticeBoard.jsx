import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import {
    Bell,
    Calendar,
    AlertTriangle,
    Info,
    BookOpen,
    Users,
    ArrowLeft,
    Clock,
    ChevronRight
} from 'lucide-react';

const NoticeBoard = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Notices data
    const notices = [
        {
            id: 1,
            title: 'Mid-Term Examination Schedule Released',
            content: 'The mid-term examination schedule for all classes has been released. Examinations will commence from January 15, 2026. Students are advised to check the timetable and prepare accordingly.',
            category: 'academic',
            priority: 'high',
            date: 'January 5, 2026',
            time: '10:30 AM'
        },
        {
            id: 2,
            title: 'Annual Sports Day Announcement',
            content: 'The Annual Sports Day will be held on February 10, 2026. All students interested in participating should register with their class teachers by January 20, 2026.',
            category: 'event',
            priority: 'medium',
            date: 'January 4, 2026',
            time: '02:15 PM'
        },
        {
            id: 3,
            title: 'Fee Payment Reminder',
            content: 'This is a reminder that the fourth installment of fees is due on January 15, 2026. Please ensure timely payment to avoid late fees.',
            category: 'administrative',
            priority: 'high',
            date: 'January 3, 2026',
            time: '09:00 AM'
        },
        {
            id: 4,
            title: 'Science Project Submission Deadline Extended',
            content: 'The submission deadline for Science projects has been extended to January 25, 2026. Students can submit their projects to the respective subject teachers.',
            category: 'academic',
            priority: 'medium',
            date: 'January 2, 2026',
            time: '11:45 AM'
        },
        {
            id: 5,
            title: 'Parent-Teacher Meeting Scheduled',
            content: 'A Parent-Teacher Meeting has been scheduled for January 28, 2026, from 10:00 AM to 1:00 PM. Parents are requested to attend for discussing student progress.',
            category: 'administrative',
            priority: 'medium',
            date: 'January 1, 2026',
            time: '04:00 PM'
        },
        {
            id: 6,
            title: 'Library Book Return Notice',
            content: 'All library books issued before December 2025 must be returned by January 10, 2026. Late returns will incur a fine.',
            category: 'administrative',
            priority: 'low',
            date: 'December 30, 2025',
            time: '01:30 PM'
        },
        {
            id: 7,
            title: 'New Computer Lab Inauguration',
            content: 'The new state-of-the-art computer lab will be inaugurated on January 8, 2026. All students are invited to attend the inaugural ceremony.',
            category: 'event',
            priority: 'low',
            date: 'December 28, 2025',
            time: '03:00 PM'
        },
    ];

    const categories = [
        { id: 'all', label: 'All Notices', icon: Bell },
        { id: 'academic', label: 'Academic', icon: BookOpen },
        { id: 'administrative', label: 'Administrative', icon: Info },
        { id: 'event', label: 'Events', icon: Users },
    ];

    const getCategoryColor = (category) => {
        switch (category) {
            case 'academic': return '#6366f1';
            case 'administrative': return '#f59e0b';
            case 'event': return '#22c55e';
            default: return '#64748b';
        }
    };

    const getPriorityIcon = (priority) => {
        if (priority === 'high') return <AlertTriangle size={16} />;
        return null;
    };

    const filteredNotices = selectedCategory === 'all'
        ? notices
        : notices.filter(n => n.category === selectedCategory);

    return (
        <div className="admin-layout">
            <Sidebar role="student" />
            <div className="admin-main">
                <Navbar />
                <div className="notice-page">
                    {/* Back Button */}
                    <button className="back-btn" onClick={() => navigate('/student/dashboard')}>
                        <ArrowLeft size={18} />
                        Back to Dashboard
                    </button>

                    {/* Page Header */}
                    <div className="page-header">
                        <div className="header-info">
                            <h1>📢 Notice Board</h1>
                            <p>Stay updated with important announcements</p>
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="category-filter">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat.id)}
                            >
                                <cat.icon size={18} />
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Notices List */}
                    <div className="notices-list">
                        {filteredNotices.map((notice) => (
                            <div key={notice.id} className={`notice-card ${notice.priority}`}>
                                <div className="notice-header">
                                    <div className="notice-category" style={{ background: `${getCategoryColor(notice.category)}15`, color: getCategoryColor(notice.category) }}>
                                        {notice.category.charAt(0).toUpperCase() + notice.category.slice(1)}
                                    </div>
                                    {notice.priority === 'high' && (
                                        <div className="priority-badge">
                                            <AlertTriangle size={14} />
                                            Important
                                        </div>
                                    )}
                                </div>
                                <h3 className="notice-title">{notice.title}</h3>
                                <p className="notice-content">{notice.content}</p>
                                <div className="notice-footer">
                                    <div className="notice-date">
                                        <Calendar size={14} />
                                        <span>{notice.date}</span>
                                    </div>
                                    <div className="notice-time">
                                        <Clock size={14} />
                                        <span>{notice.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .notice-page {
                    padding: 2rem;
                    background: #f8fafc;
                    min-height: 100vh;
                }

                .back-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.625rem 1rem;
                    background: white;
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    color: #64748b;
                    cursor: pointer;
                    margin-bottom: 1.5rem;
                    transition: all 0.2s;
                }

                .back-btn:hover {
                    color: #FEA3BE;
                    background: #fef7f9;
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

                /* Category Filter */
                .category-filter {
                    display: flex;
                    gap: 0.75rem;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                }

                .category-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.25rem;
                    background: white;
                    border: 2px solid transparent;
                    border-radius: 12px;
                    font-weight: 600;
                    color: #64748b;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .category-btn:hover {
                    border-color: #FEA3BE;
                    color: #FEA3BE;
                }

                .category-btn.active {
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    color: white;
                    border-color: transparent;
                }

                /* Notices List */
                .notices-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .notice-card {
                    background: white;
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                    border-left: 4px solid #e2e8f0;
                    transition: all 0.2s;
                }

                .notice-card:hover {
                    transform: translateX(4px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                }

                .notice-card.high {
                    border-left-color: #ef4444;
                    background: linear-gradient(to right, #fef2f2, white);
                }

                .notice-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 0.75rem;
                }

                .notice-category {
                    padding: 0.25rem 0.75rem;
                    border-radius: 6px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .priority-badge {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    padding: 0.25rem 0.75rem;
                    background: #fef2f2;
                    color: #ef4444;
                    border-radius: 6px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .notice-title {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0 0 0.75rem 0;
                }

                .notice-content {
                    font-size: 0.95rem;
                    color: #64748b;
                    line-height: 1.6;
                    margin: 0 0 1rem 0;
                }

                .notice-footer {
                    display: flex;
                    gap: 1.5rem;
                    padding-top: 1rem;
                    border-top: 1px solid #f1f5f9;
                }

                .notice-date,
                .notice-time {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.85rem;
                    color: #94a3b8;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .notice-page {
                        padding: 1rem;
                    }

                    .category-filter {
                        overflow-x: auto;
                        flex-wrap: nowrap;
                        padding-bottom: 0.5rem;
                    }

                    .category-btn {
                        white-space: nowrap;
                    }
                }
            `}</style>
        </div>
    );
};

export default NoticeBoard;

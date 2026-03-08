import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Sidebar from '../shared/Sidebar';
import { useClasses } from '../../contexts/ClassesContext'; // Assuming this exists or similar
import { Megaphone, Users, GraduationCap, Send, CheckCircle2 } from 'lucide-react';

const NoticeBoard = () => {
    const { classes } = useClasses(); // Context to get classes list
    const [recipientType, setRecipientType] = useState('student'); // 'student' or 'faculty'
    const [selectedClass, setSelectedClass] = useState('');
    const [noticeText, setNoticeText] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const [notices, setNotices] = useState([]);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const { data } = await api.get('/notices');
                setNotices(data);
            } catch (error) {
                console.error('Error fetching notices:', error);
            }
        };
        fetchNotices();
    }, []);

    const handlePublish = async (e) => {
        e.preventDefault();
        if (!noticeText.trim()) return;
        if (recipientType === 'student' && !selectedClass) {
            alert('Please select a class');
            return;
        }

        try {
            const newNotice = {
                message: noticeText,
                recipientType: recipientType,
                targetClass: recipientType === 'student' ? selectedClass : null,
                postedBy: 'Admin'
            };

            const { data } = await api.post('/notices', newNotice);
            setNotices([data, ...notices]);
            setShowSuccess(true);
            setNoticeText('');
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error('Error publishing notice:', error);
            alert('Failed to publish notice');
        }
    };

    return (
        <div className="new-admin-layout">
            <Sidebar role="admin" />
            <div className="new-admin-main">
                <div className="new-admin-content">
                    <div className="new-dashboard-header">
                        <h1>Notice Board</h1>
                        <p className="header-subtitle">Send important announcements to students and faculty</p>
                    </div>

                    <div className="content-grid">
                        <div className="glass-card form-section">
                            <div className="card-header">
                                <h3><Megaphone size={20} className="header-icon" /> Compose Notice</h3>
                            </div>

                            <form onSubmit={handlePublish}>
                                {/* Recipient Selection */}
                                <div className="form-group">
                                    <label>Send To</label>
                                    <div className="recipient-options">
                                        <div
                                            className={`recipient-card ${recipientType === 'student' ? 'active' : ''}`}
                                            onClick={() => setRecipientType('student')}
                                        >
                                            <div className="icon-wrapper student-icon">
                                                <Users size={24} />
                                            </div>
                                            <span>Students</span>
                                            {recipientType === 'student' && <div className="checked-indicator"><CheckCircle2 size={16} /></div>}
                                        </div>
                                        <div
                                            className={`recipient-card ${recipientType === 'faculty' ? 'active' : ''}`}
                                            onClick={() => setRecipientType('faculty')}
                                        >
                                            <div className="icon-wrapper faculty-icon">
                                                <GraduationCap size={24} />
                                            </div>
                                            <span>Faculty</span>
                                            {recipientType === 'faculty' && <div className="checked-indicator"><CheckCircle2 size={16} /></div>}
                                        </div>
                                    </div>
                                </div>

                                {/* Conditional Class Selection */}
                                {recipientType === 'student' && (
                                    <div className="form-group fade-in">
                                        <label>Select Class</label>
                                        <select
                                            className="input-field"
                                            value={selectedClass}
                                            onChange={(e) => setSelectedClass(e.target.value)}
                                            required={recipientType === 'student'}
                                        >
                                            <option value="">-- Select Class --</option>
                                            {classes.map((cls, idx) => (
                                                <option key={idx} value={cls.name || cls.id}>{cls.name || cls}</option>
                                            ))}
                                            <option value="all">All Classes</option>
                                        </select>
                                    </div>
                                )}

                                {/* Message Box */}
                                <div className="form-group">
                                    <label>Notice Message</label>
                                    <textarea
                                        className="input-field textarea-field"
                                        rows="6"
                                        placeholder="Type your announcement here..."
                                        value={noticeText}
                                        onChange={(e) => setNoticeText(e.target.value)}
                                        required
                                    ></textarea>
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn-primary">
                                        <Send size={18} />
                                        Publish Notice
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Preview / History Section (Optional, purely visual for now) */}
                        <div className="glass-card info-section">
                            <div className="card-header">
                                <h3>Recent Notices</h3>
                            </div>
                            <div className="notices-list">
                                {notices.map(notice => (
                                    <div key={notice.id} className="notice-item">
                                        <div className="notice-meta">
                                            <span className={`badge ${notice.recipientType}`}>
                                                {notice.recipientType === 'student'
                                                    ? `Student - ${notice.targetClass === 'all' ? 'All Classes' : notice.targetClass}`
                                                    : 'Faculty'}
                                            </span>
                                            <span className="date">
                                                {new Date(notice.createdAt || Date.now()).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p>{notice.message}</p>
                                    </div>
                                ))}
                                {notices.length === 0 && <p style={{ color: '#64748b', textAlign: 'center' }}>No notices yet.</p>}
                            </div>
                        </div>
                    </div>

                    {showSuccess && (
                        <div className="success-toast">
                            <CheckCircle2 size={20} />
                            Notice published successfully!
                        </div>
                    )}

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
        }
        .new-admin-content {
            padding: 2rem;
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
        }
        .new-dashboard-header {
            margin-bottom: 2rem;
        }
        .new-dashboard-header h1 {
            font-size: 2rem;
            font-weight: 700;
            color: #000;
            margin-bottom: 0.5rem;
        }
        .header-subtitle {
            color: #64748b;
        }
        
        .content-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 2rem;
        }

        .glass-card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border: 1px solid #e2e8f0;
            overflow: hidden;
        }

        .form-section {
            padding: 2rem;
        }
        .info-section {
            padding: 1.5rem;
            background: #f8fafc;
        }

        .card-header {
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .card-header h3 {
            font-size: 1.25rem;
            font-weight: 600;
            color: #1e293b;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin: 0;
        }
        .header-icon {
            color: #FBA2AB;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }
        .form-group label {
            display: block;
            margin-bottom: 0.75rem;
            font-weight: 600;
            color: #334155;
            font-size: 0.95rem;
        }

        /* Recipient Cards */
        .recipient-options {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
        .recipient-card {
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            padding: 1rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 1rem;
            transition: all 0.2s;
            position: relative;
        }
        .recipient-card:hover {
            border-color: #cbd5e1;
            background: #f8fafc;
        }
        .recipient-card.active {
            border-color: #FBA2AB;
            background: #FFF5EB;
        }
        .recipient-card span {
            font-weight: 600;
            font-size: 1rem;
        }
        .icon-wrapper {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .student-icon {
            background: #e0f2fe;
            color: #0ea5e9;
        }
        .faculty-icon {
            background: #fef3c7;
            color: #d97706;
        }
        .checked-indicator {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            color: #FBA2AB;
        }

        /* Inputs */
        .input-field {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.2s;
            background: white;
        }
        .input-field:focus {
            outline: none;
            border-color: #FBA2AB;
            box-shadow: 0 0 0 3px rgba(251, 162, 171, 0.1);
        }
        .textarea-field {
            resize: vertical;
            min-height: 120px;
        }

        .btn-primary {
            background: #000;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: opacity 0.2s;
        }
        .btn-primary:hover {
            opacity: 0.9;
        }

        /* Fade In Animation */
        .fade-in {
            animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Success Toast */
        .success-toast {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: #000;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            animation: slideIn 0.3s ease-out;
            z-index: 100;
        }
        @keyframes slideIn {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        /* Notices List */
        .notices-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        .notice-item {
            background: white;
            padding: 1rem;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }
        .notice-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
        }
        .badge {
            font-size: 0.75rem;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-weight: 600;
        }
        .badge.student {
            background: #e0f2fe;
            color: #0284c7;
        }
        .badge.faculty {
            background: #fef3c7;
            color: #d97706;
        }
        .date {
            font-size: 0.75rem;
            color: #94a3b8;
        }
        .notice-item p {
            margin: 0;
            font-size: 0.9rem;
            color: #334155;
            line-height: 1.4;
        }

        @media (max-width: 1024px) {
            .new-admin-content {
                padding-top: 6.5rem;
                padding-left: 1rem;
                padding-right: 1rem;
            }
            .content-grid {
                grid-template-columns: 1fr;
            }
        }
      `}</style>
        </div>
    );
};

export default NoticeBoard;

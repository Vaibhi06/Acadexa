import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import { useTheme } from '../../contexts/ThemeContext';
import {
    Settings as SettingsIcon,
    Palette,
    Lock,
    Bell,
    Moon,
    Sun,
    Eye,
    EyeOff,
    Check,
    ArrowLeft
} from 'lucide-react';

const Settings = () => {
    const navigate = useNavigate();

    // Theme settings from context
    const { theme, setTheme } = useTheme();
    const [themeSaved, setThemeSaved] = useState(false);

    // Password change
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordSaved, setPasswordSaved] = useState(false);

    // Notification preferences with localStorage persistence
    const [notifications, setNotifications] = useState(() => {
        const stored = localStorage.getItem('studentNotifications');
        return stored ? JSON.parse(stored) : {
            emailNotifications: true,
            examReminders: true,
            feeReminders: true,
            attendanceAlerts: true,
            newsUpdates: false,
            smsNotifications: false
        };
    });
    const [notificationsSaved, setNotificationsSaved] = useState(false);

    const themes = [
        { id: 'light', name: 'Light', icon: Sun, color: '#f8fafc' },
        { id: 'dark', name: 'Dark', icon: Moon, color: '#1e293b' },
        { id: 'pink', name: 'Pink', icon: Palette, color: '#FEA3BE' },
    ];

    // Handle theme change
    const handleThemeChange = (themeId) => {
        setTheme(themeId);
        setThemeSaved(true);
        setTimeout(() => setThemeSaved(false), 2000);
    };

    const handlePasswordChange = (e) => {
        setPasswordForm({
            ...passwordForm,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (passwordForm.newPassword === passwordForm.confirmPassword) {
            setPasswordSaved(true);
            setTimeout(() => setPasswordSaved(false), 3000);
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        }
    };

    const handleNotificationChange = (key) => {
        const updated = {
            ...notifications,
            [key]: !notifications[key]
        };
        setNotifications(updated);
    };

    const saveNotifications = () => {
        localStorage.setItem('studentNotifications', JSON.stringify(notifications));
        setNotificationsSaved(true);
        setTimeout(() => setNotificationsSaved(false), 3000);
    };

    return (
        <div className="admin-layout">
            <Sidebar role="student" />
            <div className="admin-main">
                <Navbar />
                <div className="settings-page">
                    {/* Back Button */}
                    <button className="back-btn" onClick={() => navigate('/student/dashboard')}>
                        <ArrowLeft size={18} />
                        Back to Dashboard
                    </button>

                    {/* Page Header */}
                    <div className="page-header">
                        <h1>⚙️ Settings</h1>
                        <p>Customize your experience</p>
                    </div>

                    {/* Theme Settings */}
                    <div className="settings-card">
                        <div className="card-header">
                            <Palette size={22} />
                            <div className="header-text">
                                <h2>Theme</h2>
                                <p>Choose your preferred appearance</p>
                            </div>
                        </div>
                        <div className="theme-options">
                            {themes.map((t) => (
                                <button
                                    key={t.id}
                                    className={`theme-btn ${theme === t.id ? 'active' : ''}`}
                                    onClick={() => handleThemeChange(t.id)}
                                    style={{ '--theme-color': t.color }}
                                >
                                    <div className="theme-preview" style={{ background: t.color }}>
                                        <t.icon size={24} />
                                    </div>
                                    <span className="theme-name">{t.name}</span>
                                    {theme === t.id && (
                                        <div className="check-badge">
                                            <Check size={14} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                        {themeSaved && (
                            <div className="theme-saved-message">
                                <Check size={16} />
                                Theme applied successfully!
                            </div>
                        )}
                    </div>

                    {/* Change Password */}
                    <div className="settings-card">
                        <div className="card-header">
                            <Lock size={22} />
                            <div className="header-text">
                                <h2>Change Password</h2>
                                <p>Update your account password</p>
                            </div>
                        </div>
                        <form className="password-form" onSubmit={handlePasswordSubmit}>
                            <div className="form-group">
                                <label>Current Password</label>
                                <div className="password-input">
                                    <input
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        name="currentPassword"
                                        value={passwordForm.currentPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Enter current password"
                                    />
                                    <button
                                        type="button"
                                        className="toggle-btn"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    >
                                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <div className="password-input">
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        name="newPassword"
                                        value={passwordForm.newPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Enter new password"
                                    />
                                    <button
                                        type="button"
                                        className="toggle-btn"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <div className="password-input">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={passwordForm.confirmPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Confirm new password"
                                    />
                                    <button
                                        type="button"
                                        className="toggle-btn"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <button type="submit" className="save-btn">
                                {passwordSaved ? (
                                    <>
                                        <Check size={18} />
                                        Password Updated!
                                    </>
                                ) : (
                                    'Update Password'
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Notification Preferences */}
                    <div className="settings-card">
                        <div className="card-header">
                            <Bell size={22} />
                            <div className="header-text">
                                <h2>Notification Preferences</h2>
                                <p>Manage how you receive updates</p>
                            </div>
                        </div>
                        <div className="notification-options">
                            <div className="notification-item">
                                <div className="notification-info">
                                    <h4>Email Notifications</h4>
                                    <p>Receive updates via email</p>
                                </div>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={notifications.emailNotifications}
                                        onChange={() => handleNotificationChange('emailNotifications')}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                            <div className="notification-item">
                                <div className="notification-info">
                                    <h4>Exam Reminders</h4>
                                    <p>Get notified about upcoming exams</p>
                                </div>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={notifications.examReminders}
                                        onChange={() => handleNotificationChange('examReminders')}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                            <div className="notification-item">
                                <div className="notification-info">
                                    <h4>Fee Reminders</h4>
                                    <p>Payment due date alerts</p>
                                </div>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={notifications.feeReminders}
                                        onChange={() => handleNotificationChange('feeReminders')}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                            <div className="notification-item">
                                <div className="notification-info">
                                    <h4>Attendance Alerts</h4>
                                    <p>Low attendance warnings</p>
                                </div>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={notifications.attendanceAlerts}
                                        onChange={() => handleNotificationChange('attendanceAlerts')}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                            <div className="notification-item">
                                <div className="notification-info">
                                    <h4>News & Updates</h4>
                                    <p>School announcements and news</p>
                                </div>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={notifications.newsUpdates}
                                        onChange={() => handleNotificationChange('newsUpdates')}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                            <div className="notification-item">
                                <div className="notification-info">
                                    <h4>SMS Notifications</h4>
                                    <p>Receive text message alerts</p>
                                </div>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={notifications.smsNotifications}
                                        onChange={() => handleNotificationChange('smsNotifications')}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>
                        <button className="save-btn" onClick={saveNotifications}>
                            {notificationsSaved ? (
                                <>
                                    <Check size={18} />
                                    Preferences Saved!
                                </>
                            ) : (
                                'Save Preferences'
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .settings-page {
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

                .page-header h1 {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0 0 0.25rem 0;
                }

                .page-header p {
                    color: #64748b;
                    margin: 0;
                }

                /* Settings Cards */
                .settings-card {
                    background: white;
                    border-radius: 20px;
                    padding: 1.5rem;
                    margin-bottom: 1.5rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                .card-header {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                    padding-bottom: 1rem;
                    border-bottom: 2px solid #f1f5f9;
                }

                .card-header svg {
                    color: #FEA3BE;
                    flex-shrink: 0;
                    margin-top: 2px;
                }

                .header-text h2 {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0 0 0.25rem 0;
                }

                .header-text p {
                    font-size: 0.9rem;
                    color: #64748b;
                    margin: 0;
                }

                /* Theme Options */
                .theme-options {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                }

                .theme-btn {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1.25rem;
                    background: #f8fafc;
                    border: 2px solid transparent;
                    border-radius: 16px;
                    cursor: pointer;
                    transition: all 0.2s;
                    min-width: 120px;
                    position: relative;
                }

                .theme-btn:hover {
                    border-color: #e2e8f0;
                }

                .theme-btn.active {
                    border-color: #FEA3BE;
                    background: #fef7f9;
                }

                .theme-preview {
                    width: 60px;
                    height: 60px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }

                .theme-preview svg {
                    color: white;
                }

                .theme-name {
                    font-weight: 600;
                    color: #1e293b;
                }

                .check-badge {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    width: 24px;
                    height: 24px;
                    background: #22c55e;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }

                .theme-saved-message {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-top: 1rem;
                    padding: 0.75rem 1rem;
                    background: linear-gradient(135deg, #dcfce7, #bbf7d0);
                    color: #166534;
                    border-radius: 10px;
                    font-weight: 600;
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* Password Form */
                .password-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .form-group label {
                    font-weight: 600;
                    color: #1e293b;
                    font-size: 0.9rem;
                }

                .password-input {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .password-input input {
                    width: 100%;
                    padding: 0.875rem 1rem;
                    padding-right: 3rem;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 1rem;
                    transition: all 0.2s;
                }

                .password-input input:focus {
                    outline: none;
                    border-color: #FEA3BE;
                }

                .toggle-btn {
                    position: absolute;
                    right: 12px;
                    background: none;
                    border: none;
                    color: #94a3b8;
                    cursor: pointer;
                    padding: 0;
                }

                .toggle-btn:hover {
                    color: #64748b;
                }

                .save-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 0.875rem 1.5rem;
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-top: 0.5rem;
                }

                .save-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(254, 163, 190, 0.4);
                }

                /* Notification Options */
                .notification-options {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                .notification-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    background: #f8fafc;
                    border-radius: 12px;
                }

                .notification-info h4 {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #1e293b;
                    margin: 0 0 0.25rem 0;
                }

                .notification-info p {
                    font-size: 0.85rem;
                    color: #64748b;
                    margin: 0;
                }

                /* Toggle Switch */
                .toggle-switch {
                    position: relative;
                    display: inline-block;
                    width: 52px;
                    height: 28px;
                }

                .toggle-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }

                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: #e2e8f0;
                    border-radius: 28px;
                    transition: 0.3s;
                }

                .slider:before {
                    position: absolute;
                    content: "";
                    height: 22px;
                    width: 22px;
                    left: 3px;
                    bottom: 3px;
                    background: white;
                    border-radius: 50%;
                    transition: 0.3s;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .toggle-switch input:checked + .slider {
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                }

                .toggle-switch input:checked + .slider:before {
                    transform: translateX(24px);
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .settings-page {
                        padding: 1rem;
                    }

                    .theme-options {
                        justify-content: center;
                    }

                    .theme-btn {
                        min-width: 100px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Settings;

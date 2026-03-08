import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import {
    Users,
    GraduationCap,
    Calendar,
    BookOpen,
    User,
    Mail,
    Phone,
    ArrowLeft
} from 'lucide-react';

const ClassInfo = () => {
    const navigate = useNavigate();

    // Class data
    const classData = {
        className: '10th Grade A',
        academicYear: '2025-26',
        section: 'A',
        totalStudents: 45,
        classTeacher: 'Mr. Rajesh Kumar',
        room: 'Room 201'
    };

    // Assigned faculty list
    const facultyList = [
        { id: 1, name: 'Mr. Rajesh Kumar', subject: 'Mathematics', email: 'rajesh.kumar@acadexa.com', phone: '+91 98765 43210', isClassTeacher: true },
        { id: 2, name: 'Dr. Priya Sharma', subject: 'Physics', email: 'priya.sharma@acadexa.com', phone: '+91 98765 43211', isClassTeacher: false },
        { id: 3, name: 'Mr. Suresh Patel', subject: 'Chemistry', email: 'suresh.patel@acadexa.com', phone: '+91 98765 43212', isClassTeacher: false },
        { id: 4, name: 'Mrs. Anjali Verma', subject: 'English', email: 'anjali.verma@acadexa.com', phone: '+91 98765 43213', isClassTeacher: false },
        { id: 5, name: 'Dr. Kavita Reddy', subject: 'Biology', email: 'kavita.reddy@acadexa.com', phone: '+91 98765 43214', isClassTeacher: false },
        { id: 6, name: 'Ms. Neha Gupta', subject: 'Computer Science', email: 'neha.gupta@acadexa.com', phone: '+91 98765 43215', isClassTeacher: false },
    ];

    // Subject colors
    const subjectColors = {
        'Mathematics': '#FF6B6B',
        'Physics': '#4ECDC4',
        'Chemistry': '#45B7D1',
        'English': '#96CEB4',
        'Biology': '#FFEAA7',
        'Computer Science': '#DDA0DD'
    };

    return (
        <div className="admin-layout">
            <Sidebar role="student" />
            <div className="admin-main">
                <Navbar />
                <div className="class-info-page">
                    {/* Back Button */}
                    <button className="back-btn" onClick={() => navigate('/student/profile')}>
                        <ArrowLeft size={18} />
                        Back to Profile
                    </button>

                    {/* Page Header */}
                    <div className="page-header">
                        <h1>🏫 Class Information</h1>
                        <p>Your enrolled class details</p>
                    </div>

                    {/* Class Details Card */}
                    <div className="class-card">
                        <div className="class-header">
                            <div className="class-icon">
                                <GraduationCap size={32} />
                            </div>
                            <div className="class-title">
                                <h2>{classData.className}</h2>
                                <span className="section-badge">Section {classData.section}</span>
                            </div>
                        </div>
                        <div className="class-stats">
                            <div className="stat-item">
                                <Calendar size={20} />
                                <div className="stat-info">
                                    <span className="stat-label">Academic Year</span>
                                    <span className="stat-value">{classData.academicYear}</span>
                                </div>
                            </div>
                            <div className="stat-item">
                                <Users size={20} />
                                <div className="stat-info">
                                    <span className="stat-label">Total Students</span>
                                    <span className="stat-value">{classData.totalStudents}</span>
                                </div>
                            </div>
                            <div className="stat-item">
                                <User size={20} />
                                <div className="stat-info">
                                    <span className="stat-label">Class Teacher</span>
                                    <span className="stat-value">{classData.classTeacher}</span>
                                </div>
                            </div>
                            <div className="stat-item">
                                <BookOpen size={20} />
                                <div className="stat-info">
                                    <span className="stat-label">Class Room</span>
                                    <span className="stat-value">{classData.room}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Assigned Faculty */}
                    <div className="faculty-section">
                        <h2><Users size={20} /> Assigned Faculty</h2>
                        <div className="faculty-grid">
                            {facultyList.map((faculty) => (
                                <div key={faculty.id} className={`faculty-card ${faculty.isClassTeacher ? 'class-teacher' : ''}`}>
                                    {faculty.isClassTeacher && (
                                        <span className="teacher-badge">Class Teacher</span>
                                    )}
                                    <div className="faculty-avatar" style={{ background: subjectColors[faculty.subject] || '#FEA3BE' }}>
                                        {faculty.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="faculty-info">
                                        <h3>{faculty.name}</h3>
                                        <span className="subject-tag" style={{ background: `${subjectColors[faculty.subject]}20`, color: subjectColors[faculty.subject] }}>
                                            {faculty.subject}
                                        </span>
                                    </div>
                                    <div className="faculty-contact">
                                        <div className="contact-item">
                                            <Mail size={14} />
                                            <span>{faculty.email}</span>
                                        </div>
                                        <div className="contact-item">
                                            <Phone size={14} />
                                            <span>{faculty.phone}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .class-info-page {
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

                /* Class Card */
                .class-card {
                    background: white;
                    border-radius: 20px;
                    padding: 2rem;
                    margin-bottom: 2rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                .class-header {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 2px solid #f1f5f9;
                }

                .class-icon {
                    width: 70px;
                    height: 70px;
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }

                .class-title h2 {
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: #1e293b;
                    margin: 0 0 0.5rem 0;
                }

                .section-badge {
                    display: inline-block;
                    padding: 0.375rem 1rem;
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    color: white;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 0.875rem;
                }

                .class-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.5rem;
                }

                .stat-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: #f8fafc;
                    border-radius: 12px;
                }

                .stat-item svg {
                    color: #FEA3BE;
                }

                .stat-info {
                    display: flex;
                    flex-direction: column;
                }

                .stat-label {
                    font-size: 0.8rem;
                    color: #64748b;
                }

                .stat-value {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #1e293b;
                }

                /* Faculty Section */
                .faculty-section {
                    margin-bottom: 2rem;
                }

                .faculty-section h2 {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0 0 1.5rem 0;
                }

                .faculty-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 1.25rem;
                }

                .faculty-card {
                    background: white;
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                    position: relative;
                }

                .faculty-card.class-teacher {
                    border: 2px solid #FEA3BE;
                }

                .teacher-badge {
                    position: absolute;
                    top: -10px;
                    right: 16px;
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    color: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.7rem;
                    font-weight: 700;
                }

                .faculty-avatar {
                    width: 56px;
                    height: 56px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 700;
                    font-size: 1.1rem;
                    margin-bottom: 1rem;
                }

                .faculty-info {
                    margin-bottom: 1rem;
                }

                .faculty-info h3 {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0 0 0.5rem 0;
                }

                .subject-tag {
                    display: inline-block;
                    padding: 0.25rem 0.75rem;
                    border-radius: 8px;
                    font-size: 0.8rem;
                    font-weight: 600;
                }

                .faculty-contact {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    padding-top: 1rem;
                    border-top: 1px solid #f1f5f9;
                }

                .contact-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.85rem;
                    color: #64748b;
                }

                .contact-item svg {
                    color: #94a3b8;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .class-info-page {
                        padding: 1rem;
                    }

                    .class-header {
                        flex-direction: column;
                        text-align: center;
                    }

                    .faculty-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default ClassInfo;

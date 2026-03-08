import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../shared/Sidebar';
import {
    User, Mail, Phone, MapPin, Calendar, ArrowLeft, Download,
    BookOpen, Award, Clock, TrendingUp, CheckCircle, GraduationCap
} from 'lucide-react';

const FacultyProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('personal');

    // Sample faculty data
    const faculty = {
        id: id || 'FAC001',
        name: 'Dr. Robert Smith',
        email: 'robert.smith@acadexa.com',
        phone: '+91 98765 11111',
        address: '456 Faculty Lane, Mumbai, Maharashtra',
        qualification: 'Ph.D. in Mathematics',
        experience: '15 years',
        joinDate: '2010-06-01',
        department: 'Mathematics',
        subjects: ['Mathematics', 'Advanced Mathematics', 'Statistics'],
        classes: ['10th Grade A', '11th Grade A', '12th Grade A'],
        attendance: {
            percentage: 98,
            present: 176,
            absent: 4,
            totalDays: 180
        },
        performance: {
            studentsPass: 95,
            averageMarks: 82,
            rating: 4.8,
            feedback: 'Excellent teaching methodology'
        },

        activities: [
            { date: '2024-12-15', activity: 'Conducted Mid-Term Exam for 10th Grade' },
            { date: '2024-12-10', activity: 'Organized Mathematics Workshop' },
            { date: '2024-12-05', activity: 'Submitted Quarterly Assessment Report' }
        ]
    };

    return (
        <div className="admin-layout">
            <Sidebar role="admin" />

            <div className="admin-main">
                <div className="admin-content">
                    {/* Header */}
                    <div className="page-header" style={{ marginBottom: '2rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                <button className="btn btn-outline" onClick={() => navigate('/admin/profile')}>
                                    <ArrowLeft size={18} />
                                    Back
                                </button>
                                <h1 style={{ margin: 0 }}>Faculty Profile</h1>
                            </div>
                            <p className="text-secondary">Detailed faculty information and records</p>
                        </div>
                    </div>

                    {/* Faculty Header Card */}
                    <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                            <div style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #FEA3BE, #FBA2AB)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '3rem',
                                fontWeight: '700',
                                flexShrink: 0
                            }}>
                                {faculty.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>{faculty.name}</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                                    <p style={{ margin: 0, color: '#64748b' }}><strong>Department:</strong> {faculty.department}</p>
                                    <p style={{ margin: 0, color: '#64748b' }}><strong>Faculty ID:</strong> {faculty.id}</p>
                                    <p style={{ margin: 0, color: '#64748b' }}><strong>Experience:</strong> {faculty.experience}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="tabs-container">
                        <button className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`} onClick={() => setActiveTab('personal')}>
                            <User size={20} />
                            Personal Info
                        </button>
                        <button className={`tab-btn ${activeTab === 'professional' ? 'active' : ''}`} onClick={() => setActiveTab('professional')}>
                            <GraduationCap size={20} />
                            Professional
                        </button>
                        <button className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>
                            <CheckCircle size={20} />
                            Attendance
                        </button>
                        <button className={`tab-btn ${activeTab === 'performance' ? 'active' : ''}`} onClick={() => setActiveTab('performance')}>
                            <Award size={20} />
                            Performance
                        </button>

                        <button className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`} onClick={() => setActiveTab('activity')}>
                            <Clock size={20} />
                            Activity
                        </button>
                    </div>

                    {/* Personal Info Tab */}
                    {activeTab === 'personal' && (
                        <div className="glass-card" style={{ padding: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>Personal Information</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                <div>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.5rem 0', fontWeight: '600' }}>Email</p>
                                    <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Mail size={16} color="#FEA3BE" />
                                        {faculty.email}
                                    </p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.5rem 0', fontWeight: '600' }}>Phone</p>
                                    <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Phone size={16} color="#FEA3BE" />
                                        {faculty.phone}
                                    </p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.5rem 0', fontWeight: '600' }}>Qualification</p>
                                    <p style={{ margin: 0 }}>{faculty.qualification}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.5rem 0', fontWeight: '600' }}>Join Date</p>
                                    <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Calendar size={16} color="#FEA3BE" />
                                        {new Date(faculty.joinDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.5rem 0', fontWeight: '600' }}>Address</p>
                                    <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <MapPin size={16} color="#FEA3BE" />
                                        {faculty.address}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Professional Tab */}
                    {activeTab === 'professional' && (
                        <div>
                            <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                                <h3 style={{ marginBottom: '1.5rem' }}>Professional Details</h3>
                                <div className="stats-grid">
                                    <div className="stat-card glass-card">
                                        <p className="stat-title">Department</p>
                                        <h3 className="stat-value">{faculty.department}</h3>
                                    </div>
                                    <div className="stat-card glass-card">
                                        <p className="stat-title">Experience</p>
                                        <h3 className="stat-value">{faculty.experience}</h3>
                                    </div>
                                    <div className="stat-card glass-card">
                                        <p className="stat-title">Classes</p>
                                        <h3 className="stat-value">{faculty.classes.length}</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                                <h4 style={{ marginBottom: '1rem' }}>Subjects Teaching</h4>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {faculty.subjects.map((subject, idx) => (
                                        <span key={idx} className="badge badge-primary">{subject}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="glass-card" style={{ padding: '2rem' }}>
                                <h4 style={{ marginBottom: '1rem' }}>Classes Assigned</h4>
                                <div style={{ display: 'grid', gap: '0.5rem' }}>
                                    {faculty.classes.map((cls, idx) => (
                                        <div key={idx} className="glass-card" style={{ padding: '1rem' }}>
                                            <span style={{ fontWeight: '600' }}>{cls}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Attendance Tab */}
                    {activeTab === 'attendance' && (
                        <div className="glass-card" style={{ padding: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>Attendance Record</h3>
                            <div className="stats-grid">
                                <div className="stat-card glass-card">
                                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                                        <CheckCircle size={28} />
                                    </div>
                                    <div>
                                        <p className="stat-title">Attendance</p>
                                        <h3 className="stat-value">{faculty.attendance.percentage}%</h3>
                                    </div>
                                </div>
                                <div className="stat-card glass-card">
                                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #FEA3BE, #FBA2AB)' }}>
                                        <TrendingUp size={28} />
                                    </div>
                                    <div>
                                        <p className="stat-title">Present Days</p>
                                        <h3 className="stat-value">{faculty.attendance.present}</h3>
                                    </div>
                                </div>
                                <div className="stat-card glass-card">
                                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                                        <User size={28} />
                                    </div>
                                    <div>
                                        <p className="stat-title">Absent Days</p>
                                        <h3 className="stat-value">{faculty.attendance.absent}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Performance Tab */}
                    {activeTab === 'performance' && (
                        <div className="glass-card" style={{ padding: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>Performance Metrics</h3>
                            <div className="stats-grid">
                                <div className="stat-card glass-card">
                                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                                        <TrendingUp size={28} />
                                    </div>
                                    <div>
                                        <p className="stat-title">Students Pass %</p>
                                        <h3 className="stat-value">{faculty.performance.studentsPass}%</h3>
                                    </div>
                                </div>
                                <div className="stat-card glass-card">
                                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #FEA3BE, #FBA2AB)' }}>
                                        <Award size={28} />
                                    </div>
                                    <div>
                                        <p className="stat-title">Avg Student Marks</p>
                                        <h3 className="stat-value">{faculty.performance.averageMarks}%</h3>
                                    </div>
                                </div>
                                <div className="stat-card glass-card">
                                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                                        <Award size={28} />
                                    </div>
                                    <div>
                                        <p className="stat-title">Rating</p>
                                        <h3 className="stat-value">{faculty.performance.rating}/5</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
                                <h4 style={{ marginBottom: '0.5rem' }}>Student Feedback</h4>
                                <p style={{ margin: 0, color: '#64748b' }}>{faculty.performance.feedback}</p>
                            </div>
                        </div>
                    )}


                    {/* Activity Tab */}
                    {activeTab === 'activity' && (
                        <div className="glass-card" style={{ padding: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>Recent Activities</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {faculty.activities.map((activity, idx) => (
                                    <div key={idx} className="glass-card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        <Clock size={20} color="#FEA3BE" style={{ flexShrink: 0, marginTop: '0.25rem' }} />
                                        <div style={{ flex: 1 }}>
                                            <p style={{ margin: '0 0 0.25rem 0', fontWeight: '600' }}>{activity.activity}</p>
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                                                {new Date(activity.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #ffffff;
        }

        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .admin-content {
          flex: 1;
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        .page-header h1 {
          font-size: 2rem;
          color: #1e293b;
          font-weight: 700;
        }

        .text-secondary {
          color: #64748b;
          margin: 0;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .tabs-container {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          border-bottom: 2px solid #e2e8f0;
          flex-wrap: wrap;
          overflow-x: auto;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          color: #64748b;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .tab-btn:hover {
          color: #FEA3BE;
        }

        .tab-btn.active {
          color: #FEA3BE;
          border-bottom-color: #FEA3BE;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .stat-title {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0 0 0.5rem 0;
          text-transform: uppercase;
          font-weight: 600;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 800;
          margin: 0;
          color: #1e293b;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .btn-primary {
          background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
          color: white;
        }

        .btn-outline {
          background: transparent;
          border: 2px solid #e2e8f0;
          color: #64748b;
        }

        .btn-outline:hover {
          border-color: #FEA3BE;
          color: #FEA3BE;
        }

        .table-container {
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table thead tr {
          border-bottom: 2px solid #e2e8f0;
        }

        .data-table th {
          padding: 0.75rem;
          text-align: left;
          font-weight: 600;
          color: #64748b;
          font-size: 0.9rem;
          text-transform: uppercase;
        }

        .data-table td {
          padding: 0.75rem;
          border-bottom: 1px solid #e2e8f0;
          color: #1e293b;
        }

        .data-table tbody tr:hover {
          background: #f8fafc;
        }

        .badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .badge-primary {
          background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
          color: white;
        }

        .badge-success {
          background: #d1fae5;
          color: #059669;
        }

        .font-semibold {
          font-weight: 600;
        }


        @media (max-width: 1024px) {
          .admin-content {
            padding-top: 6.5rem;
            padding-left: 1rem;
            padding-right: 1rem;
          }
          .new-admin-content {
            padding-top: 6.5rem;
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
        @media (max-width: 768px) {
          .admin-content {
            padding: 1rem;
          }

          .tabs-container {
            overflow-x: auto;
          }
        }
      `}</style>
        </div>
    );
};

export default FacultyProfile;

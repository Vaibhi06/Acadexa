import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../shared/Sidebar';
import {
    User, Mail, Phone, MapPin, Calendar, ArrowLeft, Download,
    BookOpen, Award, DollarSign, Clock, TrendingUp, CheckCircle
} from 'lucide-react';

const StudentProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('personal');

    // Sample student data
    const student = {
        id: id || 'STU001',
        name: 'John Doe',
        rollNo: '001',
        class: '10th Grade A',
        section: 'A',
        email: 'john.doe@student.com',
        phone: '+91 98765 43210',
        address: '123 Student Street, Mumbai, Maharashtra',
        bloodGroup: 'A+',
        dob: '2008-05-15',
        admissionDate: '2020-04-01',
        guardianName: 'Mr. Robert Doe',
        guardianPhone: '+91 98765 00000',
        attendance: {
            percentage: 92,
            present: 165,
            absent: 15,
            totalDays: 180
        },
        performance: [
            { subject: 'Mathematics', marks: 85, total: 100, grade: 'A' },
            { subject: 'Physics', marks: 78, total: 100, grade: 'B+' },
            { subject: 'Chemistry', marks: 92, total: 100, grade: 'A+' },
            { subject: 'English', marks: 88, total: 100, grade: 'A' },
            { subject: 'Hindi', marks: 75, total: 100, grade: 'B+' }
        ],
        fees: {
            total: 50000,
            paid: 35000,
            pending: 15000,
            payments: [
                { date: '2024-04-01', amount: 15000, method: 'Online', receipt: 'REC001' },
                { date: '2024-07-01', amount: 10000, method: 'Cash', receipt: 'REC002' },
                { date: '2024-10-01', amount: 10000, method: 'Online', receipt: 'REC003' }
            ]
        },
        activities: [
            { date: '2024-12-15', activity: 'Submitted Math Assignment' },
            { date: '2024-12-10', activity: 'Attended Science Fair' },
            { date: '2024-12-05', activity: 'Participated in Sports Day' }
        ]
    };

    const overallPercentage = (student.performance.reduce((sum, p) => sum + p.marks, 0) /
        student.performance.reduce((sum, p) => sum + p.total, 0) * 100).toFixed(2);

    return (
        <div className="admin-layout">
            <Sidebar role="admin" />

            <div className="admin-main">
                <div className="admin-content">
                    {/* Header */}
                    <div className="page-header" style={{ marginBottom: '2rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                <button className="btn btn-outline" onClick={() => navigate('/admin/students')}>
                                    <ArrowLeft size={18} />
                                    Back
                                </button>
                                <h1 style={{ margin: 0 }}>Student Profile</h1>
                            </div>
                            <p className="text-secondary">Detailed student information and records</p>
                        </div>
                    </div>

                    {/* Student Header Card */}
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
                                {student.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem' }}>{student.name}</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                                    <p style={{ margin: 0, color: '#64748b' }}><strong>Roll No:</strong> {student.rollNo}</p>
                                    <p style={{ margin: 0, color: '#64748b' }}><strong>Class:</strong> {student.class}</p>
                                    <p style={{ margin: 0, color: '#64748b' }}><strong>Student ID:</strong> {student.id}</p>
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
                        <button className={`tab-btn ${activeTab === 'academic' ? 'active' : ''}`} onClick={() => setActiveTab('academic')}>
                            <BookOpen size={20} />
                            Academic
                        </button>
                        <button className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>
                            <CheckCircle size={20} />
                            Attendance
                        </button>
                        <button className={`tab-btn ${activeTab === 'performance' ? 'active' : ''}`} onClick={() => setActiveTab('performance')}>
                            <Award size={20} />
                            Performance
                        </button>
                        <button className={`tab-btn ${activeTab === 'fees' ? 'active' : ''}`} onClick={() => setActiveTab('fees')}>
                            <DollarSign size={20} />
                            Fees
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
                                        {student.email}
                                    </p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.5rem 0', fontWeight: '600' }}>Phone</p>
                                    <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Phone size={16} color="#FEA3BE" />
                                        {student.phone}
                                    </p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.5rem 0', fontWeight: '600' }}>Date of Birth</p>
                                    <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Calendar size={16} color="#FEA3BE" />
                                        {new Date(student.dob).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.5rem 0', fontWeight: '600' }}>Blood Group</p>
                                    <p style={{ margin: 0 }}>{student.bloodGroup}</p>
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.5rem 0', fontWeight: '600' }}>Address</p>
                                    <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <MapPin size={16} color="#FEA3BE" />
                                        {student.address}
                                    </p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.5rem 0', fontWeight: '600' }}>Guardian Name</p>
                                    <p style={{ margin: 0 }}>{student.guardianName}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.5rem 0', fontWeight: '600' }}>Guardian Phone</p>
                                    <p style={{ margin: 0 }}>{student.guardianPhone}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.5rem 0', fontWeight: '600' }}>Admission Date</p>
                                    <p style={{ margin: 0 }}>{new Date(student.admissionDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Academic Tab */}
                    {activeTab === 'academic' && (
                        <div className="glass-card" style={{ padding: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>Academic Details</h3>
                            <div className="stats-grid">
                                <div className="stat-card glass-card">
                                    <p className="stat-title">Class</p>
                                    <h3 className="stat-value">{student.class}</h3>
                                </div>
                                <div className="stat-card glass-card">
                                    <p className="stat-title">Roll Number</p>
                                    <h3 className="stat-value">{student.rollNo}</h3>
                                </div>
                                <div className="stat-card glass-card">
                                    <p className="stat-title">Overall Percentage</p>
                                    <h3 className="stat-value">{overallPercentage}%</h3>
                                </div>
                            </div>
                            <h4 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Subjects</h4>
                            <div style={{ display: 'grid', gap: '0.5rem' }}>
                                {student.performance.map((subject, idx) => (
                                    <div key={idx} className="glass-card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '600' }}>{subject.subject}</span>
                                        <span className="badge badge-primary">{subject.grade}</span>
                                    </div>
                                ))}
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
                                        <h3 className="stat-value">{student.attendance.percentage}%</h3>
                                    </div>
                                </div>
                                <div className="stat-card glass-card">
                                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #FEA3BE, #FBA2AB)' }}>
                                        <TrendingUp size={28} />
                                    </div>
                                    <div>
                                        <p className="stat-title">Present Days</p>
                                        <h3 className="stat-value">{student.attendance.present}</h3>
                                    </div>
                                </div>
                                <div className="stat-card glass-card">
                                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                                        <User size={28} />
                                    </div>
                                    <div>
                                        <p className="stat-title">Absent Days</p>
                                        <h3 className="stat-value">{student.attendance.absent}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Performance Tab */}
                    {activeTab === 'performance' && (
                        <div className="glass-card" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ margin: 0 }}>Performance Records</h3>
                                <button className="btn btn-outline">
                                    <Download size={18} />
                                    Download Report
                                </button>
                            </div>
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Subject</th>
                                            <th>Marks Obtained</th>
                                            <th>Total Marks</th>
                                            <th>Percentage</th>
                                            <th>Grade</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {student.performance.map((subject, idx) => (
                                            <tr key={idx}>
                                                <td className="font-semibold">{subject.subject}</td>
                                                <td>{subject.marks}</td>
                                                <td>{subject.total}</td>
                                                <td>
                                                    <span style={{ fontWeight: '600', color: subject.marks >= 90 ? '#10b981' : subject.marks >= 75 ? '#3b82f6' : '#f59e0b' }}>
                                                        {((subject.marks / subject.total) * 100).toFixed(2)}%
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${subject.grade.includes('A') ? 'badge-success' : 'badge-primary'}`}>
                                                        {subject.grade}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Fees Tab */}
                    {activeTab === 'fees' && (
                        <div>
                            <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                                <h3 style={{ marginBottom: '1.5rem' }}>Fee Summary</h3>
                                <div className="stats-grid">
                                    <div className="stat-card glass-card">
                                        <p className="stat-title">Total Fees</p>
                                        <h3 className="stat-value">₹{student.fees.total.toLocaleString()}</h3>
                                    </div>
                                    <div className="stat-card glass-card">
                                        <p className="stat-title">Paid Amount</p>
                                        <h3 className="stat-value" style={{ color: '#10b981' }}>₹{student.fees.paid.toLocaleString()}</h3>
                                    </div>
                                    <div className="stat-card glass-card">
                                        <p className="stat-title">Pending</p>
                                        <h3 className="stat-value" style={{ color: '#ef4444' }}>₹{student.fees.pending.toLocaleString()}</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card" style={{ padding: '2rem' }}>
                                <h3 style={{ marginBottom: '1.5rem' }}>Payment History</h3>
                                <div className="table-container">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Amount</th>
                                                <th>Method</th>
                                                <th>Receipt No</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {student.fees.payments.map((payment, idx) => (
                                                <tr key={idx}>
                                                    <td>{new Date(payment.date).toLocaleDateString()}</td>
                                                    <td className="font-semibold">₹{payment.amount.toLocaleString()}</td>
                                                    <td>{payment.method}</td>
                                                    <td><span className="badge badge-primary">{payment.receipt}</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Activity Tab */}
                    {activeTab === 'activity' && (
                        <div className="glass-card" style={{ padding: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>Recent Activities</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {student.activities.map((activity, idx) => (
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

export default StudentProfile;

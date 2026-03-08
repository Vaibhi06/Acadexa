import React, { useState } from 'react';
import Sidebar from '../shared/Sidebar';
import { TrendingUp, Download, BarChart3, Users, UserCheck, GraduationCap, Calendar, FileText } from 'lucide-react';

const Reports = () => {
    const [activeTab, setActiveTab] = useState('student'); // student, class, attendance, faculty

    // Sample data - in real app, this would come from context/API
    const studentPerformance = [
        { id: 'STU001', name: 'John Doe', class: '10th Grade A', average: 85, rank: 2, attendance: '92%' },
        { id: 'STU002', name: 'Jane Smith', class: '10th Grade B', average: 92, rank: 1, attendance: '95%' },
        { id: 'STU003', name: 'Mike Johnson', class: '11th Grade A', average: 78, rank: 5, attendance: '88%' },
        { id: 'STU004', name: 'Sarah Williams', class: '12th Grade A', average: 95, rank: 1, attendance: '97%' },
    ];

    const classAnalysis = [
        { class: '10th Grade A', students: 45, averageMarks: 82, passPercentage: 95, toppers: 3 },
        { class: '10th Grade B', students: 42, averageMarks: 78, passPercentage: 90, toppers: 2 },
        { class: '11th Grade A', students: 38, averageMarks: 85, passPercentage: 97, toppers: 4 },
        { class: '12th Grade A', students: 40, averageMarks: 88, passPercentage: 98, toppers: 5 },
    ];

    const attendanceReport = [
        { class: '10th Grade A', totalDays: 180, avgAttendance: '92%', aboveThreshold: 40, belowThreshold: 5 },
        { class: '10th Grade B', totalDays: 180, avgAttendance: '89%', aboveThreshold: 37, belowThreshold: 5 },
        { class: '11th Grade A', totalDays: 180, avgAttendance: '94%', aboveThreshold: 36, belowThreshold: 2 },
        { class: '12th Grade A', totalDays: 180, avgAttendance: '95%', aboveThreshold: 38, belowThreshold: 2 },
    ];

    const facultyPerformance = [
        { id: 'FAC001', name: 'Dr. Robert Smith', subject: 'Mathematics', classes: 3, avgStudentScore: 85, attendance: '98%' },
        { id: 'FAC002', name: 'Prof. Emily Davis', subject: 'Science', classes: 4, avgStudentScore: 82, attendance: '96%' },
        { id: 'FAC003', name: 'Ms. Sarah Wilson', subject: 'English', classes: 3, avgStudentScore: 88, attendance: '99%' },
        { id: 'FAC004', name: 'Mr. John Brown', subject: 'History', classes: 2, avgStudentScore: 80, attendance: '95%' },
    ];

    const downloadCSV = (data, filename) => {
        let csv = '';

        // Get headers from first object
        if (data.length > 0) {
            const headers = Object.keys(data[0]);
            csv = headers.join(',') + '\\n';

            // Add data rows
            data.forEach(row => {
                csv += headers.map(header => row[header]).join(',') + '\\n';
            });
        }

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
    };

    const getPerformanceColor = (value) => {
        if (value >= 90) return '#10b981';
        if (value >= 75) return '#3b82f6';
        if (value >= 60) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className="admin-layout">
            <Sidebar role="admin" />
            <div className="admin-main">
                <div className="admin-content">
                    <div className="page-header">
                        <div>
                            <h1>Reports & Analytics</h1>
                            <p className="text-secondary">Performance insights and administrative reports</p>
                        </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="stats-grid">
                        <div className="stat-card glass-card">
                            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #FEA3BE, #FBA2AB)' }}>
                                <Users size={28} />
                            </div>
                            <div>
                                <p className="stat-title">Total Students</p>
                                <h3 className="stat-value">{studentPerformance.length}</h3>
                            </div>
                        </div>

                        <div className="stat-card glass-card">
                            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                                <BarChart3 size={28} />
                            </div>
                            <div>
                                <p className="stat-title">Avg Performance</p>
                                <h3 className="stat-value">
                                    {(studentPerformance.reduce((sum, s) => sum + s.average, 0) / studentPerformance.length).toFixed(1)}%
                                </h3>
                            </div>
                        </div>

                        <div className="stat-card glass-card">
                            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                                <UserCheck size={28} />
                            </div>
                            <div>
                                <p className="stat-title">Avg Attendance</p>
                                <h3 className="stat-value">93%</h3>
                            </div>
                        </div>

                        <div className="stat-card glass-card">
                            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                                <GraduationCap size={28} />
                            </div>
                            <div>
                                <p className="stat-title">Total Faculty</p>
                                <h3 className="stat-value">{facultyPerformance.length}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="tabs-container">
                        <button
                            className={`tab-btn ${activeTab === 'student' ? 'active' : ''}`}
                            onClick={() => setActiveTab('student')}
                        >
                            <Users size={20} />
                            Student Performance
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'class' ? 'active' : ''}`}
                            onClick={() => setActiveTab('class')}
                        >
                            <BarChart3 size={20} />
                            Class Analysis
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
                            onClick={() => setActiveTab('attendance')}
                        >
                            <UserCheck size={20} />
                            Attendance
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'faculty' ? 'active' : ''}`}
                            onClick={() => setActiveTab('faculty')}
                        >
                            <GraduationCap size={20} />
                            Faculty Overview
                        </button>
                    </div>

                    {/* Student Performance Tab */}
                    {activeTab === 'student' && (
                        <div className="report-container glass-card">
                            <div className="report-header">
                                <h3>Student Performance Report</h3>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => downloadCSV(studentPerformance, 'student_performance_report.csv')}
                                >
                                    <Download size={18} />
                                    Download CSV
                                </button>
                            </div>

                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Student ID</th>
                                            <th>Name</th>
                                            <th>Class</th>
                                            <th>Average Marks</th>
                                            <th>Rank</th>
                                            <th>Attendance</th>
                                            <th>Performance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {studentPerformance.map(student => (
                                            <tr key={student.id}>
                                                <td><span className="badge badge-primary">{student.id}</span></td>
                                                <td className="font-semibold">{student.name}</td>
                                                <td>{student.class}</td>
                                                <td className="font-semibold">{student.average}%</td>
                                                <td>#{student.rank}</td>
                                                <td>{student.attendance}</td>
                                                <td>
                                                    <div className="performance-bar">
                                                        <div
                                                            className="performance-fill"
                                                            style={{
                                                                width: `${student.average}%`,
                                                                background: getPerformanceColor(student.average)
                                                            }}
                                                        ></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Class Analysis Tab */}
                    {activeTab === 'class' && (
                        <div className="report-container glass-card">
                            <div className="report-header">
                                <h3>Class-wise Result Analysis</h3>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => downloadCSV(classAnalysis, 'class_analysis_report.csv')}
                                >
                                    <Download size={18} />
                                    Download CSV
                                </button>
                            </div>

                            <div className="class-cards-grid">
                                {classAnalysis.map((cls, idx) => (
                                    <div key={idx} className="class-analysis-card">
                                        <h4>{cls.class}</h4>
                                        <div className="analysis-stats">
                                            <div className="stat-row">
                                                <span className="stat-label">Total Students</span>
                                                <span className="stat-value-sm">{cls.students}</span>
                                            </div>
                                            <div className="stat-row">
                                                <span className="stat-label">Average Marks</span>
                                                <span className="stat-value-sm" style={{ color: getPerformanceColor(cls.averageMarks) }}>
                                                    {cls.averageMarks}%
                                                </span>
                                            </div>
                                            <div className="stat-row">
                                                <span className="stat-label">Pass Percentage</span>
                                                <span className="stat-value-sm success">{cls.passPercentage}%</span>
                                            </div>
                                            <div className="stat-row">
                                                <span className="stat-label">Toppers</span>
                                                <span className="stat-value-sm">{cls.toppers}</span>
                                            </div>
                                        </div>
                                        <div className="progress-bar" style={{ marginTop: '1rem' }}>
                                            <div
                                                className="progress-fill"
                                                style={{
                                                    width: `${cls.passPercentage}%`,
                                                    background: 'linear-gradient(135deg, #10b981, #059669)'
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Attendance Tab */}
                    {activeTab === 'attendance' && (
                        <div className="report-container glass-card">
                            <div className="report-header">
                                <h3>Attendance Summary Report</h3>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => downloadCSV(attendanceReport, 'attendance_report.csv')}
                                >
                                    <Download size={18} />
                                    Download CSV
                                </button>
                            </div>

                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Class</th>
                                            <th>Total Days</th>
                                            <th>Avg Attendance</th>
                                            <th>Above 75%</th>
                                            <th>Below 75%</th>
                                            <th>Visual</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendanceReport.map((report, idx) => (
                                            <tr key={idx}>
                                                <td className="font-semibold">{report.class}</td>
                                                <td>{report.totalDays}</td>
                                                <td className="font-semibold">{report.avgAttendance}</td>
                                                <td><span className="badge badge-success">{report.aboveThreshold}</span></td>
                                                <td><span className="badge badge-danger">{report.belowThreshold}</span></td>
                                                <td>
                                                    <div className="performance-bar">
                                                        <div
                                                            className="performance-fill"
                                                            style={{
                                                                width: report.avgAttendance,
                                                                background: 'linear-gradient(135deg, #10b981, #059669)'
                                                            }}
                                                        ></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Faculty Overview Tab */}
                    {activeTab === 'faculty' && (
                        <div className="report-container glass-card">
                            <div className="report-header">
                                <h3>Faculty Performance Overview</h3>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => downloadCSV(facultyPerformance, 'faculty_performance_report.csv')}
                                >
                                    <Download size={18} />
                                    Download CSV
                                </button>
                            </div>

                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Faculty ID</th>
                                            <th>Name</th>
                                            <th>Subject</th>
                                            <th>Classes</th>
                                            <th>Avg Student Score</th>
                                            <th>Attendance</th>
                                            <th>Performance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {facultyPerformance.map(faculty => (
                                            <tr key={faculty.id}>
                                                <td><span className="badge badge-primary">{faculty.id}</span></td>
                                                <td className="font-semibold">{faculty.name}</td>
                                                <td>{faculty.subject}</td>
                                                <td>{faculty.classes}</td>
                                                <td className="font-semibold">{faculty.avgStudentScore}%</td>
                                                <td>{faculty.attendance}</td>
                                                <td>
                                                    <div className="performance-bar">
                                                        <div
                                                            className="performance-fill"
                                                            style={{
                                                                width: `${faculty.avgStudentScore}%`,
                                                                background: getPerformanceColor(faculty.avgStudentScore)
                                                            }}
                                                        ></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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
          padding: 1.5rem;
          max-width: 1600px;
          margin: 0 auto;
          width: 100%;
        }

        .page-header {
          margin-bottom: 2rem;
        }

        .page-header h1 {
          font-size: 2.5rem;
          margin: 0 0 0.5rem 0;
          color: #1e293b;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
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
          font-size: 2rem;
          font-weight: 800;
          margin: 0;
          color: #1e293b;
        }

        .tabs-container {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          border-bottom: 2px solid #e2e8f0;
          flex-wrap: wrap;
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

        .report-container {
          padding: 1.5rem;
        }

        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .report-header h3 {
          margin: 0;
          color: #1e293b;
          font-size: 1.5rem;
        }

        .table-container {
          overflow-x: hidden;
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

        .font-semibold {
          font-weight: 600;
        }

        .performance-bar {
          width: 100px;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .performance-fill {
          height: 100%;
          transition: width 0.3s ease;
          border-radius: 4px;
        }

        .class-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .class-analysis-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          border: 2px solid #e2e8f0;
        }

        .class-analysis-card h4 {
          margin: 0 0 1rem 0;
          color: #FEA3BE;
          font-size: 1.25rem;
        }

        .analysis-stats {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #64748b;
        }

        .stat-value-sm {
          font-weight: 700;
          color: #1e293b;
          font-size: 1.1rem;
        }

        .stat-value-sm.success {
          color: #10b981;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .admin-content {
            padding: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .tabs-container {
            overflow-x: auto;
            flex-wrap: nowrap;
          }

          .report-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .table-container {
            overflow-x: auto;
          }

          .data-table {
            min-width: 800px;
          }
        }
      `}</style>
        </div>
    );
};

export default Reports;

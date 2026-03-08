import React, { useState, useEffect } from 'react';
import { useAttendance } from '../../contexts/AttendanceContext';
import { useStudents } from '../../contexts/StudentsContext';
import { useClasses } from '../../contexts/ClassesContext';
import Sidebar from '../shared/Sidebar';
import { Calendar, UserCheck, X, Check, Download, TrendingUp, BarChart3 } from 'lucide-react';

const AttendanceManagement = () => {
  const { saveAttendance, getAttendance } = useAttendance();
  const { students: allStudents } = useStudents();
  const { classes } = useClasses();

  const [activeTab, setActiveTab] = useState('mark'); // mark, view, analytics
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [students, setStudents] = useState([]); // For Mark Attendance

  // For View/Analytics
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  // Set default selected class
  useEffect(() => {
    if (!selectedClass && classes.length > 0) {
      setSelectedClass(classes[0].code);
    }
  }, [classes, selectedClass]);

  // Load students for Mark Attendance tab
  useEffect(() => {
    const fetchDailyAttendance = async () => {
      if (selectedClass && activeTab === 'mark') {
        try {
          // 1. Get students for class
          const classStudents = allStudents
            .filter(s => s.classCode === selectedClass)
            .map(s => ({
              id: s.id,
              name: `${s.firstName} ${s.middleName || ''} ${s.lastName}`.trim(),
              status: 'present' // Default
            }));

          // 2. Get existing attendance from API
          const records = await getAttendance(selectedDate, selectedClass);

          if (records && records.length > 0) {
            // Merge existing status
            const merged = classStudents.map(s => {
              const record = records.find(r => r.studentId === s.id);
              return { ...s, status: record ? record.status : 'present' };
            });
            setStudents(merged);
          } else {
            setStudents(classStudents);
          }
        } catch (err) {
          console.error(err);
          // Fallback to defaults
          const classStudents = allStudents
            .filter(s => s.classCode === selectedClass)
            .map(s => ({
              id: s.id,
              name: `${s.firstName} ${s.middleName || ''} ${s.lastName}`.trim(),
              status: 'present'
            }));
          setStudents(classStudents);
        }
      }
    };
    fetchDailyAttendance();
  }, [selectedClass, selectedDate, allStudents, activeTab]);

  // Load History for View/Analytics
  useEffect(() => {
    const fetchHistory = async () => {
      if ((activeTab === 'view' || activeTab === 'analytics') && selectedClass && dateRange.from && dateRange.to) {
        setLoadingHistory(true);
        try {
          // Fetch range: getAttendance(date, classCode, startDate, endDate)
          const records = await getAttendance(null, selectedClass, dateRange.from, dateRange.to);
          if (records) {
            setHistory(records);
          } else {
            setHistory([]);
          }
          setLoadingHistory(false);
        } catch (e) {
          console.error(e);
          setLoadingHistory(false);
        }
      }
    };

    fetchHistory();
  }, [activeTab, selectedClass, dateRange, getAttendance]);


  const toggleAttendance = (id) => {
    setStudents(students.map(student =>
      student.id === id
        ? { ...student, status: student.status === 'present' ? 'absent' : 'present' }
        : student
    ));
  };

  const handleSave = async () => {
    setSuccessMessage('');
    setErrorMessage('');
    const result = await saveAttendance(selectedDate, selectedClass, students);
    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => setSuccessMessage(''), 3000);

      const presentCount = students.filter(s => s.status === 'present').length;
      const percentage = ((presentCount / students.length) * 100).toFixed(1);
      // Optional: don't alert, just message
    } else {
      setErrorMessage(result.message);
    }
  };

  const presentCount = students.filter(s => s.status === 'present').length;
  const percentage = students.length > 0 ? ((presentCount / students.length) * 100).toFixed(1) : '0';

  return (
    <div className="admin-layout">
      <Sidebar role="admin" />

      <div className="admin-main">
        <div className="admin-content">
          <div className="page-header">
            <div>
              <h1>Attendance Management</h1>
              <p className="text-secondary">Track and manage student attendance</p>
            </div>
          </div>

          {successMessage && (
            <div className="success-banner">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="error-banner" style={{ padding: '1rem', marginBottom: '1.5rem', background: '#fee2e2', color: '#dc2626', borderRadius: '8px' }}>
              {errorMessage}
            </div>
          )}

          {/* Tabs */}
          <div className="tabs-container">
            <button
              className={`tab-btn ${activeTab === 'mark' ? 'active' : ''}`}
              onClick={() => setActiveTab('mark')}
            >
              <UserCheck size={20} />
              Mark Attendance
            </button>
            <button
              className={`tab-btn ${activeTab === 'view' ? 'active' : ''}`}
              onClick={() => setActiveTab('view')}
            >
              <Calendar size={20} />
              View Records
            </button>
          </div>

          {/* Mark Attendance Tab */}
          {activeTab === 'mark' && (
            <>
              <div className="attendance-controls glass-card">
                <div className="control-group">
                  <label className="input-label">Select Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>

                <div className="control-group">
                  <label className="input-label">Select Class</label>
                  <select
                    className="input-field"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.code}>{cls.name} ({cls.code})</option>
                    ))}
                  </select>
                </div>

                <div className="attendance-summary">
                  <div className="summary-item">
                    <span className="summary-label">Present</span>
                    <span className="summary-value success">{presentCount}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Absent</span>
                    <span className="summary-value danger">{students.length - presentCount}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Percentage</span>
                    <span className="summary-value">{percentage}%</span>
                  </div>
                </div>
              </div>

              <div className="attendance-list glass-card">
                <h3>Mark Attendance</h3>
                <div className="student-attendance-grid">
                  {students.length === 0 ? <p>No students found in this class.</p> : students.map(student => (
                    <div key={student.id} className={`attendance-item ${student.status}`}>
                      <div className="student-info">
                        <span className="student-id">{student.id}</span>
                        <span className="student-name">{student.name}</span>
                      </div>
                      <button
                        className={`attendance-btn ${student.status}`}
                        onClick={() => toggleAttendance(student.id)}
                      >
                        {student.status === 'present' ? (
                          <>
                            <Check size={16} />
                            Present
                          </>
                        ) : (
                          <>
                            <X size={16} />
                            Absent
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
                {students.length > 0 && (
                  <button className="btn btn-primary" onClick={handleSave} style={{ marginTop: '2rem' }}>
                    Save Attendance
                  </button>
                )}
              </div>
            </>
          )}

          {/* View Records Tab */}
          {activeTab === 'view' && (
            <div className="records-container glass-card">
              <div className="records-header">
                <h3>Attendance Records</h3>
                <div className="date-range-controls">
                  <div className="control-group">
                    <label className="input-label">From</label>
                    <input
                      type="date"
                      className="input-field"
                      value={dateRange.from}
                      onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                    />
                  </div>
                  <div className="control-group">
                    <label className="input-label">To</label>
                    <input
                      type="date"
                      className="input-field"
                      value={dateRange.to}
                      onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                    />
                  </div>
                  {/* Export button can be re-added here */}
                </div>
              </div>

              {loadingHistory ? (
                <p>Loading records...</p>
              ) : (
                <div className="attendance-records-table">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Student Name</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.length === 0 ? (
                        <tr><td colSpan="3">No records found for this period.</td></tr>
                      ) : (
                        history.map((record, idx) => {
                          const student = allStudents.find(s => s.id === record.studentId);
                          const studentName = student
                            ? `${student.firstName} ${student.lastName}`
                            : `Unknown (${record.studentId})`;
                          return (
                            <tr key={idx}>
                              <td>{record.date}</td>
                              <td>{studentName}</td>
                              <td>
                                <span className={`badge badge-${record.status === 'present' ? 'success' : 'danger'}`}>
                                  {record.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .admin-layout { display: flex; min-height: 100vh; background: #ffffff; }
        .admin-main { flex: 1; display: flex; flex-direction: column; }
        .admin-content { flex: 1; padding: 1.5rem; max-width: 1600px; margin: 0 auto; width: 100%; }
        .page-header { margin-bottom: 2rem; }
        .page-header h1 { font-size: 2.5rem; margin: 0 0 0.5rem 0; color: #1e293b; }
        .success-banner { padding: 1rem; margin-bottom: 1.5rem; background: linear-gradient(135deg, #10b981, #059669); color: white; border-radius: 8px; text-align: center; font-weight: 600; }
        .tabs-container { display: flex; gap: 1rem; margin-bottom: 2rem; border-bottom: 2px solid #e2e8f0; }
        .tab-btn { display: flex; align-items: center; gap: 0.5rem; padding: 1rem 1.5rem; background: none; border: none; border-bottom: 3px solid transparent; color: #64748b; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .tab-btn:hover { color: #FEA3BE; }
        .tab-btn.active { color: #FEA3BE; border-bottom-color: #FEA3BE; }
        .attendance-controls { padding: 1.5rem; margin-bottom: 2rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
        .control-group { display: flex; flex-direction: column; }
        .attendance-summary { display: flex; gap: 1.5rem; align-items: center; grid-column: 1 / -1; }
        .summary-item { display: flex; flex-direction: column; align-items: center; padding: 1rem; background: white; border-radius: 8px; min-width: 100px; border: 2px solid #e2e8f0; }
        .summary-label { font-size: 0.85rem; color: #64748b; margin-bottom: 0.5rem; }
        .summary-value { font-size: 2rem; font-weight: 800; color: #1e293b; }
        .summary-value.success { color: #10b981; }
        .summary-value.danger { color: #ef4444; }
        .attendance-list { padding: 1.5rem; }
        .attendance-list h3 { margin-bottom: 1.5rem; color: #1e293b; }
        .student-attendance-grid { display: grid; gap: 1rem; }
        .attendance-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; background: white; border-radius: 8px; border: 2px solid transparent; transition: all 0.2s; }
        .attendance-item.present { border-color: #10b981; background: rgba(16, 185, 129, 0.05); }
        .attendance-item.absent { border-color: #ef4444; background: rgba(239, 68, 68, 0.05); }
        .student-info { display: flex; flex-direction: column; gap: 0.25rem; }
        .student-id { font-size: 0.85rem; color: #64748b; }
        .student-name { font-size: 1.1rem; font-weight: 600; color: #1e293b; }
        .attendance-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .attendance-btn.present { background: linear-gradient(135deg, #10b981, #059669); color: white; }
        .attendance-btn.absent { background: white; color: #ef4444; border: 2px solid #ef4444; }
        .attendance-btn:hover { transform: scale(1.05); }
        .records-container { padding: 1.5rem; }
        @media (max-width: 1024px) { .admin-content { padding-top: 6.5rem; padding-left: 1rem; padding-right: 1rem; } }
        @media (max-width: 768px) { .admin-content { padding: 1rem; } .attendance-controls { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default AttendanceManagement;

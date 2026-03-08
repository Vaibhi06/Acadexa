import React, { useState } from 'react';
import { useStudents } from '../../contexts/StudentsContext';
import Sidebar from '../shared/Sidebar';
import { Search, Filter, Eye, Edit2, Trash2, UserCircle, X, Mail, Phone, MapPin, Calendar as CalendarIcon, Users as UsersIcon, Award, DollarSign, TrendingUp } from 'lucide-react';

const AllStudents = () => {
  const { students: contextStudents, deleteStudent } = useStudents();
  const students = contextStudents;

  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === 'all' || student.classCode === filterClass;
    return matchesSearch && matchesClass;
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      deleteStudent(id);
    }
  };

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
    setShowProfile(true);
  };

  const closeProfile = () => {
    setShowProfile(false);
    setSelectedStudent(null);
  };

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="admin-layout">
      <Sidebar role="admin" />

      <div className="admin-main">
        <div className="admin-content">
          <div className="page-header">
            <div>
              <h1>Student Info</h1>
              <p className="text-secondary">Manage all enrolled students</p>
            </div>
            <div className="header-stats">
              <div className="stat-badge gradient-card" style={{ background: 'linear-gradient(135deg, #FEA3BE, #FBA2AB)' }}>
                <span className="stat-number">{students.length}</span>
                <span className="stat-label">Total Students</span>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="search-filter-bar glass-card">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search by name or student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-box">
              <Filter size={20} />
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Classes</option>
                <option value="10th Grade A">10th Grade A</option>
                <option value="10th Grade B">10th Grade B</option>
                <option value="11th Grade A">11th Grade A</option>
                <option value="12th Grade A">12th Grade A</option>
              </select>
            </div>
          </div>

          {/* Students Table */}
          <div className="table-container glass-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Email</th>

                  <th>Phone</th>
                  <th>Attendance</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student.id}>
                    <td>
                      <span className="badge badge-primary">{student.id}</span>
                    </td>
                    <td>
                      <div className="student-cell">
                        <div className="student-avatar gradient-card">
                          <UserCircle size={20} />
                        </div>
                        <span className="student-name">{student.name}</span>
                      </div>
                    </td>
                    <td>{student.classCode}</td>
                    <td className="text-secondary">{student.email}</td>

                    <td className="text-secondary">{student.phone}</td>
                    <td>
                      <div className="attendance-bar">
                        <div
                          className="attendance-fill"
                          style={{ width: student.attendance }}
                        ></div>
                        <span className="attendance-text">{student.attendance}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${student.status === 'active' ? 'success' : 'danger'}`}>
                        {student.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="icon-btn" title="View" onClick={() => handleViewProfile(student)}>
                          <Eye size={16} />
                        </button>
                        <button className="icon-btn" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button className="icon-btn" title="Delete" onClick={() => handleDelete(student.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Student Profile Modal */}
          {showProfile && selectedStudent && (
            <div className="modal-overlay" onClick={closeProfile}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <div className="profile-header-info">
                    <div className="profile-avatar-large gradient-card">
                      <UserCircle size={40} />
                    </div>
                    <div>
                      <h2>{selectedStudent.name}</h2>
                      <p className="text-secondary">{selectedStudent.id} • {selectedStudent.classCode}</p>
                    </div>
                  </div>
                  <button className="close-btn" onClick={closeProfile}>
                    <X size={24} />
                  </button>
                </div>

                <div className="modal-body">
                  {/* Personal Information */}
                  <div className="profile-section">
                    <h3>📋 Personal Information</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <Mail size={18} />
                        <div>
                          <p className="info-label">Email</p>
                          <p className="info-value">{selectedStudent.email}</p>
                        </div>
                      </div>
                      <div className="info-item">
                        <Phone size={18} />
                        <div>
                          <p className="info-label">Phone</p>
                          <p className="info-value">{selectedStudent.phone}</p>
                        </div>
                      </div>
                      <div className="info-item">
                        <CalendarIcon size={18} />
                        <div>
                          <p className="info-label">Date of Birth</p>
                          <p className="info-value">{new Date(selectedStudent.dateOfBirth).toLocaleDateString()} ({calculateAge(selectedStudent.dateOfBirth)} years)</p>
                        </div>
                      </div>
                      <div className="info-item">
                        <UsersIcon size={18} />
                        <div>
                          <p className="info-label">Gender</p>
                          <p className="info-value" style={{ textTransform: 'capitalize' }}>{selectedStudent.gender}</p>
                        </div>
                      </div>
                      <div className="info-item">
                        <MapPin size={18} />
                        <div>
                          <p className="info-label">Address</p>
                          <p className="info-value">{selectedStudent.address}, {selectedStudent.city}</p>
                        </div>
                      </div>
                      <div className="info-item">
                        <CalendarIcon size={18} />
                        <div>
                          <p className="info-label">Joining Date</p>
                          <p className="info-value">{new Date(selectedStudent.joiningDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Guardian Information */}
                  <div className="profile-section">
                    <h3>👨‍👩‍👧 Guardian Information</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <UsersIcon size={18} />
                        <div>
                          <p className="info-label">Guardian Name</p>
                          <p className="info-value">{selectedStudent.guardianName}</p>
                        </div>
                      </div>
                      <div className="info-item">
                        <Phone size={18} />
                        <div>
                          <p className="info-label">Guardian Phone</p>
                          <p className="info-value">{selectedStudent.guardianPhone}</p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Academic Performance */}
                  {selectedStudent.marks && selectedStudent.marks.length > 0 && (
                    <div className="profile-section">
                      <h3>📊 Academic Performance</h3>
                      <div className="marks-table">
                        <table>
                          <thead>
                            <tr>
                              <th>Subject</th>
                              <th>Marks Obtained</th>
                              <th>Max Marks</th>
                              <th>Percentage</th>
                              <th>Grade</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedStudent.marks.map((mark, idx) => (
                              <tr key={idx}>
                                <td>{mark.subject}</td>
                                <td className="marks-value">{mark.marks}</td>
                                <td>{mark.maxMarks}</td>
                                <td>{((mark.marks / mark.maxMarks) * 100).toFixed(1)}%</td>
                                <td><span className="grade-badge">{mark.grade}</span></td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td><strong>Overall</strong></td>
                              <td><strong>{selectedStudent.marks.reduce((sum, m) => sum + m.marks, 0)}</strong></td>
                              <td><strong>{selectedStudent.marks.reduce((sum, m) => sum + m.maxMarks, 0)}</strong></td>
                              <td><strong>{((selectedStudent.marks.reduce((sum, m) => sum + m.marks, 0) / selectedStudent.marks.reduce((sum, m) => sum + m.maxMarks, 0)) * 100).toFixed(1)}%</strong></td>
                              <td></td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Attendance */}
                  <div className="profile-section">
                    <h3>📅 Attendance</h3>
                    <div className="attendance-stats">
                      <div className="attendance-stat-card">
                        <TrendingUp size={24} />
                        <div>
                          <p className="stat-label">Overall Attendance</p>
                          <p className="stat-value">{selectedStudent.attendance}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fee Status */}
                  {selectedStudent.fees && (
                    <div className="profile-section">
                      <h3>💰 Fee Status</h3>
                      <div className="fee-cards">
                        <div className="fee-card">
                          <DollarSign size={20} />
                          <div>
                            <p className="fee-label">Total Fees</p>
                            <p className="fee-value">₹{selectedStudent.fees.total.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="fee-card success">
                          <Award size={20} />
                          <div>
                            <p className="fee-label">Paid</p>
                            <p className="fee-value">₹{selectedStudent.fees.paid.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="fee-card warning">
                          <DollarSign size={20} />
                          <div>
                            <p className="fee-label">Pending</p>
                            <p className="fee-value">₹{selectedStudent.fees.pending.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
        }

        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
        }

        .admin-content {
          flex: 1;
          padding: 1.5rem;
          max-width: 1600px;
          margin: 0 auto;
          width: 100%;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .page-header h1 {
          font-size: 2.5rem;
          margin: 0 0 0.5rem 0;
        }

        .page-header p {
          margin: 0;
        }

        .header-stats {
          display: flex;
          gap: 1rem;
        }

        .stat-badge {
          padding: 1rem 1.5rem;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 120px;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          color: white;
        }

        .stat-label {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.9);
        }

        .search-filter-bar {
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          min-width: 300px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--bg-card);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--glass-border);
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-size: 1rem;
        }

        .search-input::placeholder {
          color: var(--text-muted);
        }

        .filter-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--bg-card);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--glass-border);
        }

        .filter-select {
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-size: 1rem;
          cursor: pointer;
        }

        .table-container {
          padding: 1.5rem;
          overflow-x: hidden;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table thead tr {
          border-bottom: 2px solid var(--glass-border);
        }

        .data-table th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: var(--text-secondary);
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .data-table td {
          padding: 0.75rem;
          border-bottom: 1px solid var(--glass-border);
        }

        .data-table tbody tr {
          transition: var(--transition-fast);
        }

        .data-table tbody tr:hover {
          background: var(--bg-card-hover);
        }

        .student-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .student-avatar {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .student-name {
          font-weight: 500;
        }

        .attendance-bar {
          position: relative;
          width: 100px;
          height: 24px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .attendance-fill {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background: var(--success-gradient);
          border-radius: var(--radius-full);
          transition: width 0.3s ease;
        }

        .attendance-text {
          position: absolute;
          width: 100%;
          text-align: center;
          line-height: 24px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }


        @media (max-width: 1024px) {
          .admin-content {
            padding-top: 6.5rem;
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }

        @media (max-width: 768px) {
          .admin-content {
            padding: 1rem;
          }

          .page-header {
            flex-direction: column;
            gap: 1rem;
          }

          .page-header h1 {
            font-size: 2rem;
          }

          .search-filter-bar {
            flex-direction: column;
          }

          .search-box {
            min-width: 100%;
          }

          .table-container {
            overflow-x: scroll;
          }

          .data-table {
            min-width: 800px;
          }
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: var(--bg-primary);
          border-radius: var(--radius-lg);
          border: 1px solid var(--glass-border);
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          padding: 2rem;
          border-bottom: 1px solid var(--glass-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--glass-bg);
        }

        .profile-header-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .profile-avatar-large {
          width: 70px;
          height: 70px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-header h2 {
          margin: 0 0 0.25rem 0;
          font-size: 1.75rem;
        }

        .close-btn {
          background: var(--bg-card);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-primary);
          transition: var(--transition-fast);
        }

        .close-btn:hover {
          background: var(--bg-card-hover);
          border-color: var(--danger);
          color: var(--danger);
        }

        .modal-body {
          padding: 2rem;
        }

        .profile-section {
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--glass-border);
        }

        .profile-section:last-child {
          border-bottom: none;
        }

        .profile-section h3 {
          margin: 0 0 1.5rem 0;
          font-size: 1.25rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .info-item {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .info-item > svg {
          color: var(--primary);
          flex-shrink: 0;
          margin-top: 0.25rem;
        }

        .info-label {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin: 0 0 0.25rem 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-value {
          margin: 0;
          color: var(--text-primary);
          font-weight: 500;
        }

        .marks-table {
          overflow-x: auto;
        }

        .marks-table table {
          width: 100%;
          border-collapse: collapse;
        }

        .marks-table th,
        .marks-table td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid var(--glass-border);
        }

        .marks-table thead th {
          background: var(--bg-card);
          font-weight: 600;
          color: var(--text-secondary);
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .marks-table tbody tr:hover {
          background: var(--bg-card-hover);
        }

        .marks-value {
          color: var(--primary);
          font-weight: 600;
        }

        .grade-badge {
          background: var(--success-gradient);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          font-weight: 600;
        }

        .marks-table tfoot td {
          background: var(--bg-card);
          font-weight: 600;
          border-top: 2px solid var(--glass-border);
        }

        .attendance-stats {
          display: flex;
          gap: 1rem;
        }

        .attendance-stat-card {
          flex: 1;
          background: var(--glass-bg);
          padding: 1.5rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--glass-border);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .attendance-stat-card svg {
          color: var(--success);
        }

        .attendance-stat-card .stat-label {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin: 0 0 0.25rem 0;
        }

        .attendance-stat-card .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          color: var(--text-primary);
        }

        .fee-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .fee-card {
          background: var(--glass-bg);
          padding: 1.5rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--glass-border);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .fee-card.success {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
          border-color: var(--success);
        }

        .fee-card.warning {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1));
          border-color: var(--warning);
        }

        .fee-card svg {
          color: var(--primary);
        }

        .fee-card.success svg {
          color: var(--success);
        }

        .fee-card.warning svg {
          color: var(--warning);
        }

        .fee-label {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin: 0 0 0.25rem 0;
        }

        .fee-value {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0;
        }

        @media (max-width: 768px) {
          .modal-overlay {
            padding: 1rem;
          }

          .modal-content {
            max-height: 95vh;
          }

          .modal-header {
            padding: 1.5rem 1rem;
          }

          .modal-body {
            padding: 1.5rem 1rem;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .fee-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AllStudents;

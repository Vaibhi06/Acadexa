import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClasses } from '../../contexts/ClassesContext';
import { useStudents } from '../../contexts/StudentsContext';
import Sidebar from '../shared/Sidebar';
import { 
  Plus, Edit2, Trash2, Users, BookOpen, 
  X, Search, Filter, RotateCw, ChevronRight, UserPlus
} from 'lucide-react';

const ClassManagement = () => {
  const { classes, addClass, deleteClass, loading, error, refreshClasses } = useClasses();
  const { students } = useStudents();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [viewClass, setViewClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    year: '2024-25',
    faculty: ''
  });

  const getStudentCount = (classCode) => {
    return students.filter(s => s.classCode === classCode).length;
  };

  const filteredClasses = classes.filter(cls => 
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    cls.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cls.faculty && cls.faculty.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await addClass(formData);
    if (result.success) {
      setShowModal(false);
      setFormData({ name: '', code: '', year: '2024-25', faculty: '' });
    } else {
      alert(result.message || 'Failed to create class');
    }
    setSubmitting(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      deleteClass(id);
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar role="admin" />

      <div className="admin-main">
        <div className="admin-content">
          <div className="page-header">
            <div className="header-title">
              <h1>Class Management</h1>
              <p>Manage all classes and batches</p>
            </div>
            <button className="create-btn" onClick={() => setShowModal(true)}>
              <Plus size={20} />
              <span>Create New</span>
            </button>
          </div>

          {error && (
            <div className="error-alert">
              <span>⚠️ {error}</span>
              <button onClick={refreshClasses}>Retry</button>
            </div>
          )}

          <div className="class-grid">
            {filteredClasses.map((cls) => (
              <div key={cls.id} className="class-card">
                <div className="card-top">
                  <div className="icon-box">
                    <BookOpen size={24} />
                  </div>
                  <div className="quick-actions">
                    <button className="action-icon"><Edit2 size={16} /></button>
                    <button className="action-icon" onClick={() => handleDelete(cls.id)}><Trash2 size={16} /></button>
                  </div>
                </div>

                <div className="card-body">
                  <h3 className="class-name">{cls.name}</h3>
                  <div className="class-meta">
                    <span className="label">Code:</span>
                    <span className="code-badge">{cls.code}</span>
                    <span className="label year-label">Year:</span>
                    <span className="value">{cls.year}</span>
                  </div>
                  
                  <div className="divider"></div>
                  
                  <div className="stats-row">
                    <Users size={16} className="pink-text" />
                    <span>{getStudentCount(cls.code)} {getStudentCount(cls.code) === 1 ? 'Student' : 'Students'}</span>
                  </div>
                  
                  <div className="faculty-row">
                    <span className="label">Faculty:</span>
                    <span className="value">{cls.faculty || 'Unassigned'}</span>
                  </div>
                </div>

                <button className="view-students-btn" onClick={() => setViewClass(cls)}>
                  <Users size={18} />
                  <span>View Students</span>
                </button>
              </div>
            ))}
          </div>

          {!loading && classes.length === 0 && (
            <div className="empty-state">
              <BookOpen size={64} />
              <h2>No Classes Found</h2>
              <p>Start by creating your first academic class.</p>
              <button className="create-btn" onClick={() => setShowModal(true)}>Create Class</button>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h2>Create New Class</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Class Name</label>
                  <input
                    type="text"
                    placeholder="e.g. 10th Grade A"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Class Code</label>
                  <input
                    type="text"
                    placeholder="e.g. 10A"
                    value={formData.code}
                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Academic Year</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={e => setFormData({ ...formData, year: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Faculty In-charge</label>
                  <input
                    type="text"
                    placeholder="Enter faculty name"
                    value={formData.faculty}
                    onChange={e => setFormData({ ...formData, faculty: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Students Modal */}
      {viewClass && (
        <div className="modal-overlay">
          <div className="modal-card large">
            <div className="modal-header">
              <div>
                <h2>{viewClass.name} ({viewClass.code})</h2>
                <p>Enrolled Students</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                  className="create-btn"
                  onClick={() => { setViewClass(null); setShowModal(true); }}
                  style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}
                >
                  <Plus size={16} />
                  <span>Create Class</span>
                </button>
                <button className="close-btn" onClick={() => setViewClass(null)}><X size={24} /></button>
              </div>
            </div>
            <div className="modal-body-scroll">
              <table className="student-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {students.filter(s => s.classCode === viewClass.code).map(student => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.id}</td>
                      <td>{student.email}</td>
                      <td>{student.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {students.filter(s => s.classCode === viewClass.code).length === 0 && (
                <div className="empty-mini">No students enrolled yet.</div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        .admin-main {
          flex: 1;
          margin-left: 280px;
        }

        .admin-content {
          padding: 2.5rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2.5rem;
        }

        .header-title h1 {
          font-size: 2rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 0.25rem 0;
        }

        .header-title p {
          color: #64748b;
          margin: 0;
        }

        .create-btn {
          background: #FEA3BE;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 6px -1px rgba(254, 163, 190, 0.2);
        }

        .create-btn:hover {
          background: #FBA2AB;
          transform: translateY(-1px);
        }

        .class-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
        }

        .class-card {
          background: white;
          border-radius: 20px;
          padding: 1.5rem;
          border-left: 4px solid #FEA3BE;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s;
          position: relative;
        }

        .class-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.25rem;
        }

        .icon-box {
          width: 48px;
          height: 48px;
          background: #FFF1F2;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FEA3BE;
        }

        .quick-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-icon {
          width: 32px;
          height: 32px;
          border: 1px solid #f1f5f9;
          background: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-icon:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #1e293b;
        }

        .class-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 1rem 0;
        }

        .class-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
          font-size: 0.9rem;
        }

        .label {
          color: #64748b;
          font-weight: 500;
        }

        .code-badge {
          background: #FFF1F2;
          color: #FEA3BE;
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.8rem;
        }

        .year-label {
          margin-left: 1rem;
        }

        .value {
          color: #334155;
          font-weight: 600;
        }

        .divider {
          height: 1px;
          background: #f1f5f9;
          margin: 1.25rem 0;
        }

        .stats-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
          font-size: 0.95rem;
          color: #475569;
          font-weight: 500;
        }

        .pink-text {
          color: #FEA3BE;
        }

        .faculty-row {
          font-size: 0.95rem;
          margin-bottom: 1.5rem;
        }

        .view-students-btn {
          width: 100%;
          background: #FEA3BE;
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .view-students-btn:hover {
          background: #FBA2AB;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }

        .modal-card {
          background: white;
          width: 100%;
          max-width: 550px;
          border-radius: 24px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .modal-card.large {
          max-width: 900px;
        }

        .modal-header {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.5rem;
          color: #1e293b;
        }

        .close-btn {
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
        }

        .form-grid {
          padding: 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 600;
          color: #475569;
          font-size: 0.9rem;
        }

        .form-group input {
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          outline: none;
        }

        .form-group input:focus {
          border-color: #FEA3BE;
        }

        .modal-footer {
          padding: 1.5rem 2rem;
          background: #f8fafc;
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }

        .cancel-btn {
          padding: 0.75rem 1.5rem;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 10px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
        }

        .submit-btn {
          padding: 0.75rem 1.5rem;
          background: #FEA3BE;
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
        }

        .modal-body-scroll {
          padding: 2rem;
          max-height: 60vh;
          overflow-y: auto;
        }

        .student-table {
          width: 100%;
          border-collapse: collapse;
        }

        .student-table th {
          text-align: left;
          padding: 1rem;
          border-bottom: 2px solid #f1f5f9;
          color: #64748b;
          font-weight: 600;
        }

        .student-table td {
          padding: 1rem;
          border-bottom: 1px solid #f1f5f9;
          color: #1e293b;
        }

        .error-alert {
          background: #fee2e2;
          color: #ef4444;
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #94a3b8;
        }

        .empty-state h2 {
          color: #1e293b;
          margin: 1.5rem 0 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default ClassManagement;

import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Sidebar from '../shared/Sidebar';
import { Plus, Calendar, Clock, Book, Trash2 } from 'lucide-react';

const ExamsManagement = () => {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await api.get('/exams');
      setExams(response.data);
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    subject: '',
    date: '',
    time: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newExam = {
        ...formData,
        status: 'upcoming'
      };
      await api.post('/exams', newExam);
      fetchExams(); // Refresh list
      setShowModal(false);
      setFormData({ name: '', class: '', subject: '', date: '', time: '' });
    } catch (error) {
      console.error('Error creating exam:', error);
      alert('Failed to create exam');
    }
  };

  const deleteExam = async (id) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await api.delete(`/exams/${id}`);
        setExams(exams.filter(e => e.id !== id));
      } catch (error) {
        console.error('Error deleting exam:', error);
        alert('Failed to delete exam');
      }
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar role="admin" />

      <div className="admin-main">
        <div className="admin-content">
          <div className="page-header">
            <div>
              <h1>Exams Management</h1>
              <p className="text-secondary">Create and manage examinations</p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={20} />
              Create Exam
            </button>
          </div>

          <div className="exams-section">
            <h3 className="section-title">Upcoming Exams</h3>
            <div className="exams-grid">
              {exams.filter(e => e.status === 'upcoming').map(exam => (
                <div key={exam.id} className="exam-card">
                  <div className="exam-header">
                    <div>
                      <h4>{exam.name}</h4>
                      <span className="badge badge-warning">Upcoming</span>
                    </div>
                    <button className="delete-btn" onClick={() => deleteExam(exam.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="exam-details">
                    <div className="detail-row">
                      <Book size={18} />
                      <span><strong>Subject:</strong> {exam.subject}</span>
                    </div>
                    <div className="detail-row">
                      <Calendar size={18} />
                      <span><strong>Class:</strong> {exam.class}</span>
                    </div>
                    <div className="detail-row">
                      <Calendar size={18} />
                      <span><strong>Date:</strong> {exam.date}</span>
                    </div>
                    <div className="detail-row">
                      <Clock size={18} />
                      <span><strong>Time:</strong> {exam.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="exams-section">
            <h3 className="section-title">Completed Exams</h3>
            <div className="exams-grid">
              {exams.filter(e => e.status === 'completed').map(exam => (
                <div key={exam.id} className="exam-card completed">
                  <div className="exam-header">
                    <div>
                      <h4>{exam.name}</h4>
                      <span className="badge badge-success">Completed</span>
                    </div>
                    <button className="delete-btn" onClick={() => deleteExam(exam.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="exam-details">
                    <div className="detail-row">
                      <Book size={18} />
                      <span><strong>Subject:</strong> {exam.subject}</span>
                    </div>
                    <div className="detail-row">
                      <Calendar size={18} />
                      <span><strong>Class:</strong> {exam.class}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Create New Exam</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Exam Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="e.g., Mid-Term Exam"
                    />
                  </div>
                  <div className="form-group">
                    <label>Class</label>
                    <select
                      value={formData.class}
                      onChange={e => setFormData({ ...formData, class: e.target.value })}
                      required
                    >
                      <option value="">Select Class</option>
                      <option>10th Grade A</option>
                      <option>11th Grade B</option>
                      <option>12th Grade A</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      required
                      placeholder="e.g., Mathematics"
                    />
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Time</label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={e => setFormData({ ...formData, time: e.target.value })}
                      required
                    />
                  </div>
                  <div className="modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Create Exam</button>
                  </div>
                </form>
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
          max-width: 1600px;
          margin: 0 auto;
          width: 100%;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2.5rem;
        }

        .page-header h1 {
          font-size: 2rem;
          margin: 0 0 0.5rem 0;
          color: #000000;
          font-weight: 700;
        }

        .text-secondary {
          color: #000000;
          font-size: 1rem;
          margin: 0;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(254, 163, 190, 0.4);
        }

        .btn-secondary {
          background: #e2e8f0;
          color: #000000;
        }

        .btn-secondary:hover {
          background: #cbd5e1;
        }

        .exams-section {
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #000000;
          margin-bottom: 1.5rem;
          position: relative;
          padding-left: 1rem;
        }

        .section-title::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
          border-radius: 2px;
        }

        .exams-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .exam-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          border-left: 4px solid #FEA3BE;
          transition: all 0.3s ease;
        }

        .exam-card.completed {
          border-left-color: #10b981;
          opacity: 0.9;
        }

        .exam-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .exam-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.25rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f1f5f9;
        }

        .exam-header h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
          color: #000000;
          font-weight: 700;
        }

        .delete-btn {
          background: none;
          border: none;
          color: #ef4444;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .delete-btn:hover {
          background: #fef2f2;
        }

        .badge {
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .badge-warning {
          background: #fef3c7;
          color: #d97706;
        }

        .badge-success {
          background: #d1fae5;
          color: #059669;
        }

        .exam-details {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }

        .detail-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #000000;
          font-size: 0.9rem;
        }

        .detail-row svg {
          color: #ff8c00;
          flex-shrink: 0;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          padding: 2rem;
        }

        .modal-content h2 {
          margin: 0 0 1.5rem 0;
          font-size: 1.5rem;
          color: #000000;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #000000;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #FEA3BE;
          box-shadow: 0 0 0 3px rgba(254, 163, 190, 0.1);
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 2px solid #f1f5f9;
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

          .exams-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ExamsManagement;

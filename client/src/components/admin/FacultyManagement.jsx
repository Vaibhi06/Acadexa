import api from '../../utils/api';
import React, { useState, useEffect } from 'react';
import Sidebar from '../shared/Sidebar';
import { Plus, PenLine, Trash2, GraduationCap, Mail, Phone } from 'lucide-react';

const FacultyManagement = () => {
    const [faculty, setFaculty] = useState([]);

    useEffect(() => {
        fetchFaculty();
    }, []);

    const fetchFaculty = async () => {
        try {
            const response = await api.get('/faculty');
            setFaculty(response.data);
        } catch (error) {
            console.error('Error fetching faculty:', error);
        }
    };

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subjects: '',
        classes: '',
        salary: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newFaculty = {
                // Generate a temporary ID or let backend handle it.
                // For display purposes, we might want to generate one or let backend return it.
                facultyId: 'FAC' + String(Date.now()).slice(-3),
                ...formData,
                subjects: formData.subjects.split(',').map(s => s.trim()),
                classes: formData.classes.split(',').map(c => c.trim())
            };

            await api.post('/faculty', newFaculty);
            fetchFaculty(); // Refresh
            setShowModal(false);
            setFormData({ name: '', email: '', phone: '', subjects: '', classes: '', salary: '' });
        } catch (error) {
            console.error('Error creating faculty:', error);
            alert('Failed to add faculty');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this faculty member?')) {
            try {
                await api.delete(`/faculty/${id}`);
                setFaculty(faculty.filter(f => f.id !== id));
            } catch (error) {
                console.error('Error deleting faculty:', error);
                alert('Failed to delete faculty');
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
                            <h1>Faculty Management</h1>
                            <p className="text-secondary">Manage all faculty members</p>
                        </div>
                        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                            <Plus size={20} />
                            Add New Faculty
                        </button>
                    </div>

                    <div className="faculty-grid">
                        {faculty.map(member => (
                            <div key={member.id} className="faculty-card glass-card hover-lift">
                                <div className="faculty-header">
                                    <div className="faculty-avatar gradient-card">
                                        <GraduationCap size={32} />
                                    </div>
                                    <div className="faculty-actions">
                                        <button className="icon-btn">
                                            <PenLine size={16} />
                                        </button>
                                        <button className="icon-btn" onClick={() => handleDelete(member.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="faculty-info">
                                    <h3>{member.name}</h3>
                                    <span className="badge badge-primary">{member.facultyId || member.id}</span>
                                </div>

                                <div className="faculty-contact">
                                    <div className="contact-item">
                                        <Mail size={14} />
                                        <span>{member.email}</span>
                                    </div>
                                    <div className="contact-item">
                                        <Phone size={14} />
                                        <span>{member.phone}</span>
                                    </div>
                                </div>

                                <div className="faculty-details">
                                    <div className="detail-section">
                                        <p className="detail-label">Subjects</p>
                                        <div className="tags">
                                            {member.subjects.map((subject, idx) => (
                                                <span key={idx} className="tag">{subject}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <p className="detail-label">Classes</p>
                                        <div className="tags">
                                            {member.classes.map((cls, idx) => (
                                                <span key={idx} className="tag">{cls}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <p className="detail-label">Salary</p>
                                        <p className="salary-amount">{member.salary}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Modal */}
                    {showModal && (
                        <div className="modal-overlay" onClick={() => setShowModal(false)}>
                            <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
                                <h2>Add New Faculty</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="input-group">
                                        <label className="input-label">Full Name</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label className="input-label">Email</label>
                                        <input
                                            type="email"
                                            className="input-field"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label className="input-label">Phone</label>
                                        <input
                                            type="tel"
                                            className="input-field"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label className="input-label">Subjects (comma separated)</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="e.g., Mathematics, Physics"
                                            value={formData.subjects}
                                            onChange={e => setFormData({ ...formData, subjects: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label className="input-label">Classes (comma separated)</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="e.g., 10th Grade A, 11th Grade B"
                                            value={formData.classes}
                                            onChange={e => setFormData({ ...formData, classes: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label className="input-label">Salary</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="e.g., ₹50,000/month"
                                            value={formData.salary}
                                            onChange={e => setFormData({ ...formData, salary: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="modal-actions">
                                        <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            Add Faculty
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        .faculty-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .faculty-card {
          padding: 1.5rem;
        }

        .faculty-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }

        .faculty-avatar {
          width: 70px;
          height: 70px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .faculty-actions {
          display: flex;
          gap: 0.5rem;
        }

        .faculty-info {
          margin-bottom: 1rem;
        }

        .faculty-info h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .faculty-contact {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--glass-border);
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .faculty-details {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .detail-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .detail-label {
          font-size: 0.85rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag {
          background: var(--bg-card);
          padding: 0.4rem 0.8rem;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          border: 1px solid var(--glass-border);
        }

        .salary-amount {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--success);
          margin: 0;
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
          .faculty-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
};

export default FacultyManagement;

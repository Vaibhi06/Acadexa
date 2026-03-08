import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStudents } from '../../contexts/StudentsContext';
import { useClasses } from '../../contexts/ClassesContext';
import Sidebar from '../shared/Sidebar';
import { UserPlus, Save, Upload, Download } from 'lucide-react';

const AddStudent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addStudent } = useStudents();
  const { classes, addClass } = useClasses();

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    classCode: location.state?.selectedClass || '',
    uid: '',
    aadharCard: '',
    joiningDate: new Date().toISOString().split('T')[0],
    guardianName: '',
    guardianPhone: '',
    address: '',
    city: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if class exists by code
    const classExists = classes.some(c => c.code === formData.classCode);

    // Note: Implicit class creation logic removed as we want to use valid class codes

    // Send student data without manual ID - let backend generate it
    const result = await addStudent(formData);

    if (result.success) {
      const fullName = `${formData.firstName} ${formData.middleName ? formData.middleName + ' ' : ''}${formData.lastName}`;

      // Find class name for display
      const selectedClassObj = classes.find(c => c.code === formData.classCode);
      const className = selectedClassObj ? selectedClassObj.name : formData.classCode;

      alert(`✅ Student Enrolled Successfully!\n\nName: ${fullName}\nClass Code: ${className}`);
      navigate('/admin/students');
    } else {
      alert(`❌ Error: ${result.message || 'Failed to add student'}`);
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar role="admin" />

      <div className="admin-main">

        <div className="admin-content">
          <div className="page-header">
            <div>
              <h1>Add New Student</h1>
              <p className="text-secondary">Enroll a new student in the system</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="form-container glass-card">
            {/* Personal Information */}
            <div className="form-section">
              <h3>Personal Information</h3>

              {/* Name Fields Row */}
              <div className="form-grid">
                <div className="input-group">
                  <label className="input-label">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    className="input-field"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Middle Name</label>
                  <input
                    type="text"
                    name="middleName"
                    className="input-field"
                    value={formData.middleName}
                    onChange={handleChange}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    className="input-field"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Other Personal Info */}
              <div className="form-grid">

                <div className="input-group">
                  <label className="input-label">Email *</label>
                  <input
                    type="email"
                    name="email"
                    className="input-field"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    className="input-field"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Date of Birth *</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    className="input-field"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Gender *</label>
                  <select
                    name="gender"
                    className="input-field"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Aadhar Card Number</label>
                  <input
                    type="text"
                    name="aadharCard"
                    className="input-field"
                    placeholder="Enter 12 digit Aadhar number"
                    value={formData.aadharCard}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 12) {
                        handleChange({ target: { name: 'aadharCard', value } });
                      }
                    }}
                    maxLength="12"
                    inputMode="numeric"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">UID (Optional)</label>
                  <input
                    type="text"
                    name="uid"
                    className="input-field"
                    placeholder="Enter UID"
                    value={formData.uid}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="form-section">
              <h3>Academic Information</h3>
              <div className="form-grid">
                <div className="input-group">
                  <label className="input-label">Class / Batch *</label>
                  <select
                    name="classCode"
                    className="input-field"
                    value={formData.classCode}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.code || cls.name}>{cls.name} ({cls.code || 'No Code'})</option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Date of Joining *</label>
                  <input
                    type="date"
                    name="joiningDate"
                    className="input-field"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Guardian Information */}
            <div className="form-section">
              <h3>Guardian Information</h3>
              <div className="form-grid">
                <div className="input-group">
                  <label className="input-label">Guardian Name *</label>
                  <input
                    type="text"
                    name="guardianName"
                    className="input-field"
                    value={formData.guardianName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Guardian Phone *</label>
                  <input
                    type="tel"
                    name="guardianPhone"
                    className="input-field"
                    value={formData.guardianPhone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="form-section">
              <h3>Address Information</h3>
              <div className="form-grid">
                <div className="input-group full-width">
                  <label className="input-label">Full Address *</label>
                  <textarea
                    name="address"
                    className="input-field"
                    rows="3"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="input-group">
                  <label className="input-label">City *</label>
                  <input
                    type="text"
                    name="city"
                    className="input-field"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
              >
                <Save size={20} />
                Add Student
              </button>
              <button
                type="button"
                className="btn btn-indigo"
                onClick={() => alert('Import Students functionality coming soon!')}
              >
                <Upload size={20} />
                Import Students
              </button>
              <button
                type="button"
                className="btn btn-indigo"
                onClick={() => alert('Downloading sample CSV...')}
              >
                <Download size={20} />
                Download Sample CSV
              </button>
            </div>
          </form>
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

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2.5rem;
        }

        .page-header h1 {
          font-size: 2rem;
          margin: 0 0 0.5rem 0;
          color: #1e293b;
          font-weight: 700;
        }

        .text-secondary {
          color: #64748b;
          font-size: 1rem;
          margin: 0;
        }

        .student-id-badge {
          padding: 1.25rem 2rem;
          background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 12px rgba(254, 163, 190, 0.3);
        }

        .id-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.9);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }

        .id-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: white;
          letter-spacing: 2px;
        }

        .form-container {
          background: white;
          padding: 2.5rem;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          border-left: 4px solid #FEA3BE;
        }

        .form-section {
          margin-bottom: 2.5rem;
          padding-bottom: 2rem;
          border-bottom: 2px solid #f1f5f9;
        }

        .form-section:last-of-type {
          border-bottom: none;
        }

        .form-section h3 {
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
          color: #1e293b;
          font-weight: 700;
          position: relative;
          padding-left: 1rem;
        }

        .form-section h3::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
          border-radius: 2px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .input-group {
          display: flex;
          flex-direction: column;
        }

        .input-label {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .input-field {
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s;
          background: white;
          color: #1e293b;
        }

        .input-field:focus {
          outline: none;
          border-color: #FEA3BE;
          box-shadow: 0 0 0 3px rgba(254, 163, 190, 0.1);
        }

        select.input-field {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23FEA3BE' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 20px;
          padding-right: 2.5rem;
          cursor: pointer;
        }

        textarea.input-field {
          resize: vertical;
          min-height: 80px;
          font-family: inherit;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-start;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 2px solid #f1f5f9;
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
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover {
          background: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .btn-indigo {
            background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
            color: white;
            box-shadow: 0 4px 12px rgba(254, 163, 190, 0.3);
        }
        
        .btn-indigo:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(254, 163, 190, 0.5);
        }

        .btn-outline {
          background: white;
          border: 2px solid #e2e8f0;
          color: #1e293b;
        }

        .btn-outline:hover {
          border-color: #FEA3BE;
          color: #FEA3BE;
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

          .form-container {
            padding: 1.5rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .form-actions button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default AddStudent;

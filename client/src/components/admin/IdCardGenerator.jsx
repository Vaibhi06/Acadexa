import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudents } from '../../contexts/StudentsContext';
import { useClasses } from '../../contexts/ClassesContext';
import Sidebar from '../shared/Sidebar';
import {
  Download,
  Printer,
  Search,
  Filter,
  User,
  QrCode,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Calendar,
  IdCard,
  CheckCircle2,
  X,
  ChevronDown,
  Users
} from 'lucide-react';

const IdCardGenerator = () => {
  const navigate = useNavigate();
  const { students } = useStudents();
  const { classes } = useClasses();
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [previewStudent, setPreviewStudent] = useState(null);
  const [isGenerated, setIsGenerated] = useState(false);

  // Filter students based on class and search
  const filteredStudents = students.filter(student => {
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    const matchesSearch = student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.uid?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const handleGenerate = () => {
    setIsGenerated(true);
    // If no students manually selected, select all filtered students
    if (selectedStudents.length === 0) {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const handleBackToSelection = () => {
    setIsGenerated(false);
    setSelectedStudents([]);
    setPreviewStudent(null);
  };

  const handleDownloadAll = () => {
    alert(`Downloading ID cards for ${selectedStudents.length} students. (PDF generation will be implemented in production)`);
  };

  const handlePrintAll = () => {
    window.print();
  };

  return (
    <div className="admin-layout">
      <Sidebar role="admin" />
      <div className="admin-main">
        <div className="id-generator-page">
          {/* Page Header */}
          <div className="page-header">
            <div className="header-content">
              <div className="header-icon">
                <IdCard size={32} />
              </div>
              <div>
                <h1>ID Card Generator</h1>
                <p>Generate and print student ID cards</p>
              </div>
            </div>
            {isGenerated && (
              <div className="header-actions">
                <button
                  className="action-btn secondary"
                  onClick={handleBackToSelection}
                >
                  <ChevronDown size={18} style={{ transform: 'rotate(90deg)' }} />
                  Change Class
                </button>
                <button
                  className="action-btn secondary"
                  onClick={handlePrintAll}
                  disabled={selectedStudents.length === 0}
                >
                  <Printer size={18} />
                  Print Selected
                </button>
                <button
                  className="action-btn primary"
                  onClick={handleDownloadAll}
                  disabled={selectedStudents.length === 0}
                >
                  <Download size={18} />
                  Download All ({selectedStudents.length})
                </button>
              </div>
            )}
          </div>

          {!isGenerated ? (
            /* Selection View */
            <div className="selection-view">
              <div className="selection-card">
                <h2>Select Class to Generate</h2>
                <p>Choose a class to view student count and generate ID cards.</p>

                <div className="class-selector-large">
                  <label>Class</label>
                  <div className="select-wrapper">
                    <select
                      value={selectedClass}
                      onChange={(e) => {
                        setSelectedClass(e.target.value);
                        setSelectedStudents([]); // Reset selection on class change
                      }}
                    >
                      <option value="all">All Classes</option>
                      {classes.map(cls => (
                        <option key={cls.id} value={cls.name}>{cls.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={20} />
                  </div>
                </div>

                <div className="student-count-display">
                  <div className="count-badge">
                    <Users size={24} />
                    <span>{filteredStudents.length} Students Found</span>
                  </div>
                </div>

                {filteredStudents.length > 0 && (
                  <div className="students-preview-list">
                    {filteredStudents.map(student => (
                      <div
                        key={student.id}
                        className={`preview-name-tag ${selectedStudents.includes(student.id) ? 'selected' : ''}`}
                        onClick={() => handleSelectStudent(student.id)}
                      >
                        {student.name}
                        {selectedStudents.includes(student.id) && <CheckCircle2 size={14} />}
                      </div>
                    ))}
                  </div>
                )}

                <button
                  className="generate-btn-large"
                  onClick={handleGenerate}
                  disabled={filteredStudents.length === 0}
                >
                  <IdCard size={24} />
                  Generate ID Cards
                </button>
              </div>
            </div>
          ) : (
            /* Generated View */
            <>
              {/* Filters */}
              <div className="filters-section">
                <div className="search-box">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search student in this list..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="current-selection-badge">
                  Current Class: <b>{selectedClass === 'all' ? 'All Classes' : selectedClass}</b>
                </div>
              </div>

              {/* Content Grid */}
              <div className="content-grid">
                {/* Students List */}
                <div className="students-panel">
                  <div className="panel-header">
                    <div className="select-all">
                      <input
                        type="checkbox"
                        checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                        onChange={handleSelectAll}
                      />
                      <span>Select All ({filteredStudents.length} students)</span>
                    </div>
                  </div>
                  <div className="students-list">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map(student => (
                        <div
                          key={student.id}
                          className={`student-item ${selectedStudents.includes(student.id) ? 'selected' : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student.id)}
                            onChange={() => handleSelectStudent(student.id)}
                          />
                          <div className="student-avatar">
                            {student.name?.[0] || 'S'}
                          </div>
                          <div className="student-info">
                            <h4>{student.name}</h4>
                            <p>{student.class} • UID: {student.uid || 'N/A'}</p>
                          </div>
                          <button
                            className="preview-btn"
                            onClick={() => setPreviewStudent(student)}
                          >
                            Preview
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">
                        <User size={48} />
                        <h3>No students found</h3>
                        <p>Try adjusting your filters or add new students</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* ID Card Preview */}
                <div className="preview-panel">
                  <div className="panel-header">
                    <h3>ID Card Preview</h3>
                    {previewStudent && (
                      <button className="close-preview" onClick={() => setPreviewStudent(null)}>
                        <X size={18} />
                      </button>
                    )}
                  </div>
                  {previewStudent ? (
                    <div className="id-card-preview">
                      {/* Front Side */}
                      <div className="card-front">
                        <div className="card-header">
                          <div className="school-logo">
                            <GraduationCap size={28} />
                          </div>
                          <div className="school-info">
                            <h2>ACADEXA SCHOOL</h2>
                            <p>Excellence in Education</p>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="photo-qr-section">
                            <div className="student-photo">
                              {previewStudent.photo ? (
                                <img src={previewStudent.photo} alt={previewStudent.name} />
                              ) : (
                                <div className="photo-placeholder">
                                  <User size={40} />
                                </div>
                              )}
                            </div>
                            <div className="qr-code">
                              <QrCode size={50} />
                            </div>
                          </div>
                          <div className="student-details">
                            <h3 className="student-name">{previewStudent.name}</h3>
                            <div className="student-id-badge">
                              UID: {previewStudent.uid || 'N/A'}
                            </div>
                            <div className="info-grid">
                              <div className="info-item">
                                <span className="label">Class</span>
                                <span className="value">{previewStudent.class}</span>
                              </div>
                              <div className="info-item">
                                <span className="label">Roll No.</span>
                                <span className="value">{previewStudent.rollNumber || 'N/A'}</span>
                              </div>
                              <div className="info-item">
                                <span className="label">Blood Group</span>
                                <span className="value blood">{previewStudent.bloodGroup || 'N/A'}</span>
                              </div>
                              <div className="info-item">
                                <span className="label">Valid Until</span>
                                <span className="value">March 2026</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card-footer">
                          <div className="footer-wave"></div>
                          <p>Property of Acadexa School</p>
                        </div>
                      </div>

                      {/* Back Side */}
                      <div className="card-back">
                        <h4>IMPORTANT INFORMATION</h4>
                        <div className="back-details">
                          <div className="back-item">
                            <Mail size={14} />
                            <span>{previewStudent.email || 'student@acadexa.com'}</span>
                          </div>
                          <div className="back-item">
                            <Phone size={14} />
                            <span>{previewStudent.phone || 'N/A'}</span>
                          </div>
                          <div className="back-item">
                            <MapPin size={14} />
                            <span>{previewStudent.address || 'Address not provided'}</span>
                          </div>
                          <div className="back-item">
                            <User size={14} />
                            <span>Parent: {previewStudent.fatherName || previewStudent.motherName || 'N/A'}</span>
                          </div>
                          <div className="back-item emergency">
                            <Phone size={14} />
                            <span>Emergency: {previewStudent.emergencyContact || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="terms">
                          <h5>Terms & Conditions</h5>
                          <ul>
                            <li>This card is non-transferable</li>
                            <li>Report loss immediately</li>
                            <li>Must carry during school hours</li>
                          </ul>
                        </div>
                        <div className="signature-section">
                          <div className="signature-line"></div>
                          <span>Principal's Signature</span>
                        </div>
                      </div>

                      <div className="preview-actions">
                        <button className="download-single" onClick={() => alert('Downloading ID card...')}>
                          <Download size={16} />
                          Download This Card
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="no-preview">
                      <IdCard size={64} />
                      <h3>Select a student to preview</h3>
                      <p>Click "Preview" on any student to see their ID card</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .id-generator-page {
          padding: 2rem;
          background: #f8fafc;
          min-height: 100vh;
        }

        /* Selection View Styles */
        .selection-view {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 60vh;
        }

        .selection-card {
            background: white;
            padding: 3rem;
            border-radius: 24px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            text-align: center;
            max-width: 500px;
            width: 100%;
        }

        .selection-card h2 {
            font-size: 1.75rem;
            color: #1e293b;
            margin: 0 0 0.5rem 0;
        }

        .selection-card p {
            color: #64748b;
            margin-bottom: 2rem;
        }

        .class-selector-large {
            text-align: left;
            margin-bottom: 2rem;
        }

        .class-selector-large label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #334155;
        }

        .select-wrapper {
            position: relative;
        }

        .select-wrapper select {
            width: 100%;
            padding: 1rem;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            font-size: 1rem;
            appearance: none;
            background: white;
            cursor: pointer;
            color: #334155;
            transition: all 0.2s;
        }

        .select-wrapper select:focus {
            border-color: #FEA3BE;
            outline: none;
        }

        .select-wrapper svg {
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: #94a3b8;
            pointer-events: none;
        }

        .student-count-display {
            margin-bottom: 2rem;
            display: flex;
            justify-content: center;
        }

        .count-badge {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            background: #fff1f2;
            color: #e11d48;
            padding: 0.75rem 1.5rem;
            border-radius: 50px;
            font-weight: 600;
        }

        .generate-btn-large {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            padding: 1rem;
            background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
            color: white;
            border: none;
            border-radius: 16px;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 4px 12px rgba(254, 163, 190, 0.4);
        }

        .generate-btn-large:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(254, 163, 190, 0.6);
        }

        .generate-btn-large:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            background: #e2e8f0;
            color: #94a3b8;
            box-shadow: none;
        }

        .current-selection-badge {
            margin-left: auto;
            color: #64748b;
            font-size: 0.9rem;
            padding: 0.5rem 1rem;
            background: #f1f5f9;
            border-radius: 8px;
        }

        .student-photo img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .students-preview-list {
            margin-bottom: 2rem;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.5rem;
            max-height: 150px;
            overflow-y: auto;
            padding: 0.5rem;
            background: #f8fafc;
            border-radius: 12px;
        }

        .preview-name-tag {
            background: white;
            border: 1px solid #e2e8f0;
            padding: 0.35rem 0.85rem;
            border-radius: 20px;
            font-size: 0.9rem;
            color: #64748b;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            user-select: none;
        }

        .preview-name-tag:hover {
            border-color: #FEA3BE;
            color: #FEA3BE;
            background: #fff0f3;
        }

        .preview-name-tag.selected {
            background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
            color: white;
            border-color: transparent;
            box-shadow: 0 2px 8px rgba(254, 163, 190, 0.4);
        }

        /* Header */
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .page-header h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .page-header > div > p {
          color: #64748b;
          margin: 0.25rem 0 0 0;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
          color: white;
        }

        .action-btn.primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(254, 163, 190, 0.4);
        }

        .action-btn.secondary {
          background: white;
          color: #64748b;
          border: 2px solid #e2e8f0;
        }

        .action-btn.secondary:hover:not(:disabled) {
          border-color: #FEA3BE;
          color: #FEA3BE;
        }

        /* Filters */
        .filters-section {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .search-box {
          flex: 1;
          min-width: 250px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
        }

        .search-box svg {
          color: #94a3b8;
        }

        .search-box input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 0.95rem;
          color: #1e293b;
        }

        .search-box:focus-within {
          border-color: #FEA3BE;
        }

        .filter-dropdown {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          position: relative;
        }

        .filter-dropdown svg:first-child {
          color: #94a3b8;
        }

        .filter-dropdown select {
          border: none;
          outline: none;
          font-size: 0.95rem;
          background: transparent;
          color: #1e293b;
          appearance: none;
          padding-right: 1.5rem;
          cursor: pointer;
        }

        .dropdown-icon {
          position: absolute;
          right: 1rem;
          color: #94a3b8;
          pointer-events: none;
        }

        /* Content Grid */
        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .students-panel,
        .preview-panel {
          background: white;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .panel-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 2px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .panel-header h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e293b;
        }

        .select-all {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 500;
          color: #64748b;
        }

        .select-all input {
          width: 18px;
          height: 18px;
          accent-color: #FEA3BE;
        }

        /* Students List */
        .students-list {
          max-height: 600px;
          overflow-y: auto;
        }

        .student-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #f1f5f9;
          transition: all 0.2s;
        }

        .student-item:hover {
          background: #fef7f9;
        }

        .student-item.selected {
          background: #fff0f3;
        }

        .student-item input {
          width: 18px;
          height: 18px;
          accent-color: #FEA3BE;
        }

        .student-avatar {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .student-info {
          flex: 1;
        }

        .student-info h4 {
          margin: 0 0 0.25rem 0;
          font-weight: 600;
          color: #1e293b;
        }

        .student-info p {
          margin: 0;
          font-size: 0.85rem;
          color: #64748b;
        }

        .preview-btn {
          padding: 0.5rem 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 500;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }

        .preview-btn:hover {
          background: #FEA3BE;
          color: white;
          border-color: #FEA3BE;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #94a3b8;
        }

        .empty-state svg {
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-state h3 {
          margin: 0 0 0.5rem 0;
          color: #64748b;
        }

        .empty-state p {
          margin: 0;
        }

        /* Preview Panel */
        .close-preview {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 0.25rem;
        }

        .close-preview:hover {
          color: #ef4444;
        }

        .no-preview {
          text-align: center;
          padding: 4rem 2rem;
          color: #94a3b8;
        }

        .no-preview svg {
          margin-bottom: 1rem;
          opacity: 0.3;
        }

        .no-preview h3 {
          margin: 0 0 0.5rem 0;
          color: #64748b;
        }

        .no-preview p {
          margin: 0;
        }

        /* ID Card Preview */
        .id-card-preview {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          align-items: center;
        }

        .card-front,
        .card-back {
          width: 100%;
          max-width: 340px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .card-header {
          background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: white;
        }

        .school-logo {
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .school-info h2 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 700;
        }

        .school-info p {
          margin: 0.125rem 0 0 0;
          font-size: 0.75rem;
          opacity: 0.9;
        }

        .card-body {
          padding: 1.25rem;
        }

        .photo-qr-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .student-photo {
          width: 80px;
          height: 100px;
          background: #f1f5f9;
          border-radius: 8px;
          border: 2px solid #FEA3BE;
          overflow: hidden;
        }

        .photo-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
        }

        .qr-code {
          padding: 0.5rem;
          background: #f8fafc;
          border-radius: 8px;
          color: #1e293b;
        }

        .student-details {
          text-align: center;
        }

        .student-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 0.5rem 0;
        }

        .student-id-badge {
          display: inline-block;
          background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
          color: white;
          padding: 0.375rem 1rem;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          text-align: left;
        }

        .info-item {
          padding: 0.625rem;
          background: #f8fafc;
          border-radius: 8px;
        }

        .info-item .label {
          display: block;
          font-size: 0.65rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-item .value {
          font-size: 0.85rem;
          font-weight: 600;
          color: #1e293b;
        }

        .info-item .value.blood {
          color: #ef4444;
        }

        .card-footer {
          background: #f8fafc;
          padding: 0.75rem;
          text-align: center;
          position: relative;
        }

        .footer-wave {
          position: absolute;
          top: -15px;
          left: 0;
          right: 0;
          height: 30px;
          background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
          clip-path: ellipse(60% 50% at 50% 100%);
        }

        .card-footer p {
          margin: 0;
          font-size: 0.7rem;
          color: #64748b;
          position: relative;
        }

        /* Card Back */
        .card-back {
          padding: 1.25rem;
        }

        .card-back h4 {
          text-align: center;
          color: #FEA3BE;
          margin: 0 0 1rem 0;
          font-size: 0.85rem;
          letter-spacing: 1px;
        }

        .back-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .back-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: #f8fafc;
          border-radius: 8px;
          font-size: 0.8rem;
          color: #1e293b;
        }

        .back-item svg {
          color: #FEA3BE;
          flex-shrink: 0;
        }

        .back-item.emergency {
          background: #fef2f2;
          color: #ef4444;
        }

        .back-item.emergency svg {
          color: #ef4444;
        }

        .terms {
          padding: 0.75rem;
          background: #fffbeb;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .terms h5 {
          margin: 0 0 0.5rem 0;
          color: #b45309;
          font-size: 0.75rem;
        }

        .terms ul {
          margin: 0;
          padding-left: 1rem;
          font-size: 0.7rem;
          color: #92400e;
        }

        .terms li {
          margin-bottom: 0.125rem;
        }

        .signature-section {
          text-align: right;
        }

        .signature-line {
          width: 100px;
          height: 2px;
          background: #e2e8f0;
          margin-left: auto;
          margin-bottom: 0.25rem;
        }

        .signature-section span {
          font-size: 0.65rem;
          color: #64748b;
        }

        .preview-actions {
          width: 100%;
          max-width: 340px;
        }

        .download-single {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem;
          background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .download-single:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(254, 163, 190, 0.4);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .id-generator-page {
            padding-top: 6.5rem;
            padding-left: 1rem;
            padding-right: 1rem;
          }
          .content-grid {
            grid-template-columns: 1fr;
          }

          .header-actions {
            width: 100%;
            justify-content: flex-end;
          }
        }

        @media (max-width: 768px) {
          .id-generator-page {
            padding: 1rem;
          }

          .page-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .header-actions {
            flex-direction: column;
            width: 100%;
          }

          .action-btn {
            justify-content: center;
          }

          .filters-section {
            flex-direction: column;
          }
        }

        /* Print Styles */
        @media print {
          .id-generator-page {
            padding: 0;
          }

          .page-header,
          .filters-section,
          .students-panel,
          .panel-header,
          .preview-actions {
            display: none !important;
          }

          .preview-panel {
            box-shadow: none;
          }

          .id-card-preview {
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default IdCardGenerator;

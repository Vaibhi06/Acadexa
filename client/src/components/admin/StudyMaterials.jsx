import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Sidebar from '../shared/Sidebar';
import { useClasses } from '../../contexts/ClassesContext';
import { Upload, FileText, Download, Trash2, X, Plus, Filter } from 'lucide-react';

const StudyMaterials = () => {
    const { classes } = useClasses();
    const [selectedClassFilter, setSelectedClassFilter] = useState('All');
    const [materials, setMaterials] = useState([]);

    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadForm, setUploadForm] = useState({
        title: '',
        class: '',
        subject: '',
        file: null
    });

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const { data } = await api.get('/materials');
                setMaterials(data);
            } catch (error) {
                console.error('Error fetching study materials:', error);
            }
        };
        fetchMaterials();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadForm({ ...uploadForm, file });
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (uploadForm.title && uploadForm.class && uploadForm.subject && uploadForm.file) {
            // Version Control Logic
            const existingMaterial = materials.find(
                m => m.class === uploadForm.class &&
                    m.subject === uploadForm.subject &&
                    m.title.toLowerCase() === uploadForm.title.toLowerCase()
            );

            let version = 1;
            if (existingMaterial) {
                // Determine next version
                const relatedMaterials = materials.filter(
                    m => m.class === uploadForm.class &&
                        m.subject === uploadForm.subject &&
                        m.title.toLowerCase() === uploadForm.title.toLowerCase()
                );
                version = relatedMaterials.length + 1;
            }

            const newMaterial = {
                title: uploadForm.title,
                class: uploadForm.class,
                subject: uploadForm.subject,
                fileName: uploadForm.file.name,
                size: (uploadForm.file.size / (1024 * 1024)).toFixed(2) + ' MB',
                date: new Date().toISOString().split('T')[0],
                version: `v${version}.0`
            };

            try {
                const { data } = await api.post('/materials', newMaterial);
                setMaterials([data, ...materials]);
                setUploadForm({ title: '', class: '', subject: '', file: null });
                setShowUploadModal(false);
            } catch (error) {
                console.error('Error uploading material:', error);
                alert('Failed to upload material');
            }
        }
    };

    const deleteMaterial = async (id) => {
        if (window.confirm('Are you sure you want to delete this material?')) {
            try {
                await api.delete(`/materials/${id}`);
                setMaterials(materials.filter(m => m.id !== id));
            } catch (error) {
                console.error('Error deleting material:', error);
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
                            <h1>Study Materials</h1>
                            <p className="text-secondary">Upload and manage study materials</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Filter size={18} color="#64748b" />
                                <select
                                    value={selectedClassFilter}
                                    onChange={(e) => setSelectedClassFilter(e.target.value)}
                                    style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer' }}
                                >
                                    <option value="All">All Classes</option>
                                    {classes.map(cls => (
                                        <option key={cls.id} value={cls.name}>{cls.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button className="btn btn-primary" onClick={() => setShowUploadModal(true)}>
                                <Upload size={20} />
                                Upload Material
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {materials
                            .filter(m => selectedClassFilter === 'All' || m.class === selectedClassFilter)
                            .map(material => (
                                <div key={material.id} className="glass-card hover-lift" style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flex: 1 }}>
                                            <div style={{
                                                width: '60px',
                                                height: '60px',
                                                background: 'var(--primary-gradient)',
                                                borderRadius: 'var(--radius-md)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <FileText size={28} color="white" />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                                    <h3 style={{ margin: 0 }}>{material.title}</h3>
                                                    {material.version && (
                                                        <span style={{ fontSize: '0.75rem', background: '#e0e7ff', color: '#6366f1', padding: '0.1rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                                                            {material.version}
                                                        </span>
                                                    )}
                                                </div>
                                                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                                    <span><strong>Class:</strong> {material.class}</span>
                                                    <span><strong>Subject:</strong> {material.subject}</span>
                                                    <span><strong>Size:</strong> {material.size}</span>
                                                    <span><strong>Uploaded:</strong> {material.date}</span>
                                                </div>
                                                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                    <strong>File:</strong> {material.fileName}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                                                <Download size={16} />
                                                Download
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                                                onClick={() => deleteMaterial(material.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Upload Study Material</h2>
                            <button className="close-btn" onClick={() => setShowUploadModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleUpload}>
                            <div className="form-group">
                                <label>Material Title *</label>
                                <input
                                    type="text"
                                    value={uploadForm.title}
                                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                                    placeholder="e.g., Mathematics Chapter 1"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Class *</label>
                                <select
                                    value={uploadForm.class}
                                    onChange={(e) => setUploadForm({ ...uploadForm, class: e.target.value })}
                                    className="input-field"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    required
                                >
                                    <option value="">Select Class</option>
                                    {classes.length > 0 ? (
                                        classes.map(cls => (
                                            <option key={cls.id} value={cls.name}>{cls.name}</option>
                                        ))
                                    ) : (
                                        <option value="10th Grade A">10th Grade A (Default)</option>
                                    )}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Subject *</label>
                                <input
                                    type="text"
                                    value={uploadForm.subject}
                                    onChange={(e) => setUploadForm({ ...uploadForm, subject: e.target.value })}
                                    placeholder="e.g., Mathematics"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Upload File *</label>
                                <div className="file-input-wrapper">
                                    <input
                                        type="file"
                                        id="file-upload"
                                        onChange={handleFileChange}
                                        accept=".pdf,.doc,.docx,.ppt,.pptx"
                                        required
                                    />
                                    <label htmlFor="file-upload" className="file-input-label">
                                        <Upload size={20} />
                                        {uploadForm.file ? uploadForm.file.name : 'Choose a file'}
                                    </label>
                                </div>
                                <small style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    Accepted formats: PDF, DOC, DOCX, PPT, PPTX
                                </small>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowUploadModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    <Plus size={20} />
                                    Upload Material
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
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
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 2px solid #f1f5f9;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.5rem;
          color: #000000;
        }

        .close-btn {
          background: none;
          border: none;
          color: #000000;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: #f1f5f9;
          color: #000000;
        }

        .modal-content form {
          padding: 1.5rem;
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

        .form-group input[type="text"] {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .form-group input[type="text"]:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .file-input-wrapper {
          position: relative;
        }

        .file-input-wrapper input[type="file"] {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .file-input-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border: 2px dashed #cbd5e1;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          color: #000000;
          font-weight: 500;
          background: #f8fafc;
        }

        .file-input-label:hover {
          border-color: #6366f1;
          background: #eef2ff;
          color: #6366f1;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 2px solid #f1f5f9;
        }

        .btn-secondary {
          background: #e2e8f0;
          color: #000000;
        }

        .btn-secondary:hover {
          background: #cbd5e1;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-danger:hover {
          background: #dc2626;
        }
      `}</style>
        </div>
    );
};

export default StudyMaterials;

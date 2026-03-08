import React, { useState, useRef } from 'react';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import {
    Upload,
    FileText,
    Download,
    Trash2,
    Eye,
    Users,
    BookOpen,
    Calendar,
    Filter,
    X,
    CheckCircle,
    AlertCircle,
    FolderOpen
} from 'lucide-react';

const FacultyStudyMaterials = () => {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedClass, setSelectedClass] = useState('all');
    const [uploadForm, setUploadForm] = useState({
        title: '',
        subject: 'Mathematics',
        class: '',
        description: '',
        file: null
    });
    const fileInputRef = useRef(null);

    // Available classes for the faculty
    const classes = [
        { id: '10a', name: '10th Grade A', students: 35 },
        { id: '10b', name: '10th Grade B', students: 32 },
        { id: '11a', name: '11th Grade A', students: 30 },
        { id: '11b', name: '11th Grade B', students: 28 },
    ];

    // Materials state
    const [materials, setMaterials] = useState([
        {
            id: 1,
            title: 'Mathematics Chapter 5 - Trigonometry',
            subject: 'Mathematics',
            class: '10th Grade A',
            classId: '10a',
            description: 'Complete notes on trigonometric functions and identities',
            fileName: 'trigonometry_ch5.pdf',
            fileSize: '2.4 MB',
            uploadDate: '2026-01-10',
            downloads: 28,
            views: 45
        },
        {
            id: 2,
            title: 'Physics - Laws of Motion PPT',
            subject: 'Physics',
            class: '11th Grade B',
            classId: '11b',
            description: 'Presentation covering Newton\'s laws with examples',
            fileName: 'laws_of_motion.pdf',
            fileSize: '5.1 MB',
            uploadDate: '2026-01-12',
            downloads: 22,
            views: 38
        },
        {
            id: 3,
            title: 'Algebra Practice Problems',
            subject: 'Mathematics',
            class: '10th Grade B',
            classId: '10b',
            description: '50 practice problems with solutions',
            fileName: 'algebra_practice.pdf',
            fileSize: '1.2 MB',
            uploadDate: '2026-01-08',
            downloads: 30,
            views: 42
        },
        {
            id: 4,
            title: 'Thermodynamics Notes',
            subject: 'Physics',
            class: '11th Grade A',
            classId: '11a',
            description: 'Comprehensive notes on heat and temperature',
            fileName: 'thermodynamics.pdf',
            fileSize: '3.8 MB',
            uploadDate: '2026-01-05',
            downloads: 25,
            views: 35
        },
    ]);

    // Filter materials by class
    const filteredMaterials = selectedClass === 'all'
        ? materials
        : materials.filter(m => m.classId === selectedClass);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadForm(prev => ({ ...prev, file }));
        }
    };

    const handleUpload = () => {
        if (!uploadForm.title || !uploadForm.class || !uploadForm.file) {
            alert('Please fill all required fields and select a file');
            return;
        }

        const selectedClassObj = classes.find(c => c.id === uploadForm.class);
        const newMaterial = {
            id: materials.length + 1,
            title: uploadForm.title,
            subject: uploadForm.subject,
            class: selectedClassObj?.name || '',
            classId: uploadForm.class,
            description: uploadForm.description,
            fileName: uploadForm.file.name,
            fileSize: (uploadForm.file.size / (1024 * 1024)).toFixed(1) + ' MB',
            uploadDate: new Date().toISOString().split('T')[0],
            downloads: 0,
            views: 0
        };

        setMaterials(prev => [newMaterial, ...prev]);
        setShowUploadModal(false);
        setUploadForm({ title: '', subject: 'Mathematics', class: '', description: '', file: null });
        alert('✅ Study material uploaded successfully!');
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this material?')) {
            setMaterials(prev => prev.filter(m => m.id !== id));
            alert('✅ Material deleted successfully!');
        }
    };

    const handleView = (material) => {
        // Increment views
        setMaterials(prev => prev.map(m =>
            m.id === material.id ? { ...m, views: m.views + 1 } : m
        ));
        alert(`📄 Opening preview of "${material.title}"\n\nFile: ${material.fileName}\nSize: ${material.fileSize}\n\nNote: In production, this would open the actual PDF preview.`);
    };

    const handleDownload = (material) => {
        // Increment downloads
        setMaterials(prev => prev.map(m =>
            m.id === material.id ? { ...m, downloads: m.downloads + 1 } : m
        ));
        alert(`⬇️ Downloading "${material.fileName}"\n\nNote: In production, this would trigger the actual file download.`);
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    // Stats
    const totalMaterials = materials.length;
    const totalDownloads = materials.reduce((sum, m) => sum + m.downloads, 0);
    const totalViews = materials.reduce((sum, m) => sum + m.views, 0);

    return (
        <div className="admin-layout">
            <Sidebar role="faculty" />
            <div className="admin-main">
                <Navbar />
                <div className="materials-page">
                    {/* Page Header */}
                    <div className="page-header-section">
                        <div className="header-content">
                            <h1>Study Materials</h1>
                            <p className="page-subtitle">Upload and manage study materials for your classes</p>
                        </div>
                        <button
                            className="upload-btn-main"
                            onClick={() => setShowUploadModal(true)}
                        >
                            <Upload size={20} />
                            Upload Material
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="materials-stats-grid">
                        <div className="materials-stat-card">
                            <div className="stat-icon-box files">
                                <FileText size={24} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-number">{totalMaterials}</span>
                                <span className="stat-label">Materials</span>
                            </div>
                        </div>

                        <div className="materials-stat-card">
                            <div className="stat-icon-box downloads">
                                <Download size={24} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-number">{totalDownloads}</span>
                                <span className="stat-label">Downloads</span>
                            </div>
                        </div>

                        <div className="materials-stat-card">
                            <div className="stat-icon-box views">
                                <Eye size={24} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-number">{totalViews}</span>
                                <span className="stat-label">Views</span>
                            </div>
                        </div>
                    </div>

                    {/* Filter by Class */}
                    <div className="filter-section">
                        <div className="filter-label">
                            <Filter size={18} />
                            <span>Filter by Class:</span>
                        </div>
                        <div className="class-filter-tabs">
                            <button
                                className={`filter-tab ${selectedClass === 'all' ? 'active' : ''}`}
                                onClick={() => setSelectedClass('all')}
                            >
                                All Classes
                            </button>
                            {classes.map(cls => (
                                <button
                                    key={cls.id}
                                    className={`filter-tab ${selectedClass === cls.id ? 'active' : ''}`}
                                    onClick={() => setSelectedClass(cls.id)}
                                >
                                    {cls.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Materials List */}
                    <div className="materials-grid">
                        {filteredMaterials.map(material => (
                            <div key={material.id} className="material-card">
                                <div className="material-icon">
                                    <FileText size={32} />
                                </div>
                                <div className="material-content">
                                    <h3>{material.title}</h3>
                                    <p className="material-desc">{material.description}</p>
                                    <div className="material-meta">
                                        <span className="meta-item">
                                            <BookOpen size={14} />
                                            {material.subject}
                                        </span>
                                        <span className="meta-item">
                                            <Users size={14} />
                                            {material.class}
                                        </span>
                                        <span className="meta-item">
                                            <Calendar size={14} />
                                            {formatDate(material.uploadDate)}
                                        </span>
                                    </div>
                                    <div className="material-stats">
                                        <span className="file-info">{material.fileName} • {material.fileSize}</span>
                                        <div className="stats-badges">
                                            <span className="stat-badge">
                                                <Download size={12} /> {material.downloads}
                                            </span>
                                            <span className="stat-badge">
                                                <Eye size={12} /> {material.views}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="material-actions">
                                    <button
                                        className="action-btn view"
                                        title="Preview"
                                        onClick={() => handleView(material)}
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button
                                        className="action-btn download"
                                        title="Download"
                                        onClick={() => handleDownload(material)}
                                    >
                                        <Download size={18} />
                                    </button>
                                    <button
                                        className="action-btn delete"
                                        title="Delete"
                                        onClick={() => handleDelete(material.id)}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div className="access-badge">
                                    <Users size={12} />
                                    {material.class} only
                                </div>
                            </div>
                        ))}

                        {filteredMaterials.length === 0 && (
                            <div className="empty-state">
                                <FolderOpen size={64} />
                                <h3>No materials found</h3>
                                <p>Upload study materials for your students</p>
                                <button
                                    className="upload-btn-main"
                                    onClick={() => setShowUploadModal(true)}
                                >
                                    <Upload size={18} />
                                    Upload Material
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Upload Modal */}
                    {showUploadModal && (
                        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
                            <div className="upload-modal" onClick={e => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h2>Upload Study Material</h2>
                                    <button
                                        className="close-btn"
                                        onClick={() => setShowUploadModal(false)}
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="modal-body">
                                    {/* Class Selection - Required First */}
                                    <div className="form-group required">
                                        <label>
                                            <Users size={16} />
                                            Select Class (Required)
                                        </label>
                                        <div className="class-selection-grid">
                                            {classes.map(cls => (
                                                <div
                                                    key={cls.id}
                                                    className={`class-option ${uploadForm.class === cls.id ? 'selected' : ''}`}
                                                    onClick={() => setUploadForm(prev => ({ ...prev, class: cls.id }))}
                                                >
                                                    <span className="class-name">{cls.name}</span>
                                                    <span className="student-count">{cls.students} students</span>
                                                    {uploadForm.class === cls.id && (
                                                        <CheckCircle size={18} className="check-icon" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <p className="hint">
                                            <AlertCircle size={14} />
                                            Only students from selected class can access this material
                                        </p>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Title</label>
                                            <input
                                                type="text"
                                                placeholder="e.g., Chapter 5 - Trigonometry Notes"
                                                value={uploadForm.title}
                                                onChange={e => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Subject</label>
                                            <select
                                                value={uploadForm.subject}
                                                onChange={e => setUploadForm(prev => ({ ...prev, subject: e.target.value }))}
                                            >
                                                <option>Mathematics</option>
                                                <option>Physics</option>
                                                <option>Chemistry</option>
                                                <option>Biology</option>
                                                <option>English</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Description (Optional)</label>
                                        <textarea
                                            placeholder="Brief description of the material..."
                                            value={uploadForm.description}
                                            onChange={e => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                                            rows={3}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Upload PDF File</label>
                                        <div
                                            className={`file-upload-zone ${uploadForm.file ? 'has-file' : ''}`}
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileSelect}
                                                accept=".pdf,.doc,.docx,.ppt,.pptx"
                                                hidden
                                            />
                                            {uploadForm.file ? (
                                                <div className="file-selected">
                                                    <FileText size={32} />
                                                    <span className="file-name">{uploadForm.file.name}</span>
                                                    <span className="file-size">
                                                        {(uploadForm.file.size / (1024 * 1024)).toFixed(2)} MB
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="upload-placeholder">
                                                    <Upload size={40} />
                                                    <p>Click to upload or drag and drop</p>
                                                    <span>PDF, DOC, DOCX, PPT, PPTX (Max 50MB)</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button
                                        className="btn-secondary"
                                        onClick={() => setShowUploadModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn-primary"
                                        onClick={handleUpload}
                                        disabled={!uploadForm.class || !uploadForm.title || !uploadForm.file}
                                    >
                                        <Upload size={18} />
                                        Upload Material
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .materials-page {
                    padding: 2rem;
                    background: var(--bg-primary, #f8fafc);
                    min-height: 100vh;
                }
                
                .page-header-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                
                .header-content h1 {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: var(--text-primary, #1e293b);
                    margin: 0 0 0.5rem 0;
                }
                
                .page-subtitle {
                    color: var(--text-secondary, #64748b);
                    font-size: 0.95rem;
                    margin: 0;
                }
                
                .upload-btn-main {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.875rem 1.5rem;
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .upload-btn-main:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 16px rgba(254, 163, 190, 0.4);
                }
                
                /* Stats Grid */
                .materials-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }
                
                .materials-stat-card {
                    background: var(--bg-card, white);
                    border-radius: 16px;
                    padding: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                    border: 1px solid var(--border-color, #e2e8f0);
                }
                
                .stat-icon-box {
                    width: 52px;
                    height: 52px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }
                
                .stat-icon-box.files { background: linear-gradient(135deg, #FEA3BE, #FBA2AB); }
                .stat-icon-box.downloads { background: linear-gradient(135deg, #22c55e, #16a34a); }
                .stat-icon-box.views { background: linear-gradient(135deg, #0ea5e9, #0284c7); }
                
                .stat-info {
                    display: flex;
                    flex-direction: column;
                }
                
                .stat-number {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: var(--text-primary, #1e293b);
                }
                
                .stat-label {
                    font-size: 0.8rem;
                    color: var(--text-secondary, #64748b);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                /* Filter Section */
                .filter-section {
                    background: var(--bg-card, white);
                    border-radius: 16px;
                    padding: 1rem 1.5rem;
                    margin-bottom: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    flex-wrap: wrap;
                    border: 1px solid var(--border-color, #e2e8f0);
                }
                
                .filter-label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--text-secondary, #64748b);
                    font-weight: 500;
                }
                
                .class-filter-tabs {
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }
                
                .filter-tab {
                    padding: 0.5rem 1rem;
                    background: #f1f5f9;
                    border: 2px solid transparent;
                    border-radius: 8px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: var(--text-secondary, #64748b);
                }
                
                .filter-tab:hover {
                    background: #e2e8f0;
                }
                
                .filter-tab.active {
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    color: white;
                }
                
                /* Materials Grid */
                .materials-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .material-card {
                    background: var(--bg-card, white);
                    border-radius: 16px;
                    padding: 1.5rem;
                    display: flex;
                    gap: 1.5rem;
                    align-items: flex-start;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                    border: 1px solid var(--border-color, #e2e8f0);
                    position: relative;
                    transition: all 0.2s;
                }
                
                .material-card:hover {
                    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
                }
                
                .material-icon {
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    flex-shrink: 0;
                }
                
                .material-content {
                    flex: 1;
                }
                
                .material-content h3 {
                    margin: 0 0 0.5rem 0;
                    font-size: 1.1rem;
                    color: var(--text-primary, #1e293b);
                }
                
                .material-desc {
                    margin: 0 0 0.75rem 0;
                    font-size: 0.9rem;
                    color: var(--text-secondary, #64748b);
                }
                
                .material-meta {
                    display: flex;
                    gap: 1.5rem;
                    margin-bottom: 0.75rem;
                    flex-wrap: wrap;
                }
                
                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    font-size: 0.85rem;
                    color: var(--text-secondary, #64748b);
                }
                
                .material-stats {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }
                
                .file-info {
                    font-size: 0.8rem;
                    color: var(--text-secondary, #94a3b8);
                }
                
                .stats-badges {
                    display: flex;
                    gap: 0.5rem;
                }
                
                .stat-badge {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    padding: 0.25rem 0.5rem;
                    background: #f1f5f9;
                    border-radius: 6px;
                    font-size: 0.75rem;
                    color: var(--text-secondary, #64748b);
                }
                
                .material-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                
                .action-btn {
                    width: 40px;
                    height: 40px;
                    border: none;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .action-btn.view {
                    background: #e0f2fe;
                    color: #0284c7;
                }
                
                .action-btn.download {
                    background: #dcfce7;
                    color: #16a34a;
                }
                
                .action-btn.delete {
                    background: #fef2f2;
                    color: #ef4444;
                }
                
                .action-btn:hover {
                    transform: scale(1.1);
                }
                
                .access-badge {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    padding: 0.25rem 0.75rem;
                    background: linear-gradient(135deg, #fef3c7, #fde68a);
                    color: #92400e;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }
                
                /* Empty State */
                .empty-state {
                    text-align: center;
                    padding: 4rem 2rem;
                    background: var(--bg-card, white);
                    border-radius: 20px;
                    border: 2px dashed var(--border-color, #e2e8f0);
                }
                
                .empty-state svg {
                    color: #94a3b8;
                    margin-bottom: 1rem;
                }
                
                .empty-state h3 {
                    margin: 0 0 0.5rem 0;
                    color: var(--text-primary, #1e293b);
                }
                
                .empty-state p {
                    color: var(--text-secondary, #64748b);
                    margin: 0 0 1.5rem 0;
                }
                
                /* Modal Styles */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 1rem;
                }
                
                .upload-modal {
                    background: var(--bg-card, white);
                    border-radius: 20px;
                    width: 100%;
                    max-width: 600px;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
                }
                
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem;
                    border-bottom: 2px solid var(--border-color, #f1f5f9);
                }
                
                .modal-header h2 {
                    margin: 0;
                    font-size: 1.25rem;
                    color: var(--text-primary, #1e293b);
                }
                
                .close-btn {
                    background: none;
                    border: none;
                    color: var(--text-secondary, #64748b);
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 8px;
                    transition: all 0.2s;
                }
                
                .close-btn:hover {
                    background: #f1f5f9;
                    color: #ef4444;
                }
                
                .modal-body {
                    padding: 1.5rem;
                }
                
                .form-group {
                    margin-bottom: 1.5rem;
                }
                
                .form-group label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 600;
                    color: var(--text-primary, #1e293b);
                    margin-bottom: 0.75rem;
                }
                
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                
                .form-group input,
                .form-group select,
                .form-group textarea {
                    width: 100%;
                    padding: 0.875rem 1rem;
                    border: 2px solid var(--border-color, #e2e8f0);
                    border-radius: 10px;
                    font-size: 0.95rem;
                    transition: all 0.2s;
                    background: var(--bg-card, white);
                    color: var(--text-primary, #1e293b);
                }
                
                .form-group input:focus,
                .form-group select:focus,
                .form-group textarea:focus {
                    outline: none;
                    border-color: #FEA3BE;
                }
                
                .class-selection-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 0.75rem;
                }
                
                .class-option {
                    position: relative;
                    padding: 1rem;
                    border: 2px solid var(--border-color, #e2e8f0);
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .class-option:hover {
                    border-color: #FEA3BE;
                    background: #fef7f9;
                }
                
                .class-option.selected {
                    border-color: #FEA3BE;
                    background: linear-gradient(135deg, #fef7f9, #fff5f7);
                }
                
                .class-option .class-name {
                    display: block;
                    font-weight: 600;
                    color: var(--text-primary, #1e293b);
                }
                
                .class-option .student-count {
                    font-size: 0.85rem;
                    color: var(--text-secondary, #64748b);
                }
                
                .class-option .check-icon {
                    position: absolute;
                    top: 0.5rem;
                    right: 0.5rem;
                    color: #22c55e;
                }
                
                .hint {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-top: 0.75rem;
                    font-size: 0.85rem;
                    color: var(--text-secondary, #64748b);
                }
                
                .file-upload-zone {
                    border: 2px dashed var(--border-color, #e2e8f0);
                    border-radius: 12px;
                    padding: 2rem;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .file-upload-zone:hover {
                    border-color: #FEA3BE;
                    background: #fef7f9;
                }
                
                .file-upload-zone.has-file {
                    border-color: #22c55e;
                    background: #f0fdf4;
                }
                
                .upload-placeholder svg {
                    color: #94a3b8;
                    margin-bottom: 0.5rem;
                }
                
                .upload-placeholder p {
                    margin: 0;
                    font-weight: 500;
                    color: var(--text-primary, #1e293b);
                }
                
                .upload-placeholder span {
                    font-size: 0.85rem;
                    color: var(--text-secondary, #64748b);
                }
                
                .file-selected {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .file-selected svg {
                    color: #22c55e;
                }
                
                .file-name {
                    font-weight: 600;
                    color: var(--text-primary, #1e293b);
                }
                
                .file-size {
                    font-size: 0.85rem;
                    color: var(--text-secondary, #64748b);
                }
                
                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    padding: 1.5rem;
                    border-top: 2px solid var(--border-color, #f1f5f9);
                }
                
                .btn-secondary {
                    padding: 0.875rem 1.5rem;
                    background: #f1f5f9;
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    color: var(--text-secondary, #64748b);
                }
                
                .btn-primary {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.875rem 1.5rem;
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    border: none;
                    border-radius: 10px;
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .btn-primary:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                .btn-primary:not(:disabled):hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 16px rgba(254, 163, 190, 0.4);
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    .materials-page {
                        padding: 1rem;
                    }
                    
                    .page-header-section {
                        flex-direction: column;
                    }
                    
                    .upload-btn-main {
                        width: 100%;
                        justify-content: center;
                    }
                    
                    .material-card {
                        flex-direction: column;
                    }
                    
                    .material-actions {
                        flex-direction: row;
                        width: 100%;
                        justify-content: flex-end;
                    }
                    
                    .access-badge {
                        position: static;
                        margin-top: 1rem;
                        align-self: flex-start;
                    }
                    
                    .form-row {
                        grid-template-columns: 1fr;
                    }
                    
                    .class-selection-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default FacultyStudyMaterials;

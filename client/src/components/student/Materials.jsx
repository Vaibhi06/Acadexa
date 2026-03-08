import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import {
    BookOpen,
    Download,
    Eye,
    Search,
    FileText,
    Video,
    Image,
    File,
    ChevronDown,
    ChevronUp,
    Filter
} from 'lucide-react';

const Materials = () => {
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedSubject, setExpandedSubject] = useState(null);

    // Subjects list
    const subjects = [
        { id: 'mathematics', name: 'Mathematics', color: '#FF6B6B', icon: '📐' },
        { id: 'physics', name: 'Physics', color: '#4ECDC4', icon: '⚛️' },
        { id: 'chemistry', name: 'Chemistry', color: '#45B7D1', icon: '🧪' },
        { id: 'english', name: 'English', color: '#96CEB4', icon: '📖' },
        { id: 'biology', name: 'Biology', color: '#FFEAA7', icon: '🧬' },
        { id: 'computer', name: 'Computer Science', color: '#DDA0DD', icon: '💻' },
    ];

    // Study materials data
    const materials = [
        { id: 1, subject: 'mathematics', title: 'Calculus - Complete Notes', type: 'pdf', size: '2.4 MB', uploadDate: 'Jan 2, 2026', chapter: 'Chapter 5' },
        { id: 2, subject: 'mathematics', title: 'Algebra Practice Problems', type: 'pdf', size: '1.8 MB', uploadDate: 'Dec 28, 2025', chapter: 'Chapter 3' },
        { id: 3, subject: 'mathematics', title: 'Trigonometry Formulas', type: 'pdf', size: '856 KB', uploadDate: 'Dec 20, 2025', chapter: 'Chapter 4' },
        { id: 4, subject: 'physics', title: 'Mechanics - Video Lecture', type: 'video', size: '120 MB', uploadDate: 'Jan 4, 2026', chapter: 'Chapter 1' },
        { id: 5, subject: 'physics', title: 'Thermodynamics Notes', type: 'pdf', size: '3.1 MB', uploadDate: 'Jan 1, 2026', chapter: 'Chapter 6' },
        { id: 6, subject: 'physics', title: 'Wave Motion Diagrams', type: 'image', size: '4.5 MB', uploadDate: 'Dec 25, 2025', chapter: 'Chapter 8' },
        { id: 7, subject: 'chemistry', title: 'Organic Chemistry Notes', type: 'pdf', size: '2.8 MB', uploadDate: 'Jan 3, 2026', chapter: 'Chapter 10' },
        { id: 8, subject: 'chemistry', title: 'Periodic Table Reference', type: 'pdf', size: '1.2 MB', uploadDate: 'Dec 15, 2025', chapter: 'Chapter 1' },
        { id: 9, subject: 'english', title: 'Literature Analysis', type: 'pdf', size: '1.5 MB', uploadDate: 'Jan 2, 2026', chapter: 'Unit 3' },
        { id: 10, subject: 'english', title: 'Grammar Workbook', type: 'pdf', size: '2.0 MB', uploadDate: 'Dec 30, 2025', chapter: 'Unit 1' },
        { id: 11, subject: 'biology', title: 'Cell Biology Notes', type: 'pdf', size: '3.5 MB', uploadDate: 'Jan 1, 2026', chapter: 'Chapter 2' },
        { id: 12, subject: 'biology', title: 'Human Anatomy Diagrams', type: 'image', size: '8.2 MB', uploadDate: 'Dec 28, 2025', chapter: 'Chapter 5' },
        { id: 13, subject: 'computer', title: 'Python Programming Guide', type: 'pdf', size: '4.2 MB', uploadDate: 'Jan 4, 2026', chapter: 'Module 1' },
        { id: 14, subject: 'computer', title: 'Data Structures Tutorial', type: 'video', size: '85 MB', uploadDate: 'Jan 2, 2026', chapter: 'Module 3' },
    ];

    const getTypeIcon = (type) => {
        switch (type) {
            case 'pdf': return <FileText size={20} />;
            case 'video': return <Video size={20} />;
            case 'image': return <Image size={20} />;
            default: return <File size={20} />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'pdf': return '#ef4444';
            case 'video': return '#8b5cf6';
            case 'image': return '#22c55e';
            default: return '#64748b';
        }
    };

    const filteredMaterials = materials.filter(material => {
        const matchesSubject = selectedSubject === 'all' || material.subject === selectedSubject;
        const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            material.chapter.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSubject && matchesSearch;
    });

    const getMaterialsBySubject = (subjectId) => {
        return materials.filter(m => m.subject === subjectId);
    };

    return (
        <div className="admin-layout">
            <Sidebar role="student" />
            <div className="admin-main">
                <Navbar />
                <div className="materials-page">
                    {/* Page Header */}
                    <div className="page-header">
                        <div className="header-info">
                            <h1>📚 Study Materials</h1>
                            <p>Access all your learning resources</p>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="search-filter-bar">
                        <div className="search-box">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search materials..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="filter-box">
                            <Filter size={18} />
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                            >
                                <option value="all">All Subjects</option>
                                {subjects.map(sub => (
                                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Subject-wise Accordion View */}
                    <div className="subjects-accordion">
                        {subjects.map(subject => {
                            const subjectMaterials = getMaterialsBySubject(subject.id);
                            const isExpanded = expandedSubject === subject.id;

                            if (selectedSubject !== 'all' && selectedSubject !== subject.id) return null;

                            return (
                                <div key={subject.id} className="subject-section">
                                    <button
                                        className="subject-header"
                                        onClick={() => setExpandedSubject(isExpanded ? null : subject.id)}
                                    >
                                        <div className="subject-info">
                                            <span className="subject-icon" style={{ background: subject.color }}>
                                                {subject.icon}
                                            </span>
                                            <span className="subject-name">{subject.name}</span>
                                            <span className="material-count">{subjectMaterials.length} files</span>
                                        </div>
                                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </button>

                                    {isExpanded && (
                                        <div className="materials-list">
                                            {subjectMaterials
                                                .filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                    m.chapter.toLowerCase().includes(searchQuery.toLowerCase()))
                                                .map(material => (
                                                    <div key={material.id} className="material-card">
                                                        <div className="material-icon" style={{ background: `${getTypeColor(material.type)}20`, color: getTypeColor(material.type) }}>
                                                            {getTypeIcon(material.type)}
                                                        </div>
                                                        <div className="material-info">
                                                            <h4>{material.title}</h4>
                                                            <div className="material-meta">
                                                                <span className="chapter">{material.chapter}</span>
                                                                <span className="dot">•</span>
                                                                <span className="size">{material.size}</span>
                                                                <span className="dot">•</span>
                                                                <span className="date">{material.uploadDate}</span>
                                                            </div>
                                                        </div>
                                                        <div className="material-actions">
                                                            <button className="action-btn view" title="View">
                                                                <Eye size={18} />
                                                            </button>
                                                            <button className="action-btn download" title="Download">
                                                                <Download size={18} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Quick Stats */}
                    <div className="stats-section">
                        <h2>📊 Resources Summary</h2>
                        <div className="stats-grid">
                            {subjects.map(subject => {
                                const count = getMaterialsBySubject(subject.id).length;
                                return (
                                    <div key={subject.id} className="stat-card">
                                        <span className="stat-icon" style={{ background: subject.color }}>
                                            {subject.icon}
                                        </span>
                                        <div className="stat-info">
                                            <span className="stat-name">{subject.name}</span>
                                            <span className="stat-count">{count} files</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .materials-page {
                    padding: 2rem;
                    background: #f8fafc;
                    min-height: 100vh;
                }

                .page-header {
                    margin-bottom: 1.5rem;
                }

                .header-info h1 {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0 0 0.25rem 0;
                }

                .header-info p {
                    color: #64748b;
                    margin: 0;
                }

                /* Search & Filter */
                .search-filter-bar {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                }

                .search-box {
                    flex: 1;
                    min-width: 250px;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    background: white;
                    padding: 0.875rem 1.25rem;
                    border-radius: 12px;
                    border: 2px solid transparent;
                    transition: all 0.2s;
                }

                .search-box:focus-within {
                    border-color: #FEA3BE;
                }

                .search-box svg {
                    color: #94a3b8;
                }

                .search-box input {
                    flex: 1;
                    border: none;
                    outline: none;
                    font-size: 1rem;
                    color: #1e293b;
                }

                .search-box input::placeholder {
                    color: #94a3b8;
                }

                .filter-box {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    background: white;
                    padding: 0.875rem 1.25rem;
                    border-radius: 12px;
                }

                .filter-box svg {
                    color: #94a3b8;
                }

                .filter-box select {
                    border: none;
                    outline: none;
                    font-size: 1rem;
                    color: #1e293b;
                    background: transparent;
                    cursor: pointer;
                }

                /* Subject Accordion */
                .subjects-accordion {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .subject-section {
                    background: white;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                .subject-header {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.25rem 1.5rem;
                    background: white;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .subject-header:hover {
                    background: #fef7f9;
                }

                .subject-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .subject-icon {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.25rem;
                }

                .subject-name {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #1e293b;
                }

                .material-count {
                    background: #f1f5f9;
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    color: #64748b;
                    font-weight: 600;
                }

                .subject-header svg {
                    color: #64748b;
                }

                /* Materials List */
                .materials-list {
                    padding: 0 1.5rem 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .material-card {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: #f8fafc;
                    border-radius: 12px;
                    transition: all 0.2s;
                }

                .material-card:hover {
                    background: #f1f5f9;
                }

                .material-icon {
                    width: 44px;
                    height: 44px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .material-info {
                    flex: 1;
                }

                .material-info h4 {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #1e293b;
                    margin: 0 0 0.25rem 0;
                }

                .material-meta {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.8rem;
                    color: #64748b;
                }

                .dot {
                    color: #cbd5e1;
                }

                .material-actions {
                    display: flex;
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
                    color: #0ea5e9;
                }

                .action-btn.view:hover {
                    background: #bae6fd;
                }

                .action-btn.download {
                    background: #dcfce7;
                    color: #22c55e;
                }

                .action-btn.download:hover {
                    background: #bbf7d0;
                }

                /* Stats Section */
                .stats-section {
                    background: white;
                    border-radius: 20px;
                    padding: 1.5rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                .stats-section h2 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0 0 1.25rem 0;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                    gap: 1rem;
                }

                .stat-card {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem;
                    background: #f8fafc;
                    border-radius: 12px;
                }

                .stat-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.1rem;
                }

                .stat-info {
                    display: flex;
                    flex-direction: column;
                }

                .stat-name {
                    font-weight: 600;
                    color: #1e293b;
                    font-size: 0.9rem;
                }

                .stat-count {
                    font-size: 0.8rem;
                    color: #64748b;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .materials-page {
                        padding: 1rem;
                    }

                    .search-filter-bar {
                        flex-direction: column;
                    }

                    .material-card {
                        flex-wrap: wrap;
                    }

                    .material-actions {
                        width: 100%;
                        justify-content: flex-end;
                        margin-top: 0.5rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Materials;

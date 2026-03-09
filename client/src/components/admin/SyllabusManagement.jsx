import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useClasses } from '../../contexts/ClassesContext';
import Sidebar from '../shared/Sidebar';
import ErrorBoundary from '../shared/ErrorBoundary';
import { BookOpen, Plus, Trash2, Save, CheckCircle2, User, X, GraduationCap, FileText, Sparkles } from 'lucide-react';

const SyllabusManagement = () => {
    const { classes, loading: classesLoading, error: classesError } = useClasses();
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [syllabus, setSyllabus] = useState({});
    const [showSaveAlert, setShowSaveAlert] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // AI Generation State
    const [promptText, setPromptText] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const API_URL = '/api/syllabus';

    // subjects based on class (mock logic for now, can be improved)
    const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Physics', 'Chemistry', 'Biology'];

    // Mock Faculty List
    const facultyList = [
        'Dr. Smith', 'Ms. Johnson', 'Mr. Williams', 'Mrs. Brown', 'Mr. Jones', 'Ms. Davis'
    ];

    // Transform API data to frontend format
    const transformToFrontendFormat = (apiData) => {
        const result = {};
        if (!Array.isArray(apiData)) {
            console.warn('⚠️ API returned non-array data for syllabus:', apiData);
            return result;
        }
        apiData.forEach(item => {
            if (!item.class) return; // Skip invalid items
            if (!result[item.class]) {
                result[item.class] = {};
            }
            result[item.class][item.subject] = {
                faculty: item.faculty || '',
                chapters: item.chapters || []
            };
        });
        return result;
    };

    // Fetch syllabus data from API
    const fetchSyllabusData = async () => {
        try {
            console.log('📚 Fetching syllabus data from API...');
            const response = await api.get('/syllabus');
            if (response.status !== 200) {
                throw new Error('Failed to fetch syllabus data');
            }
            const data = response.data;
            console.log('✅ Syllabus data loaded:', data);

            const transformedData = transformToFrontendFormat(data);
            setSyllabus(transformedData);
            setError(null);
        } catch (err) {
            console.error('❌ Error fetching syllabus:', err);
            setError('Failed to load syllabus data');
        } finally {
            setLoading(false);
        }
    };

    // Load syllabus data on component mount
    useEffect(() => {
        fetchSyllabusData();
    }, []);

    const getCurrentSyllabus = () => {
        if (!selectedClass || !selectedSubject) return { faculty: '', chapters: [] };
        return syllabus[selectedClass]?.[selectedSubject] || { faculty: '', chapters: [] };
    };

    const updateSyllabus = (newData) => {
        setSyllabus(prev => ({
            ...prev,
            [selectedClass]: {
                ...prev[selectedClass],
                [selectedSubject]: newData
            }
        }));
    };

    const addChapter = () => {
        const current = getCurrentSyllabus();
        const newChapters = [...(current.chapters || []), {
            id: Date.now(),
            title: 'New Chapter',
            topics: []
        }];
        updateSyllabus({ ...current, chapters: newChapters });
    };

    const addTopic = (chapterId) => {
        const current = getCurrentSyllabus();
        const newChapters = (current.chapters || []).map(ch => {
            if (ch.id === chapterId) {
                return {
                    ...ch,
                    topics: [...(ch.topics || []), { id: Date.now(), title: 'New Topic', completed: false }]
                };
            }
            return ch;
        });
        updateSyllabus({ ...current, chapters: newChapters });
    };

    const updateChapterTitle = (id, title) => {
        const current = getCurrentSyllabus();
        const newChapters = (current.chapters || []).map(ch => ch.id === id ? { ...ch, title } : ch);
        updateSyllabus({ ...current, chapters: newChapters });
    };

    const updateTopicTitle = (chapterId, topicId, title) => {
        const current = getCurrentSyllabus();
        const newChapters = (current.chapters || []).map(ch => {
            if (ch.id === chapterId) {
                return {
                    ...ch,
                    topics: (ch.topics || []).map(t => t.id === topicId ? { ...t, title } : t)
                };
            }
            return ch;
        });
        updateSyllabus({ ...current, chapters: newChapters });
    };

    const toggleTopicCompletion = (chapterId, topicId) => {
        const current = getCurrentSyllabus();
        const newChapters = (current.chapters || []).map(ch => {
            if (ch.id === chapterId) {
                return {
                    ...ch,
                    topics: (ch.topics || []).map(t => t.id === topicId ? { ...t, completed: !t.completed } : t)
                };
            }
            return ch;
        });
        updateSyllabus({ ...current, chapters: newChapters });
    };

    const deleteChapter = (id) => {
        const current = getCurrentSyllabus();
        const newChapters = (current.chapters || []).filter(ch => ch.id !== id);
        updateSyllabus({ ...current, chapters: newChapters });
    };

    const deleteTopic = (chapterId, topicId) => {
        const current = getCurrentSyllabus();
        const newChapters = (current.chapters || []).map(ch => {
            if (ch.id === chapterId) {
                return {
                    ...ch,
                    topics: (ch.topics || []).filter(t => t.id !== topicId)
                };
            }
            return ch;
        });
        updateSyllabus({ ...current, chapters: newChapters });
    };

    const handleFacultyChange = (faculty) => {
        const current = getCurrentSyllabus();
        updateSyllabus({ ...current, faculty });
    };

    const saveSyllabus = async () => {
        if (!selectedClass || !selectedSubject) {
            setError('Please select a class and subject');
            return;
        }

        try {
            setSaving(true);
            console.log('💾 Saving syllabus to database...');

            const current = getCurrentSyllabus();

            const response = await api.post('/syllabus', {
                class: selectedClass,
                subject: selectedSubject,
                chapters: current.chapters,
                faculty: current.faculty
            });

            const data = response.data;

            if (!data.success && response.status !== 200 && response.status !== 201) {
                throw new Error('Failed to save syllabus');
            }

            // const data = await response.json(); // Data already assigned above
            console.log('✅ Syllabus saved successfully:', data);

            setShowSaveAlert(true);
            setTimeout(() => setShowSaveAlert(false), 3000);
            setError(null);
        } catch (err) {
            console.error('❌ Error saving syllabus:', err);
            setError('Failed to save syllabus. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const calculateProgress = () => {
        const current = getCurrentSyllabus();
        if (!current || !current.chapters || !Array.isArray(current.chapters)) return 0;

        let totalTopics = 0;
        let completedTopics = 0;
        current.chapters.forEach(ch => {
            if (ch.topics && Array.isArray(ch.topics)) {
                ch.topics.forEach(t => {
                    totalTopics++;
                    if (t.completed) completedTopics++;
                });
            }
        });
        return totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);
    };

    const currentSyllabus = getCurrentSyllabus();
    const progress = calculateProgress();

    const handleGenerateSyllabus = async () => {
        if (!promptText.trim()) return;
        if (!selectedClass || !selectedSubject) {
            setError('Please select a Class and Subject first to generate a syllabus.');
            setTimeout(() => setError(null), 3000);
            return;
        }

        setIsGenerating(true);
        // Simulate "AI Thinking" purely UI if mock is fast, but real endpoint has delay
        try {
            const response = await api.post('/syllabus/ai-generate', {
                prompt: promptText,
                class: selectedClass,
                subject: selectedSubject
            });

            if (response.data && response.data.success) {
                const generatedChapters = response.data.data;
                const current = getCurrentSyllabus();
                // Append or Replace? Let's Replace for a fresh generation, or Append?
                // User said "give prompt and it gives syllabus", implies receiving a full syllabus.
                // Let's prompt confirm if overwriting? No, let's just append for now or set if empty.
                // Better UX: Set it.
                updateSyllabus({ ...current, chapters: generatedChapters });
                setPromptText('');
            }
        } catch (err) {
            console.error('Error generating syllabus:', err);
            setError('Failed to generate syllabus. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="admin-layout">
            <Sidebar role="admin" />
            <div className="admin-main">
                <div className="admin-content">
                    {/* Header */}
                    <div className="page-header">
                        <div className="header-content">
                            <div className="header-icon">
                                <GraduationCap size={32} />
                            </div>
                            <div>
                                <h1>Syllabus Management</h1>
                                <p className="text-secondary">Plan and track academic syllabus with faculty assignment</p>
                            </div>
                        </div>
                        <button className="btn-save" onClick={saveSyllabus} disabled={saving || loading}>
                            <Save size={20} />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="alert-info">
                            <div className="spinner"></div>
                            <span>Loading syllabus data...</span>
                        </div>
                    )}

                    {/* Error Alert */}
                    {error && (
                        <div className="alert-error">
                            <span>⚠️ {error}</span>
                        </div>
                    )}

                    {/* Success Alert */}
                    {showSaveAlert && (
                        <div className="alert-success">
                            <CheckCircle2 size={24} />
                            <strong>Success!</strong> Syllabus saved to database successfully.
                        </div>
                    )}

                    {/* Controls Card */}
                    <div className="controls-card">
                        <div className="control-group">
                            <label className="control-label">
                                <BookOpen size={16} />
                                Select Class
                            </label>
                            <select
                                className="control-select"
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                disabled={loading || classesLoading || classesError || (Array.isArray(classes) && classes.length === 0)}
                            >
                                <option value="">Select a Class</option>
                                {classesLoading && <option value="">Loading classes...</option>}
                                {classesError && <option value="">⚠️ {classesError}</option>}
                                {!classesLoading && !classesError && Array.isArray(classes) && classes.map(cls => (
                                    cls ? <option key={cls.id || cls.name} value={cls.name}>{cls.name}</option> : null
                                ))}
                            </select>
                            {classesError && (
                                <p className="error-text">
                                    {classesError === 'Not authenticated. Please log in.'
                                        ? '⚠️ Please log in to view classes'
                                        : '⚠️ Failed to load classes'}
                                </p>
                            )}
                        </div>

                        <div className="control-group">
                            <label className="control-label">
                                <FileText size={16} />
                                Select Subject
                            </label>
                            <select
                                className="control-select"
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                            >
                                <option value="">Select a Subject</option>
                                {subjects.map(sub => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
                            </select>
                        </div>

                        <div className="control-group">
                            <label className="control-label">
                                <User size={16} />
                                Assigned Faculty
                            </label>
                            <select
                                className="control-select faculty-select"
                                value={currentSyllabus.faculty || ''}
                                onChange={(e) => handleFacultyChange(e.target.value)}
                            >
                                <option value="">Unassigned</option>
                                {Array.isArray(facultyList) && facultyList.map(f => (
                                    <option key={f} value={f}>{f}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* AI Prompt Section */}
                    <div className="ai-prompt-card">
                        <div className="ai-header">
                            <Sparkles className="ai-icon" size={24} />
                            <div>
                                <h3>AI Syllabus Creator</h3>
                                <p>Describe what you want (e.g., "Full 10th Grade Math Syllabus" or "Physics Chapter on Thermodynamics")</p>
                            </div>
                        </div>
                        <div className="ai-input-wrapper">
                            <textarea
                                className="ai-textarea"
                                placeholder="Enter your prompt here..."
                                value={promptText}
                                onChange={(e) => setPromptText(e.target.value)}
                                disabled={isGenerating}
                            />
                            <button
                                className="btn-generate"
                                onClick={handleGenerateSyllabus}
                                disabled={isGenerating || !promptText.trim()}
                            >
                                {isGenerating ? (
                                    <>
                                        <div className="spinner-small"></div>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={18} />
                                        Generate
                                    </>
                                )}
                            </button>
                        </div>
                    </div>



                    {/* Chapters List */}
                    {(!currentSyllabus.chapters || currentSyllabus.chapters.length === 0) && !isGenerating && (
                        <div className="empty-state-minimal">
                            <p>Enter a prompt above to begin building your syllabus.</p>
                        </div>
                    )}

                    {isGenerating && (
                        <div className="generating-state">
                            <div className="shimmer-card"></div>
                            <div className="shimmer-card"></div>
                            <div className="shimmer-card"></div>
                        </div>
                    )}

                    {(currentSyllabus.chapters && currentSyllabus.chapters.length > 0) && (
                        <div className="chapters-container">
                            {Array.isArray(currentSyllabus.chapters) && currentSyllabus.chapters.map((chapter, cIdx) => (
                                chapter ? (
                                    <div key={chapter.id || cIdx} className="chapter-card">
                                        <div className="chapter-header">
                                            <div className="chapter-title-container">
                                                <div className="chapter-number">
                                                    {cIdx + 1}
                                                </div>
                                                <input
                                                    type="text"
                                                    value={chapter.title || ''}
                                                    onChange={(e) => updateChapterTitle(chapter.id, e.target.value)}
                                                    className="chapter-title-input"
                                                    placeholder="Chapter Title"
                                                />
                                            </div>
                                            <button onClick={() => deleteChapter(chapter.id)} className="btn-delete-chapter">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        <div className="chapter-body">
                                            {(!chapter.topics || chapter.topics.length === 0) ? (
                                                <div className="empty-topics">
                                                    <p>No topics added yet</p>
                                                </div>
                                            ) : (
                                                <div className="topics-list">
                                                    {Array.isArray(chapter.topics) && chapter.topics.map((topic, tIdx) => (
                                                        topic ? (
                                                            <div key={topic.id || tIdx} className={`topic-item ${topic.completed ? 'completed' : ''}`}>
                                                                <label className="topic-checkbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={!!topic.completed}
                                                                        onChange={() => toggleTopicCompletion(chapter.id, topic.id)}
                                                                    />
                                                                    <span className="checkmark"></span>
                                                                </label>
                                                                <span className="topic-number">{cIdx + 1}.{tIdx + 1}</span>
                                                                <input
                                                                    type="text"
                                                                    value={topic.title || ''}
                                                                    onChange={(e) => updateTopicTitle(chapter.id, topic.id, e.target.value)}
                                                                    className="topic-title-input"
                                                                    placeholder="Topic title"
                                                                />
                                                                <button
                                                                    onClick={() => deleteTopic(chapter.id, topic.id)}
                                                                    className="btn-delete-topic"
                                                                >
                                                                    <X size={16} />
                                                                </button>
                                                            </div>
                                                        ) : null
                                                    ))}
                                                </div>
                                            )}
                                            <button onClick={() => addTopic(chapter.id)} className="btn-add-topic">
                                                <Plus size={18} />
                                                Add Topic
                                            </button>
                                        </div>
                                    </div>
                                ) : null
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .admin-layout {
                    display: flex;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
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
                    gap: 1.5rem;
                }

                .header-icon {
                    width: 64px;
                    height: 64px;
                    background: linear-gradient(135deg, #FEA3BE, #F77DC0);
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    box-shadow: 0 4px 12px rgba(254, 163, 190, 0.3);
                }

                .page-header h1 {
                    margin: 0 0 0.5rem 0;
                    font-size: 2rem;
                    background: linear-gradient(135deg, #1e293b, #475569);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-weight: 700;
                }

                .text-secondary {
                    color: #64748b;
                    margin: 0;
                    font-size: 0.95rem;
                }

                .btn-save {
                    padding: 0.875rem 1.75rem;
                    background: linear-gradient(135deg, #FEA3BE, #F77DC0);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 1rem;
                    box-shadow: 0 4px 12px rgba(254, 163, 190, 0.3);
                    transition: all 0.3s ease;
                }

                .btn-save:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(254, 163, 190, 0.4);
                }

                .btn-save:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                /* Alert Styles */
                .alert-info {
                    padding: 1rem 1.5rem;
                    background: linear-gradient(135deg, #dbeafe, #bfdbfe);
                    border: 2px solid #3b82f6;
                    border-radius: 12px;
                    color: #1e40af;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
                    animation: slideDown 0.3s ease;
                }

                .alert-error {
                    padding: 1rem 1.5rem;
                    background: linear-gradient(135deg, #fee2e2, #fecaca);
                    border: 2px solid #ef4444;
                    border-radius: 12px;
                    color: #991b1b;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
                    animation: slideDown 0.3s ease;
                }

                /* Success Alert */
                .alert-success {
                    padding: 1rem 1.5rem;
                    background: linear-gradient(135deg, #d1fae5, #a7f3d0);
                    border: 2px solid #10b981;
                    border-radius: 12px;
                    color: #065f46;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
                    animation: slideDown 0.3s ease;
                }

                /* Spinner */
                .spinner {
                    width: 20px;
                    height: 20px;
                    border: 3px solid rgba(59, 130, 246, 0.3);
                    border-top-color: #3b82f6;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                @keyframes slideDown {
                    from {
                        transform: translateY(-20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                /* Controls Card */
                .controls-card {
                    background: white;
                    border-radius: 16px;
                    padding: 2rem;
                    margin-bottom: 1.5rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                    border: 1px solid rgba(254, 163, 190, 0.2);
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1.5rem;
                }

                .control-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .control-label {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #475569;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .control-select {
                    padding: 0.875rem 1rem;
                    border: 2px solid #e2e8f0;
                    border-radius: 10px;
                    font-size: 1rem;
                    outline: none;
                    transition: all 0.2s;
                    background: white;
                    cursor: pointer;
                    color: #1e293b;
                    font-weight: 500;
                }

                .control-select:focus {
                    border-color: #FEA3BE;
                    box-shadow: 0 0 0 3px rgba(254, 163, 190, 0.1);
                }

                .control-select:disabled {
                    background: #f1f5f9;
                    cursor: not-allowed;
                }

                .error-text {
                    font-size: 0.85rem;
                    color: #ef4444;
                    margin: 0;
                }

                /* Progress Card */
                .progress-card {
                    background: linear-gradient(135deg, #ffffff, #fef3f7);
                    border-radius: 16px;
                    padding: 2rem;
                    margin-bottom: 2rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                    border: 1px solid rgba(254, 163, 190, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                    flex-wrap: wrap;
                }

                .progress-info {
                    flex: 1;
                    min-width: 250px;
                }

                .progress-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .progress-header h3 {
                    margin: 0;
                    color: #1e293b;
                    font-size: 1.125rem;
                    font-weight: 600;
                }

                .progress-percentage {
                    font-size: 1.5rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #FEA3BE, #F77DC0);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .progress-bar-container {
                    height: 12px;
                    background: #e2e8f0;
                    border-radius: 6px;
                    overflow: hidden;
                    position: relative;
                }

                .progress-bar-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #FEA3BE, #F77DC0, #FEA3BE);
                    background-size: 200% 100%;
                    border-radius: 6px;
                    transition: width 0.5s ease;
                    animation: shimmer 2s infinite;
                }

                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }

                .btn-add-chapter {
                    padding: 0.875rem 1.5rem;
                    background: white;
                    border: 2px solid #FEA3BE;
                    color: #FEA3BE;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 1rem;
                    transition: all 0.2s;
                }

                .btn-add-chapter:hover {
                    background: linear-gradient(135deg, #FEA3BE, #F77DC0);
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(254, 163, 190, 0.3);
                }

                /* AI Prompt Card */
                .ai-prompt-card {
                    background: white;
                    border-radius: 16px;
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                    box-shadow: 0 10px 30px -10px rgba(168, 85, 247, 0.15); /* Purple tint shadow */
                    border: 2px solid transparent;
                    background-image: linear-gradient(white, white), linear-gradient(135deg, #d8b4fe, #f9a8d4);
                    background-origin: border-box;
                    background-clip: padding-box, border-box;
                }

                .ai-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }

                .ai-icon {
                    color: #9333ea; /* Purple */
                }

                .ai-header h3 {
                    margin: 0;
                    font-size: 1.25rem;
                    background: linear-gradient(90deg, #9333ea, #db2777);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .ai-header p {
                    margin: 0.25rem 0 0 0;
                    color: #64748b;
                    font-size: 0.9rem;
                }

                .ai-input-wrapper {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .ai-textarea {
                    width: 100%;
                    padding: 1rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 1rem;
                    min-height: 80px;
                    resize: vertical;
                    outline: none;
                    transition: all 0.2s;
                    font-family: inherit;
                }

                .ai-textarea:focus {
                    border-color: #d8b4fe;
                    box-shadow: 0 0 0 3px rgba(216, 180, 254, 0.2);
                }

                .btn-generate {
                    align-self: flex-end;
                    padding: 0.75rem 1.5rem;
                    background: linear-gradient(135deg, #9333ea, #db2777);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.3s;
                }

                .btn-generate:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(147, 51, 234, 0.3);
                }

                .btn-generate:disabled {
                    opacity: 0.7;
                    cursor: wait;
                    transform: none;
                }

                .spinner-small {
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                .empty-state-minimal {
                    text-align: center;
                    padding: 2rem;
                    color: #94a3b8;
                    border: 2px dashed #e2e8f0;
                    border-radius: 12px;
                }

                .generating-state {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .shimmer-card {
                    height: 100px;
                    background: #f1f5f9;
                    border-radius: 12px;
                    position: relative;
                    overflow: hidden;
                }

                .shimmer-card::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    transform: translateX(-100%);
                    background-image: linear-gradient(
                        90deg,
                        rgba(255, 255, 255, 0) 0,
                        rgba(255, 255, 255, 0.2) 20%,
                        rgba(255, 255, 255, 0.5) 60%,
                        rgba(255, 255, 255, 0)
                    );
                    animation: shimmer 2s infinite;
                }

                /* Chapters Container */
                .chapters-container {
                    display: grid;
                    gap: 1.5rem;
                }

                /* Chapter Card */
                .chapter-card {
                    background: white;
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                    border: 1px solid rgba(254, 163, 190, 0.2);
                    transition: all 0.2s ease;
                }

                .chapter-card:hover {
                    box-shadow: 0 8px 16px rgba(0,0,0,0.08);
                }

                .chapter-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid #f1f5f9;
                }

                .chapter-title-container {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    flex: 1;
                }

                .chapter-number {
                    width: 32px;
                    height: 32px;
                    background: #FEA3BE;
                    color: white;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 1rem;
                }

                .chapter-title-input {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: #1e293b;
                    border: none;
                    outline: none;
                    background: transparent;
                    width: 100%;
                    padding: 0.25rem 0.5rem;
                    border-radius: 6px;
                    transition: all 0.2s;
                }

                .chapter-title-input:focus {
                    background: #f8fafc;
                    box-shadow: 0 0 0 2px rgba(254, 163, 190, 0.2);
                }

                .btn-delete-chapter {
                    background: #fee2e2;
                    color: #ef4444;
                    border: none;
                    width: 36px;
                    height: 36px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-delete-chapter:hover {
                    background: #fecaca;
                    color: #dc2626;
                }

                /* Topics List */
                .topics-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
                }

                .topic-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 0.75rem 1rem;
                    background: #f8fafc;
                    border-radius: 10px;
                    border: 1px solid #e2e8f0;
                    transition: all 0.2s;
                }

                .topic-item:hover {
                    border-color: #FEA3BE;
                    background: #fff;
                }

                .topic-item.completed {
                    opacity: 0.7;
                    background: #f1f5f9;
                }

                .topic-checkbox {
                    position: relative;
                    cursor: pointer;
                    user-select: none;
                    width: 20px;
                    height: 20px;
                }

                .topic-checkbox input {
                    position: absolute;
                    opacity: 0;
                    cursor: pointer;
                    height: 0;
                    width: 0;
                }

                .checkmark {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 20px;
                    width: 20px;
                    background-color: white;
                    border: 2px solid #cbd5e1;
                    border-radius: 6px;
                    transition: all 0.2s;
                }

                .topic-checkbox:hover input ~ .checkmark {
                    border-color: #FEA3BE;
                }

                .topic-checkbox input:checked ~ .checkmark {
                    background-color: #FEA3BE;
                    border-color: #FEA3BE;
                }

                .checkmark:after {
                    content: "";
                    position: absolute;
                    display: none;
                }

                .topic-checkbox input:checked ~ .checkmark:after {
                    display: block;
                }

                .topic-checkbox .checkmark:after {
                    left: 6px;
                    top: 2px;
                    width: 5px;
                    height: 10px;
                    border: solid white;
                    border-width: 0 2px 2px 0;
                    transform: rotate(45deg);
                }

                .topic-number {
                    color: #64748b;
                    font-size: 0.875rem;
                    font-weight: 500;
                    width: 32px;
                }

                .topic-title-input {
                    flex: 1;
                    border: none;
                    background: transparent;
                    font-size: 0.95rem;
                    color: #334155;
                    outline: none;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                }

                .topic-title-input:focus {
                    background: white;
                    box-shadow: 0 0 0 2px rgba(254, 163, 190, 0.2);
                }

                .btn-delete-topic {
                    background: transparent;
                    border: none;
                    color: #94a3b8;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }

                .btn-delete-topic:hover {
                    background: #fee2e2;
                    color: #ef4444;
                }

                .btn-add-topic {
                    width: 100%;
                    padding: 0.75rem;
                    border: 2px dashed #e2e8f0;
                    border-radius: 10px;
                    background: transparent;
                    color: #64748b;
                    font-weight: 500;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    transition: all 0.2s;
                }

                .btn-add-topic:hover {
                    border-color: #FEA3BE;
                    color: #FEA3BE;
                    background: #fff;
                }

                @media (max-width: 768px) {
                    .admin-content {
                        padding: 1rem;
                    }

                    .controls-card {
                        grid-template-columns: 1fr;
                    }

                    .progress-card {
                        flex-direction: column;
                        align-items: stretch;
                        gap: 1.5rem;
                    }

                    .btn-save span {
                        display: none;
                    }

                    .btn-save {
                        padding: 0.75rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default function WrappedSyllabusManagement() {
    return (
        <ErrorBoundary>
            <SyllabusManagement />
        </ErrorBoundary>
    );
};

import React, { useState, useEffect } from 'react';
import { useAttendance } from '../../contexts/AttendanceContext';
import { useClasses } from '../../contexts/ClassesContext';
import { useStudents } from '../../contexts/StudentsContext';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import {
    Check,
    X,
    Save,
    Calendar,
    Users,
    BookOpen,
    FileText,
    ChevronRight,
    CheckCircle,
    AlertCircle,
    Layers
} from 'lucide-react';

const MarkAttendance = () => {
    const { saveAttendance, getAttendance } = useAttendance();
    const { classes } = useClasses();
    const { getStudentsByClass } = useStudents();

    // Step tracking
    const [currentStep, setCurrentStep] = useState(1);

    // Form states
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedChapter, setSelectedChapter] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [subTopic, setSubTopic] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // Sample subjects and chapters (frontend only for now)
    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'English', 'Biology'];

    const chaptersData = {
        'Mathematics': [
            { id: 1, name: 'Chapter 1: Real Numbers', topics: ['Introduction to Real Numbers', 'Euclid Division Lemma', 'Fundamental Theorem of Arithmetic', 'Irrational Numbers'] },
            { id: 2, name: 'Chapter 2: Polynomials', topics: ['Zeros of Polynomial', 'Relationship between Zeros', 'Division Algorithm', 'Factorization'] },
            { id: 3, name: 'Chapter 3: Linear Equations', topics: ['Pair of Linear Equations', 'Graphical Method', 'Algebraic Methods', 'Cross Multiplication'] },
            { id: 4, name: 'Chapter 4: Quadratic Equations', topics: ['Standard Form', 'Factorization Method', 'Completing Square', 'Quadratic Formula'] },
        ],
        'Physics': [
            { id: 1, name: 'Chapter 1: Light - Reflection', topics: ['Laws of Reflection', 'Plane Mirror', 'Spherical Mirrors', 'Mirror Formula'] },
            { id: 2, name: 'Chapter 2: Light - Refraction', topics: ['Laws of Refraction', 'Refractive Index', 'Lenses', 'Power of Lens'] },
            { id: 3, name: 'Chapter 3: Electricity', topics: ['Electric Current', 'Ohms Law', 'Resistance', 'Electric Power'] },
        ],
        'Chemistry': [
            { id: 1, name: 'Chapter 1: Chemical Reactions', topics: ['Types of Reactions', 'Combination Reaction', 'Decomposition', 'Displacement'] },
            { id: 2, name: 'Chapter 2: Acids and Bases', topics: ['Properties of Acids', 'Properties of Bases', 'pH Scale', 'Neutralization'] },
        ],
        'English': [
            { id: 1, name: 'Chapter 1: A Letter to God', topics: ['Summary', 'Character Analysis', 'Themes', 'Grammar Practice'] },
            { id: 2, name: 'Chapter 2: Nelson Mandela', topics: ['Summary', 'Historical Context', 'Message', 'Vocabulary'] },
        ],
        'Biology': [
            { id: 1, name: 'Chapter 1: Life Processes', topics: ['Nutrition', 'Respiration', 'Transportation', 'Excretion'] },
            { id: 2, name: 'Chapter 2: Control and Coordination', topics: ['Nervous System', 'Hormones', 'Reflex Action', 'Plant Hormones'] },
        ],
    };

    const [chapters, setChapters] = useState([]);
    const [topics, setTopics] = useState([]);

    // Students list based on selected class
    const [students, setStudents] = useState([]);

    // Update chapters when subject changes
    useEffect(() => {
        if (selectedSubject) {
            setChapters(chaptersData[selectedSubject] || []);
            setSelectedChapter('');
            setSelectedTopic('');
            setTopics([]);
        }
    }, [selectedSubject]);

    // Update topics when chapter changes
    useEffect(() => {
        if (selectedChapter) {
            const chapter = chapters.find(c => c.name === selectedChapter);
            setTopics(chapter?.topics || []);
            setSelectedTopic('');
        }
    }, [selectedChapter, chapters]);

    // Load students and existing attendance when class/date changes
    useEffect(() => {
        const fetchStudentsAndAttendance = async () => {
            if (selectedClass) {
                setLoading(true);
                try {
                    // 1. Get students for class
                    const classStudents = getStudentsByClass(selectedClass);

                    // 2. Get existing attendance if date is selected
                    let existingRecords = [];
                    if (selectedDate) {
                        try {
                            existingRecords = await getAttendance(selectedDate, selectedClass) || [];
                        } catch (err) {
                            console.error("Error fetching existing attendance", err);
                        }
                    }

                    // 3. Map to component format, merging existing status
                    const formattedStudents = classStudents.map(s => {
                        const record = existingRecords.find(r => r.studentId === s.id);
                        return {
                            id: s.id,
                            name: `${s.firstName} ${s.middleName ? s.middleName + ' ' : ''}${s.lastName}`,
                            rollNo: s.rollNo || s.id.substring(s.id.length - 3),
                            status: record ? record.status : 'present' // Default to present if no record
                        };
                    });

                    setStudents(formattedStudents);
                } catch (error) {
                    console.error("Error loading data", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setStudents([]);
            }
        };

        fetchStudentsAndAttendance();
    }, [selectedClass, selectedDate, getStudentsByClass, getAttendance]);

    const toggleAttendance = (id) => {
        setStudents(students.map(s =>
            s.id === id ? { ...s, status: s.status === 'present' ? 'absent' : 'present' } : s
        ));
    };

    const markAllPresent = () => {
        setStudents(students.map(s => ({ ...s, status: 'present' })));
    };

    const markAllAbsent = () => {
        setStudents(students.map(s => ({ ...s, status: 'absent' })));
    };

    const handleSave = () => {
        const attendanceData = {
            date: selectedDate,
            class: selectedClass,
            subject: selectedSubject,
            chapter: selectedChapter,
            topic: selectedTopic,
            subTopic: subTopic,
            students: students,
            presentCount: presentCount,
            totalStudents: students.length
        };

        const result = saveAttendance(selectedDate, selectedClass, students);
        if (result.success) {
            setShowSuccess(true);
            setSuccessMessage(`Attendance saved successfully for ${selectedClass} - ${selectedSubject}`);
            setTimeout(() => {
                setShowSuccess(false);
                // Reset form
                setCurrentStep(1);
                setSelectedClass('');
                setSelectedSubject('');
                setSelectedChapter('');
                setSelectedTopic('');
                setSubTopic('');
            }, 3000);
        }
    };

    const canProceedToStep2 = selectedDate && selectedClass && selectedSubject;
    const canProceedToStep3 = canProceedToStep2 && selectedChapter && selectedTopic;
    const presentCount = students.filter(s => s.status === 'present').length;

    const steps = [
        { number: 1, title: 'Basic Info', icon: Calendar },
        { number: 2, title: 'Curriculum', icon: BookOpen },
        { number: 3, title: 'Attendance', icon: Users },
    ];

    return (
        <div className="admin-layout">
            <Sidebar role="faculty" />
            <div className="admin-main">
                <Navbar />
                <div className="mark-attendance-page">
                    {/* Header */}
                    <div className="page-header-section">
                        <div className="header-content">
                            <div className="header-icon">
                                <Users size={28} />
                            </div>
                            <div>
                                <h1>Mark Student Attendance</h1>
                                <p>Record daily attendance with curriculum tracking</p>
                            </div>
                        </div>
                    </div>

                    {/* Success Message */}
                    {showSuccess && (
                        <div className="success-alert">
                            <CheckCircle size={24} />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {/* Progress Steps */}
                    <div className="steps-container">
                        {steps.map((step, idx) => (
                            <React.Fragment key={step.number}>
                                <div
                                    className={`step-item ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
                                    onClick={() => {
                                        if (step.number === 1) setCurrentStep(1);
                                        else if (step.number === 2 && canProceedToStep2) setCurrentStep(2);
                                        else if (step.number === 3 && canProceedToStep3) setCurrentStep(3);
                                    }}
                                >
                                    <div className="step-circle">
                                        {currentStep > step.number ? <Check size={18} /> : <step.icon size={18} />}
                                    </div>
                                    <span className="step-title">{step.title}</span>
                                </div>
                                {idx < steps.length - 1 && <div className="step-connector" />}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Step 1: Basic Info */}
                    {currentStep === 1 && (
                        <div className="step-content">
                            <div className="form-card">
                                <h3><Calendar size={20} /> Basic Information</h3>

                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Select Date *</label>
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={e => setSelectedDate(e.target.value)}
                                            max={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Select Class *</label>
                                        <select
                                            value={selectedClass}
                                            onChange={e => setSelectedClass(e.target.value)}
                                        >
                                            <option value="">-- Select Class --</option>
                                            {classes.map(cls => (
                                                <option key={cls.id} value={cls.code}>
                                                    {cls.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Select Subject *</label>
                                        <select
                                            value={selectedSubject}
                                            onChange={e => setSelectedSubject(e.target.value)}
                                        >
                                            <option value="">-- Select Subject --</option>
                                            {subjects.map(subject => (
                                                <option key={subject} value={subject}>{subject}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button
                                        className="btn-next"
                                        onClick={() => setCurrentStep(2)}
                                        disabled={!canProceedToStep2}
                                    >
                                        Next: Curriculum Details
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Curriculum Selection */}
                    {currentStep === 2 && (
                        <div className="step-content">
                            <div className="form-card">
                                <h3><BookOpen size={20} /> Curriculum Details</h3>

                                <div className="selection-summary">
                                    <span className="summary-item">
                                        <Calendar size={14} /> {selectedDate}
                                    </span>
                                    <span className="summary-item">
                                        <Users size={14} /> {selectedClass}
                                    </span>
                                    <span className="summary-item">
                                        <BookOpen size={14} /> {selectedSubject}
                                    </span>
                                </div>

                                <div className="form-grid">
                                    <div className="form-group full-width">
                                        <label>Select Chapter *</label>
                                        <select
                                            value={selectedChapter}
                                            onChange={e => setSelectedChapter(e.target.value)}
                                        >
                                            <option value="">-- Select Chapter --</option>
                                            {chapters.map(chapter => (
                                                <option key={chapter.id} value={chapter.name}>
                                                    {chapter.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Select Topic *</label>
                                        <select
                                            value={selectedTopic}
                                            onChange={e => setSelectedTopic(e.target.value)}
                                            disabled={!selectedChapter}
                                        >
                                            <option value="">-- Select Topic --</option>
                                            {topics.map((topic, idx) => (
                                                <option key={idx} value={topic}>{topic}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group full-width">
                                        <label>
                                            <Layers size={14} style={{ marginRight: '0.5rem' }} />
                                            Sub-Topic (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={subTopic}
                                            onChange={e => setSubTopic(e.target.value)}
                                            placeholder="Enter specific sub-topic covered today..."
                                        />
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button
                                        className="btn-back"
                                        onClick={() => setCurrentStep(1)}
                                    >
                                        Back
                                    </button>
                                    <button
                                        className="btn-next"
                                        onClick={() => setCurrentStep(3)}
                                        disabled={!canProceedToStep3}
                                    >
                                        Next: Mark Attendance
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Mark Attendance */}
                    {currentStep === 3 && (
                        <div className="step-content">
                            <div className="form-card attendance-card">
                                <div className="attendance-header">
                                    <div>
                                        <h3><Users size={20} /> Mark Attendance</h3>
                                        <div className="selection-summary compact">
                                            <span>{selectedClass}</span>
                                            <span>•</span>
                                            <span>{selectedSubject}</span>
                                            <span>•</span>
                                            <span>{selectedTopic}</span>
                                        </div>
                                    </div>
                                    <div className="attendance-stats">
                                        <div className="stat present">
                                            <span className="stat-value">{presentCount}</span>
                                            <span className="stat-label">Present</span>
                                        </div>
                                        <div className="stat absent">
                                            <span className="stat-value">{students.length - presentCount}</span>
                                            <span className="stat-label">Absent</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="quick-actions">
                                    <button className="quick-btn present" onClick={markAllPresent}>
                                        <Check size={16} /> Mark All Present
                                    </button>
                                    <button className="quick-btn absent" onClick={markAllAbsent}>
                                        <X size={16} /> Mark All Absent
                                    </button>
                                </div>

                                <div className="students-list">
                                    {students.map(student => (
                                        <div
                                            key={student.id}
                                            className={`student-row ${student.status}`}
                                            onClick={() => toggleAttendance(student.id)}
                                        >
                                            <div className="student-info">
                                                <span className="roll-badge">{student.rollNo}</span>
                                                <div className="student-details">
                                                    <span className="student-name">{student.name}</span>
                                                    <span className="student-id">{student.id}</span>
                                                </div>
                                            </div>
                                            <button className={`status-btn ${student.status}`}>
                                                {student.status === 'present' ? (
                                                    <><Check size={16} /> Present</>
                                                ) : (
                                                    <><X size={16} /> Absent</>
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="form-actions">
                                    <button
                                        className="btn-back"
                                        onClick={() => setCurrentStep(2)}
                                    >
                                        Back
                                    </button>
                                    <button
                                        className="btn-save"
                                        onClick={handleSave}
                                    >
                                        <Save size={18} />
                                        Save Attendance
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .mark-attendance-page {
                    padding: 2rem;
                    background: #f8fafc;
                    min-height: 100vh;
                }

                .page-header-section {
                    margin-bottom: 2rem;
                }

                .header-content {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .header-icon {
                    width: 56px;
                    height: 56px;
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }

                .page-header-section h1 {
                    margin: 0 0 0.25rem 0;
                    font-size: 1.75rem;
                    color: #1e293b;
                }

                .page-header-section p {
                    margin: 0;
                    color: #64748b;
                }

                .success-alert {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem 1.5rem;
                    background: #d1fae5;
                    color: #065f46;
                    border-radius: 12px;
                    margin-bottom: 1.5rem;
                    font-weight: 600;
                }

                /* Steps */
                .steps-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0;
                    margin-bottom: 2rem;
                    background: white;
                    padding: 1.5rem 2rem;
                    border-radius: 16px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                .step-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    cursor: pointer;
                    padding: 0.5rem 1rem;
                    border-radius: 10px;
                    transition: all 0.2s;
                }

                .step-item:hover {
                    background: #f8fafc;
                }

                .step-circle {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #e2e8f0;
                    color: #64748b;
                    transition: all 0.2s;
                }

                .step-item.active .step-circle {
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    color: white;
                }

                .step-item.completed .step-circle {
                    background: #22c55e;
                    color: white;
                }

                .step-title {
                    font-weight: 600;
                    color: #64748b;
                }

                .step-item.active .step-title {
                    color: #1e293b;
                }

                .step-connector {
                    width: 60px;
                    height: 2px;
                    background: #e2e8f0;
                    margin: 0 1rem;
                }

                /* Form Card */
                .form-card {
                    background: white;
                    border-radius: 20px;
                    padding: 2rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                .form-card h3 {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin: 0 0 1.5rem 0;
                    font-size: 1.25rem;
                    color: #1e293b;
                }

                .form-card h3 svg {
                    color: #FEA3BE;
                }

                .selection-summary {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                }

                .selection-summary.compact {
                    margin-bottom: 0;
                    gap: 0.5rem;
                    color: #64748b;
                    font-size: 0.9rem;
                }

                .summary-item {
                    display: flex;
                    align-items: center;
                    gap: 0.375rem;
                    padding: 0.5rem 1rem;
                    background: #f1f5f9;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    color: #64748b;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .form-group.full-width {
                    grid-column: 1 / -1;
                }

                .form-group label {
                    font-weight: 600;
                    color: #1e293b;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                }

                .form-group input,
                .form-group select {
                    padding: 0.875rem 1rem;
                    border: 2px solid #e2e8f0;
                    border-radius: 10px;
                    font-size: 1rem;
                    transition: all 0.2s;
                    background: white;
                }

                .form-group input:focus,
                .form-group select:focus {
                    outline: none;
                    border-color: #FEA3BE;
                    box-shadow: 0 0 0 3px rgba(254, 163, 190, 0.1);
                }

                .form-group select:disabled {
                    background: #f8fafc;
                    cursor: not-allowed;
                }

                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    padding-top: 1rem;
                    border-top: 2px solid #f1f5f9;
                }

                .btn-next, .btn-save {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.875rem 1.5rem;
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-next:hover:not(:disabled), .btn-save:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(254, 163, 190, 0.4);
                }

                .btn-next:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .btn-back {
                    padding: 0.875rem 1.5rem;
                    background: #f1f5f9;
                    color: #64748b;
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-back:hover {
                    background: #e2e8f0;
                }

                .btn-save {
                    background: linear-gradient(135deg, #22c55e, #16a34a);
                }

                .btn-save:hover {
                    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
                }

                /* Attendance Card */
                .attendance-card {
                    max-width: 100%;
                }

                .attendance-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .attendance-stats {
                    display: flex;
                    gap: 1rem;
                }

                .attendance-stats .stat {
                    padding: 1rem 1.5rem;
                    border-radius: 12px;
                    text-align: center;
                }

                .attendance-stats .stat.present {
                    background: #d1fae5;
                }

                .attendance-stats .stat.absent {
                    background: #fee2e2;
                }

                .attendance-stats .stat-value {
                    display: block;
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #1e293b;
                }

                .attendance-stats .stat-label {
                    font-size: 0.85rem;
                    color: #64748b;
                }

                .quick-actions {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                .quick-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.25rem;
                    border: 2px solid;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    background: white;
                }

                .quick-btn.present {
                    border-color: #22c55e;
                    color: #22c55e;
                }

                .quick-btn.present:hover {
                    background: #22c55e;
                    color: white;
                }

                .quick-btn.absent {
                    border-color: #ef4444;
                    color: #ef4444;
                }

                .quick-btn.absent:hover {
                    background: #ef4444;
                    color: white;
                }

                .students-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    max-height: 400px;
                    overflow-y: auto;
                    padding-right: 0.5rem;
                    margin-bottom: 1.5rem;
                }

                .student-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 1.25rem;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 2px solid transparent;
                }

                .student-row.present {
                    background: #f0fdf4;
                    border-color: #22c55e;
                }

                .student-row.absent {
                    background: #fef2f2;
                    border-color: #ef4444;
                }

                .student-row:hover {
                    transform: translateX(4px);
                }

                .student-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .roll-badge {
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    color: white;
                    border-radius: 8px;
                    font-weight: 700;
                    font-size: 0.9rem;
                }

                .student-details {
                    display: flex;
                    flex-direction: column;
                }

                .student-name {
                    font-weight: 600;
                    color: #1e293b;
                }

                .student-id {
                    font-size: 0.8rem;
                    color: #94a3b8;
                }

                .status-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 0.9rem;
                }

                .status-btn.present {
                    background: #22c55e;
                    color: white;
                }

                .status-btn.absent {
                    background: #ef4444;
                    color: white;
                }

                @media (max-width: 768px) {
                    .mark-attendance-page {
                        padding: 1rem;
                    }

                    .steps-container {
                        flex-direction: column;
                        gap: 1rem;
                    }

                    .step-connector {
                        width: 2px;
                        height: 20px;
                        margin: 0;
                    }

                    .form-grid {
                        grid-template-columns: 1fr;
                    }

                    .attendance-header {
                        flex-direction: column;
                    }

                    .quick-actions {
                        flex-direction: column;
                    }

                    .form-actions {
                        flex-direction: column;
                    }

                    .btn-next, .btn-back, .btn-save {
                        width: 100%;
                        justify-content: center;
                    }
                }
            `}</style>
        </div>
    );
};

export default MarkAttendance;

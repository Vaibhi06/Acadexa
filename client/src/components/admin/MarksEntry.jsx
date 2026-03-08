import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import { Save, Search, CircleCheck } from 'lucide-react';
import api from '../../utils/api';

const MarksEntry = () => {
    const [selectedClass, setSelectedClass] = useState('10th Grade A');
    const [selectedExam, setSelectedExam] = useState('Mid-Term Exam');
    const [selectedSubject, setSelectedSubject] = useState('Mathematics');
    const [showSuccess, setShowSuccess] = useState(false);

    const [students, setStudents] = useState([
        { id: 'STU001', name: 'John Doe', marks: 85, maxMarks: 100 },
        { id: 'STU002', name: 'Jane Smith', marks: 92, maxMarks: 100 },
        { id: 'STU003', name: 'Mike Johnson', marks: 78, maxMarks: 100 },
        { id: 'STU004', name: 'Sarah Williams', marks: 95, maxMarks: 100 },
    ]);

    const handleMarksChange = (id, value) => {
        setStudents(students.map(s =>
            s.id === id ? { ...s, marks: parseInt(value) || 0 } : s
        ));
    };

    const calculateGrade = (marks, maxMarks) => {
        const percentage = (marks / maxMarks) * 100;
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B+';
        if (percentage >= 60) return 'B';
        if (percentage >= 50) return 'C';
        return 'F';
    };

    const saveMarks = async () => {
        try {
            const marksData = students.map(student => ({
                studentId: student.id,
                studentName: student.name,
                class: selectedClass,
                examName: selectedExam,
                subject: selectedSubject,
                marksObtained: student.marks,
                maxMarks: student.maxMarks
            }));

            await api.post('/marks', marksData);

            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error('Error saving marks:', error);
            alert('Failed to save marks');
        }
    };

    return (
        <div className="admin-layout">
            <Sidebar role="admin" />
            <div className="admin-main">
                <Navbar />
                <div className="admin-content">
                    <div className="page-header">
                        <div>
                            <h1>Marks Entry</h1>
                            <p className="text-secondary">Enter and manage student marks</p>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            <div className="input-group">
                                <label className="input-label">Select Class</label>
                                <select className="input-field" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
                                    <option>10th Grade A</option>
                                    <option>10th Grade B</option>
                                    <option>11th Grade A</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Select Exam</label>
                                <select className="input-field" value={selectedExam} onChange={e => setSelectedExam(e.target.value)}>
                                    <option>Mid-Term Exam</option>
                                    <option>Final Exam</option>
                                    <option>Unit Test 1</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Select Subject</label>
                                <select className="input-field" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
                                    <option>Mathematics</option>
                                    <option>Physics</option>
                                    <option>Chemistry</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Student Marks</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--glass-border)' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Student ID</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                                    <th style={{ padding: '1rem', textAlign: 'center' }}>Marks</th>
                                    <th style={{ padding: '1rem', textAlign: 'center' }}>Max Marks</th>
                                    <th style={{ padding: '1rem', textAlign: 'center' }}>Percentage</th>
                                    <th style={{ padding: '1rem', textAlign: 'center' }}>Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(student => (
                                    <tr key={student.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                        <td style={{ padding: '1rem' }}><span className="badge badge-primary">{student.id}</span></td>
                                        <td style={{ padding: '1rem' }}>{student.name}</td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <input
                                                type="number"
                                                className="input-field"
                                                value={student.marks}
                                                onChange={e => handleMarksChange(student.id, e.target.value)}
                                                style={{ width: '100px', textAlign: 'center' }}
                                                min="0"
                                                max={student.maxMarks}
                                            />
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>{student.maxMarks}</td>
                                        <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
                                            {((student.marks / student.maxMarks) * 100).toFixed(1)}%
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <span className="badge badge-success">{calculateGrade(student.marks, student.maxMarks)}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className="btn btn-primary" style={{ marginTop: '2rem' }} onClick={saveMarks}>
                            <Save size={20} />
                            Save All Marks
                        </button>
                    </div>

                    {showSuccess && (
                        <div className="glass-card" style={{
                            position: 'fixed',
                            bottom: '2rem',
                            right: '2rem',
                            padding: '1rem 1.5rem',
                            background: '#ecfdf5',
                            borderColor: '#10b981',
                            color: '#065f46',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            zIndex: 1000,
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}>
                            <CircleCheck size={24} color="#10b981" />
                            <strong>Success!</strong> All marks have been saved successfully.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MarksEntry;

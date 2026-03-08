import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Sidebar from '../shared/Sidebar';
import { useClasses } from '../../contexts/ClassesContext';
import { Clock, Edit2, Trash2, Plus, Save, X, CheckCircle2 } from 'lucide-react';

const TimetableManagement = () => {
    const { classes, error: classesError } = useClasses();
    const [selectedClass, setSelectedClass] = useState('');
    const [timetable, setTimetable] = useState({});
    const [showPublishAlert, setShowPublishAlert] = useState(false);

    useEffect(() => {
        if (classes?.length > 0 && !selectedClass) {
            setSelectedClass(classes[0].name);
        }
    }, [classes, selectedClass]);

    useEffect(() => {
        const fetchTimetable = async () => {
            if (selectedClass) {
                try {
                    const { data } = await api.get(`/timetable?class=${encodeURIComponent(selectedClass)}`);
                    setTimetable(prev => ({
                        ...prev,
                        [selectedClass]: data
                    }));
                } catch (error) {
                    console.error('Error fetching timetable:', error);
                }
            }
        };
        fetchTimetable();
    }, [selectedClass]);

    return (
        <div className="new-admin-layout">
            <Sidebar role="admin" />
            <div className="new-admin-main">
                <div className="new-admin-content">
                    <div className="page-header">
                        <div>
                            <h1>Timetable Management</h1>
                            <p className="text-secondary">Manage class schedules and faculty allocation</p>
                        </div>
                        <button
                            className="btn btn-success"
                            onClick={async () => {
                                try {
                                    await api.post('/timetable', {
                                        class: selectedClass,
                                        schedules: timetable[selectedClass] || []
                                    });
                                    setShowPublishAlert(true);
                                    setTimeout(() => setShowPublishAlert(false), 3000);
                                } catch (error) {
                                    console.error('Error saving timetable:', error);
                                    alert('Failed to save timetable');
                                }
                            }}
                            style={{
                                background: '#10b981',
                                color: 'white',
                                border: 'none',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontWeight: 600
                            }}
                        >
                            <Save size={20} />
                            Publish Timetable
                        </button>
                    </div>

                    {showPublishAlert && (
                        <div style={{
                            padding: '1rem',
                            marginBottom: '1.5rem',
                            background: '#ecfdf5',
                            border: '1px solid #10b981',
                            borderRadius: '8px',
                            color: '#065f46',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                        }}>
                            <CheckCircle2 size={24} color="#10b981" />
                            <strong>Success!</strong> Timetable has been published successfully.
                        </div>
                    )}

                    <div style={{
                        padding: '2rem',
                        marginBottom: '2rem',
                        background: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ maxWidth: '300px' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                                Select Class
                            </label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0'
                                }}
                            >
                                {classes?.length > 0 ? (
                                    classes.map(cls => (
                                        <option key={cls.id} value={cls.name}>{cls.name}</option>
                                    ))
                                ) : (
                                    <option>No classes available</option>
                                )}
                            </select>
                        </div>
                    </div>

                    <div style={{
                        padding: '1.5rem',
                        background: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                        overflowX: 'auto'
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>
                                        <Clock size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                        Time
                                    </th>
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                        <th key={day} style={{ padding: '1rem', textAlign: 'center' }}>{day}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {timetable[selectedClass]?.length > 0 ? (
                                    timetable[selectedClass].map((period) => (
                                        <tr key={period.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                            <td style={{ padding: '1rem', fontWeight: 600 }}>{period.time}</td>
                                            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                                                <td key={day} style={{ padding: '1rem', textAlign: 'center' }}>
                                                    <div style={{
                                                        background: 'linear-gradient(135deg, #FEA3BE, #FBA2AB)',
                                                        padding: '0.75rem',
                                                        borderRadius: '8px',
                                                        color: 'white',
                                                        minHeight: '60px',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '0.25rem'
                                                    }}>
                                                        {(() => {
                                                            let cellData = period[day];
                                                            // Parse if it's a JSON string
                                                            if (typeof cellData === 'string' && cellData.startsWith('{')) {
                                                                try {
                                                                    cellData = JSON.parse(cellData);
                                                                } catch (e) {
                                                                    return <span style={{ fontWeight: 600 }}>{cellData || '-'}</span>;
                                                                }
                                                            }

                                                            if (typeof cellData === 'object' && cellData !== null) {
                                                                return (
                                                                    <>
                                                                        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                                                                            {cellData.subject || '-'}
                                                                        </span>
                                                                        {cellData.faculty && (
                                                                            <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                                                                                {cellData.faculty}
                                                                            </span>
                                                                        )}
                                                                    </>
                                                                );
                                                            }

                                                            return <span style={{ fontWeight: 600 }}>{cellData || '-'}</span>;
                                                        })()}
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                                            {selectedClass ? 'No timetable entries for this class.' : 'Please select a class to view timetable.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <style>{`
                .new-admin-layout {
                    display: flex;
                    min-height: 100vh;
                    background: #ffffff;
                }

                .new-admin-main {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    margin-left: 280px;
                }

                .new-admin-content {
                    flex: 1;
                    padding: 2rem;
                    max-width: 1600px;
                    margin: 0 auto;
                    width: 100%;
                }

                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }

                .page-header h1 {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #000000;
                    margin: 0 0 0.5rem 0;
                }

                .text-secondary {
                    color: #64748b;
                    margin: 0;
                }

                @media (max-width: 1024px) {
                    .new-admin-content {
                        padding-top: 6.5rem;
                        padding-left: 1rem;
                        padding-right: 1rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default TimetableManagement;

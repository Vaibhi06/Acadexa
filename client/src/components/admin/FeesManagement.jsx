import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import { useClasses } from '../../contexts/ClassesContext';
import { DollarSign, Download, Check, X, Plus, Trash2, Calendar, Save, List, FileText, MessageCircle } from 'lucide-react';

const FeesManagement = () => {
    const { classes } = useClasses();
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'structure'

    // --- Overview State ---
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStudents, setSelectedStudents] = useState([]); // For individual selection
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [showSelectedModal, setShowSelectedModal] = useState(false); // For selected students
    const [bulkFeeData, setBulkFeeData] = useState({
        selectedClass: '',
        totalFees: '',
        initialPayment: '',
        sendWhatsAppReminder: true // Auto-send WhatsApp by default
    });

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('Fetching students from /api/students...');
                const response = await api.get('/students');
                console.log('Full API Response:', response.data);

                // Handle wrapped response format from successResponse utility
                // Response structure: { success: true, message: "", data: { students: [...] } }
                const studentsArray = response.data?.data?.students || response.data?.students || response.data || [];
                console.log('Students array:', studentsArray);
                console.log('Students received:', studentsArray.length);

                // Map API data to UI structure including phone numbers for WhatsApp
                const mapped = studentsArray.map(s => ({
                    id: s.id,
                    name: `${s.firstName} ${s.lastName}`,
                    class: s.classCode,
                    phone: s.phone || s.guardianPhone, // Prioritize student registered phone
                    totalFees: s.fees?.total || 0,
                    paid: s.fees?.paid || 0,
                    pending: s.fees?.pending || 0,
                    status: (s.fees?.pending > 0) ? 'partial' : 'paid'
                }));

                setStudents(mapped);
            } catch (error) {
                console.error('Error fetching students:', error);
                console.error('Error details:', error.response?.data || error.message);

                if (error.response?.status === 401) {
                    setError('Please log in to view student records');
                } else {
                    setError(error.response?.data?.message || 'Failed to load students');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const totalCollected = students.reduce((sum, s) => sum + parseInt(s.paid || 0), 0);
    const totalPending = students.reduce((sum, s) => sum + parseInt(s.pending || 0), 0);

    // --- Bulk Fee Assignment ---
    // Handle student selection
    const handleStudentSelect = (studentId) => {
        setSelectedStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedStudents(students.map(s => s.id));
        } else {
            setSelectedStudents([]);
        }
    };

    const handleAssignToSelected = () => {
        if (selectedStudents.length === 0) {
            alert('Please select at least one student');
            return;
        }
        setShowSelectedModal(true);
    };

    const handleBulkFeeChange = (e) => {
        const { name, value } = e.target;
        setBulkFeeData(prev => ({ ...prev, [name]: value }));
    };

    const handleBulkAssign = async (e) => {
        e.preventDefault();
        try {
            const { selectedClass, totalFees, initialPayment } = bulkFeeData;
            const total = parseFloat(totalFees);
            const paid = parseFloat(initialPayment) || 0;
            const pending = total - paid;

            // Debug: Show what we're looking for
            console.log('Looking for students in class:', selectedClass);
            console.log('All students:', students.map(s => ({ name: s.name, class: s.class })));

            // Get students from selected class
            const classStudents = students.filter(s => s.class === selectedClass);
            console.log('Found students:', classStudents);

            if (classStudents.length === 0) {
                alert(`No students found in selected class: "${selectedClass}"\n\nAvailable classes: ${[...new Set(students.map(s => s.class))].join(', ')}`);
                return;
            }

            console.log(`Starting bulk assignment for class: ${selectedClass}`);
            console.log(`Assigning to ${classStudents.length} students. Payload:`, { total, paid, pending });

            // Update each student in the class
            const updatePromises = classStudents.map(student => {
                return api.put(`/fees/students/${student.id}`, {
                    total,
                    paid,
                    pending
                });
            });

            await Promise.all(updatePromises);

            alert(`✅ Fees assigned to ${classStudents.length} students in ${selectedClass}`);

            // Send WhatsApp reminders if enabled
            if (bulkFeeData.sendWhatsAppReminder && pending > 0) {
                const studentsWithPhone = classStudents.filter(s => s.phone);

                if (studentsWithPhone.length > 0) {
                    const confirmSend = window.confirm(
                        `Send WhatsApp reminders to ${studentsWithPhone.length} students?\n\n` +
                        `This will open ${studentsWithPhone.length} WhatsApp tabs.`
                    );

                    if (confirmSend) {
                        studentsWithPhone.forEach((student, index) => {
                            setTimeout(() => {
                                const message = encodeURIComponent(
                                    `Dear Parent/Guardian,\n\n` +
                                    `Fee payment notification for ${student.name} (ID: ${student.id}).\n\n` +
                                    `Total Fees: ₹${total.toLocaleString()}\n` +
                                    `Paid: ₹${paid.toLocaleString()}\n` +
                                    `Pending: ₹${pending.toLocaleString()}\n\n` +
                                    `Please make the payment at your earliest convenience.\n\n` +
                                    `Thank you!`
                                );
                                const phoneNumber = student.phone.replace(/\D/g, '');
                                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
                                window.open(whatsappUrl, '_blank');
                            }, index * 1000);
                        });
                    }
                }
            }

            setShowBulkModal(false);
            setBulkFeeData({ selectedClass: '', totalFees: '', initialPayment: '', sendWhatsAppReminder: true });

            // Refresh student data
            try {
                const response = await api.get('/students');
                const studentsArray = response.data?.data?.students || response.data?.students || response.data || [];
                const mapped = studentsArray.map(s => ({
                    id: s.id,
                    name: `${s.firstName} ${s.lastName}`,
                    class: s.classCode,
                    phone: s.phone || s.guardianPhone, // Prioritize registered phone
                    totalFees: s.fees?.total || 0,
                    paid: s.fees?.paid || 0,
                    pending: s.fees?.pending || 0,
                    status: (s.fees?.pending > 0) ? 'partial' : 'paid'
                }));
                setStudents(mapped);
            } catch (error) {
                console.error('Error refreshing:', error);
            }
        } catch (error) {
            console.error('Error assigning bulk fees:', error);
            alert('Failed to assign fees. Please try again.');
        }
    };

    // Handle assign to selected students
    const handleAssignToSelectedSubmit = async (e) => {
        e.preventDefault();
        try {
            const { totalFees, initialPayment, sendWhatsAppReminder } = bulkFeeData;
            const total = parseFloat(totalFees);
            const paid = parseFloat(initialPayment) || 0;
            const pending = total - paid;

            const selectedStudentData = students.filter(s => selectedStudents.includes(s.id));

            // Update each selected student
            const updatePromises = selectedStudentData.map(student => {
                return api.put(`/fees/students/${student.id}`, {
                    total,
                    paid,
                    pending
                });
            });

            await Promise.all(updatePromises);
            alert(`✅ Fees assigned to ${selectedStudentData.length} selected students`);

            // Send WhatsApp reminders if enabled
            if (sendWhatsAppReminder && pending > 0) {
                const studentsWithPhone = selectedStudentData.filter(s => s.phone);

                if (studentsWithPhone.length > 0) {
                    const confirmSend = window.confirm(
                        `Send WhatsApp reminders to ${studentsWithPhone.length} students?\n\n` +
                        `This will open ${studentsWithPhone.length} WhatsApp tabs.`
                    );

                    if (confirmSend) {
                        studentsWithPhone.forEach((student, index) => {
                            setTimeout(() => {
                                const message = encodeURIComponent(
                                    `Dear Parent/Guardian,\n\n` +
                                    `Fee payment notification for ${student.name} (ID: ${student.id}).\n\n` +
                                    `Total Fees: ₹${total.toLocaleString()}\n` +
                                    `Paid: ₹${paid.toLocaleString()}\n` +
                                    `Pending: ₹${pending.toLocaleString()}\n\n` +
                                    `Please make the payment at your earliest convenience.\n\n` +
                                    `Thank you!`
                                );
                                const phoneNumber = student.phone.replace(/\D/g, '');
                                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
                                window.open(whatsappUrl, '_blank');
                            }, index * 1000);
                        });
                    }
                }
            }

            setShowSelectedModal(false);
            setSelectedStudents([]);
            setBulkFeeData({ selectedClass: '', totalFees: '', initialPayment: '', sendWhatsAppReminder: true });

            // Refresh student data
            try {
                const response = await api.get('/students');
                const studentsArray = response.data?.data?.students || response.data?.students || response.data || [];
                const mapped = studentsArray.map(s => ({
                    id: s.id,
                    name: `${s.firstName} ${s.lastName}`,
                    class: s.classCode,
                    phone: s.phone || s.guardianPhone, // Prioritize student registered phone
                    totalFees: s.fees?.total || 0,
                    paid: s.fees?.paid || 0,
                    pending: s.fees?.pending || 0,
                    status: (s.fees?.pending > 0) ? 'partial' : 'paid'
                }));
                setStudents(mapped);
            } catch (error) {
                console.error('Error refreshing:', error);
            }
        } catch (error) {
            console.error('Error assigning fees to selected:', error);
            alert('Failed to assign fees. Please try again.');
        }
    };

    // --- Structure State ---
    const [feeStructures, setFeeStructures] = useState([]);
    const [structureData, setStructureData] = useState({
        selectedClass: '',
        totalFees: '',
        installments: [{ id: 1, amount: '', dueDate: '' }],
        notes: ''
    });

    const handleStructureChange = (e) => {
        const { name, value } = e.target;
        setStructureData(prev => ({ ...prev, [name]: value }));
    };

    const handleInstallmentChange = (id, field, value) => {
        setStructureData(prev => ({
            ...prev,
            installments: prev.installments.map(inst =>
                inst.id === id ? { ...inst, [field]: value } : inst
            )
        }));
    };

    const addInstallment = () => {
        if (structureData.installments.length >= 12) {
            alert('Maximum 12 installments allowed');
            return;
        }
        setStructureData(prev => ({
            ...prev,
            installments: [...prev.installments, { id: Date.now(), amount: '', dueDate: '' }]
        }));
    };

    const removeInstallment = (id) => {
        if (structureData.installments.length <= 1) return;
        setStructureData(prev => ({
            ...prev,
            installments: prev.installments.filter(inst => inst.id !== id)
        }));
    };

    const handleSaveStructure = async (e) => {
        e.preventDefault();
        try {
            await api.post('/fees', {
                class: structureData.selectedClass,
                totalFees: structureData.totalFees,
                installments: structureData.installments,
                notes: structureData.notes
            });
            alert('Fee Structure Saved Successfully!');
            setStructureData({
                selectedClass: '',
                totalFees: '',
                installments: [{ id: 1, amount: '', dueDate: '' }],
                notes: ''
            });
        } catch (error) {
            console.error('Error saving fee structure:', error);
            alert('Failed to save fee structure');
        }
    };

    return (
        <div className="admin-layout">
            <Sidebar role="admin" />
            <div className="admin-main">
                {/* Navbar is optional if Dashboard has it, but based on previous file it was here */}
                {/* <Navbar /> */}

                <div className="admin-content">
                    <div className="page-header">
                        <div>
                            <h1>Fees Management</h1>
                            <p className="text-secondary">Track fees and define structures</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            {selectedStudents.length > 0 && (
                                <button
                                    className="assign-selected-btn"
                                    onClick={handleAssignToSelected}
                                    style={{
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        color: 'white',
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '8px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '0.95rem',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <Check size={18} />
                                    Assign to Selected ({selectedStudents.length})
                                </button>
                            )}
                            <button
                                className="bulk-assign-btn"
                                onClick={() => setShowBulkModal(true)}
                            >
                                <Plus size={18} />
                                Bulk Assign Fees
                            </button>
                            <div className="header-tabs">
                                <button
                                    className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('overview')}
                                >
                                    <List size={18} />
                                    Fees Overview
                                </button>
                                <button
                                    className={`tab-btn ${activeTab === 'structure' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('structure')}
                                >
                                    <FileText size={18} />
                                    Fees Structure
                                </button>
                            </div>
                        </div>
                    </div>

                    {activeTab === 'overview' ? (
                        <div className="fade-in">
                            <div className="stats-grid">
                                <div className="stat-card glass-card">
                                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                                        <DollarSign size={28} />
                                    </div>
                                    <div>
                                        <p className="stat-title">Total Collected</p>
                                        <h3 className="stat-value">₹{totalCollected.toLocaleString()}</h3>
                                    </div>
                                </div>
                                <div className="stat-card glass-card">
                                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                                        <DollarSign size={28} />
                                    </div>
                                    <div>
                                        <p className="stat-title">Total Pending</p>
                                        <h3 className="stat-value">₹{totalPending.toLocaleString()}</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card" style={{ padding: '2rem', marginTop: '2rem' }}>
                                <h3 style={{ marginBottom: '1.5rem' }}>Student Fee Records</h3>
                                <table className="custom-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '40px', textAlign: 'center' }}>
                                                <input
                                                    type="checkbox"
                                                    onChange={handleSelectAll}
                                                    checked={students.length > 0 && selectedStudents.length === students.length}
                                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                                />
                                            </th>
                                            <th>Student</th>
                                            <th>Class</th>
                                            <th className="text-right">Total Fees</th>
                                            <th className="text-right">Paid</th>
                                            <th className="text-right">Pending</th>
                                            <th className="text-center">Status</th>
                                            <th className="text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map(student => (
                                            <tr key={student.id} className={selectedStudents.includes(student.id) ? 'selected-row' : ''}>
                                                <td style={{ textAlign: 'center' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedStudents.includes(student.id)}
                                                        onChange={() => handleStudentSelect(student.id)}
                                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                                    />
                                                </td>
                                                <td>
                                                    <div>
                                                        <div style={{ fontWeight: 600 }}>{student.name}</div>
                                                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>{student.id}</div>
                                                    </div>
                                                </td>
                                                <td>{student.class}</td>
                                                <td className="text-right font-bold">₹{student.totalFees.toLocaleString()}</td>
                                                <td className="text-right text-success">₹{student.paid.toLocaleString()}</td>
                                                <td className="text-right text-warning">₹{student.pending.toLocaleString()}</td>
                                                <td className="text-center">
                                                    {student.status === 'paid' ? (
                                                        <span className="badge badge-success">
                                                            <Check size={14} /> Paid
                                                        </span>
                                                    ) : (
                                                        <span className="badge badge-warning">
                                                            <X size={14} /> Pending
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="text-center">
                                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                        {student.pending > 0 && student.phone && (
                                                            <button
                                                                className="whatsapp-btn"
                                                                onClick={() => {
                                                                    const message = encodeURIComponent(
                                                                        `Dear Parent/Guardian,\n\nThis is a friendly reminder regarding the pending fee for ${student.name} (ID: ${student.id}).\n\n` +
                                                                        `Pending Amount: ₹${student.pending.toLocaleString()}\n` +
                                                                        `Total Fees: ₹${student.totalFees.toLocaleString()}\n` +
                                                                        `Already Paid: ₹${student.paid.toLocaleString()}\n\n` +
                                                                        `Please make the payment at your earliest convenience.\n\n` +
                                                                        `Thank you!`
                                                                    );
                                                                    const phoneNumber = student.phone.replace(/\D/g, ''); // Remove non-digits
                                                                    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
                                                                    window.open(whatsappUrl, '_blank');
                                                                }}
                                                                title="Send WhatsApp Reminder"
                                                            >
                                                                <MessageCircle size={16} />
                                                                <span>Send Reminder</span>
                                                            </button>
                                                        )}
                                                        <button className="icon-btn" title="Download Receipt">
                                                            <Download size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {loading && (
                                    <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                        <p style={{ fontSize: '1.1rem' }}>Loading students...</p>
                                    </div>
                                )}
                                {!loading && error && (
                                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                                        <p style={{ fontSize: '1.1rem', color: '#ef4444', marginBottom: '0.5rem' }}>⚠️ {error}</p>
                                        <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Make sure you're logged in as admin</p>
                                    </div>
                                )}
                                {!loading && !error && students.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                        <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No students found</p>
                                        <p style={{ fontSize: '0.9rem' }}>Add students from the Student Management page</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="fade-in">
                            <form onSubmit={handleSaveStructure}>
                                {/* Class Selection Section */}
                                <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid #3b82f6' }}>
                                    <div className="section-header">
                                        <h3><Check size={20} /> Select Class</h3>
                                    </div>
                                    <div className="form-group">
                                        <label>Choose Class/Batch</label>
                                        <select
                                            className="input-field"
                                            name="selectedClass"
                                            value={structureData.selectedClass}
                                            onChange={handleStructureChange}
                                            required
                                        >
                                            <option value="">Select a class...</option>
                                            {classes.map((cls, idx) => (
                                                <option key={idx} value={cls.name || cls.id}>{cls.name || cls}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Fee Structure Section */}
                                <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #3b82f6' }}>
                                    <div className="section-header">
                                        <h3><DollarSign size={20} /> Fees Structure</h3>
                                    </div>

                                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                        <label>Total Decided Fees (₹)</label>
                                        <input
                                            type="number"
                                            className="input-field"
                                            name="totalFees"
                                            value={structureData.totalFees}
                                            onChange={handleStructureChange}
                                            placeholder="Enter total annual fees"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label style={{ marginBottom: '1rem', display: 'block' }}>Installments</label>
                                        <div className="installments-container">
                                            {structureData.installments.map((inst, index) => (
                                                <div key={inst.id} className="installment-row">
                                                    <div className="input-group">
                                                        <label className="sub-label">Amount (₹)</label>
                                                        <input
                                                            type="number"
                                                            className="input-field"
                                                            value={inst.amount}
                                                            onChange={(e) => handleInstallmentChange(inst.id, 'amount', e.target.value)}
                                                            placeholder="Example: 5000"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="input-group">
                                                        <label className="sub-label">Due Date</label>
                                                        <div className="date-input-wrapper">
                                                            <input
                                                                type="date"
                                                                className="input-field"
                                                                value={inst.dueDate}
                                                                onChange={(e) => handleInstallmentChange(inst.id, 'dueDate', e.target.value)}
                                                                required
                                                            />
                                                            <Calendar size={18} className="calendar-icon" />
                                                        </div>
                                                    </div>
                                                    {structureData.installments.length > 1 && (
                                                        <button
                                                            type="button"
                                                            className="delete-btn"
                                                            onClick={() => removeInstallment(inst.id)}
                                                            title="Remove Installment"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="installment-actions">
                                            <button type="button" className="add-btn" onClick={addInstallment}>
                                                <Plus size={16} /> Add Installment
                                            </button>
                                            <span className="info-text">Maximum 12 installments allowed</span>
                                        </div>
                                    </div>

                                    <div className="form-group" style={{ marginTop: '1.5rem' }}>
                                        <label>Notes</label>
                                        <textarea
                                            className="input-field textarea"
                                            name="notes"
                                            value={structureData.notes}
                                            onChange={handleStructureChange}
                                            placeholder="Additional notes or instructions..."
                                            rows="3"
                                        ></textarea>
                                    </div>

                                    <div className="form-actions" style={{ marginTop: '2rem' }}>
                                        <button type="submit" className="save-btn">
                                            <Save size={18} /> Save Fees Structure
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* Assign to Selected Students Modal */}
            {showSelectedModal && (
                <div className="modal-overlay" onClick={() => setShowSelectedModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Assign Fees to Selected</h2>
                            <button className="close-btn" onClick={() => setShowSelectedModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleAssignToSelectedSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <p style={{ marginBottom: '1rem', color: '#64748b' }}>
                                        Assigning fees to <strong>{selectedStudents.length} selected students</strong>.
                                    </p>
                                </div>
                                <div className="form-group">
                                    <label>Total Fees (₹)</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        name="totalFees"
                                        value={bulkFeeData.totalFees}
                                        onChange={handleBulkFeeChange}
                                        placeholder="e.g., 50000"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Initial Payment (₹) <span style={{ color: '#94a3b8' }}>(Optional)</span></label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        name="initialPayment"
                                        value={bulkFeeData.initialPayment}
                                        onChange={handleBulkFeeChange}
                                        placeholder="e.g., 20000 (leave empty for 0)"
                                    />
                                </div>

                                <div className="form-group" style={{ marginTop: '1.5rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.5rem' }}>
                                        <input
                                            type="checkbox"
                                            name="sendWhatsAppReminder"
                                            checked={bulkFeeData.sendWhatsAppReminder}
                                            onChange={(e) => setBulkFeeData({ ...bulkFeeData, sendWhatsAppReminder: e.target.checked })}
                                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                        />
                                        <span>Send WhatsApp reminder after assigning</span>
                                    </label>
                                </div>

                                <div className="info-box">
                                    <p>Pending amount will be calculated: <strong>Total - Initial Payment</strong></p>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="cancel-btn" onClick={() => setShowSelectedModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="submit-btn" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                                    Assign to {selectedStudents.length} Students
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Bulk Fee Assignment Modal */}
            {showBulkModal && (
                <div className="modal-overlay" onClick={() => setShowBulkModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Bulk Assign Fees</h2>
                            <button className="close-btn" onClick={() => setShowBulkModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleBulkAssign}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Select Class</label>
                                    <select
                                        className="input-field"
                                        name="selectedClass"
                                        value={bulkFeeData.selectedClass}
                                        onChange={handleBulkFeeChange}
                                        required
                                    >
                                        <option value="">Choose a class...</option>
                                        {[...new Set(students.map(s => s.class))].sort().map((className) => (
                                            <option key={className} value={className}>{className}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Total Fees (₹)</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        name="totalFees"
                                        value={bulkFeeData.totalFees}
                                        onChange={handleBulkFeeChange}
                                        placeholder="e.g., 50000"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Initial Payment (₹) <span style={{ color: '#94a3b8' }}>(Optional)</span></label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        name="initialPayment"
                                        value={bulkFeeData.initialPayment}
                                        onChange={handleBulkFeeChange}
                                        placeholder="e.g., 20000 (leave empty for 0)"
                                    />
                                </div>
                                <div className="info-box">
                                    <p>💡 This will assign the same fee structure to all students in the selected class.</p>
                                    <p>Pending amount will be calculated automatically: <strong>Total - Initial Payment</strong></p>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="cancel-btn" onClick={() => setShowBulkModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="submit-btn">
                                    Assign Fees
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .page-header {
                    margin-bottom: 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                .page-header h1 { margin: 0; font-size: 2rem; color: #1e293b; }
                
                .header-tabs {
                    display: flex;
                    gap: 1rem;
                    background: #f1f5f9;
                    padding: 0.35rem;
                    border-radius: 12px;
                }
                .tab-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.5rem;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    color: #64748b;
                    background: transparent;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .tab-btn:hover { background: rgba(255, 255, 255, 0.5); color: #1e293b; }
                .tab-btn.active { background: white; color: #1e293b; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }

                /* Form Styles */
                .section-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
                }
                .section-header h3 { margin: 0; font-size: 1.1rem; color: #1e293b; display: flex; align-items: center; gap: 0.5rem; }
                
                .form-group label {
                    display: block;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    color: #334155;
                    font-size: 0.95rem;
                }

                .input-field {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: all 0.2s;
                    background: #f8fafc;
                }
                .input-field:focus {
                    outline: none;
                    border-color: #3b82f6;
                    background: white;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }
                .input-field.textarea { resize: vertical; }

                /* Installments */
                .installments-container {
                    background: #f8fafc;
                    padding: 1.5rem;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .installment-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr auto;
                    gap: 1.5rem;
                    align-items: flex-end;
                    background: white;
                    padding: 1rem;
                    border-radius: 8px;
                    border: 1px solid #e2e8f0;
                }
                .sub-label { font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem; }
                
                .date-input-wrapper { position: relative; }
                .calendar-icon {
                    position: absolute;
                    right: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #94a3b8;
                    pointer-events: none;
                }

                .delete-btn {
                    background: #fee2e2;
                    color: #ef4444;
                    border: none;
                    width: 42px;
                    height: 42px;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .delete-btn:hover { background: #fecaca; }

                .installment-actions {
                    margin-top: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .add-btn {
                    background: #dbeafe;
                    color: #3b82f6;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.2s;
                }
                .add-btn:hover { background: #bfdbfe; }
                .info-text { font-size: 0.85rem; color: #94a3b8; }

                .save-btn {
                    background: #3b82f6;
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 1rem;
                }
                .save-btn:hover { background: #2563eb; }

                /* Table Styles (reused) */
                .custom-table { width: 100%; border-collapse: collapse; }
                .custom-table th { text-align: left; padding: 1rem; border-bottom: 2px solid #e2e8f0; color: #64748b; font-weight: 600; }
                .custom-table td { padding: 1rem; border-bottom: 1px solid #f1f5f9; color: #1e293b; transition: all 0.2s; }
                .custom-table tr.selected-row { background-color: #f0f9ff; }
                .custom-table tr.selected-row td { border-bottom-color: #bae6fd; }
                .text-right { text-align: right; }
                .text-center { text-align: center; }
                .text-success { color: #10b981; }
                .text-warning { color: #f59e0b; }
                .font-bold { font-weight: 600; }
                .badge { display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.25rem 0.6rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
                .badge-success { background: #d1fae5; color: #059669; }
                .badge-warning { background: #fef3c7; color: #d97706; }

                /* WhatsApp Button */
                .whatsapp-btn {
                    background: linear-gradient(135deg, #25D366, #128C7E);
                    color: white;
                    border: none;
                    padding: 0.6rem 1rem;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(37, 211, 102, 0.3);
                }
                .whatsapp-btn:hover {
                    background: linear-gradient(135deg, #128C7E, #075E54);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
                }
                .icon-btn {
                    background: #f1f5f9;
                    border: none;
                    padding: 0.5rem;
                    border-radius: 6px;
                    cursor: pointer;
                    color: #64748b;
                    transition: all 0.2s;
                }
                .icon-btn:hover {
                    background: #e2e8f0;
                    color: #1e293b;
                }
                
                /* Bulk Assign Button */
                .bulk-assign-btn {
                    background: linear-gradient(135deg, #3b82f6, #2563eb);
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.95rem;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
                }
                .bulk-assign-btn:hover {
                    background: linear-gradient(135deg, #2563eb, #1d4ed8);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
                }

                /* Modal Styles */
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
                    backdrop-filter: blur(4px);
                }
                .modal-content {
                    background: white;
                    border-radius: 16px;
                    width: 90%;
                    max-width: 500px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    animation: modalSlideIn 0.3s ease-out;
                }
                @keyframes modalSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .modal-header {
                    padding: 1.5rem 2rem;
                    border-bottom: 1px solid #e2e8f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .modal-header h2 {
                    margin: 0;
                    font-size: 1.5rem;
                    color: #1e293b;
                }
                .close-btn {
                    background: none;
                    border: none;
                    font-size: 2rem;
                    color: #94a3b8;
                    cursor: pointer;
                    line-height: 1;
                    padding: 0;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 6px;
                    transition: all 0.2s;
                }
                .close-btn:hover {
                    background: #f1f5f9;
                    color: #1e293b;
                }
                .modal-body {
                    padding: 2rem;
                }
                .info-box {
                    background: linear-gradient(135deg, #dbeafe, #e0f2fe);
                    border-left: 4px solid #3b82f6;
                    padding: 1rem 1.25rem;
                    border-radius: 8px;
                    margin-top: 1.5rem;
                }
                .info-box p {
                    margin: 0.5rem 0;
                    font-size: 0.9rem;
                    color: #334155;
                }
                .info-box p:first-child {
                    margin-top: 0;
                }
                .info-box p:last-child {
                    margin-bottom: 0;
                }
                .modal-footer {
                    padding: 1.5rem 2rem;
                    border-top: 1px solid #e2e8f0;
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                }
                .cancel-btn {
                    background: #f1f5f9;
                    color: #64748b;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .cancel-btn:hover {
                    background: #e2e8f0;
                    color: #1e293b;
                }
                .submit-btn {
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .submit-btn:hover {
                    background: linear-gradient(135deg, #059669, #047857);
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
                    .installment-row { grid-template-columns: 1fr; }
                    .delete-btn { width: 100%; }
                    .modal-content { width: 95%; }
                }
            `}</style>
        </div>
    );
};

export default FeesManagement;

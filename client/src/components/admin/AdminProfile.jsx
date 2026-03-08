import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../shared/Sidebar';
import BirthdayWishes from '../shared/BirthdayWishes';
import IncomeDashboard from './IncomeDashboard';
import {
  User, Mail, Phone, MapPin, Calendar, Edit2, Camera, Save, X,
  DollarSign, Download, TrendingUp, CreditCard, AlertCircle, CheckCircle,
  Users, GraduationCap, BookOpen, UserPlus, Eye, Trash2, BarChart3, FileText, UserCheck, Award, Cake
} from 'lucide-react';

const AdminProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || 'Admin User',
    email: user?.email || 'admin@acadexa.com',
    phone: '+91 98765 43210',
    address: '123 Education Street, Mumbai, Maharashtra',
    joinDate: '2024-01-01',
    department: 'Administration',
    designation: 'School Administrator'
  });

  const [editData, setEditData] = useState({ ...profileData });

  // Reports state and data
  const [reportsSubTab, setReportsSubTab] = useState('student');

  const studentPerformance = [
    { id: 'STU001', name: 'John Doe', class: '10th Grade A', average: 85, rank: 2, attendance: '92%' },
    { id: 'STU002', name: 'Jane Smith', class: '10th Grade B', average: 92, rank: 1, attendance: '95%' },
    { id: 'STU003', name: 'Mike Johnson', class: '11th Grade A', average: 78, rank: 5, attendance: '88%' },
  ];

  const getPerformanceColor = (value) => {
    if (value >= 90) return '#10b981';
    if (value >= 75) return '#3b82f6';
    if (value >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const downloadCSV = (data, filename) => {
    let csv = '';
    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      csv = headers.join(',') + '\n';
      data.forEach(row => {
        csv += headers.map(header => row[header]).join(',') + '\n';
      });
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };


  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData });
  };

  // ID Card Generator state
  const [idCardType, setIdCardType] = useState('student'); // student or faculty
  const [selectedPerson, setSelectedPerson] = useState(null);

  const sampleStudents = [
    { id: 'STU001', name: 'John Doe', class: '10th Grade A', photo: null, bloodGroup: 'A+', dob: '2008-05-15' },
    { id: 'STU002', name: 'Jane Smith', class: '10th Grade B', photo: null, bloodGroup: 'B+', dob: '2008-08-20' },
  ];

  const sampleFaculty = [
    { id: 'FAC001', name: 'Dr. Robert Smith', designation: 'Math Teacher', photo: null, department: 'Mathematics' },
    { id: 'FAC002', name: 'Prof. Emily Davis', designation: 'Science Teacher', photo: null, department: 'Science' },
  ];

  const generateQRCode = (data) => {
    // Simple QR code placeholder - in production, use a library like 'qrcode'
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(JSON.stringify(data))}`;
  };

  const downloadIDCard = (person) => {
    alert(`Downloading ID card for ${person.name}. In production, this would generate a PDF/PNG file.`);
  };

  // Faculty Management state
  const [showAddFaculty, setShowAddFaculty] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showFacultyDetails, setShowFacultyDetails] = useState(false);

  const [facultyList, setFacultyList] = useState([
    {
      id: 'FAC001',
      name: 'Dr. Robert Smith',
      email: 'robert.smith@acadexa.com',
      phone: '+91 98765 11111',
      subject: 'Mathematics',
      classes: ['10th Grade A', '11th Grade A'],
      attendance: '98%',
      salary: 50000,
      joinDate: '2023-06-01',
      qualification: 'Ph.D. in Mathematics'
    },
    {
      id: 'FAC002',
      name: 'Prof. Emily Davis',
      email: 'emily.davis@acadexa.com',
      phone: '+91 98765 22222',
      subject: 'Science',
      classes: ['10th Grade B', '11th Grade B'],
      attendance: '96%',
      salary: 48000,
      joinDate: '2023-08-15',
      qualification: 'M.Sc. in Physics'
    },
  ]);

  const [newFaculty, setNewFaculty] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    qualification: '',
    salary: '',
  });

  const handleNewFacultyChange = (e) => {
    setNewFaculty({
      ...newFaculty,
      [e.target.name]: e.target.value
    });
  };

  const handleAddFaculty = () => {
    if (newFaculty.name && newFaculty.email && newFaculty.subject) {
      const faculty = {
        id: `FAC${String(facultyList.length + 1).padStart(3, '0')}`,
        ...newFaculty,
        classes: [],
        attendance: '100%',
        joinDate: new Date().toISOString().split('T')[0]
      };
      setFacultyList([...facultyList, faculty]);
      setNewFaculty({ name: '', email: '', phone: '', subject: '', qualification: '', salary: '' });
      setShowAddFaculty(false);
    }
  };

  const viewFacultyDetails = (faculty) => {
    setSelectedFaculty(faculty);
    setShowFacultyDetails(true);
  };

  const deleteFaculty = (id) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      setFacultyList(facultyList.filter(f => f.id !== id));
    }
  };


  // Marks Management state
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [marksData, setMarksData] = useState([]);

  const classList = ['10th Grade A', '10th Grade B', '11th Grade A', '11th Grade B', '12th Grade A'];
  const examsList = ['Mid-Term Exam', 'Final Exam', 'Unit Test 1', 'Unit Test 2'];
  const subjectsList = ['Mathematics', 'Physics', 'Chemistry', 'English', 'Hindi'];

  const sampleStudentsForMarks = [
    { id: 'STU001', name: 'John Doe', rollNo: '001' },
    { id: 'STU002', name: 'Jane Smith', rollNo: '002' },
    { id: 'STU003', name: 'Mike Johnson', rollNo: '003' },
  ];

  const calculateGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  };

  const handleClassExamChange = () => {
    if (selectedClass && selectedExam) {
      const initialMarks = sampleStudentsForMarks.map(student => ({
        studentId: student.id,
        studentName: student.name,
        rollNo: student.rollNo,
        marks: subjectsList.reduce((acc, subject) => {
          acc[subject] = { obtained: '', total: 100 };
          return acc;
        }, {}),
        percentage: 0,
        grade: '',
        published: false
      }));
      setMarksData(initialMarks);
    }
  };

  const handleMarksChange = (studentId, subject, value) => {
    const marks = parseInt(value) || 0;
    const maxMarks = 100;

    if (marks > maxMarks) {
      alert(`Marks cannot exceed ${maxMarks}`);
      return;
    }

    setMarksData(prevData =>
      prevData.map(student => {
        if (student.studentId === studentId) {
          const updatedMarks = {
            ...student.marks,
            [subject]: { ...student.marks[subject], obtained: marks }
          };

          // Calculate total obtained and total marks
          const totalObtained = Object.values(updatedMarks).reduce((sum, mark) => sum + (parseInt(mark.obtained) || 0), 0);
          const totalMax = Object.values(updatedMarks).reduce((sum, mark) => sum + mark.total, 0);
          const percentage = ((totalObtained / totalMax) * 100).toFixed(2);
          const grade = calculateGrade(parseFloat(percentage));

          return {
            ...student,
            marks: updatedMarks,
            percentage: parseFloat(percentage),
            grade
          };
        }
        return student;
      })
    );
  };

  const togglePublishResult = (studentId) => {
    setMarksData(prevData =>
      prevData.map(student =>
        student.studentId === studentId
          ? { ...student, published: !student.published }
          : student
      )
    );
  };

  const saveAllMarks = () => {
    alert('Marks saved successfully!');
  };

  // Fees Management state
  const [selectedFeeClass, setSelectedFeeClass] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  const feeStructures = {
    '10th Grade A': { tuition: 25000, library: 2000, sports: 1500, lab: 3000, total: 31500 },
    '10th Grade B': { tuition: 25000, library: 2000, sports: 1500, lab: 3000, total: 31500 },
    '11th Grade A': { tuition: 30000, library: 2500, sports: 2000, lab: 4000, total: 38500 },
    '11th Grade B': { tuition: 30000, library: 2500, sports: 2000, lab: 4000, total: 38500 },
    '12th Grade A': { tuition: 35000, library: 3000, sports: 2500, lab: 5000, total: 45500 },
  };

  const [studentFees, setStudentFees] = useState([
    {
      id: 'STU001',
      name: 'John Doe',
      rollNo: '001',
      class: '10th Grade A',
      totalFees: 31500,
      paidAmount: 20000,
      pendingAmount: 11500,
      installments: [
        { number: 1, amount: 10000, dueDate: '2024-04-01', status: 'Paid', paidDate: '2024-04-01', receiptNo: 'REC001' },
        { number: 2, amount: 10000, dueDate: '2024-07-01', status: 'Paid', paidDate: '2024-07-05', receiptNo: 'REC002' },
        { number: 3, amount: 11500, dueDate: '2024-10-01', status: 'Pending', paidDate: '', receiptNo: '' }
      ],
      paymentHistory: [
        { date: '2024-04-01', amount: 10000, method: 'Online', receiptNo: 'REC001' },
        { date: '2024-07-05', amount: 10000, method: 'Cash', receiptNo: 'REC002' }
      ]
    },
    {
      id: 'STU002',
      name: 'Jane Smith',
      rollNo: '002',
      class: '10th Grade A',
      totalFees: 31500,
      paidAmount: 31500,
      pendingAmount: 0,
      installments: [
        { number: 1, amount: 15000, dueDate: '2024-04-01', status: 'Paid', paidDate: '2024-03-28', receiptNo: 'REC003' },
        { number: 2, amount: 16500, dueDate: '2024-07-01', status: 'Paid', paidDate: '2024-06-30', receiptNo: 'REC004' }
      ],
      paymentHistory: [
        { date: '2024-03-28', amount: 15000, method: 'Online', receiptNo: 'REC003' },
        { date: '2024-06-30', amount: 16500, method: 'Online', receiptNo: 'REC004' }
      ]
    }
  ]);

  const handlePaymentSubmit = () => {
    if (!selectedStudent || !paymentAmount) return;

    const amount = parseFloat(paymentAmount);
    if (amount <= 0 || amount > selectedStudent.pendingAmount) {
      alert('Invalid payment amount');
      return;
    }

    const receiptNo = `REC${String(Date.now()).slice(-6)}`;
    const paymentDate = new Date().toISOString().split('T')[0];

    setStudentFees(prevFees =>
      prevFees.map(student => {
        if (student.id === selectedStudent.id) {
          const newPaidAmount = student.paidAmount + amount;
          const newPendingAmount = student.totalFees - newPaidAmount;

          const updatedInstallments = student.installments.map(inst => {
            if (inst.status === 'Pending') {
              return {
                ...inst,
                status: 'Paid',
                paidDate: paymentDate,
                receiptNo: receiptNo
              };
            }
            return inst;
          });

          return {
            ...student,
            paidAmount: newPaidAmount,
            pendingAmount: newPendingAmount,
            installments: updatedInstallments,
            paymentHistory: [
              ...student.paymentHistory,
              { date: paymentDate, amount, method: paymentMethod, receiptNo }
            ]
          };
        }
        return student;
      })
    );

    setShowPaymentModal(false);
    setPaymentAmount('');
    setSelectedStudent(null);
    alert(`Payment recorded successfully! Receipt No: ${receiptNo}`);
  };

  const downloadReceipt = (student, payment) => {
    alert(`Downloading receipt ${payment.receiptNo} for ${student.name}`);
  };




  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ ...profileData });
  };

  const handleSave = () => {
    setProfileData({ ...editData });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="admin-layout">
      <Sidebar role="admin" />
      <div className="admin-main">
        <div className="admin-content">
          <div className="page-header">
            <div>
              <h1>My Profile</h1>
              <p className="text-secondary">Manage your profile information</p>
            </div>
            {!isEditing && activeTab === 'profile' && (
              <button className="btn btn-primary" onClick={handleEdit}>
                <Edit2 size={18} />
                Edit Profile
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="tabs-container">
            <button
              className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={20} />
              Profile
            </button>
            <button
              className={`tab-btn ${activeTab === 'finance' ? 'active' : ''}`}
              onClick={() => setActiveTab('finance')}
            >
              <DollarSign size={20} />
              Finance
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="profile-container">
              <div className="profile-header-card glass-card">
                <div className="profile-avatar-section">
                  <div className="profile-avatar-large">
                    <User size={60} />
                    <button className="avatar-edit-btn" title="Change Photo">
                      <Camera size={16} />
                    </button>
                  </div>
                  <div className="profile-header-info">
                    <h2>{profileData.name}</h2>
                    <p className="profile-designation">{profileData.designation}</p>
                    <p className="profile-department">{profileData.department}</p>
                  </div>
                </div>
              </div>

              <div className="profile-details-card glass-card">
                <h3>Personal Information</h3>

                <div className="profile-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="input-label">
                        <User size={16} />
                        Full Name
                      </label>
                      {isEditing ? (
                        <input type="text" name="name" className="input-field" value={editData.name} onChange={handleChange} />
                      ) : (
                        <p className="info-value">{profileData.name}</p>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="input-label">
                        <Mail size={16} />
                        Email Address
                      </label>
                      {isEditing ? (
                        <input type="email" name="email" className="input-field" value={editData.email} onChange={handleChange} />
                      ) : (
                        <p className="info-value">{profileData.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="input-label">
                        <Phone size={16} />
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input type="tel" name="phone" className="input-field" value={editData.phone} onChange={handleChange} />
                      ) : (
                        <p className="info-value">{profileData.phone}</p>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="input-label">
                        <Calendar size={16} />
                        Joining Date
                      </label>
                      <p className="info-value">{new Date(profileData.joinDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group full-width">
                      <label className="input-label">
                        <MapPin size={16} />
                        Address
                      </label>
                      {isEditing ? (
                        <textarea name="address" className="input-field" value={editData.address} onChange={handleChange} rows="3" />
                      ) : (
                        <p className="info-value">{profileData.address}</p>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="form-actions">
                      <button className="btn btn-outline" onClick={handleCancel}>
                        <X size={18} />
                        Cancel
                      </button>
                      <button className="btn btn-primary" onClick={handleSave}>
                        <Save size={18} />
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="info-grid">
                <div className="info-card glass-card">
                  <div className="info-icon" style={{ background: 'linear-gradient(135deg, #FEA3BE, #FBA2AB)' }}>
                    <User size={24} />
                  </div>
                  <div>
                    <p className="info-label">Role</p>
                    <p className="info-stat">Administrator</p>
                  </div>
                </div>

                <div className="info-card glass-card">
                  <div className="info-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="info-label">Member Since</p>
                    <p className="info-stat">{new Date(profileData.joinDate).getFullYear()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'finance' && (
            <IncomeDashboard embedded={true} />
          )}

          {activeTab === 'faculty' && (
            <div className="faculty-container">
              {/* Header with Add Button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ margin: 0 }}>Faculty Management</h2>
                  <p style={{ color: '#64748b', margin: '0.5rem 0 0 0' }}>Manage faculty records and assignments</p>
                </div>
                {!showAddFaculty && (
                  <button className="btn btn-primary" onClick={() => setShowAddFaculty(true)}>
                    <UserPlus size={18} />
                    Add Faculty
                  </button>
                )}
              </div>

              {/* Faculty Stats */}
              <div className="stats-grid">
                <div className="stat-card glass-card">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #FEA3BE, #FBA2AB)' }}>
                    <Users size={28} />
                  </div>
                  <div>
                    <p className="stat-title">Total Faculty</p>
                    <h3 className="stat-value">{facultyList.length}</h3>
                  </div>
                </div>
                <div className="stat-card glass-card">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                    <CheckCircle size={28} />
                  </div>
                  <div>
                    <p className="stat-title">Avg Attendance</p>
                    <h3 className="stat-value">97%</h3>
                  </div>
                </div>
                <div className="stat-card glass-card">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                    <BookOpen size={28} />
                  </div>
                  <div>
                    <p className="stat-title">Subjects Taught</p>
                    <h3 className="stat-value">{new Set(facultyList.map(f => f.subject)).size}</h3>
                  </div>
                </div>
              </div>

              {/* Add New Faculty Form */}
              {showAddFaculty && (
                <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0 }}>Add New Faculty</h3>
                    <button className="btn btn-outline" onClick={() => setShowAddFaculty(false)}>
                      <X size={18} />
                      Cancel
                    </button>
                  </div>

                  <div className="profile-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label className="input-label">
                          <User size={16} />
                          Full Name
                        </label>
                        <input type="text" name="name" className="input-field" value={newFaculty.name} onChange={handleNewFacultyChange} placeholder="Enter full name" />
                      </div>
                      <div className="form-group">
                        <label className="input-label">
                          <Mail size={16} />
                          Email Address
                        </label>
                        <input type="email" name="email" className="input-field" value={newFaculty.email} onChange={handleNewFacultyChange} placeholder="Enter email" />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="input-label">
                          <Phone size={16} />
                          Phone Number
                        </label>
                        <input type="tel" name="phone" className="input-field" value={newFaculty.phone} onChange={handleNewFacultyChange} placeholder="Enter phone number" />
                      </div>
                      <div className="form-group">
                        <label className="input-label">
                          <BookOpen size={16} />
                          Subject
                        </label>
                        <input type="text" name="subject" className="input-field" value={newFaculty.subject} onChange={handleNewFacultyChange} placeholder="Enter subject" />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="input-label">
                          <GraduationCap size={16} />
                          Qualification
                        </label>
                        <input type="text" name="qualification" className="input-field" value={newFaculty.qualification} onChange={handleNewFacultyChange} placeholder="Enter qualification" />
                      </div>
                      <div className="form-group">
                        <label className="input-label">
                          <DollarSign size={16} />
                          Salary (₹)
                        </label>
                        <input type="number" name="salary" className="input-field" value={newFaculty.salary} onChange={handleNewFacultyChange} placeholder="Enter salary" />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                      <button className="btn btn-primary" onClick={handleAddFaculty}>
                        <Save size={18} />
                        Add Faculty
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Faculty List */}
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: 0 }}>Faculty Members ({facultyList.length})</h3>
                  <button className="btn btn-outline" onClick={() => downloadCSV(facultyList, 'faculty_list.csv')}>
                    <Download size={18} />
                    Export CSV
                  </button>
                </div>

                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Subject</th>
                        <th>Qualification</th>
                        <th>Classes</th>
                        <th>Attendance</th>
                        <th>Salary</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {facultyList.map(faculty => (
                        <tr key={faculty.id}>
                          <td><span className="badge badge-primary">{faculty.id}</span></td>
                          <td className="font-semibold">{faculty.name}</td>
                          <td>{faculty.subject}</td>
                          <td>{faculty.qualification}</td>
                          <td>
                            <span className="badge badge-success">
                              {faculty.classes?.length || 0} Classes
                            </span>
                          </td>
                          <td>{faculty.attendance}</td>
                          <td className="font-semibold">₹{Number(faculty.salary || 0).toLocaleString()}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button
                                className="btn-icon"
                                onClick={() => viewFacultyDetails(faculty)}
                                title="View Details"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                className="btn-icon danger"
                                onClick={() => deleteFaculty(faculty.id)}
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Faculty Details Modal */}
              {showFacultyDetails && selectedFaculty && (
                <div className="modal-overlay" onClick={() => setShowFacultyDetails(false)}>
                  <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <h3 style={{ margin: 0 }}>{selectedFaculty.name}</h3>
                      <button className="btn-icon" onClick={() => setShowFacultyDetails(false)}>
                        <X size={20} />
                      </button>
                    </div>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                      <div>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.25rem 0', fontWeight: '600' }}>Faculty ID</p>
                        <p style={{ margin: 0, fontWeight: '600', fontSize: '1.1rem' }}>{selectedFaculty.id}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.25rem 0', fontWeight: '600' }}>Email</p>
                        <p style={{ margin: 0 }}>{selectedFaculty.email}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.25rem 0', fontWeight: '600' }}>Phone</p>
                        <p style={{ margin: 0 }}>{selectedFaculty.phone}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.25rem 0', fontWeight: '600' }}>Subject</p>
                        <p style={{ margin: 0 }}>{selectedFaculty.subject}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.25rem 0', fontWeight: '600' }}>Qualification</p>
                        <p style={{ margin: 0 }}>{selectedFaculty.qualification}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.25rem 0', fontWeight: '600' }}>Assigned Classes</p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                          {selectedFaculty.classes?.length > 0 ? (
                            selectedFaculty.classes.map((cls, idx) => (
                              <span key={idx} className="badge badge-primary">{cls}</span>
                            ))
                          ) : (
                            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>No classes assigned</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.25rem 0', fontWeight: '600' }}>Attendance</p>
                        <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600', color: '#10b981' }}>{selectedFaculty.attendance}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.25rem 0', fontWeight: '600' }}>Salary</p>
                        <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>₹{Number(selectedFaculty.salary || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.25rem 0', fontWeight: '600' }}>Join Date</p>
                        <p style={{ margin: 0 }}>{selectedFaculty.joinDate ? new Date(selectedFaculty.joinDate).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="reports-container">
              {/* Reports Sub-tabs */}
              <div className="reports-subtabs">
                <button
                  className={`subtab-btn ${reportsSubTab === 'student' ? 'active' : ''}`}
                  onClick={() => setReportsSubTab('student')}
                >
                  <BarChart3 size={18} />
                  Student Performance
                </button>
                <button
                  className={`subtab-btn ${reportsSubTab === 'class' ? 'active' : ''}`}
                  onClick={() => setReportsSubTab('class')}
                >
                  <Users size={18} />
                  Class Analysis
                </button>
                <button
                  className={`subtab-btn ${reportsSubTab === 'attendance' ? 'active' : ''}`}
                  onClick={() => setReportsSubTab('attendance')}
                >
                  <UserCheck size={18} />
                  Attendance
                </button>
                <button
                  className={`subtab-btn ${reportsSubTab === 'faculty' ? 'active' : ''}`}
                  onClick={() => setReportsSubTab('faculty')}
                >
                  <GraduationCap size={18} />
                  Faculty Overview
                </button>
              </div>

              {/* Student Performance Report */}
              {reportsSubTab === 'student' && (
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0 }}>Student Performance Report</h3>
                    <button className="btn btn-primary" onClick={() => downloadCSV(studentPerformance, 'student_performance.csv')}>
                      <Download size={18} />
                      Download CSV
                    </button>
                  </div>
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Student ID</th>
                          <th>Name</th>
                          <th>Class</th>
                          <th>Average Score</th>
                          <th>Rank</th>
                          <th>Attendance</th>
                          <th>Performance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentPerformance.map(student => (
                          <tr key={student.id}>
                            <td><span className="badge badge-primary">{student.id}</span></td>
                            <td className="font-semibold">{student.name}</td>
                            <td>{student.class}</td>
                            <td>
                              <span style={{ color: getPerformanceColor(student.average), fontWeight: '600' }}>
                                {student.average}%
                              </span>
                            </td>
                            <td>#{student.rank}</td>
                            <td>{student.attendance}</td>
                            <td>
                              <span className={`badge ${student.average >= 90 ? 'badge-success' : student.average >= 75 ? 'badge-primary' : 'badge-warning'}`}>
                                {student.average >= 90 ? 'Excellent' : student.average >= 75 ? 'Good' : 'Average'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Class Analysis Report */}
              {reportsSubTab === 'class' && (
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0 }}>Class-wise Result Analysis</h3>
                    <button className="btn btn-primary" onClick={() => downloadCSV([
                      { class: '10th Grade A', students: 45, averageMarks: 82, passPercentage: 95 },
                      { class: '10th Grade B', students: 42, averageMarks: 78, passPercentage: 90 }
                    ], 'class_analysis.csv')}>
                      <Download size={18} />
                      Download CSV
                    </button>
                  </div>
                  <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
                    <div className="stat-card glass-card">
                      <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #FEA3BE, #FBA2AB)' }}>
                        <Users size={28} />
                      </div>
                      <div>
                        <p className="stat-title">Total Classes</p>
                        <h3 className="stat-value">4</h3>
                      </div>
                    </div>
                    <div className="stat-card glass-card">
                      <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                        <TrendingUp size={28} />
                      </div>
                      <div>
                        <p className="stat-title">Average Pass Rate</p>
                        <h3 className="stat-value">95%</h3>
                      </div>
                    </div>
                  </div>
                  <p style={{ color: '#64748b', marginBottom: '1rem' }}>Detailed class performance metrics</p>
                </div>
              )}

              {/* Attendance Report */}
              {reportsSubTab === 'attendance' && (
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0 }}>Attendance Reports</h3>
                    <button className="btn btn-primary" onClick={() => downloadCSV([
                      { class: '10th Grade A', totalDays: 180, avgAttendance: '92%' },
                      { class: '10th Grade B', totalDays: 180, avgAttendance: '89%' }
                    ], 'attendance_report.csv')}>
                      <Download size={18} />
                      Download CSV
                    </button>
                  </div>
                  <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
                    <div className="stat-card glass-card">
                      <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                        <UserCheck size={28} />
                      </div>
                      <div>
                        <p className="stat-title">Overall Attendance</p>
                        <h3 className="stat-value">92.5%</h3>
                      </div>
                    </div>
                    <div className="stat-card glass-card">
                      <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                        <Calendar size={28} />
                      </div>
                      <div>
                        <p className="stat-title">Total School Days</p>
                        <h3 className="stat-value">180</h3>
                      </div>
                    </div>
                  </div>
                  <p style={{ color: '#64748b', marginBottom: '1rem' }}>Comprehensive attendance tracking across all classes</p>
                </div>
              )}

              {/* Faculty Performance Report */}
              {reportsSubTab === 'faculty' && (
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0 }}>Faculty Performance Overview</h3>
                    <button className="btn btn-primary" onClick={() => downloadCSV([
                      { name: 'Dr. Robert Smith', subject: 'Mathematics', avgScore: 85, attendance: '98%' },
                      { name: 'Prof. Emily Davis', subject: 'Science', avgScore: 82, attendance: '96%' }
                    ], 'faculty_performance.csv')}>
                      <Download size={18} />
                      Download CSV
                    </button>
                  </div>
                  <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
                    <div className="stat-card glass-card">
                      <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #FEA3BE, #FBA2AB)' }}>
                        <GraduationCap size={28} />
                      </div>
                      <div>
                        <p className="stat-title">Total Faculty</p>
                        <h3 className="stat-value">12</h3>
                      </div>
                    </div>
                    <div className="stat-card glass-card">
                      <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                        <CheckCircle size={28} />
                      </div>
                      <div>
                        <p className="stat-title">Avg Faculty Attendance</p>
                        <h3 className="stat-value">97%</h3>
                      </div>
                    </div>
                  </div>
                  <p style={{ color: '#64748b', marginBottom: '1rem' }}>Track faculty performance and student outcomes</p>
                </div>
              )}
            </div>
          )}

          {/* ID Cards Tab */}
          {activeTab === 'idcards' && (
            <div className="idcard-container">
              <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Select ID Card Type</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    className={`subtab-btn ${idCardType === 'student' ? 'active' : ''}`}
                    onClick={() => { setIdCardType('student'); setSelectedPerson(null); }}
                  >
                    <GraduationCap size={18} />
                    Student ID
                  </button>
                  <button
                    className={`subtab-btn ${idCardType === 'faculty' ? 'active' : ''}`}
                    onClick={() => { setIdCardType('faculty'); setSelectedPerson(null); }}
                  >
                    <Users size={18} />
                    Faculty ID
                  </button>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>
                  Select {idCardType === 'student' ? 'Student' : 'Faculty'}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                  {(idCardType === 'student' ? sampleStudents : sampleFaculty).map(person => (
                    <div
                      key={person.id}
                      style={{
                        padding: '1rem',
                        border: selectedPerson?.id === person.id ? '2px solid #FEA3BE' : '2px solid #e2e8f0',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        background: selectedPerson?.id === person.id ? 'rgba(254, 163, 190, 0.1)' : 'white',
                        transition: 'all 0.2s'
                      }}
                      onClick={() => setSelectedPerson(person)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #FEA3BE, #FBA2AB)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: '600'
                        }}>
                          {person.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>{person.name}</p>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{person.id}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedPerson && (
                <div className="glass-card" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0 }}>ID Card Preview</h3>
                    <button className="btn btn-primary" onClick={() => downloadIDCard(selectedPerson)}>
                      <Download size={18} />
                      Download ID Card
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{
                      width: '350px',
                      background: 'white',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                    }}>
                      <div style={{
                        background: 'linear-gradient(135deg, #FEA3BE, #FBA2AB)',
                        padding: '1.5rem',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white' }}>ACADEXA</div>
                        <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)' }}>School Management System</div>
                      </div>

                      <div style={{ padding: '2rem' }}>
                        <div style={{
                          width: '120px',
                          height: '120px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 1.5rem'
                        }}>
                          <User size={60} color="#64748b" />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                          <div style={{ marginBottom: '0.75rem' }}>
                            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Name: </span>
                            <span style={{ fontSize: '1rem', color: '#1e293b', fontWeight: '600' }}>{selectedPerson.name}</span>
                          </div>
                          <div style={{ marginBottom: '0.75rem' }}>
                            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>ID: </span>
                            <span style={{ fontSize: '1rem', color: '#1e293b' }}>{selectedPerson.id}</span>
                          </div>
                          {idCardType === 'student' ? (
                            <>
                              <div style={{ marginBottom: '0.75rem' }}>
                                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Class: </span>
                                <span style={{ fontSize: '1rem', color: '#1e293b' }}>{selectedPerson.class}</span>
                              </div>
                              <div style={{ marginBottom: '0.75rem' }}>
                                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Blood Group: </span>
                                <span style={{ fontSize: '1rem', color: '#1e293b' }}>{selectedPerson.bloodGroup}</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div style={{ marginBottom: '0.75rem' }}>
                                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Designation: </span>
                                <span style={{ fontSize: '1rem', color: '#1e293b' }}>{selectedPerson.designation}</span>
                              </div>
                              <div style={{ marginBottom: '0.75rem' }}>
                                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Department: </span>
                                <span style={{ fontSize: '1rem', color: '#1e293b' }}>{selectedPerson.department}</span>
                              </div>
                            </>
                          )}
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                          <img
                            src={generateQRCode(selectedPerson)}
                            alt="QR Code"
                            style={{ width: '120px', height: '120px', borderRadius: '8px' }}
                          />
                          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
                            Scan for Details
                          </p>
                        </div>
                      </div>

                      <div style={{
                        background: '#f8fafc',
                        padding: '0.75rem',
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        color: '#64748b'
                      }}>
                        Valid for Academic Year 2024-2025
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Marks Tab */}
          {activeTab === 'marks' && (
            <div className="marks-container">
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0 }}>Marks Management</h2>
                <p style={{ color: '#64748b', margin: '0.5rem 0 0 0' }}>Enter and manage student marks</p>
              </div>

              {/* Selection Controls */}
              <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Select Class and Exam</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="input-label">Class</label>
                    <select
                      className="input-field"
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                    >
                      <option value="">Select Class</option>
                      {classList.map((cls, idx) => (
                        <option key={idx} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="input-label">Exam</label>
                    <select
                      className="input-field"
                      value={selectedExam}
                      onChange={(e) => setSelectedExam(e.target.value)}
                    >
                      <option value="">Select Exam</option>
                      {examsList.map((exam, idx) => (
                        <option key={idx} value={exam}>{exam}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button
                      className="btn btn-primary"
                      onClick={handleClassExamChange}
                      disabled={!selectedClass || !selectedExam}
                      style={{ width: '100%' }}
                    >
                      Load Students
                    </button>
                  </div>
                </div>
              </div>

              {/* Marks Entry Table */}
              {marksData.length > 0 && (
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0 }}>Enter Marks</h3>
                    <button className="btn btn-primary" onClick={saveAllMarks}>
                      <Save size={18} />
                      Save All Marks
                    </button>
                  </div>

                  <div className="table-container" style={{ overflowX: 'auto' }}>
                    <table className="marks-table">
                      <thead>
                        <tr>
                          <th style={{ minWidth: '80px' }}>Roll No</th>
                          <th style={{ minWidth: '150px' }}>Student Name</th>
                          {subjectsList.map((subject, idx) => (
                            <th key={idx} style={{ minWidth: '100px' }}>{subject}</th>
                          ))}
                          <th style={{ minWidth: '100px' }}>Percentage</th>
                          <th style={{ minWidth: '80px' }}>Grade</th>
                          <th style={{ minWidth: '120px' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {marksData.map((student) => (
                          <tr key={student.studentId}>
                            <td className="font-semibold">{student.rollNo}</td>
                            <td className="font-semibold">{student.studentName}</td>
                            {subjectsList.map((subject, idx) => (
                              <td key={idx}>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  className="marks-input"
                                  value={student.marks[subject]?.obtained || ''}
                                  onChange={(e) => handleMarksChange(student.studentId, subject, e.target.value)}
                                  placeholder="0"
                                />
                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>/100</span>
                              </td>
                            ))}
                            <td>
                              <span style={{
                                fontWeight: '600',
                                color: student.percentage >= 60 ? '#10b981' : student.percentage >= 40 ? '#f59e0b' : '#ef4444'
                              }}>
                                {student.percentage.toFixed(2)}%
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${student.grade === 'A+' || student.grade === 'A' ? 'badge-success' :
                                student.grade === 'B+' || student.grade === 'B' ? 'badge-primary' :
                                  'badge-warning'
                                }`}>
                                {student.grade || '-'}
                              </span>
                            </td>
                            <td>
                              <button
                                className={`btn ${student.published ? 'btn-outline' : 'btn-primary'}`}
                                onClick={() => togglePublishResult(student.studentId)}
                                style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                              >
                                {student.published ? 'Unpublish' : 'Publish'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Stats */}
                  <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="stat-card glass-card">
                      <p className="stat-title">Total Students</p>
                      <h3 className="stat-value">{marksData.length}</h3>
                    </div>
                    <div className="stat-card glass-card">
                      <p className="stat-title">Published Results</p>
                      <h3 className="stat-value">{marksData.filter(s => s.published).length}</h3>
                    </div>
                    <div className="stat-card glass-card">
                      <p className="stat-title">Average Percentage</p>
                      <h3 className="stat-value">
                        {marksData.length > 0
                          ? (marksData.reduce((sum, s) => sum + s.percentage, 0) / marksData.length).toFixed(2)
                          : 0}%
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {marksData.length === 0 && selectedClass && selectedExam && (
                <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                  <Award size={48} style={{ color: '#FEA3BE', margin: '0 auto 1rem' }} />
                  <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
                    Click "Load Students" to start entering marks
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Fees Tab */}
          {activeTab === 'fees' && (
            <div className="fees-container">
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0 }}>Fees Management</h2>
                <p style={{ color: '#64748b', margin: '0.5rem 0 0 0' }}>Manage fee structures and student payments</p>
              </div>

              {/* Fee Statistics */}
              <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card glass-card">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #FEA3BE, #FBA2AB)' }}>
                    <DollarSign size={28} />
                  </div>
                  <div>
                    <p className="stat-title">Total Collection</p>
                    <h3 className="stat-value">₹{studentFees.reduce((sum, s) => sum + s.paidAmount, 0).toLocaleString()}</h3>
                  </div>
                </div>
                <div className="stat-card glass-card">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                    <AlertCircle size={28} />
                  </div>
                  <div>
                    <p className="stat-title">Pending Amount</p>
                    <h3 className="stat-value">₹{studentFees.reduce((sum, s) => sum + s.pendingAmount, 0).toLocaleString()}</h3>
                  </div>
                </div>
                <div className="stat-card glass-card">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                    <CheckCircle size={28} />
                  </div>
                  <div>
                    <p className="stat-title">Students Paid</p>
                    <h3 className="stat-value">{studentFees.filter(s => s.pendingAmount === 0).length}/{studentFees.length}</h3>
                  </div>
                </div>
              </div>

              {/* Fee Structure */}
              <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Fee Structure by Class</h3>
                <div className="form-group" style={{ maxWidth: '300px' }}>
                  <label className="input-label">Select Class</label>
                  <select
                    className="input-field"
                    value={selectedFeeClass}
                    onChange={(e) => setSelectedFeeClass(e.target.value)}
                  >
                    <option value="">Select Class</option>
                    {Object.keys(feeStructures).map((cls, idx) => (
                      <option key={idx} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>

                {selectedFeeClass && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Fee Breakdown - {selectedFeeClass}</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      <div className="glass-card" style={{ padding: '1rem' }}>
                        <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.9rem' }}>Tuition Fee</p>
                        <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>₹{feeStructures[selectedFeeClass].tuition.toLocaleString()}</p>
                      </div>
                      <div className="glass-card" style={{ padding: '1rem' }}>
                        <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.9rem' }}>Library Fee</p>
                        <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>₹{feeStructures[selectedFeeClass].library.toLocaleString()}</p>
                      </div>
                      <div className="glass-card" style={{ padding: '1rem' }}>
                        <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.9rem' }}>Sports Fee</p>
                        <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>₹{feeStructures[selectedFeeClass].sports.toLocaleString()}</p>
                      </div>
                      <div className="glass-card" style={{ padding: '1rem' }}>
                        <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.9rem' }}>Lab Fee</p>
                        <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>₹{feeStructures[selectedFeeClass].lab.toLocaleString()}</p>
                      </div>
                      <div className="glass-card" style={{ padding: '1rem', background: 'linear-gradient(135deg, rgba(254, 163, 190, 0.1), rgba(251, 162, 171, 0.1))' }}>
                        <p style={{ margin: '0 0 0.5rem 0', color: '#FEA3BE', fontSize: '0.9rem', fontWeight: '700' }}>Total Fee</p>
                        <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: '800', color: '#FEA3BE' }}>₹{feeStructures[selectedFeeClass].total.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Student Fees Tracking */}
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Student Fees Tracking</h3>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Roll No</th>
                        <th>Student Name</th>
                        <th>Class</th>
                        <th>Total Fees</th>
                        <th>Paid Amount</th>
                        <th>Pending Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentFees.map((student) => (
                        <tr key={student.id}>
                          <td className="font-semibold">{student.rollNo}</td>
                          <td className="font-semibold">{student.name}</td>
                          <td>{student.class}</td>
                          <td>₹{student.totalFees.toLocaleString()}</td>
                          <td style={{ color: '#10b981', fontWeight: '600' }}>₹{student.paidAmount.toLocaleString()}</td>
                          <td style={{ color: student.pendingAmount > 0 ? '#ef4444' : '#10b981', fontWeight: '600' }}>
                            ₹{student.pendingAmount.toLocaleString()}
                          </td>
                          <td>
                            <span className={`badge ${student.pendingAmount === 0 ? 'badge-success' : 'badge-warning'}`}>
                              {student.pendingAmount === 0 ? 'Paid' : 'Pending'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              {student.pendingAmount > 0 && (
                                <button
                                  className="btn btn-primary"
                                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                  onClick={() => {
                                    setSelectedStudent(student);
                                    setShowPaymentModal(true);
                                  }}
                                >
                                  Record Payment
                                </button>
                              )}
                              <button
                                className="btn btn-outline"
                                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                onClick={() => { }}
                              >
                                <Eye size={16} />
                                View Details
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment Modal */}
              {showPaymentModal && selectedStudent && (
                <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
                  <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <h3 style={{ margin: 0 }}>Record Payment</h3>
                      <button className="btn-icon" onClick={() => setShowPaymentModal(false)}>
                        <X size={20} />
                      </button>
                    </div>

                    <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                      <p style={{ margin: '0 0 0.5rem 0' }}><strong>Student:</strong> {selectedStudent.name}</p>
                      <p style={{ margin: '0 0 0.5rem 0' }}><strong>Total Fees:</strong> ₹{selectedStudent.totalFees.toLocaleString()}</p>
                      <p style={{ margin: '0 0 0.5rem 0' }}><strong>Paid:</strong> ₹{selectedStudent.paidAmount.toLocaleString()}</p>
                      <p style={{ margin: 0, color: '#ef4444', fontWeight: '600' }}>
                        <strong>Pending:</strong> ₹{selectedStudent.pendingAmount.toLocaleString()}
                      </p>
                    </div>

                    <div className="form-group">
                      <label className="input-label">Payment Amount (₹)</label>
                      <input
                        type="number"
                        className="input-field"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        placeholder="Enter amount"
                        max={selectedStudent.pendingAmount}
                      />
                    </div>

                    <div className="form-group">
                      <label className="input-label">Payment Method</label>
                      <select
                        className="input-field"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        <option value="Cash">Cash</option>
                        <option value="Online">Online</option>
                        <option value="Cheque">Cheque</option>
                        <option value="Card">Card</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                      <button className="btn btn-outline" onClick={() => setShowPaymentModal(false)}>
                        Cancel
                      </button>
                      <button className="btn btn-primary" onClick={handlePaymentSubmit}>
                        <Save size={18} />
                        Record Payment
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Birthdays Tab */}
          {activeTab === 'birthdays' && (
            <BirthdayWishes />
          )}
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
          padding: 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .page-header h1 {
          font-size: 2.5rem;
          margin: 0 0 0.5rem 0;
          color: #1e293b;
        }

        .text-secondary {
          color: #64748b;
          margin: 0;
        }

        .tabs-container {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          border-bottom: 2px solid #e2e8f0;
          flex-wrap: wrap;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          color: #64748b;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .tab-btn:hover {
          color: #FEA3BE;
        }

        .tab-btn.active {
          color: #FEA3BE;
          border-bottom-color: #FEA3BE;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .glass-card:hover {
          box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
        }

        .profile-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .profile-header-card {
          padding: 2rem;
        }

        .profile-avatar-section {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .profile-avatar-large {
          position: relative;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .avatar-edit-btn {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: white;
          border: 2px solid #FEA3BE;
          color: #FEA3BE;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .avatar-edit-btn:hover {
          background: #FEA3BE;
          color: white;
        }

        .profile-header-info h2 {
          margin: 0 0 0.5rem 0;
          color: #1e293b;
          font-size: 2rem;
        }

        .profile-designation {
          color: #FEA3BE;
          font-weight: 600;
          margin: 0 0 0.25rem 0;
          font-size: 1.1rem;
        }

        .profile-department {
          color: #64748b;
          margin: 0;
        }

        .profile-details-card {
          padding: 2rem;
        }

        .profile-details-card h3 {
          margin: 0 0 1.5rem 0;
          color: #1e293b;
          font-size: 1.5rem;
        }

        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .input-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #1e293b;
          font-size: 0.9rem;
        }

        .input-field {
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s;
          background: white;
        }

        .input-field:focus {
          outline: none;
          border-color: #FEA3BE;
        }

        .info-value {
          color: #1e293b;
          font-size: 1rem;
          margin: 0;
          padding: 0.75rem 0;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .info-card {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .info-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .info-label {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0 0 0.5rem 0;
          text-transform: uppercase;
          font-weight: 600;
        }

        .info-stat {
          font-size: 1.5rem;
          font-weight: 800;
          margin: 0;
          color: #1e293b;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          font-size: 1rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(254, 163, 190, 0.4);
        }

        .btn-outline {
          background: transparent;
          border: 2px solid #e2e8f0;
          color: #64748b;
        }

        .btn-outline:hover {
          border-color: #FEA3BE;
          color: #FEA3BE;
        }

        .reports-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .reports-subtabs {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .subtab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: rgba(255, 255, 255, 0.7);
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          color: #64748b;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .subtab-btn:hover {
          border-color: #FEA3BE;
          color: #FEA3BE;
          background: rgba(254, 163, 190, 0.1);
        }

        .subtab-btn.active {
          background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
          color: white;
          border-color: #FEA3BE;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .stat-title {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0 0 0.5rem 0;
          text-transform: uppercase;
          font-weight: 600;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          margin: 0;
          color: #1e293b;
        }

        .table-container {
          overflow-x: auto;
          margin-top: 1rem;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table thead tr {
          border-bottom: 2px solid #e2e8f0;
        }

        .data-table th {
          padding: 0.75rem;
          text-align: left;
          font-weight: 600;
          color: #64748b;
          font-size: 0.9rem;
          text-transform: uppercase;
        }

        .data-table td {
          padding: 0.75rem;
          border-bottom: 1px solid #e2e8f0;
          color: #1e293b;
        }

        .data-table tbody tr:hover {
          background: #f8fafc;
        }

        .font-semibold {
          font-weight: 600;
        }

        .badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .badge-primary {
          background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
          color: white;
        }

        .badge-success {
          background: #d1fae5;
          color: #059669;
        }

        .badge-warning {
          background: #fef3c7;
          color: #d97706;
        }

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
          padding: 2rem;
          border-radius: 12px;
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
        }

        .btn-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: none;
          background: #e2e8f0;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-icon:hover {
          background: #cbd5e1;
          color: #1e293b;
        }

        .btn-icon.danger {
          background: #fee2e2;
          color: #dc2626;
        }

        .btn-icon.danger:hover {
          background: #fecaca;
          color: #b91c1c;
        }

        .faculty-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .marks-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .marks-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }

        .marks-table thead tr {
          background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
          color: white;
        }

        .marks-table th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .marks-table td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #e2e8f0;
          color: #1e293b;
        }

        .marks-table tbody tr:hover {
          background: #f8fafc;
        }

        .marks-input {
          width: 70px;
          padding: 0.5rem;
          border: 2px solid #e2e8f0;
          border-radius: 6px;
          font-size: 1rem;
          text-align: center;
          transition: all 0.2s;
        }

        .marks-input:focus {
          outline: none;
          border-color: #FEA3BE;
          box-shadow: 0 0 0 3px rgba(254, 163, 190, 0.1);
        }

        .marks-input::-webkit-inner-spin-button,
        .marks-input::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        @media (max-width: 768px) {
          .admin-content {
            padding: 1rem;
          }

          .page-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .profile-avatar-section {
            flex-direction: column;
            text-align: center;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .tabs-container {
            overflow-x: auto;
            flex-wrap: nowrap;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminProfile;

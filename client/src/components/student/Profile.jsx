import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import {
  User,
  Users,
  Mail,
  Phone,
  Calendar,
  Award,
  IdCard,
  TrendingUp,
  DollarSign,
  Wallet,
  Camera,
  FileText,
  CreditCard
} from 'lucide-react';

const StudentProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  // Calculate age from DOB
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Student data
  const studentData = {
    name: user?.name || 'Student User',
    email: user?.email || 'student@acadexa.com',
    phone: '+91 98765 43210',
    dateOfBirth: '2008-05-15',
    className: '10th Grade A',
    rollNumber: '15',
    points: 450,
    academicStanding: 'A+',
    attendancePercentage: 94.5
  };

  const age = calculateAge(studentData.dateOfBirth);

  return (
    <div className="admin-layout">
      <Sidebar role="student" />
      <div className="admin-main">
        <Navbar />
        <div className="profile-page">
          {/* Profile Header Card */}
          <div className="profile-header">
            <div className="profile-header-bg"></div>
            <div className="profile-header-content">
              {/* Profile Picture */}
              <div className="profile-picture-wrapper">
                <div className="profile-picture">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" />
                  ) : (
                    <div className="profile-initials">
                      {studentData.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>
                <label className="upload-btn">
                  <Camera size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    hidden
                  />
                </label>
              </div>

              {/* Name & Class */}
              <div className="profile-title">
                <h1>{studentData.name}</h1>
                <span className="class-badge">{studentData.className}</span>
              </div>

              {/* Points Wallet */}
              <div className="points-card">
                <Wallet size={24} />
                <div className="points-content">
                  <span className="points-label">Points Wallet</span>
                  <span className="points-value">{studentData.points}</span>
                </div>
              </div>
            </div>
          </div>



          {/* Main Content Grid */}
          <div className="profile-grid">
            {/* Personal Details Card */}
            <div className="info-card personal-details">
              <h2>Personal Details</h2>
              <div className="details-list">
                <div className="detail-row">
                  <div className="detail-icon">
                    <User size={18} />
                  </div>
                  <div className="detail-info">
                    <span className="label">Full Name</span>
                    <span className="value">{studentData.name}</span>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-icon">
                    <Mail size={18} />
                  </div>
                  <div className="detail-info">
                    <span className="label">Email Address</span>
                    <span className="value">{studentData.email}</span>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-icon">
                    <Phone size={18} />
                  </div>
                  <div className="detail-info">
                    <span className="label">Mobile Number</span>
                    <span className="value">{studentData.phone}</span>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-icon">
                    <IdCard size={18} />
                  </div>
                  <div className="detail-info">
                    <span className="label">Class Name</span>
                    <span className="value">{studentData.className}</span>
                  </div>
                </div>

                <div className="detail-row">
                  <div className="detail-icon">
                    <Calendar size={18} />
                  </div>
                  <div className="detail-info">
                    <span className="label">Age</span>
                    <span className="value">{age} years</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Standing Card */}
            <div className="info-card academic-standing">
              <h2>Academic Standing</h2>
              <div className="standing-content">
                <div className="grade-circle">
                  <Award size={32} />
                  <span className="grade">{studentData.academicStanding}</span>
                </div>
                <div className="standing-info">
                  <h3>Excellent Performance!</h3>
                  <p>You are in the top 10% of your class</p>
                  <div className="attendance-bar">
                    <span className="bar-label">Attendance: {studentData.attendancePercentage}%</span>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{ width: `${studentData.attendancePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
                .profile-page {
                    padding: 0;
                    background: #f8fafc;
                    min-height: 100vh;
                }

                /* Profile Header */
                .profile-header {
                    position: relative;
                    background: white;
                    margin-bottom: 0;
                }

                /* Tab Navigation */
                .profile-tabs {
                    display: flex;
                    gap: 0.5rem;
                    padding: 0 2rem;
                    background: white;
                    border-bottom: 2px solid #f1f5f9;
                    margin-bottom: 2rem;
                }

                .tab-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 1rem 1.5rem;
                    background: none;
                    border: none;
                    font-weight: 600;
                    color: #64748b;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.2s;
                    font-size: 0.95rem;
                }

                .tab-btn:hover {
                    color: #FEA3BE;
                }

                .tab-btn.active {
                    color: #FEA3BE;
                }

                .tab-btn.active::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    border-radius: 3px 3px 0 0;
                }

                /* Birthday Tab Content */
                .birthday-tab-content {
                    padding: 0 2rem 2rem;
                }

                .profile-header-bg {
                    height: 140px;
                    background: linear-gradient(135deg, #FEA3BE 0%, #FBA2AB 50%, #FFB6C1 100%);
                }

                .profile-header-content {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                    padding: 0 2rem 2rem;
                    margin-top: -60px;
                    flex-wrap: wrap;
                }

                /* Profile Picture */
                .profile-picture-wrapper {
                    position: relative;
                }

                .profile-picture {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    background: white;
                    border: 4px solid white;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .profile-picture img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .profile-initials {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    color: white;
                    font-size: 2.5rem;
                    font-weight: 700;
                }

                .upload-btn {
                    position: absolute;
                    bottom: 4px;
                    right: 4px;
                    width: 36px;
                    height: 36px;
                    background: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                    color: #FEA3BE;
                    transition: all 0.2s;
                }

                .upload-btn:hover {
                    transform: scale(1.1);
                    background: #fef7f9;
                }

                /* Profile Title */
                .profile-title {
                    flex: 1;
                    padding-top: 60px;
                }

                .profile-title h1 {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0 0 0.5rem 0;
                }

                .class-badge {
                    display: inline-block;
                    padding: 0.5rem 1rem;
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    color: white;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 0.875rem;
                }

                /* Points Card */
                .points-card {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1.25rem 1.5rem;
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    border-radius: 16px;
                    color: white;
                    margin-top: 60px;
                }

                .points-content {
                    display: flex;
                    flex-direction: column;
                }

                .points-label {
                    font-size: 0.875rem;
                    opacity: 0.9;
                }

                .points-value {
                    font-size: 1.75rem;
                    font-weight: 800;
                }

                /* Profile Grid */
                .profile-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                    gap: 1.5rem;
                    padding: 0 2rem 2rem;
                }

                /* Info Cards */
                .info-card {
                    background: white;
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                .info-card h2 {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0 0 1.25rem 0;
                    padding-bottom: 0.75rem;
                    border-bottom: 2px solid #f1f5f9;
                }

                /* Personal Details */
                .details-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .detail-row {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: #f8fafc;
                    border-radius: 12px;
                    border-left: 3px solid #FEA3BE;
                }

                .detail-icon {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    flex-shrink: 0;
                }

                .detail-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .detail-info .label {
                    font-size: 0.8rem;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .detail-info .value {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #1e293b;
                }

                /* Quick Actions */
                .actions-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .action-btn {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: #f8fafc;
                    border: 2px solid transparent;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: left;
                }

                .action-btn:hover {
                    border-color: #FEA3BE;
                    background: #fef7f9;
                    transform: translateX(4px);
                }

                .action-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    flex-shrink: 0;
                }

                .action-icon.id-card { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
                .action-icon.reports { background: linear-gradient(135deg, #22c55e, #16a34a); }
                .action-icon.fees { background: linear-gradient(135deg, #f59e0b, #d97706); }
                .action-icon.class-info { background: linear-gradient(135deg, #0ea5e9, #0284c7); }

                .action-label {
                    font-weight: 600;
                    color: #1e293b;
                    display: block;
                }

                .action-desc {
                    font-size: 0.8rem;
                    color: #64748b;
                }

                /* Academic Standing */
                .standing-content {
                    display: flex;
                    gap: 1.5rem;
                    align-items: center;
                }

                .grade-circle {
                    width: 100px;
                    height: 100px;
                    background: linear-gradient(135deg, #22c55e, #16a34a);
                    border-radius: 50%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    flex-shrink: 0;
                }

                .grade-circle .grade {
                    font-size: 1.5rem;
                    font-weight: 800;
                    margin-top: 0.25rem;
                }

                .standing-info {
                    flex: 1;
                }

                .standing-info h3 {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0 0 0.25rem 0;
                }

                .standing-info p {
                    font-size: 0.9rem;
                    color: #64748b;
                    margin: 0 0 1rem 0;
                }

                .attendance-bar {
                    width: 100%;
                }

                .bar-label {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #1e293b;
                    display: block;
                    margin-bottom: 0.5rem;
                }

                .bar-track {
                    height: 8px;
                    background: #e2e8f0;
                    border-radius: 4px;
                    overflow: hidden;
                }

                .bar-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #FEA3BE, #22c55e);
                    border-radius: 4px;
                    transition: width 0.5s ease;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .profile-page {
                        padding: 0;
                        max-width: 100vw;
                        overflow-x: hidden;
                    }

                    .profile-header-bg {
                        height: 120px;
                    }

                    .profile-header-content {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                        padding: 0 1rem 1.5rem;
                        max-width: 100%;
                    }

                    .profile-title {
                        padding-top: 0;
                        max-width: 100%;
                    }

                    .profile-title h1 {
                        font-size: 1.3rem;
                        word-wrap: break-word;
                        overflow-wrap: break-word;
                    }

                    .class-badge {
                        font-size: 0.8rem;
                        word-wrap: break-word;
                    }

                    .points-card {
                        margin-top: 0;
                        width: 100%;
                        max-width: 100%;
                        overflow: hidden;
                    }

                    .profile-grid {
                        grid-template-columns: 1fr;
                        padding: 0 1rem 1.5rem;
                        max-width: 100%;
                    }

                    .info-card {
                        max-width: 100%;
                        overflow: hidden;
                    }

                    .details-list {
                        max-width: 100%;
                    }

                    .detail-row {
                        max-width: 100%;
                        overflow: hidden;
                    }

                    .detail-info .value {
                        font-size: 0.9rem;
                        word-wrap: break-word;
                        overflow-wrap: break-word;
                    }

                    .standing-content {
                        flex-direction: column;
                        text-align: center;
                    }

                    .standing-info h3 {
                        font-size: 1rem;
                        word-wrap: break-word;
                    }

                    .standing-info p {
                        font-size: 0.85rem;
                        word-wrap: break-word;
                    }
                }
            `}</style>
      </div>
    </div>
  );
};

export default StudentProfile;

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import {
    User,
    Mail,
    Phone,
    Calendar,
    Building,
    Camera,
    Sun,
    Moon,
    Palette,
    LogOut,
    Check,
    Edit2,
    Award,
    Briefcase
} from 'lucide-react';

const FacultyProfile = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const fileInputRef = useRef(null);
    const [profileImage, setProfileImage] = useState(null);
    const [themeSaved, setThemeSaved] = useState(false);

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

    // Faculty data (would come from context/API in real app)
    const facultyData = {
        id: 'FAC001',
        name: user?.name || 'John Smith',
        email: user?.email || 'john.smith@acadexa.com',
        phone: '+91 98765 11111',
        dateOfBirth: '1985-06-15',
        age: calculateAge('1985-06-15'),
        designation: 'Senior Mathematics Teacher',
        department: 'Mathematics',
        instituteName: 'Acadexa International School',
        instituteAddress: 'Education Lane, Knowledge City, 560001',
        joiningDate: '2023-06-01',
        experience: '8 years',
        qualification: 'M.Sc Mathematics, B.Ed',
        subjects: ['Mathematics', 'Physics'],
        classes: ['10th Grade A', '10th Grade B', '11th Grade A']
    };

    const themes = [
        { id: 'light', name: 'Light', icon: Sun, color: '#f8fafc' },
        { id: 'dark', name: 'Dark', icon: Moon, color: '#1e293b' },
        { id: 'pink', name: 'Pink', icon: Palette, color: '#FEA3BE' },
    ];

    const handleThemeChange = (themeId) => {
        setTheme(themeId);
        setThemeSaved(true);
        setTimeout(() => setThemeSaved(false), 2000);
    };

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

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="admin-layout">
            <Sidebar role="faculty" />
            <div className="admin-main">
                <Navbar />
                <div className="faculty-profile-page">
                    {/* Profile Header */}
                    <div className="profile-header">
                        <div className="header-bg"></div>
                        <div className="header-content">
                            {/* Profile Picture */}
                            <div className="profile-picture-section">
                                <div className="profile-picture">
                                    {profileImage ? (
                                        <img src={profileImage} alt={facultyData.name} />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            {facultyData.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                    )}
                                    <button
                                        className="camera-btn"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Camera size={18} />
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                        hidden
                                    />
                                </div>
                            </div>

                            {/* Profile Info */}
                            <div className="profile-info">
                                <h1>{facultyData.name}</h1>
                                <p className="designation">{facultyData.designation}</p>
                                <div className="badges">
                                    <span className="badge id-badge">{facultyData.id}</span>
                                    <span className="badge dept-badge">{facultyData.department}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="profile-content">
                        {/* Personal Details Card */}
                        <div className="profile-card">
                            <div className="card-header">
                                <User size={22} />
                                <h2>Personal Details</h2>
                            </div>
                            <div className="details-grid">
                                <div className="detail-item">
                                    <User size={18} />
                                    <div>
                                        <span className="label">Full Name</span>
                                        <span className="value">{facultyData.name}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <Mail size={18} />
                                    <div>
                                        <span className="label">Email Address</span>
                                        <span className="value">{facultyData.email}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <Phone size={18} />
                                    <div>
                                        <span className="label">Contact Number</span>
                                        <span className="value">{facultyData.phone}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <Calendar size={18} />
                                    <div>
                                        <span className="label">Age</span>
                                        <span className="value">{facultyData.age} years</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Institute Details Card */}
                        <div className="profile-card">
                            <div className="card-header">
                                <Building size={22} />
                                <h2>Institute Information</h2>
                            </div>
                            <div className="institute-info">
                                <div className="institute-main">
                                    <div className="institute-icon">
                                        <Building size={32} />
                                    </div>
                                    <div className="institute-details">
                                        <h3>{facultyData.instituteName}</h3>
                                        <p>{facultyData.instituteAddress}</p>
                                    </div>
                                </div>
                                <div className="professional-details">
                                    <div className="pro-item">
                                        <Briefcase size={16} />
                                        <span>Experience: {facultyData.experience}</span>
                                    </div>
                                    <div className="pro-item">
                                        <Calendar size={16} />
                                        <span>Joined: {new Date(facultyData.joiningDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                    </div>
                                    <div className="pro-item">
                                        <Award size={16} />
                                        <span>{facultyData.qualification}</span>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* Theme Settings Card */}
                        <div className="profile-card">
                            <div className="card-header">
                                <Palette size={22} />
                                <h2>Change Theme</h2>
                            </div>
                            <div className="theme-options">
                                {themes.map((t) => (
                                    <button
                                        key={t.id}
                                        className={`theme-btn ${theme === t.id ? 'active' : ''}`}
                                        onClick={() => handleThemeChange(t.id)}
                                    >
                                        <div className="theme-preview" style={{ background: t.color }}>
                                            <t.icon size={24} />
                                        </div>
                                        <span className="theme-name">{t.name}</span>
                                        {theme === t.id && (
                                            <div className="check-badge">
                                                <Check size={14} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                            {themeSaved && (
                                <div className="theme-saved">
                                    <Check size={16} />
                                    Theme applied successfully!
                                </div>
                            )}
                        </div>

                        {/* Logout Section */}
                        <div className="logout-section">
                            <button className="logout-btn" onClick={handleLogout}>
                                <LogOut size={20} />
                                Logout from Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .faculty-profile-page {
                    background: #f8fafc;
                    min-height: 100vh;
                }

                /* Profile Header */
                .profile-header {
                    position: relative;
                    background: white;
                    margin-bottom: 2rem;
                }

                .header-bg {
                    height: 160px;
                    background: linear-gradient(135deg, #FEA3BE 0%, #FBA2AB 50%, #F3B5A0 100%);
                }

                .header-content {
                    display: flex;
                    align-items: flex-end;
                    gap: 2rem;
                    padding: 0 2rem 2rem;
                    margin-top: -70px;
                }

                /* Profile Picture */
                .profile-picture-section {
                    flex-shrink: 0;
                }

                .profile-picture {
                    width: 140px;
                    height: 140px;
                    border-radius: 24px;
                    overflow: hidden;
                    position: relative;
                    border: 4px solid white;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
                }

                .profile-picture img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .avatar-placeholder {
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 3rem;
                    font-weight: 700;
                    color: white;
                }

                .camera-btn {
                    position: absolute;
                    bottom: 8px;
                    right: 8px;
                    width: 36px;
                    height: 36px;
                    background: white;
                    border: none;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                    color: #FEA3BE;
                    transition: all 0.2s;
                }

                .camera-btn:hover {
                    transform: scale(1.1);
                    background: #FEA3BE;
                    color: white;
                }

                /* Profile Info */
                .profile-info {
                    flex: 1;
                    padding-bottom: 0.5rem;
                }

                .profile-info h1 {
                    margin: 0 0 0.5rem 0;
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #1e293b;
                }

                .designation {
                    color: #64748b;
                    margin: 0 0 1rem 0;
                    font-size: 1rem;
                }

                .badges {
                    display: flex;
                    gap: 0.75rem;
                }

                .badge {
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 600;
                }

                .id-badge {
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    color: white;
                }

                .dept-badge {
                    background: #f1f5f9;
                    color: #64748b;
                }

                /* Profile Content */
                .profile-content {
                    padding: 0 2rem 2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                /* Profile Cards */
                .profile-card {
                    background: white;
                    border-radius: 20px;
                    padding: 1.5rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                .card-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
                    padding-bottom: 1rem;
                    border-bottom: 2px solid #f1f5f9;
                    color: #FEA3BE;
                }

                .card-header h2 {
                    margin: 0;
                    font-size: 1.1rem;
                    color: #1e293b;
                }

                /* Details Grid */
                .details-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1rem;
                }

                .detail-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                    padding: 1rem;
                    background: #f8fafc;
                    border-radius: 12px;
                }

                .detail-item svg {
                    color: #FEA3BE;
                    flex-shrink: 0;
                    margin-top: 2px;
                }

                .detail-item .label {
                    display: block;
                    font-size: 0.8rem;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 0.25rem;
                }

                .detail-item .value {
                    display: block;
                    font-size: 1rem;
                    font-weight: 600;
                    color: #1e293b;
                }

                /* Institute Info */
                .institute-info {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .institute-main {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1.5rem;
                    background: linear-gradient(135deg, #fef7f9, #fff5f7);
                    border-radius: 16px;
                    border: 1px solid #fecdd3;
                }

                .institute-icon {
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }

                .institute-details h3 {
                    margin: 0 0 0.25rem 0;
                    font-size: 1.1rem;
                    color: #1e293b;
                }

                .institute-details p {
                    margin: 0;
                    color: #64748b;
                    font-size: 0.9rem;
                }

                .professional-details {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .pro-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1rem;
                    background: #f8fafc;
                    border-radius: 10px;
                    font-size: 0.9rem;
                    color: #1e293b;
                }

                .pro-item svg {
                    color: #FEA3BE;
                }

                /* Salary Card */
                .salary-content {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .salary-main {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 2rem;
                    background: linear-gradient(135deg, #22c55e, #16a34a);
                    border-radius: 16px;
                    color: white;
                }

                .salary-label {
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    opacity: 0.9;
                    margin-bottom: 0.5rem;
                }

                .salary-amount {
                    font-size: 2.5rem;
                    font-weight: 800;
                }

                .salary-breakdown {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .salary-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 1rem;
                    background: #f8fafc;
                    border-radius: 10px;
                }

                .salary-item .positive {
                    color: #22c55e;
                    font-weight: 600;
                }

                .salary-item .negative {
                    color: #ef4444;
                    font-weight: 600;
                }

                .view-salary-btn {
                    width: 100%;
                    margin-top: 1rem;
                    padding: 1rem;
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-weight: 600;
                    font-size: 0.95rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .view-salary-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(254, 163, 190, 0.4);
                }

                /* Theme Options */
                .theme-options {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                }

                .theme-btn {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1.5rem;
                    background: #f8fafc;
                    border: 2px solid transparent;
                    border-radius: 16px;
                    cursor: pointer;
                    transition: all 0.2s;
                    position: relative;
                    min-width: 100px;
                }

                .theme-btn:hover {
                    background: #f1f5f9;
                }

                .theme-btn.active {
                    border-color: #FEA3BE;
                    background: #fef7f9;
                }

                .theme-preview {
                    width: 50px;
                    height: 50px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }

                .theme-name {
                    font-weight: 600;
                    color: #1e293b;
                }

                .check-badge {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    width: 24px;
                    height: 24px;
                    background: #22c55e;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }

                .theme-saved {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-top: 1rem;
                    padding: 0.75rem 1rem;
                    background: linear-gradient(135deg, #dcfce7, #bbf7d0);
                    color: #166534;
                    border-radius: 10px;
                    font-weight: 600;
                }

                /* Logout Section */
                .logout-section {
                    border-top: 2px solid #f1f5f9;
                    padding-top: 1.5rem;
                }

                .logout-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    width: 100%;
                    padding: 1rem;
                    background: #fef2f2;
                    border: 2px solid #fecaca;
                    border-radius: 12px;
                    color: #ef4444;
                    font-weight: 600;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .logout-btn:hover {
                    background: #ef4444;
                    border-color: #ef4444;
                    color: white;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .faculty-profile-page {
                        background: #f8fafc;
                        max-width: 100vw;
                        overflow-x: hidden;
                    }

                    .header-content {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                        margin-top: -50px;
                        padding: 0 1rem 1.5rem;
                        max-width: 100%;
                    }

                    .profile-picture {
                        width: 120px;
                        height: 120px;
                    }

                    .profile-info {
                        max-width: 100%;
                        overflow: hidden;
                    }

                    .profile-info h1 {
                        font-size: 1.25rem;
                        word-wrap: break-word;
                        overflow-wrap: break-word;
                    }

                    .designation {
                        font-size: 0.9rem;
                        word-wrap: break-word;
                    }

                    .badges {
                        justify-content: center;
                        flex-wrap: wrap;
                        max-width: 100%;
                    }

                    .badge {
                        font-size: 0.8rem;
                        word-wrap: break-word;
                    }

                    .profile-content {
                        padding: 0 1rem 1rem;
                        max-width: 100%;
                    }

                    .profile-card {
                        max-width: 100%;
                        overflow: hidden;
                    }

                    .details-grid {
                        grid-template-columns: 1fr;
                    }

                    .detail-item {
                        max-width: 100%;
                        overflow: hidden;
                    }

                    .detail-item .value {
                        word-wrap: break-word;
                        overflow-wrap: break-word;
                        font-size: 0.95rem;
                    }

                    .theme-options {
                        justify-content: center;
                    }

                    .professional-details {
                        flex-direction: column;
                    }

                    .institute-main {
                        flex-direction: column;
                        text-align: center;
                        max-width: 100%;
                    }

                    .institute-details h3 {
                        font-size: 1rem;
                        word-wrap: break-word;
                    }

                    .institute-details p {
                        font-size: 0.85rem;
                        word-wrap: break-word;
                    }
                }
            `}</style>
        </div>
    );
};

export default FacultyProfile;

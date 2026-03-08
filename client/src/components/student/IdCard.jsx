import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import {
    ArrowLeft,
    Download,
    Share2,
    QrCode,
    Phone,
    Mail,
    MapPin,
    Calendar,
    GraduationCap,
    User,
    IdCard
} from 'lucide-react';

const StudentIdCard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const cardRef = useRef(null);

    // Student data (would come from context/API in real app)
    const studentData = {
        id: 'STU2024001',
        name: user?.name || 'Student Name',
        email: user?.email || 'student@acadexa.com',
        phone: '+91 98765 43210',
        class: '10th Grade - Section A',
        rollNumber: '15',
        dateOfBirth: '2008-05-15',
        bloodGroup: 'O+',
        address: '123 Education Lane, Knowledge City',
        admissionYear: '2020',
        validUntil: 'March 2026',
        emergencyContact: '+91 98765 12345',
        parentName: 'John Doe',
        photo: null
    };

    const handleDownload = () => {
        // In a real app, this would generate a PDF/image
        alert('ID Card download feature - Would generate PDF in production');
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Student ID Card',
                text: `Student ID: ${studentData.id} - ${studentData.name}`,
            });
        } else {
            alert('Share feature not supported in this browser');
        }
    };

    return (
        <div className="admin-layout">
            <Sidebar role="student" />
            <div className="admin-main">
                <Navbar />
                <div className="id-card-page">
                    {/* Back Button */}
                    <button className="back-btn" onClick={() => navigate('/student/profile')}>
                        <ArrowLeft size={18} />
                        Back to Profile
                    </button>

                    {/* Page Header */}
                    <div className="page-header">
                        <h1>🪪 Digital ID Card</h1>
                        <p>Your official student identification</p>
                    </div>

                    {/* Actions */}
                    <div className="card-actions">
                        <button className="action-btn download" onClick={handleDownload}>
                            <Download size={18} />
                            Download PDF
                        </button>
                        <button className="action-btn share" onClick={handleShare}>
                            <Share2 size={18} />
                            Share
                        </button>
                    </div>

                    {/* ID Card */}
                    <div className="id-card-container" ref={cardRef}>
                        <div className="id-card">
                            {/* Front Side */}
                            <div className="card-front">
                                {/* Header */}
                                <div className="card-header">
                                    <div className="school-logo">
                                        <GraduationCap size={32} />
                                    </div>
                                    <div className="school-info">
                                        <h2>ACADEXA SCHOOL</h2>
                                        <p>Excellence in Education</p>
                                    </div>
                                </div>

                                {/* Student Photo & Details */}
                                <div className="card-body">
                                    <div className="photo-section">
                                        <div className="student-photo">
                                            {studentData.photo ? (
                                                <img src={studentData.photo} alt={studentData.name} />
                                            ) : (
                                                <div className="photo-placeholder">
                                                    <User size={48} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="qr-code">
                                            <QrCode size={60} />
                                        </div>
                                    </div>

                                    <div className="details-section">
                                        <h3 className="student-name">{studentData.name}</h3>
                                        <div className="student-id">ID: {studentData.id}</div>

                                        <div className="info-grid">
                                            <div className="info-item">
                                                <span className="label">Class</span>
                                                <span className="value">{studentData.class}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="label">Roll No.</span>
                                                <span className="value">{studentData.rollNumber}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="label">Blood Group</span>
                                                <span className="value blood-group">{studentData.bloodGroup}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="label">Valid Until</span>
                                                <span className="value">{studentData.validUntil}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="card-footer">
                                    <div className="footer-wave"></div>
                                    <p>This card is property of Acadexa School</p>
                                </div>
                            </div>

                            {/* Back Side */}
                            <div className="card-back">
                                <h4>IMPORTANT INFORMATION</h4>

                                <div className="back-details">
                                    <div className="back-item">
                                        <Mail size={16} />
                                        <span>{studentData.email}</span>
                                    </div>
                                    <div className="back-item">
                                        <Phone size={16} />
                                        <span>{studentData.phone}</span>
                                    </div>
                                    <div className="back-item">
                                        <MapPin size={16} />
                                        <span>{studentData.address}</span>
                                    </div>
                                    <div className="back-item">
                                        <User size={16} />
                                        <span>Parent: {studentData.parentName}</span>
                                    </div>
                                    <div className="back-item emergency">
                                        <Phone size={16} />
                                        <span>Emergency: {studentData.emergencyContact}</span>
                                    </div>
                                </div>

                                <div className="terms">
                                    <h5>Terms & Conditions</h5>
                                    <ul>
                                        <li>This card is non-transferable</li>
                                        <li>Report loss immediately to admin office</li>
                                        <li>Must be carried during school hours</li>
                                    </ul>
                                </div>

                                <div className="signature-section">
                                    <div className="signature">
                                        <div className="signature-line"></div>
                                        <span>Principal's Signature</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .id-card-page {
                    padding: 2rem;
                    background: #f8fafc;
                    min-height: 100vh;
                }

                .back-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.625rem 1rem;
                    background: white;
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    color: #64748b;
                    cursor: pointer;
                    margin-bottom: 1.5rem;
                    transition: all 0.2s;
                }

                .back-btn:hover {
                    color: #FEA3BE;
                    background: #fef7f9;
                }

                .page-header {
                    margin-bottom: 1.5rem;
                }

                .page-header h1 {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0 0 0.25rem 0;
                }

                .page-header p {
                    color: #64748b;
                    margin: 0;
                }

                /* Card Actions */
                .card-actions {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .action-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.5rem;
                    border: none;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .action-btn.download {
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    color: white;
                }

                .action-btn.download:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(254, 163, 190, 0.4);
                }

                .action-btn.share {
                    background: white;
                    color: #64748b;
                    border: 2px solid #e2e8f0;
                }

                .action-btn.share:hover {
                    border-color: #FEA3BE;
                    color: #FEA3BE;
                }

                /* ID Card Container */
                .id-card-container {
                    display: flex;
                    justify-content: center;
                    padding: 2rem 0;
                }

                .id-card {
                    display: flex;
                    gap: 2rem;
                    flex-wrap: wrap;
                    justify-content: center;
                }

                /* Card Front */
                .card-front {
                    width: 380px;
                    background: white;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                    position: relative;
                }

                .card-header {
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    padding: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    color: white;
                }

                .school-logo {
                    width: 60px;
                    height: 60px;
                    background: rgba(255,255,255,0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .school-info h2 {
                    margin: 0;
                    font-size: 1.25rem;
                    font-weight: 800;
                }

                .school-info p {
                    margin: 0.25rem 0 0 0;
                    font-size: 0.85rem;
                    opacity: 0.9;
                }

                .card-body {
                    padding: 1.5rem;
                }

                .photo-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1.5rem;
                }

                .student-photo {
                    width: 100px;
                    height: 120px;
                    background: #f1f5f9;
                    border-radius: 10px;
                    overflow: hidden;
                    border: 3px solid #FEA3BE;
                }

                .student-photo img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .photo-placeholder {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #94a3b8;
                }

                .qr-code {
                    padding: 0.75rem;
                    background: #f8fafc;
                    border-radius: 10px;
                    color: #1e293b;
                }

                .details-section {
                    text-align: center;
                }

                .student-name {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0 0 0.5rem 0;
                }

                .student-id {
                    display: inline-block;
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    color: white;
                    padding: 0.5rem 1.25rem;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 0.9rem;
                    margin-bottom: 1.5rem;
                }

                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                    text-align: left;
                }

                .info-item {
                    padding: 0.75rem;
                    background: #f8fafc;
                    border-radius: 10px;
                }

                .info-item .label {
                    display: block;
                    font-size: 0.75rem;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 0.25rem;
                }

                .info-item .value {
                    font-weight: 600;
                    color: #1e293b;
                }

                .info-item .value.blood-group {
                    color: #ef4444;
                }

                .card-footer {
                    background: #f8fafc;
                    padding: 1rem;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }

                .footer-wave {
                    position: absolute;
                    top: -20px;
                    left: 0;
                    right: 0;
                    height: 40px;
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    clip-path: ellipse(60% 50% at 50% 100%);
                }

                .card-footer p {
                    margin: 0;
                    font-size: 0.8rem;
                    color: #64748b;
                    position: relative;
                    z-index: 1;
                }

                /* Card Back */
                .card-back {
                    width: 380px;
                    background: white;
                    border-radius: 20px;
                    padding: 1.5rem;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                }

                .card-back h4 {
                    text-align: center;
                    color: #FEA3BE;
                    margin: 0 0 1.5rem 0;
                    font-size: 1rem;
                    letter-spacing: 1px;
                }

                .back-details {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
                }

                .back-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem;
                    background: #f8fafc;
                    border-radius: 10px;
                    font-size: 0.9rem;
                    color: #1e293b;
                }

                .back-item svg {
                    color: #FEA3BE;
                    flex-shrink: 0;
                }

                .back-item.emergency {
                    background: #fef2f2;
                    color: #ef4444;
                }

                .back-item.emergency svg {
                    color: #ef4444;
                }

                .terms {
                    margin-bottom: 1.5rem;
                    padding: 1rem;
                    background: #fffbeb;
                    border-radius: 10px;
                }

                .terms h5 {
                    margin: 0 0 0.75rem 0;
                    color: #b45309;
                    font-size: 0.85rem;
                }

                .terms ul {
                    margin: 0;
                    padding-left: 1.25rem;
                    font-size: 0.8rem;
                    color: #92400e;
                }

                .terms li {
                    margin-bottom: 0.25rem;
                }

                .signature-section {
                    display: flex;
                    justify-content: flex-end;
                }

                .signature {
                    text-align: center;
                }

                .signature-line {
                    width: 120px;
                    height: 2px;
                    background: #e2e8f0;
                    margin-bottom: 0.5rem;
                }

                .signature span {
                    font-size: 0.75rem;
                    color: #64748b;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .id-card-page {
                        padding: 1rem;
                    }

                    .id-card {
                        flex-direction: column;
                        align-items: center;
                    }

                    .card-front,
                    .card-back {
                        width: 100%;
                        max-width: 380px;
                    }

                    .card-actions {
                        flex-direction: column;
                    }
                }
            `}</style>
        </div>
    );
};

export default StudentIdCard;

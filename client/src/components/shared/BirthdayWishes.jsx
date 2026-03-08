import React, { useState, useEffect } from 'react';
import { Cake, Gift, PartyPopper, Heart, Sparkles, Calendar } from 'lucide-react';
import { useStudents } from '../../contexts/StudentsContext';

const BirthdayWishes = () => {
    const { students } = useStudents();
    const [todaysBirthdays, setTodaysBirthdays] = useState({ students: [], faculty: [] });

    // Sample faculty data with birthdays
    const facultyData = [
        {
            id: 'FAC001',
            name: 'Dr. Robert Smith',
            designation: 'Math Teacher',
            dateOfBirth: '1985-01-03',
            department: 'Mathematics',
            photo: null
        },
        {
            id: 'FAC002',
            name: 'Prof. Emily Davis',
            designation: 'Science Teacher',
            dateOfBirth: '1990-07-15',
            department: 'Science',
            photo: null
        },
        {
            id: 'FAC003',
            name: 'Mrs. Sarah Johnson',
            designation: 'English Teacher',
            dateOfBirth: '1988-03-22',
            department: 'English',
            photo: null
        }
    ];

    useEffect(() => {
        // Get today's date
        const today = new Date();
        const todayMonth = today.getMonth() + 1; // Months are 0-indexed
        const todayDate = today.getDate();

        // Filter students with today's birthday
        const birthdayStudents = students.filter(student => {
            if (student.dateOfBirth) {
                const dob = new Date(student.dateOfBirth);
                return dob.getMonth() + 1 === todayMonth && dob.getDate() === todayDate;
            }
            return false;
        });

        // Filter faculty with today's birthday
        const birthdayFaculty = facultyData.filter(faculty => {
            if (faculty.dateOfBirth) {
                const dob = new Date(faculty.dateOfBirth);
                return dob.getMonth() + 1 === todayMonth && dob.getDate() === todayDate;
            }
            return false;
        });

        setTodaysBirthdays({
            students: birthdayStudents,
            faculty: birthdayFaculty
        });
    }, [students]);

    const calculateAge = (dateOfBirth) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const BirthdayCard = ({ person, type }) => {
        const age = calculateAge(person.dateOfBirth);
        const initials = person.name.split(' ').map(n => n[0]).join('');

        return (
            <div className="birthday-card glass-card hover-lift">
                <div className="birthday-card-header">
                    <div className="confetti-decoration">
                        <Sparkles className="sparkle sparkle-1" size={20} />
                        <Sparkles className="sparkle sparkle-2" size={16} />
                        <Sparkles className="sparkle sparkle-3" size={18} />
                    </div>
                    <PartyPopper className="party-icon" size={32} />
                </div>

                <div className="birthday-avatar">
                    <div className="avatar-circle">
                        {person.photo ? (
                            <img src={person.photo} alt={person.name} />
                        ) : (
                            <span className="avatar-initials">{initials}</span>
                        )}
                    </div>
                    <div className="birthday-badge">
                        <Cake size={20} />
                    </div>
                </div>

                <div className="birthday-info">
                    <h3 className="birthday-name">{person.name}</h3>
                    <p className="birthday-role">
                        {type === 'student' ? person.class : person.designation}
                    </p>
                    <div className="birthday-age">
                        <Gift size={18} />
                        <span>Turning {age} today!</span>
                    </div>
                </div>

                <div className="birthday-wish">
                    <Heart className="wish-heart" size={20} />
                    <p>Wishing you a wonderful birthday filled with joy and success!</p>
                </div>

                <div className="birthday-footer">
                    <span className="birthday-id">{person.id}</span>
                    <Calendar size={16} />
                </div>
            </div>
        );
    };

    const EmptyState = () => (
        <div className="birthday-empty-state glass-card">
            <div className="empty-icon">
                <Cake size={64} />
            </div>
            <h3>No Birthdays Today</h3>
            <p>Check back tomorrow to celebrate with your community!</p>
        </div>
    );

    const totalBirthdays = todaysBirthdays.students.length + todaysBirthdays.faculty.length;

    return (
        <div className="birthday-wishes-container">
            <div className="birthday-header">
                <div className="birthday-title-section">
                    <div className="title-icon">
                        <PartyPopper size={40} />
                    </div>
                    <div>
                        <h1 className="birthday-main-title">🎉 Birthday Celebrations</h1>
                        <p className="birthday-subtitle">
                            {totalBirthdays > 0
                                ? `${totalBirthdays} special celebration${totalBirthdays > 1 ? 's' : ''} today!`
                                : 'Celebrate special moments with our community'}
                        </p>
                    </div>
                </div>

                <div className="birthday-stats">
                    <div className="stat-item">
                        <div className="stat-icon student-stat">
                            <Cake size={24} />
                        </div>
                        <div>
                            <p className="stat-value">{todaysBirthdays.students.length}</p>
                            <p className="stat-label">Students</p>
                        </div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-icon faculty-stat">
                            <Gift size={24} />
                        </div>
                        <div>
                            <p className="stat-value">{todaysBirthdays.faculty.length}</p>
                            <p className="stat-label">Faculty</p>
                        </div>
                    </div>
                </div>
            </div>

            {totalBirthdays === 0 ? (
                <EmptyState />
            ) : (
                <>
                    {todaysBirthdays.students.length > 0 && (
                        <div className="birthday-section">
                            <div className="section-header">
                                <h2>
                                    <Cake size={28} />
                                    Student Birthdays
                                </h2>
                                <span className="count-badge">{todaysBirthdays.students.length}</span>
                            </div>
                            <div className="birthday-cards-grid">
                                {todaysBirthdays.students.map(student => (
                                    <BirthdayCard key={student.id} person={student} type="student" />
                                ))}
                            </div>
                        </div>
                    )}

                    {todaysBirthdays.faculty.length > 0 && (
                        <div className="birthday-section">
                            <div className="section-header">
                                <h2>
                                    <Gift size={28} />
                                    Faculty Birthdays
                                </h2>
                                <span className="count-badge">{todaysBirthdays.faculty.length}</span>
                            </div>
                            <div className="birthday-cards-grid">
                                {todaysBirthdays.faculty.map(faculty => (
                                    <BirthdayCard key={faculty.id} person={faculty} type="faculty" />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            <style jsx>{`
                .birthday-wishes-container {
                    padding: 0;
                }

                .birthday-header {
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    padding: 2.5rem;
                    border-radius: var(--radius-lg);
                    margin-bottom: 2rem;
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 2rem;
                    box-shadow: 0 8px 24px rgba(254, 163, 190, 0.3);
                    position: relative;
                    overflow: hidden;
                }

                .birthday-header::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    right: -10%;
                    width: 300px;
                    height: 300px;
                    background: radial-gradient(circle, rgba(255, 255, 255, 0.15), transparent);
                    border-radius: 50%;
                }

                .birthday-title-section {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    z-index: 1;
                }

                .title-icon {
                    background: rgba(255, 255, 255, 0.2);
                    padding: 1rem;
                    border-radius: 50%;
                    backdrop-filter: blur(10px);
                    animation: bounce 2s infinite;
                }

                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                .birthday-main-title {
                    font-size: 2.5rem;
                    font-weight: 800;
                    margin: 0;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
                }

                .birthday-subtitle {
                    font-size: 1.1rem;
                    margin: 0.5rem 0 0 0;
                    opacity: 0.95;
                    font-weight: 500;
                }

                .birthday-stats {
                    display: flex;
                    gap: 2rem;
                    z-index: 1;
                }

                .stat-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    background: rgba(255, 255, 255, 0.15);
                    padding: 1rem 1.5rem;
                    border-radius: var(--radius-md);
                    backdrop-filter: blur(10px);
                }

                .stat-icon {
                    padding: 0.75rem;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .student-stat {
                    background: rgba(255, 255, 255, 0.9);
                    color: #FEA3BE;
                }

                .faculty-stat {
                    background: rgba(255, 255, 255, 0.9);
                    color: #F3B5A0;
                }

                .stat-value {
                    font-size: 2rem;
                    font-weight: 800;
                    margin: 0;
                    line-height: 1;
                }

                .stat-label {
                    font-size: 0.9rem;
                    margin: 0.25rem 0 0 0;
                    opacity: 0.9;
                }

                .birthday-section {
                    margin-bottom: 3rem;
                }

                .section-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1.5rem;
                    padding-bottom: 1rem;
                    border-bottom: 2px solid var(--border-color);
                }

                .section-header h2 {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 1.75rem;
                    font-weight: 700;
                    margin: 0;
                    color: var(--text-primary);
                }

                .count-badge {
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: var(--radius-full);
                    font-weight: 700;
                    font-size: 1.1rem;
                    box-shadow: 0 4px 12px rgba(254, 163, 190, 0.3);
                }

                .birthday-cards-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 2rem;
                }

                .birthday-card {
                    padding: 2rem;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s ease;
                    border: 2px solid transparent;
                }

                .birthday-card:hover {
                    border-color: var(--primary);
                    transform: translateY(-8px) scale(1.02);
                    box-shadow: 0 12px 32px rgba(254, 163, 190, 0.4);
                }

                .birthday-card-header {
                    position: absolute;
                    top: 0;
                    right: 0;
                    left: 0;
                    height: 80px;
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    border-radius: var(--radius-md) var(--radius-md) 0 0;
                }

                .confetti-decoration {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                }

                .sparkle {
                    position: absolute;
                    color: rgba(255, 255, 255, 0.8);
                    animation: twinkle 2s infinite;
                }

                .sparkle-1 {
                    top: 15px;
                    left: 20px;
                    animation-delay: 0s;
                }

                .sparkle-2 {
                    top: 35px;
                    right: 30px;
                    animation-delay: 0.5s;
                }

                .sparkle-3 {
                    top: 20px;
                    left: 50%;
                    animation-delay: 1s;
                }

                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.2); }
                }

                .party-icon {
                    position: absolute;
                    top: 50%;
                    right: 1.5rem;
                    transform: translateY(-50%);
                    color: rgba(255, 255, 255, 0.9);
                    animation: shake 1s infinite;
                }

                @keyframes shake {
                    0%, 100% { transform: translateY(-50%) rotate(0deg); }
                    25% { transform: translateY(-50%) rotate(-10deg); }
                    75% { transform: translateY(-50%) rotate(10deg); }
                }

                .birthday-avatar {
                    margin: 3rem auto 1.5rem;
                    position: relative;
                    width: 120px;
                    height: 120px;
                }

                .avatar-circle {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 4px solid white;
                    box-shadow: 0 4px 16px rgba(254, 163, 190, 0.3);
                }

                .avatar-initials {
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: white;
                }

                .avatar-circle img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    object-fit: cover;
                }

                .birthday-badge {
                    position: absolute;
                    bottom: -5px;
                    right: -5px;
                    background: linear-gradient(135deg, #FFDFC3, #F6E0D0);
                    color: var(--text-primary);
                    padding: 0.5rem;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }

                .birthday-info {
                    text-align: center;
                    margin-bottom: 1.5rem;
                }

                .birthday-name {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin: 0 0 0.5rem 0;
                    color: var(--text-primary);
                }

                .birthday-role {
                    font-size: 1rem;
                    color: var(--text-secondary);
                    margin: 0 0 1rem 0;
                    font-weight: 500;
                }

                .birthday-age {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: var(--radius-full);
                    font-weight: 600;
                    font-size: 0.95rem;
                }

                .birthday-wish {
                    background: linear-gradient(135deg, #FFE9F1, #FFF5EB);
                    padding: 1rem;
                    border-radius: var(--radius-md);
                    text-align: center;
                    margin-bottom: 1rem;
                    position: relative;
                }

                .wish-heart {
                    position: absolute;
                    top: -10px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: white;
                    color: #FEA3BE;
                    padding: 0.5rem;
                    border-radius: 50%;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    animation: heartbeat 1.5s infinite;
                }

                @keyframes heartbeat {
                    0%, 100% { transform: translateX(-50%) scale(1); }
                    50% { transform: translateX(-50%) scale(1.15); }
                }

                .birthday-wish p {
                    margin: 0.75rem 0 0 0;
                    color: var(--text-primary);
                    font-style: italic;
                    font-weight: 500;
                    line-height: 1.6;
                }

                .birthday-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 1rem;
                    border-top: 1px solid var(--border-color);
                }

                .birthday-id {
                    font-weight: 600;
                    color: var(--primary);
                    font-size: 0.9rem;
                }

                .birthday-empty-state {
                    text-align: center;
                    padding: 4rem 2rem;
                }

                .empty-icon {
                    color: var(--primary);
                    opacity: 0.3;
                    margin-bottom: 1.5rem;
                }

                .birthday-empty-state h3 {
                    font-size: 1.75rem;
                    font-weight: 700;
                    margin: 0 0 0.75rem 0;
                    color: var(--text-primary);
                }

                .birthday-empty-state p {
                    font-size: 1.1rem;
                    color: var(--text-secondary);
                    margin: 0;
                }

                @media (max-width: 768px) {
                    .birthday-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .birthday-main-title {
                        font-size: 2rem;
                    }

                    .birthday-stats {
                        width: 100%;
                        justify-content: space-around;
                    }

                    .birthday-cards-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default BirthdayWishes;

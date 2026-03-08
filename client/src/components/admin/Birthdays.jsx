import React, { useState } from 'react';
import { useStudents } from '../../contexts/StudentsContext';
import Navbar from '../shared/Navbar';
import Sidebar from '../shared/Sidebar';
import { Calendar, Gift, Cake, Mail, Phone, PartyPopper, Users, GraduationCap } from 'lucide-react';

const Birthdays = () => {
  const { students } = useStudents();
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'students', 'faculty'

  // Sample faculty data - In production, this would come from a FacultyContext
  const faculty = [
    {
      id: 'F001',
      name: 'Dr. Sarah Johnson',
      role: 'Mathematics Professor',
      dateOfBirth: '1985-01-20',
      email: 'sarah.j@school.edu',
      phone: '+1234567890'
    },
    {
      id: 'F002',
      name: 'Prof. Michael Chen',
      role: 'Physics Teacher',
      dateOfBirth: '1990-02-15',
      email: 'michael.c@school.edu',
      phone: '+1234567891'
    }
  ];

  // Get today's date
  const today = new Date();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();

  // Generic function to get upcoming birthdays
  const getUpcomingBirthdays = (people) => {
    return people.filter(person => {
      const dob = new Date(person.dateOfBirth);
      const birthMonth = dob.getMonth();
      const birthDate = dob.getDate();

      // Calculate days until birthday
      const currentYear = today.getFullYear();
      let nextBirthday = new Date(currentYear, birthMonth, birthDate);

      if (nextBirthday < today) {
        nextBirthday = new Date(currentYear + 1, birthMonth, birthDate);
      }

      const daysUntil = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

      return daysUntil > 0 && daysUntil <= 30;
    }).sort((a, b) => {
      const dobA = new Date(a.dateOfBirth);
      const dobB = new Date(b.dateOfBirth);

      const currentYear = today.getFullYear();
      let nextBirthdayA = new Date(currentYear, dobA.getMonth(), dobA.getDate());
      let nextBirthdayB = new Date(currentYear, dobB.getMonth(), dobB.getDate());

      if (nextBirthdayA < today) nextBirthdayA = new Date(currentYear + 1, dobA.getMonth(), dobA.getDate());
      if (nextBirthdayB < today) nextBirthdayB = new Date(currentYear + 1, dobB.getMonth(), dobB.getDate());

      return nextBirthdayA - nextBirthdayB;
    });
  };

  // Get today's birthdays
  const getTodaysBirthdays = (people) => {
    return people.filter(person => {
      const dob = new Date(person.dateOfBirth);
      return dob.getMonth() === todayMonth && dob.getDate() === todayDate;
    });
  };

  const todaysStudentBirthdays = getTodaysBirthdays(students);
  const todaysFacultyBirthdays = getTodaysBirthdays(faculty);
  const todaysBirthdays = [...todaysStudentBirthdays, ...todaysFacultyBirthdays];

  const upcomingStudentBirthdays = getUpcomingBirthdays(students);
  const upcomingFacultyBirthdays = getUpcomingBirthdays(faculty);
  const upcomingBirthdays = [...upcomingStudentBirthdays, ...upcomingFacultyBirthdays];

  // Calculate age
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Calculate days until birthday
  const daysUntilBirthday = (dob) => {
    const birthDate = new Date(dob);
    const currentYear = today.getFullYear();
    let nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());

    if (nextBirthday < today) {
      nextBirthday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate());
    }

    const daysUntil = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
    return daysUntil;
  };

  // Filter based on active tab
  const getFilteredTodaysBirthdays = () => {
    if (activeTab === 'students') return todaysStudentBirthdays;
    if (activeTab === 'faculty') return todaysFacultyBirthdays;
    return todaysBirthdays;
  };

  const getFilteredUpcomingBirthdays = () => {
    if (activeTab === 'students') return upcomingStudentBirthdays;
    if (activeTab === 'faculty') return upcomingFacultyBirthdays;
    return upcomingBirthdays;
  };

  const filteredTodaysBirthdays = getFilteredTodaysBirthdays();
  const filteredUpcomingBirthdays = getFilteredUpcomingBirthdays();

  return (
    <div className="admin-layout">
      <Sidebar role="admin" />

      <div className="admin-main">
        <Navbar />

        <div className="admin-content">
          <div className="page-header">
            <div>
              <h1>🎂 Birthday Wishes</h1>
              <p className="text-secondary">Celebrate special days for students and faculty</p>
            </div>
            <div className="birthday-stats">
              <div className="stat-badge gradient-card">
                <Cake size={24} />
                <span className="stat-number">{todaysBirthdays.length}</span>
                <span className="stat-label">Today</span>
              </div>
              <div className="stat-badge-secondary glass-card">
                <Gift size={24} />
                <span className="stat-number">{upcomingBirthdays.length}</span>
                <span className="stat-label">Upcoming</span>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="tabs-container">
              <button
                className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                <PartyPopper size={18} />
                All ({todaysBirthdays.length + upcomingBirthdays.length})
              </button>
              <button
                className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
                onClick={() => setActiveTab('students')}
              >
                <Users size={18} />
                Students ({todaysStudentBirthdays.length + upcomingStudentBirthdays.length})
              </button>
              <button
                className={`tab-btn ${activeTab === 'faculty' ? 'active' : ''}`}
                onClick={() => setActiveTab('faculty')}
              >
                <GraduationCap size={18} />
                Faculty ({todaysFacultyBirthdays.length + upcomingFacultyBirthdays.length})
              </button>
            </div>
          </div>

          {/* Today's Birthdays */}
          {filteredTodaysBirthdays.length > 0 && (
            <div className="birthday-section">
              <div className="section-header">
                <h2>🎉 Today's Birthdays</h2>
                <PartyPopper size={24} className="party-icon" />
              </div>
              <div className="birthday-grid">
                {filteredTodaysBirthdays.map(person => (
                  <div key={person.id} className="birthday-card today">
                    <div className="birthday-card-header">
                      <div className="birthday-badge">🎂 TODAY!</div>
                      <div className={`person-type-badge ${person.role ? 'faculty' : 'student'}`}>
                        {person.role ? '👨‍🏫 Faculty' : '👨‍🎓 Student'}
                      </div>
                    </div>
                    <div className="birthday-avatar-large gradient-card">
                      <Cake size={40} />
                    </div>
                    <h3>{person.name || `${person.firstName} ${person.lastName}`}</h3>
                    <p className="birthday-class">{person.role || person.class}</p>
                    <p className="birthday-age">Turning {calculateAge(person.dateOfBirth) + 1} years old</p>
                    <div className="birthday-info">
                      <div className="info-row">
                        <Mail size={16} />
                        <span>{person.email}</span>
                      </div>
                      <div className="info-row">
                        <Phone size={16} />
                        <span>{person.phone}</span>
                      </div>
                    </div>
                    <button className="wish-btn">
                      <Gift size={16} />
                      Send Wishes
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Birthdays */}
          <div className="birthday-section">
            <div className="section-header">
              <h2>📅 Upcoming Birthdays (Next 30 Days)</h2>
              <Calendar size={24} />
            </div>
            {filteredUpcomingBirthdays.length === 0 ? (
              <div className="empty-state glass-card">
                <Cake size={48} />
                <p>No upcoming birthdays in the next 30 days</p>
              </div>
            ) : (
              <div className="birthday-list">
                {filteredUpcomingBirthdays.map(person => {
                  const days = daysUntilBirthday(person.dateOfBirth);
                  const birthDate = new Date(person.dateOfBirth);
                  return (
                    <div key={person.id} className="birthday-list-item glass-card">
                      <div className="birthday-avatar gradient-card">
                        <Cake size={24} />
                      </div>
                      <div className="birthday-details">
                        <h4>{person.name || `${person.firstName} ${person.lastName}`}</h4>
                        <p className="text-secondary">
                          {person.role ? `👨‍🏫 ${person.role}` : `👨‍🎓 ${person.class}`} • {person.id}
                        </p>
                      </div>
                      <div className="birthday-date-info">
                        <div className="date-badge">
                          <Calendar size={16} />
                          <span>{birthDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                        <p className="days-until">in {days} day{days !== 1 ? 's' : ''}</p>
                      </div>
                      <div className="age-info">
                        <p className="turning-age">Turning {calculateAge(person.dateOfBirth) + 1}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
        }

        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
        }

        .admin-content {
          flex: 1;
          padding: 2rem;
          max-width: 1600px;
          margin: 0 auto;
          width: 100%;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .page-header h1 {
          font-size: 2.5rem;
          margin: 0 0 0.5rem 0;
        }

        .birthday-stats {
          display: flex;
          gap: 1rem;
        }

        .stat-badge {
          padding: 1rem 1.5rem;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          min-width: 120px;
        }

        .stat-badge-secondary {
          padding: 1rem 1.5rem;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          min-width: 120px;
          border: 1px solid var(--glass-border);
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
        }

        .stat-label {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.9);
        }

        .birthday-section {
          margin-bottom: 3rem;
        }

        /* Tab Navigation */
        .tabs-container {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          border-bottom: 2px solid var(--glass-border);
          padding-bottom: 0.5rem;
        }

        .tab-btn {
          background: none;
          border: none;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-radius: var(--radius-md) var(--radius-md) 0 0;
          transition: all 0.3s ease;
          position: relative;
        }

        .tab-btn:hover {
          background: var(--bg-card-hover);
          color: var(--text-primary);
        }

        .tab-btn.active {
          background: var(--primary-gradient);
          color: white;
        }

        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -0.5rem;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--primary-gradient);
        }

        /* Person Type Badge */
        .birthday-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          gap: 0.5rem;
        }

        .person-type-badge {
          padding: 0.375rem 0.75rem;
          border-radius: var(--radius-md);
          font-size: 0.75rem;
          font-weight: 600;
          display: inline-block;
        }

        .person-type-badge.student {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2));
          color: #2563eb;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .person-type-badge.faculty {
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(147, 51, 234, 0.2));
          color: #9333ea;
          border: 1px solid rgba(168, 85, 247, 0.3);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid var(--glass-border);
        }

        .section-header h2 {
          font-size: 1.5rem;
          margin: 0;
        }

        .party-icon {
          color: var(--warning);
          animation: bounce 1s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .birthday-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .birthday-card {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .birthday-card.today {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1));
          border: 2px solid var(--warning);
          box-shadow: 0 0 30px rgba(245, 158, 11, 0.3);
        }

        .birthday-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .birthday-card-header {
          margin-bottom: 1rem;
        }

        .birthday-badge {
          background: var(--warning-gradient);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 700;
          display: inline-block;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .birthday-avatar-large {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }

        .birthday-card h3 {
          margin: 0.5rem 0;
          font-size: 1.5rem;
        }

        .birthday-class {
          color: var(--text-secondary);
          margin: 0.25rem 0;
        }

        .birthday-age {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--primary);
          margin: 0.5rem 0 1rem 0;
        }

        .birthday-info {
          background: var(--bg-card);
          padding: 1rem;
          border-radius: var(--radius-md);
          margin: 1rem 0;
          text-align: left;
        }

        .info-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0.5rem 0;
          font-size: 0.9rem;
        }

        .info-row svg {
          color: var(--primary);
        }

        .wish-btn {
          background: var(--success-gradient);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          transition: all 0.3s ease;
        }

        .wish-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(16, 185, 129, 0.4);
        }

        .birthday-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .birthday-list-item {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          border: 1px solid var(--glass-border);
          transition: all 0.3s ease;
        }

        .birthday-list-item:hover {
          background: var(--bg-card-hover);
          transform: translateX(5px);
        }

        .birthday-avatar {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .birthday-details {
          flex: 1;
        }

        .birthday-details h4 {
          margin: 0 0 0.25rem 0;
          font-size: 1.1rem;
        }

        .birthday-date-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
        }

        .date-badge {
          background: var(--primary-gradient);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .days-until {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .age-info {
          margin-left: 1rem;
          text-align: center;
        }

        .turning-age {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .empty-state {
          padding: 4rem 2rem;
          text-align: center;
          border: 1px solid var(--glass-border);
        }

        .empty-state svg {
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }

        .empty-state p {
          color: var(--text-secondary);
          font-size: 1.1rem;
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
          .admin-content {
            padding: 1rem;
          }

          .page-header {
            flex-direction: column;
            gap: 1rem;
          }

          .page-header h1 {
            font-size: 2rem;
          }

          .birthday-grid {
            grid-template-columns: 1fr;
          }

          .birthday-list-item {
            flex-direction: column;
            text-align: center;
          }

          .birthday-date-info {
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Birthdays;

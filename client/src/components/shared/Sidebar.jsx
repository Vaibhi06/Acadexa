import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  User,
  BookOpen,
  UserCheck,
  FileText,
  DollarSign,
  Calendar,
  Upload,
  ClipboardList,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Home,
  UserPlus,
  ClipboardCheck,
  Mail,
  TrendingUp,
  Cake,
  IdCard,
  BookMarked,
  Settings,
  LogOut,
  ChevronUp,
  Award,
  BarChart3,
  Megaphone
} from 'lucide-react';

const Sidebar = ({ role = 'admin' }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const adminMenuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/notices', icon: Megaphone, label: 'Notice Board' },
    { path: '/admin/classes', icon: BookOpen, label: 'Classes' },
    { path: '/admin/students', icon: Users, label: 'Student Info' },
    { path: '/admin/attendance', icon: UserCheck, label: 'Attendance' },
    { path: '/admin/inquiries', icon: Mail, label: 'Inquiries' },
    { path: '/admin/tasks', icon: ClipboardCheck, label: 'Task Management' },
    { path: '/admin/exams', icon: ClipboardList, label: 'Exam Management' },
    { path: '/admin/materials', icon: BookMarked, label: 'Study Materials' },
    { path: '/admin/timetable', icon: Calendar, label: 'Timetable' },
    { path: '/admin/syllabus', icon: FileText, label: 'Syllabus Maker' },
    { path: '/admin/id-cards', icon: IdCard, label: 'ID Card Generator' },
    { path: '/admin/reports', icon: BarChart3, label: 'Reports' },
    { path: '/admin/marks', icon: Award, label: 'Marks Entry' },
    { path: '/admin/fees', icon: DollarSign, label: 'Fees Management' },
    { path: '/admin/faculty', icon: GraduationCap, label: 'Faculty Management' },
    { path: '/admin/birthdays', icon: Cake, label: 'Birthdays' },
  ];

  const studentMenuItems = [
    { path: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/student/timetable', icon: Calendar, label: 'Timetable' },
    { path: '/student/attendance', icon: UserCheck, label: 'My Attendance' },
    { path: '/student/exams', icon: ClipboardList, label: 'Exams' },
    { path: '/student/materials', icon: BookOpen, label: 'Study Materials' },
    { path: '/student/id-card', icon: IdCard, label: 'Digital ID Card' },
    { path: '/student/reports', icon: TrendingUp, label: 'Academic Reports' },
    { path: '/student/fees', icon: DollarSign, label: 'Fee Payment' },
    { path: '/student/class-info', icon: Users, label: 'Class Information' },
    { path: '/student/syllabus', icon: FileText, label: 'My Syllabus' },
  ];

  const facultyMenuItems = [
    { path: '/faculty/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/faculty/timetable', icon: Calendar, label: 'Timetable' },
    { path: '/faculty/attendance', icon: UserCheck, label: 'My Attendance' },
    { path: '/faculty/mark-attendance', icon: ClipboardCheck, label: 'Mark Attendance' },
    { path: '/faculty/exams', icon: ClipboardList, label: 'Exams' },
    { path: '/faculty/materials', icon: BookOpen, label: 'Study Materials' },
    { path: '/faculty/salary', icon: DollarSign, label: 'Salary' },
    { path: '/faculty/syllabus', icon: FileText, label: 'Syllabus View' },
  ];

  const menuItems = role === 'admin' ? adminMenuItems :
    role === 'student' ? studentMenuItems : facultyMenuItems;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSettings = () => {
    // Navigate to settings page based on role
    if (role === 'admin') {
      navigate('/admin/settings');
    } else if (role === 'student') {
      navigate('/student/settings');
    } else {
      navigate('/faculty/settings');
    }
    setShowProfileMenu(false);
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon gradient-card">
              <GraduationCap size={collapsed ? 24 : 32} />
            </div>
            {!collapsed && (
              <div className="logo-text">
                <h3>Acadexa</h3>
                <p>{role}</p>
              </div>
            )}
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              title={collapsed ? item.label : ''}
              onClick={() => setMobileOpen(false)}
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Profile Section */}
        <div className="sidebar-profile">
          {showProfileMenu && !collapsed && (
            <div className="profile-menu">
              <button className="profile-menu-item" onClick={() => { navigate(`/${role}/profile`); setShowProfileMenu(false); setMobileOpen(false); }}>
                <User size={18} />
                <span>Profile</span>
              </button>
              <button className="profile-menu-item" onClick={() => { handleSettings(); setMobileOpen(false); }}>
                <Settings size={18} />
                <span>Settings</span>
              </button>
              <button className="profile-menu-item logout-item" onClick={() => { handleLogout(); setMobileOpen(false); }}>
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}

          <button
            className="profile-button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            title={collapsed ? user?.name || 'Profile' : ''}
          >
            <div className="profile-avatar">
              {user?.name?.[0] || 'A'}
            </div>
            {!collapsed && (
              <>
                <div className="profile-info">
                  <p className="profile-name">{user?.name || 'Admin'}</p>
                  <p className="profile-role">{role}</p>
                </div>
                <ChevronUp size={18} className={`profile-chevron ${showProfileMenu ? 'rotated' : ''}`} />
              </>
            )}
          </button>
        </div>

        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        <style>{`
        /* Mobile Menu Toggle */
        .mobile-menu-toggle {
          display: none;
          position: fixed;
          top: 1rem;
          left: 1rem;
          z-index: 1001;
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
          border: none;
          border-radius: 12px;
          color: white;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(254, 163, 190, 0.4);
          transition: all 0.3s ease;
        }

        .mobile-menu-toggle:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(254, 163, 190, 0.5);
        }

        .mobile-menu-toggle:active {
          transform: scale(0.95);
        }

        /* Sidebar Overlay */
        .sidebar-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(2px);
          z-index: 999;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .sidebar {
          width: 280px;
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          background: #ffffff;
          backdrop-filter: blur(10px);
          border-right: 1px solid var(--glass-border);
          display: flex;
          flex-direction: column;
          transition: var(--transition-normal);
          overflow-y: auto;
          z-index: 100;
        }

        .sidebar.collapsed {
          width: 80px;
        }

        .sidebar-header {
          padding: 2rem 1.5rem;
          border-bottom: 1px solid var(--glass-border);
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo-icon {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .collapsed .logo-icon {
          width: 40px;
          height: 40px;
        }

        .logo-text h3 {
          font-size: 1.5rem;
          margin: 0;
          font-weight: 800;
        }

        .logo-text p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin: 0;
          text-transform: capitalize;
        }

        .sidebar-nav {
          flex: 1;
          padding: 1.5rem 0;
          overflow-y: auto;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          color: var(--text-secondary);
          text-decoration: none;
          transition: var(--transition-fast);
          position: relative;
          font-weight: 500;
        }

        .collapsed .sidebar-link {
          justify-content: center;
          padding: 1rem;
        }

        .collapsed .sidebar-link span {
          display: none;
        }

        .sidebar-link::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 0;
          background: var(--primary-gradient);
          border-radius: 0 4px 4px 0;
          transition: var(--transition-fast);
        }

        .sidebar-link:hover {
          color: var(--text-primary);
          background: var(--bg-card-hover);
        }

        .sidebar-link:hover::before {
          height: 60%;
        }

        .sidebar-link.active {
          color: var(--primary);
          background: var(--bg-card-hover);
        }

        .sidebar-link.active::before {
          height: 80%;
        }

        /* Profile Section */
        .sidebar-profile {
          position: relative;
          padding: 0 1rem 1rem;
          border-top: 1px solid var(--glass-border);
        }

        .profile-menu {
          position: absolute;
          bottom: 100%;
          left: 1rem;
          right: 1rem;
          background: white;
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          padding: 0.5rem;
          margin-bottom: 0.5rem;
          animation: slideUp 0.2s ease-out;
          z-index: 10;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .profile-menu-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          background: none;
          border: none;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .profile-menu-item:hover {
          background: var(--bg-card-hover);
          color: var(--text-primary);
        }

        .profile-menu-item.logout-item {
          color: #ef4444;
        }

        .profile-menu-item.logout-item:hover {
          background: #fef2f2;
          color: #dc2626;
        }

        .profile-button {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 1rem;
        }

        .collapsed .profile-button {
          justify-content: center;
          padding: 0.75rem;
        }

        .profile-button:hover {
          background: var(--bg-card-hover);
          border-color: var(--primary);
        }

        .profile-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1e40af, #1e3a8a);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          flex-shrink: 0;
        }

        .profile-info {
          flex: 1;
          text-align: left;
        }

        .profile-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 0.125rem 0;
        }

        .profile-role {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin: 0;
          text-transform: capitalize;
        }

        .profile-chevron {
          color: var(--text-secondary);
          transition: transform 0.2s ease;
        }

        .profile-chevron.rotated {
          transform: rotate(180deg);
        }

        .sidebar-toggle {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
          padding: 0.75rem;
          margin: 0 1rem 1rem;
          color: var(--text-primary);
          cursor: pointer;
          transition: var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sidebar-toggle:hover {
          background: var(--bg-card-hover);
          border-color: var(--primary);
        }

        @media (max-width: 1024px) {
          .mobile-menu-toggle {
            display: flex;
          }

          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            z-index: 1000;
            transform: translateX(-100%);
            box-shadow: 2px 0 16px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
          }

          .sidebar.open {
            transform: translateX(0);
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 240px;
          }
        }
      `}</style>
      </aside>
    </>
  );
};

export default Sidebar;

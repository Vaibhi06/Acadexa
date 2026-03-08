import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AttendanceProvider } from './contexts/AttendanceContext';
import { StudentsProvider } from './contexts/StudentsContext';
import { ClassesProvider } from './contexts/ClassesContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Shared Components
import Login from './components/shared/Login';

// Admin Components
import AdminDashboard from './components/admin/Dashboard';
import ClassManagement from './components/admin/ClassManagement';
import AllStudents from './components/admin/AllStudents';
import AddStudent from './components/admin/AddStudent';
import FacultyManagement from './components/admin/FacultyManagement';
import AttendanceManagement from './components/admin/AttendanceManagement';
import ExamsManagement from './components/admin/ExamsManagement';
import MarksEntry from './components/admin/MarksEntry';
import FeesManagement from './components/admin/FeesManagement';
import Reports from './components/admin/Reports';
import InquiriesManagement from './components/admin/InquiriesManagement';
import TimetableManagement from './components/admin/TimetableManagement';
import StudyMaterials from './components/admin/StudyMaterials';
import AdminNoticeBoard from './components/admin/NoticeBoard';
import Birthdays from './components/admin/Birthdays';
import SyllabusManagement from './components/admin/SyllabusManagement';
import TasksManagement from './components/admin/TasksManagement';
import IdCardGenerator from './components/admin/IdCardGenerator';
import IncomeDashboard from './components/admin/IncomeDashboard';
import IncomeSheet from './components/admin/IncomeSheet';
import ExpenseSheet from './components/admin/ExpenseSheet';
import QuickAccess from './components/admin/QuickAccess';
import AdminProfile from './components/admin/AdminProfile';
import StudentProfilePage from './components/admin/StudentProfile';
import FacultyProfilePage from './components/admin/FacultyProfile';
import AdminSettings from './components/admin/Settings';

// Student Components
import StudentDashboard from './components/student/Dashboard';
import StudentProfile from './components/student/Profile';
import StudentTimetable from './components/student/Timetable';
import StudentAttendance from './components/student/MyAttendance';
import StudentExams from './components/student/Exams';
import StudentMaterials from './components/student/Materials';
import StudentFees from './components/student/Fees';
import StudentReports from './components/student/Reports';
import StudentClassInfo from './components/student/ClassInfo';
import StudentNoticeBoard from './components/student/NoticeBoard';
import StudentSettings from './components/student/Settings';
import StudentIdCard from './components/student/IdCard';
import StudentBirthdays from './components/student/Birthdays';
import StudentSyllabus from './components/student/Syllabus';

// Faculty Components
import FacultyDashboard from './components/faculty/Dashboard';
import FacultyProfile from './components/faculty/Profile';
import FacultyAttendance from './components/faculty/MyAttendance';
import MarkAttendance from './components/faculty/MarkAttendance';
import FacultyExams from './components/faculty/Exams';
import FacultyMaterials from './components/faculty/StudyMaterials';
import FacultyTimetable from './components/faculty/Timetable';
import FacultySalary from './components/faculty/Salary';
import FacultyBirthdays from './components/faculty/Birthdays';
import FacultySyllabus from './components/faculty/Syllabus';

import './styles/index.css';
import './styles/premium-effects.css';
import './styles/admin-layout.css';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Placeholder for features still in development
const PlaceholderPage = ({ title }) => (
  <div className="flex-center" style={{ minHeight: '100vh' }}>
    <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
      <h1>{title}</h1>
      <p className="text-secondary">This feature will be added soon</p>
    </div>
  </div>
);

function AppContent() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Public Route */}
      <Route
        path="/"
        element={<Login />}
      />

      {/* ========== ADMIN ROUTES ========== */}
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/quick-access" element={<ProtectedRoute allowedRole="admin"><QuickAccess /></ProtectedRoute>} />
      <Route path="/admin/classes" element={<ProtectedRoute allowedRole="admin"><ClassManagement /></ProtectedRoute>} />
      <Route path="/admin/students" element={<ProtectedRoute allowedRole="admin"><AllStudents /></ProtectedRoute>} />
      <Route path="/admin/add-student" element={<ProtectedRoute allowedRole="admin"><AddStudent /></ProtectedRoute>} />
      <Route path="/admin/attendance" element={<ProtectedRoute allowedRole="admin"><AttendanceManagement /></ProtectedRoute>} />
      <Route path="/admin/profile" element={<ProtectedRoute allowedRole="admin"><AdminProfile /></ProtectedRoute>} />
      <Route path="/admin/students/:id" element={<ProtectedRoute allowedRole="admin"><StudentProfilePage /></ProtectedRoute>} />
      <Route path="/admin/faculty/:id" element={<ProtectedRoute allowedRole="admin"><FacultyProfilePage /></ProtectedRoute>} />
      <Route path="/admin/faculty" element={<ProtectedRoute allowedRole="admin"><FacultyManagement /></ProtectedRoute>} />
      <Route path="/admin/exams" element={<ProtectedRoute allowedRole="admin"><ExamsManagement /></ProtectedRoute>} />
      <Route path="/admin/marks" element={<ProtectedRoute allowedRole="admin"><MarksEntry /></ProtectedRoute>} />
      <Route path="/admin/fees" element={<ProtectedRoute allowedRole="admin"><FeesManagement /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute allowedRole="admin"><Reports /></ProtectedRoute>} />
      <Route path="/admin/inquiries" element={<ProtectedRoute allowedRole="admin"><InquiriesManagement /></ProtectedRoute>} />
      <Route path="/admin/timetable" element={<ProtectedRoute allowedRole="admin"><TimetableManagement /></ProtectedRoute>} />
      <Route path="/admin/notices" element={<ProtectedRoute allowedRole="admin"><AdminNoticeBoard /></ProtectedRoute>} />
      <Route path="/admin/materials" element={<ProtectedRoute allowedRole="admin"><StudyMaterials /></ProtectedRoute>} />
      <Route path="/admin/syllabus" element={<ProtectedRoute allowedRole="admin"><SyllabusManagement /></ProtectedRoute>} />
      <Route path="/admin/tasks" element={<ProtectedRoute allowedRole="admin"><TasksManagement /></ProtectedRoute>} />
      <Route path="/admin/id-cards" element={<ProtectedRoute allowedRole="admin"><IdCardGenerator /></ProtectedRoute>} />
      <Route path="/admin/income" element={<ProtectedRoute allowedRole="admin"><IncomeDashboard /></ProtectedRoute>} />
      <Route path="/admin/income-sheet" element={<ProtectedRoute allowedRole="admin"><IncomeSheet /></ProtectedRoute>} />
      <Route path="/admin/expense-sheet" element={<ProtectedRoute allowedRole="admin"><ExpenseSheet /></ProtectedRoute>} />
      <Route path="/admin/birthdays" element={<ProtectedRoute allowedRole="admin"><Birthdays /></ProtectedRoute>} />
      <Route path="/admin/faculty" element={<ProtectedRoute allowedRole="admin"><FacultyManagement /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute allowedRole="admin"><AdminSettings /></ProtectedRoute>} />

      {/* ========== STUDENT ROUTES ========== */}
      <Route path="/student/dashboard" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/profile" element={<ProtectedRoute allowedRole="student"><StudentProfile /></ProtectedRoute>} />
      <Route path="/student/timetable" element={<ProtectedRoute allowedRole="student"><StudentTimetable /></ProtectedRoute>} />
      <Route path="/student/attendance" element={<ProtectedRoute allowedRole="student"><StudentAttendance /></ProtectedRoute>} />
      <Route path="/student/exams" element={<ProtectedRoute allowedRole="student"><StudentExams /></ProtectedRoute>} />
      <Route path="/student/materials" element={<ProtectedRoute allowedRole="student"><StudentMaterials /></ProtectedRoute>} />
      <Route path="/student/fees" element={<ProtectedRoute allowedRole="student"><StudentFees /></ProtectedRoute>} />
      <Route path="/student/reports" element={<ProtectedRoute allowedRole="student"><StudentReports /></ProtectedRoute>} />
      <Route path="/student/class-info" element={<ProtectedRoute allowedRole="student"><StudentClassInfo /></ProtectedRoute>} />
      <Route path="/student/syllabus" element={<ProtectedRoute allowedRole="student"><StudentSyllabus /></ProtectedRoute>} />
      <Route path="/student/notices" element={<ProtectedRoute allowedRole="student"><StudentNoticeBoard /></ProtectedRoute>} />
      <Route path="/student/settings" element={<ProtectedRoute allowedRole="student"><StudentSettings /></ProtectedRoute>} />
      <Route path="/student/id-card" element={<ProtectedRoute allowedRole="student"><StudentIdCard /></ProtectedRoute>} />
      <Route path="/student/birthdays" element={<ProtectedRoute allowedRole="student"><StudentBirthdays /></ProtectedRoute>} />

      {/* ========== FACULTY ROUTES ========== */}
      <Route path="/faculty/dashboard" element={<ProtectedRoute allowedRole="faculty"><FacultyDashboard /></ProtectedRoute>} />
      <Route path="/faculty/profile" element={<ProtectedRoute allowedRole="faculty"><FacultyProfile /></ProtectedRoute>} />
      <Route path="/faculty/students" element={<ProtectedRoute allowedRole="faculty"><AllStudents /></ProtectedRoute>} />
      <Route path="/faculty/add-student" element={<ProtectedRoute allowedRole="faculty"><AddStudent /></ProtectedRoute>} />
      <Route path="/faculty/attendance" element={<ProtectedRoute allowedRole="faculty"><FacultyAttendance /></ProtectedRoute>} />
      <Route path="/faculty/mark-attendance" element={<ProtectedRoute allowedRole="faculty"><MarkAttendance /></ProtectedRoute>} />
      <Route path="/faculty/exams" element={<ProtectedRoute allowedRole="faculty"><FacultyExams /></ProtectedRoute>} />
      <Route path="/faculty/materials" element={<ProtectedRoute allowedRole="faculty"><FacultyMaterials /></ProtectedRoute>} />
      <Route path="/faculty/timetable" element={<ProtectedRoute allowedRole="faculty"><FacultyTimetable /></ProtectedRoute>} />
      <Route path="/faculty/salary" element={<ProtectedRoute allowedRole="faculty"><FacultySalary /></ProtectedRoute>} />
      <Route path="/faculty/birthdays" element={<ProtectedRoute allowedRole="faculty"><FacultyBirthdays /></ProtectedRoute>} />
      <Route path="/faculty/syllabus" element={<ProtectedRoute allowedRole="faculty"><FacultySyllabus /></ProtectedRoute>} />

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <StudentsProvider>
            <ClassesProvider>
              <AttendanceProvider>
                <AppContent />
              </AttendanceProvider>
            </ClassesProvider>
          </StudentsProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../shared/Sidebar';
import { CheckSquare, GraduationCap, Upload, Calendar, ArrowRight, BookOpen } from 'lucide-react';

const QuickAccess = () => {
  const navigate = useNavigate();

  const quickAccessItems = [
    {
      icon: CheckSquare,
      title: 'Tasks Management',
      description: 'Create and maintain your daily tasks',
      color: '#FEA3BE',
      bgColor: '#FFE9F1',
      path: '/admin/tasks'
    },
    {
      icon: GraduationCap,
      title: 'Exams Management',
      description: 'Create and manage examinations',
      color: '#FBA2AB',
      bgColor: '#FFE5E9',
      path: '/admin/exams'
    },
    {
      icon: Upload,
      title: 'Study Materials',
      description: 'Upload and manage study materials',
      color: '#FFDFC3',
      bgColor: '#FFF5EB',
      path: '/admin/materials'
    },
    {
      icon: Calendar,
      title: 'Timetable',
      description: 'Manage class schedules and timetables',
      color: '#F3B5A0',
      bgColor: '#FFE7DC',
      path: '/admin/timetable'
    },
    {
      icon: BookOpen,
      title: 'Syllabus Maker',
      description: 'Plan and track academic syllabus',
      color: '#A0C4FF',
      bgColor: '#E6F0FF',
      path: '/admin/syllabus'
    }
  ];

  return (
    <div className="admin-layout">
      <Sidebar role="admin" />

      <div className="admin-main">
        <div className="admin-content">
          <div className="page-header">
            <div>
              <h1>Quick Access</h1>
              <p className="text-secondary">Fast access to frequently used features</p>
            </div>
          </div>

          <div className="quick-access-grid">
            {quickAccessItems.map((item, idx) => (
              <div
                key={idx}
                className="quick-access-card"
                onClick={() => navigate(item.path)}
              >
                <div className="qa-icon-wrapper" style={{ background: item.bgColor }}>
                  <item.icon size={40} style={{ color: item.color }} />
                </div>
                <div className="qa-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <button className="qa-button">
                  Go to {item.title.split(' ')[0]}
                  <ArrowRight size={18} />
                </button>
              </div>
            ))}
          </div>
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
          padding: 2rem;
          max-width: 1600px;
          margin: 0 auto;
          width: 100%;
        }

        .page-header {
          margin-bottom: 2.5rem;
        }

        .page-header h1 {
          font-size: 2rem;
          margin: 0 0 0.5rem 0;
          color: #000000;
          font-weight: 700;
        }

        .text-secondary {
          color: #000000;
          font-size: 1rem;
          margin: 0;
        }

        .quick-access-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }

        .quick-access-card {
          background: white;
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .quick-access-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(254, 163, 190, 0.15);
          border-color: #FEA3BE;
        }

        .qa-icon-wrapper {
          width: 100px;
          height: 100px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          transition: all 0.3s ease;
        }

        .quick-access-card:hover .qa-icon-wrapper {
          transform: scale(1.1);
        }

        .qa-content {
          margin-bottom: 2rem;
        }

        .qa-content h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #000000;
          margin: 0 0 0.75rem 0;
        }

        .qa-content p {
          font-size: 1rem;
          color: #000000;
          margin: 0;
          line-height: 1.6;
        }

        .qa-button {
          background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
          color: white;
          border: none;
          padding: 0.875rem 2rem;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
        }

        .qa-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(254, 163, 190, 0.3);
        }

        @media (max-width: 768px) {
          .admin-content {
            padding: 1rem;
          }

          .quick-access-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .quick-access-card {
            padding: 2rem;
          }

          .qa-icon-wrapper {
            width: 80px;
            height: 80px;
          }
        }
      `}</style>
    </div>
  );
};

export default QuickAccess;

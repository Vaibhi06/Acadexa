import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Empty navbar - all navigation in sidebar */}
      </div>

      <style>{`
        .navbar {
          background: var(--glass-bg);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--glass-border);
          padding: 1.25rem 2rem;
          position: sticky;
          top: 0;
          z-index: 100;
          min-height: 70px;
        }

        .navbar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1600px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 1rem;
            min-height: 60px;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;

import React from 'react';

const StatCard = ({ icon: Icon, title, value, trend, color = 'primary' }) => {
    const gradients = {
        primary: 'var(--primary-gradient)',
        secondary: 'var(--secondary-gradient)',
        success: 'var(--success-gradient)',
        warning: 'var(--warning-gradient)',
    };

    return (
        <div className="stat-card glass-card hover-lift animate-fadeIn">
            <div className="stat-icon" style={{ background: gradients[color] }}>
                <Icon size={28} />
            </div>
            <div className="stat-content">
                <p className="stat-title">{title}</p>
                <h3 className="stat-value">{value}</h3>
                {trend && (
                    <p className={`stat-trend ${trend.positive ? 'positive' : 'negative'}`}>
                        {trend.value}
                    </p>
                )}
            </div>

            <style>{`
        .stat-card {
          padding: 1.5rem;
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
          box-shadow: var(--shadow-md);
        }

        .stat-content {
          flex: 1;
        }

        .stat-title {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin: 0 0 0.5rem 0;
          font-weight: 500;
        }

        .stat-value {
          font-size: 2rem;
          margin: 0 0 0.25rem 0;
          font-weight: 800;
        }

        .stat-trend {
          font-size: 0.85rem;
          font-weight: 600;
        }

        .stat-trend.positive {
          color: var(--success);
        }

        .stat-trend.negative {
          color: var(--danger);
        }
      `}</style>
        </div>
    );
};

export default StatCard;

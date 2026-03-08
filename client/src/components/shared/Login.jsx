import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, GraduationCap, Users, BookOpen, BarChart } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLogin) {
      const result = await login(email, password);

      if (result.success) {
        const userRole = result.user.role;
        if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else if (userRole === 'student') {
          navigate('/student/dashboard');
        } else if (userRole === 'faculty') {
          navigate('/faculty/dashboard');
        }
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } else {
      // Signup with backend API
      const result = await signup(email, password, role);

      if (result.success) {
        // Auto-navigate based on role after successful signup
        const userRole = result.user.role;
        if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else if (userRole === 'student') {
          navigate('/student/dashboard');
        } else if (userRole === 'faculty') {
          navigate('/faculty/dashboard');
        }
      } else {
        setError(result.error || 'Signup failed. Please try again.');
      }
    }

    setLoading(false);
  };

  return (
    <div className="modern-auth-page">
      {/* Left Section - White Background with Form */}
      <div className="modern-auth-left">
        <div className="modern-auth-container">
          {/* Logo */}
          <div className="modern-logo">
            <div className="logo-icon">
              <GraduationCap size={32} />
            </div>
            <span className="logo-name">Acadexa</span>
          </div>

          {/* Header */}
          <div className="modern-auth-header">
            <h1>{isLogin ? 'Log in to your Account' : 'Create your Account'}</h1>
            <p>{isLogin ? 'Welcome back! Select method to log in:' : 'Join us today! Fill in your details:'}</p>
          </div>

          {/* Social Login Buttons */}
          <div className="social-buttons">
            <button className="social-btn google-btn" type="button">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button className="social-btn facebook-btn" type="button">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>

          <div className="divider">
            <span>or continue with email</span>
          </div>

          {/* Login/Signup Form */}
          <form onSubmit={handleSubmit} className="modern-auth-form">
            {error && (
              <div className="modern-error-alert">
                {error}
              </div>
            )}

            {!isLogin && (
              <div className="modern-form-group">
                <div className="input-wrapper">
                  <Mail className="input-icon" size={20} />
                  <input
                    type="text"
                    className="modern-input"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="modern-form-group">
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  className="modern-input"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="modern-form-group">
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="modern-input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="modern-form-group">
                <div className="input-wrapper">
                  <Users className="input-icon" size={20} />
                  <select
                    className="modern-input modern-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                  </select>
                </div>
              </div>
            )}

            {isLogin && (
              <div className="form-extras">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-password">Forgot Password?</a>
              </div>
            )}

            <button type="submit" className="modern-submit-btn" disabled={loading}>
              {loading ? (
                <div className="modern-spinner"></div>
              ) : (
                isLogin ? 'Log in' : 'Sign up'
              )}
            </button>
          </form>

          <div className="auth-switch">
            <span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
            <button
              type="button"
              className="switch-btn"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
            >
              {isLogin ? 'Create an account' : 'Log in'}
            </button>
          </div>

          {/* Demo Credentials (only for login) */}
          {isLogin && (
            <div className="demo-info">
              <p className="demo-text">Demo: student@acadexa.com / faculty@acadexa.com (password: any)</p>
            </div>
          )}
        </div>
      </div>



      <style>{`
        .modern-auth-page {
          display: flex;
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #f8fafc;
          align-items: center;
          justify-content: center;
        }

        /* LEFT SECTION - WHITE FORM */
        .modern-auth-left {
          width: 100%;
          max-width: 580px;
          padding: 2rem;
          background: transparent;
        }

        .modern-auth-container {
          width: 100%;
          background: white;
          padding: 2.5rem;
          border-radius: 20px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Logo */
        .modern-logo {
          display: flex;
          align-items: center;
          justify-content: center; /* Centered */
          gap: 0.75rem;
          margin-bottom: 3rem;
        }

        .logo-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .logo-name {
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Header */
        .modern-auth-header {
          margin-bottom: 2rem;
          text-align: center; /* Centered */
        }

        .modern-auth-header h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #000000;
          margin-bottom: 0.5rem;
          background: none;
          -webkit-text-fill-color: #000000;
        }

        .modern-auth-header p {
          font-size: 0.95rem;
          color: #000000;
        }

        /* Social Buttons */
        .social-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          background: white;
          color: #334155;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .social-btn:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
          transform: translateY(-1px);
        }

        .social-btn svg {
          flex-shrink: 0;
        }

        /* Divider */
        .divider {
          position: relative;
          text-align: center;
          margin: 1.5rem 0;
        }

        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #e2e8f0;
        }

        .divider span {
          position: relative;
          background: white;
          padding: 0 1rem;
          font-size: 0.875rem;
          color: #94a3b8;
        }

        /* Form */
        .modern-auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .modern-error-alert {
          padding: 0.875rem 1rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          color: #dc2626;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .modern-form-group {
          position: relative;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          color: #94a3b8;
          pointer-events: none;
        }

        .modern-input {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 3rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.95rem;
          color: #000000;
          background: white;
          transition: all 0.2s ease;
          font-family: 'Inter', sans-serif;
        }

        .modern-input:focus {
          outline: none;
          border-color: #FEA3BE;
          box-shadow: 0 0 0 3px rgba(254, 163, 190, 0.1);
        }

        .modern-input::placeholder {
          color: #cbd5e1;
        }

        .modern-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M5 7.5L10 12.5L15 7.5' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          padding-right: 3rem;
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          transition: color 0.2s ease;
        }

        .password-toggle:hover {
          color: #000000;
        }

        /* Form Extras */
        .form-extras {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: -0.5rem;
        }

        .remember-me {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #000000;
          cursor: pointer;
        }

        .remember-me input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: #1e40af;
        }

        .forgot-password {
          font-size: 0.875rem;
          color: #FEA3BE;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .forgot-password:hover {
          color: #FEA3BE;
        }

        /* Submit Button */
        .modern-submit-btn {
          padding: 1rem;
          background: linear-gradient(135deg, #FEA3BE, #FBA2AB);
          border: none;
          border-radius: 10px;
          color: white;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 0.5rem;
          box-shadow: 0 4px 12px rgba(254, 163, 190, 0.4);
        }

        .modern-submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .modern-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .modern-spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Auth Switch */
        .auth-switch {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.95rem;
          color: #000000;
        }

        .switch-btn {
          background: none;
          border: none;
          color: #FEA3BE;
          font-weight: 600;
          cursor: pointer;
          margin-left: 0.5rem;
          transition: color 0.2s ease;
        }

        .switch-btn:hover {
          color: #FEA3BE;
          text-decoration: underline;
        }

        /* Demo Info */
        .demo-info {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
        }

        .demo-text {
          font-size: 0.85rem;
          text-align: center;
          line-height: 1.5;
        }













        /* Responsive */


        @media (max-width: 640px) {
          .modern-auth-page {
            background: white;
          }

          .modern-auth-left {
            padding: 2rem 1.5rem;
          }

          .social-buttons {
            grid-template-columns: 1fr;
          }

          .modern-auth-header h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;

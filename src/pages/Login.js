import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/', { replace: true });
    });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .login-page {
          min-height: 100vh;
          background: #0B1F3A;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          padding: 24px;
        }
        .login-card {
          background: #fff;
          border-radius: 16px;
          padding: 48px 44px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.3);
        }
        .login-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 32px;
        }
        .login-brand__logo {
          background: #C9A84C;
          color: #0B1F3A;
          font-weight: 700;
          font-size: 13px;
          padding: 5px 10px;
          border-radius: 6px;
          letter-spacing: 1px;
        }
        .login-brand__name { color: #0B1F3A; font-size: 15px; font-weight: 600; }
        .login-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          color: #0B1F3A;
          margin-bottom: 8px;
        }
        .login-subtitle {
          font-size: 14px;
          color: #6B7280;
          margin-bottom: 32px;
          line-height: 1.5;
        }
        .login-form { display: flex; flex-direction: column; gap: 16px; }
        .login-group { display: flex; flex-direction: column; gap: 6px; }
        .login-group label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #6B7280;
          transition: color 0.2s;
        }
        .login-group.focused label { color: #0B1F3A; }
        .login-group input {
          background: #F5F4F0;
          border: 1px solid #DDD9CE;
          border-radius: 8px;
          padding: 12px 14px;
          color: #0B1F3A;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          width: 100%;
        }
        .login-group input:focus {
          border-color: #C9A84C;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(201,168,76,0.15);
        }
        .login-error {
          background: rgba(220,38,38,0.07);
          border: 1px solid rgba(220,38,38,0.25);
          border-radius: 8px;
          padding: 11px 14px;
          font-size: 13px;
          color: #DC2626;
        }
        .login-btn {
          padding: 13px 28px;
          background: #C9A84C;
          color: #0B1F3A;
          border: none;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          margin-top: 4px;
          transition: background 0.2s, transform 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .login-btn:hover:not(:disabled) { background: #F0D080; transform: translateY(-1px); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .login-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(11,31,58,0.2);
          border-top-color: #0B1F3A;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .login-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 4px 0;
        }
        .login-divider::before,
        .login-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #F0EDE6;
        }
        .login-divider span {
          font-size: 12px;
          color: #9CA3AF;
        }
        .login-btn--outline {
          padding: 13px 28px;
          background: transparent;
          color: #0B1F3A;
          border: 1.5px solid #DDD9CE;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          transition: border-color 0.2s, background 0.2s;
          text-align: center;
          text-decoration: none;
          display: block;
        }
        .login-btn--outline:hover { border-color: #C9A84C; background: rgba(201,168,76,0.05); }
        .login-footer {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #F0EDE6;
          text-align: center;
          font-size: 12px;
          color: #9CA3AF;
          line-height: 1.6;
        }
        @media (max-width: 480px) { .login-card { padding: 36px 24px; } }
      `}</style>

      <div className="login-page">
        <div className="login-card">
          <div className="login-brand">
            <span className="login-brand__logo">ALG</span>
            <span className="login-brand__name">Credit Committee</span>
          </div>
          <h1 className="login-title">Member Login</h1>
          <p className="login-subtitle">
            Authorized creditors and committee members only.
            Access is monitored and logged.
          </p>
          <form className="login-form" onSubmit={handleLogin}>
            <div className={`login-group ${focused === 'email' ? 'focused' : ''}`}>
              <label htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused('')}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
            <div className={`login-group ${focused === 'password' ? 'focused' : ''}`}>
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused('')}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
            {error && <div className="login-error">⚠ {error}</div>}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? <><div className="login-spinner" /> Signing in...</> : 'Sign In'}
            </button>

            <div className="login-divider"><span>or</span></div>

            <a href="/request-access" className="login-btn--outline">
              Request Access
            </a>
          </form>

          <div className="login-footer">
            Access issues? Contact your committee administrator.<br />
            <strong style={{ color: '#0B1F3A' }}>committee@algcommittee.com</strong>
          </div>
        </div>
      </div>
    </>
  );
}
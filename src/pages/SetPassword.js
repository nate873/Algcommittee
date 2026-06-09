import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function SetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenHash = params.get('token_hash');
    const type = params.get('type');

    if (tokenHash && (type === 'invite' || type === 'recovery')) {
      supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: type === 'invite' ? 'invite' : 'recovery',
      }).then(({ error }) => {
        if (error) {
          setError('Invalid or expired invite link. Please request a new one.');
        }
        setReady(true);
      });
    } else {
      // Check if already signed in (e.g. password recovery flow)
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setReady(true);
        } else {
          setError('Invalid or expired invite link. Please request a new one.');
          setReady(true);
        }
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }

    setLoading(true);
    setError('');

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .sp-page {
          min-height: 100vh;
          background: #0B1F3A;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          padding: 24px;
        }
        .sp-card {
          background: #fff;
          border-radius: 16px;
          padding: 48px 44px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.3);
        }
        .sp-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 32px;
        }
        .sp-brand__logo {
          background: #C9A84C;
          color: #0B1F3A;
          font-weight: 700;
          font-size: 13px;
          padding: 5px 10px;
          border-radius: 6px;
          letter-spacing: 1px;
        }
        .sp-brand__name { color: #0B1F3A; font-size: 15px; font-weight: 600; }
        .sp-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          color: #0B1F3A;
          margin-bottom: 8px;
        }
        .sp-subtitle {
          font-size: 14px;
          color: #6B7280;
          margin-bottom: 32px;
          line-height: 1.5;
        }
        .sp-form { display: flex; flex-direction: column; gap: 16px; }
        .sp-group { display: flex; flex-direction: column; gap: 6px; }
        .sp-group label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #6B7280;
          transition: color 0.2s;
        }
        .sp-group.focused label { color: #0B1F3A; }
        .sp-group input {
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
        .sp-group input:focus {
          border-color: #C9A84C;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(201,168,76,0.15);
        }
        .sp-hint {
          font-size: 11px;
          color: #9CA3AF;
          margin-top: 2px;
        }
        .sp-error {
          background: rgba(220,38,38,0.07);
          border: 1px solid rgba(220,38,38,0.25);
          border-radius: 8px;
          padding: 11px 14px;
          font-size: 13px;
          color: #DC2626;
        }
        .sp-btn {
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
        .sp-btn:hover:not(:disabled) { background: #F0D080; transform: translateY(-1px); }
        .sp-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .sp-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(11,31,58,0.2);
          border-top-color: #0B1F3A;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .sp-waiting {
          text-align: center;
          padding: 20px 0;
          color: #6B7280;
          font-size: 14px;
        }
        .sp-back {
          text-align: center;
          margin-top: 20px;
          font-size: 13px;
          color: #6B7280;
        }
        .sp-back a {
          color: #0B1F3A;
          font-weight: 600;
          text-decoration: none;
        }
        .sp-back a:hover { text-decoration: underline; }
        @media (max-width: 480px) { .sp-card { padding: 36px 24px; } }
      `}</style>

      <div className="sp-page">
        <div className="sp-card">
          <div className="sp-brand">
            <span className="sp-brand__logo">ALG</span>
            <span className="sp-brand__name">Credit Committee</span>
          </div>

          {!ready ? (
            <div className="sp-waiting">
              <div className="sp-spinner" style={{ margin: '0 auto 16px', width: 28, height: 28 }} />
              <p>Verifying your invite link...</p>
            </div>
          ) : error && !password ? (
            <div className="sp-waiting">
              <div className="sp-error" style={{ marginBottom: 20 }}>⚠ {error}</div>
              <div className="sp-back">
                <a href="/request-access">Request a new invite</a>
              </div>
            </div>
          ) : (
            <>
              <h1 className="sp-title">Set Your Password</h1>
              <p className="sp-subtitle">
                Welcome! Create a secure password to access the Credit Committee portal.
              </p>
              <form className="sp-form" onSubmit={handleSubmit}>
                <div className={`sp-group ${focused === 'password' ? 'focused' : ''}`}>
                  <label>New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused('')}
                    placeholder="Minimum 8 characters"
                    required
                  />
                  <span className="sp-hint">{password.length}/8 characters minimum</span>
                </div>
                <div className={`sp-group ${focused === 'confirm' ? 'focused' : ''}`}>
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    onFocus={() => setFocused('confirm')}
                    onBlur={() => setFocused('')}
                    placeholder="Re-enter your password"
                    required
                  />
                </div>
                {error && <div className="sp-error">⚠ {error}</div>}
                <button type="submit" className="sp-btn" disabled={loading}>
                  {loading
                    ? <><div className="sp-spinner" /> Setting password...</>
                    : 'Set Password & Sign In'
                  }
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
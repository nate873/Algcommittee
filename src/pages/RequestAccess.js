import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function RequestAccess() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '', email: '', organization: '', reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase
      .from('access_requests')
      .insert([{ ...formData, status: 'pending' }]);

    if (error) {
      setError('Submission failed. Please try again.');
      setLoading(false);
    } else {
      setSubmitted(true);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .ra-page {
          min-height: 100vh;
          background: #0B1F3A;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          padding: 24px;
        }
        .ra-card {
          background: #fff;
          border-radius: 16px;
          padding: 48px 44px;
          width: 100%;
          max-width: 460px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.3);
        }
        .ra-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 32px;
        }
        .ra-brand__logo {
          background: #C9A84C;
          color: #0B1F3A;
          font-weight: 700;
          font-size: 13px;
          padding: 5px 10px;
          border-radius: 6px;
          letter-spacing: 1px;
        }
        .ra-brand__name { color: #0B1F3A; font-size: 15px; font-weight: 600; }
        .ra-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          color: #0B1F3A;
          margin-bottom: 8px;
        }
        .ra-subtitle {
          font-size: 14px;
          color: #6B7280;
          margin-bottom: 32px;
          line-height: 1.5;
        }
        .ra-notice {
          background: rgba(201,168,76,0.08);
          border: 1px solid rgba(201,168,76,0.3);
          border-radius: 8px;
          padding: 12px 14px;
          font-size: 13px;
          color: #92784a;
          margin-bottom: 24px;
          line-height: 1.5;
        }
        .ra-form { display: flex; flex-direction: column; gap: 16px; }
        .ra-group { display: flex; flex-direction: column; gap: 6px; }
        .ra-group label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #6B7280;
          transition: color 0.2s;
        }
        .ra-group.focused label { color: #0B1F3A; }
        .ra-group input,
        .ra-group textarea {
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
          resize: none;
        }
        .ra-group input:focus,
        .ra-group textarea:focus {
          border-color: #C9A84C;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(201,168,76,0.15);
        }
        .ra-error {
          background: rgba(220,38,38,0.07);
          border: 1px solid rgba(220,38,38,0.25);
          border-radius: 8px;
          padding: 11px 14px;
          font-size: 13px;
          color: #DC2626;
        }
        .ra-btn {
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
        .ra-btn:hover:not(:disabled) { background: #F0D080; transform: translateY(-1px); }
        .ra-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .ra-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(11,31,58,0.2);
          border-top-color: #0B1F3A;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .ra-back {
          text-align: center;
          margin-top: 20px;
          font-size: 13px;
          color: #6B7280;
        }
        .ra-back a {
          color: #0B1F3A;
          font-weight: 600;
          text-decoration: none;
        }
        .ra-back a:hover { text-decoration: underline; }
        .ra-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 20px 0;
        }
        .ra-success__icon {
          width: 64px; height: 64px;
          background: #0B1F3A;
          color: #C9A84C;
          border-radius: 50%;
          font-size: 26px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        .ra-success h2 {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          color: #0B1F3A;
          margin-bottom: 10px;
        }
        .ra-success p {
          color: #6B7280;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 28px;
        }
        @media (max-width: 480px) { .ra-card { padding: 36px 24px; } }
      `}</style>

      <div className="ra-page">
        <div className="ra-card">
          <div className="ra-brand">
            <span className="ra-brand__logo">ALG</span>
            <span className="ra-brand__name">Credit Committee</span>
          </div>

          {submitted ? (
            <div className="ra-success">
              <div className="ra-success__icon">✓</div>
              <h2>Request Submitted</h2>
              <p>
                Your access request has been received. The committee
                administrator will review it and you'll receive an email
                at <strong>{formData.email}</strong> once approved.
              </p>
              <button className="ra-btn" onClick={() => navigate('/login')}>
                Back to Login
              </button>
            </div>
          ) : (
            <>
              <h1 className="ra-title">Request Access</h1>
              <p className="ra-subtitle">
                Fill out the form below. An administrator will review your
                request and send you login credentials if approved.
              </p>
              <div className="ra-notice">
                ⏱ Requests are typically reviewed within 1–2 business days.
              </div>
              <form className="ra-form" onSubmit={handleSubmit}>
                <div className={`ra-group ${focused === 'full_name' ? 'focused' : ''}`}>
                  <label>Full Name</label>
                  <input type="text" name="full_name" value={formData.full_name}
                    onChange={handleChange} onFocus={() => setFocused('full_name')}
                    onBlur={() => setFocused('')} placeholder="Jane Smith" required />
                </div>
                <div className={`ra-group ${focused === 'email' ? 'focused' : ''}`}>
                  <label>Email Address</label>
                  <input type="email" name="email" value={formData.email}
                    onChange={handleChange} onFocus={() => setFocused('email')}
                    onBlur={() => setFocused('')} placeholder="jane@example.com" required />
                </div>
                <div className={`ra-group ${focused === 'organization' ? 'focused' : ''}`}>
                  <label>Organization</label>
                  <input type="text" name="organization" value={formData.organization}
                    onChange={handleChange} onFocus={() => setFocused('organization')}
                    onBlur={() => setFocused('')} placeholder="Firm or institution" required />
                </div>
                <div className={`ra-group ${focused === 'reason' ? 'focused' : ''}`}>
                  <label>Reason for Access</label>
                  <textarea name="reason" rows="3" value={formData.reason}
                    onChange={handleChange} onFocus={() => setFocused('reason')}
                    onBlur={() => setFocused('')}
                    placeholder="Briefly explain your role and why you need access..." required />
                </div>
                {error && <div className="ra-error">⚠ {error}</div>}
                <button type="submit" className="ra-btn" disabled={loading}>
                  {loading ? <><div className="ra-spinner" /> Submitting...</> : 'Submit Request'}
                </button>
              </form>
              <div className="ra-back">
                Already have an account? <a href="/login">Sign in</a>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
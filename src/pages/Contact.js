import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import Header from '../components/Header';
import Footer from '../components/Footer';

const INQUIRY_TYPES = [
  'General Inquiry',
  'Loan Process',
  'Credit Policy',
  'Membership',
  'Meeting Notes',
  'Portal Access',
  'Other',
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '', email: '', member_id: '', inquiry_type: 'General Inquiry', subject: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [focused, setFocused]     = useState('');

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Generate a simple ref ID e.g. INQ-20250527-4F2A
    const ref_id = `INQ-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;

    const { error: sbError } = await supabase.from('cc_inquiries').insert([{
      name:         formData.name,
      email:        formData.email,
      member_id:    formData.member_id || null,
      inquiry_type: formData.inquiry_type,
      subject:      formData.subject,
      message:      formData.message,
      ref_id,
      status:       'received',
      priority:     'standard',
    }]);

    if (sbError) {
      setError('Submission failed. Please try again or email us directly.');
    } else {
      setSubmitted(true);
    }
    setLoading(false);
  };

  const reset = () => {
    setSubmitted(false);
    setFormData({ name: '', email: '', member_id: '', inquiry_type: 'General Inquiry', subject: '', message: '' });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .contact-body {
          font-family: 'DM Sans', sans-serif;
          background: #F5F4F0;
          color: #0B1F3A;
          min-height: 100vh;
        }

        /* ── Hero ── */
        .contact-hero {
          background: #0B1F3A;
          color: #fff;
          text-align: center;
          padding: 72px 2rem 80px;
        }
        .contact-hero__badge {
          display: inline-block;
          border: 1px solid rgba(201,168,76,0.5);
          color: #C9A84C;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 100px;
          margin-bottom: 22px;
        }
        .contact-hero__title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 5vw, 3rem);
          line-height: 1.2;
          margin-bottom: 16px;
          color: #fff;
        }
        .contact-hero__accent { color: #C9A84C; }
        .contact-hero__subtitle {
          max-width: 480px;
          margin: 0 auto;
          font-size: 1rem;
          line-height: 1.7;
          color: rgba(255,255,255,0.6);
        }

        /* ── Content ── */
        .contact-content {
          max-width: 680px;
          margin: 0 auto;
          padding: 56px 2rem 80px;
        }

        /* ── Form card ── */
        .contact-form-card {
          background: #fff;
          border: 1px solid #DDD9CE;
          border-radius: 14px;
          padding: 40px 36px;
          box-shadow: 0 4px 24px rgba(11,31,58,0.07);
        }
        .contact-form__title {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          color: #0B1F3A;
          margin-bottom: 6px;
        }
        .contact-form__subtitle {
          font-size: 13.5px;
          color: #6B7280;
          margin-bottom: 30px;
          line-height: 1.5;
        }
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .contact-form__row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .contact-form__group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .contact-form__group label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #9CA3AF;
          transition: color 0.2s;
        }
        .contact-form__group.focused label { color: #0B1F3A; }
        .contact-form__group input,
        .contact-form__group select,
        .contact-form__group textarea {
          background: #F5F4F0;
          border: 1px solid #DDD9CE;
          border-radius: 8px;
          padding: 11px 14px;
          color: #0B1F3A;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          resize: none;
          appearance: none;
          -webkit-appearance: none;
          width: 100%;
        }
        .contact-form__group input::placeholder,
        .contact-form__group textarea::placeholder { color: #C9D0D9; }
        .contact-form__group input:focus,
        .contact-form__group select:focus,
        .contact-form__group textarea:focus {
          border-color: #C9A84C;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(201,168,76,0.12);
        }
        .contact-form__group textarea { line-height: 1.65; }
        .contact-select-wrap { position: relative; }
        .contact-select-wrap::after {
          content: '▾';
          position: absolute;
          right: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #9CA3AF;
          pointer-events: none;
          font-size: 11px;
        }
        .contact-select-wrap select { padding-right: 30px; cursor: pointer; }

        /* ── Optional field note ── */
        .contact-optional {
          font-size: 10px;
          color: #C9D0D9;
          font-weight: 400;
          letter-spacing: 0;
          text-transform: none;
          margin-left: 5px;
        }

        /* ── Error ── */
        .contact-error {
          background: rgba(220,38,38,0.07);
          border: 1px solid rgba(220,38,38,0.2);
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 13.5px;
          color: #DC2626;
        }

        /* ── Submit ── */
        .contact-btn-submit {
          padding: 13px 28px;
          background: #C9A84C;
          color: #0B1F3A;
          border: none;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: background 0.2s, transform 0.15s;
          margin-top: 4px;
          width: 100%;
        }
        .contact-btn-submit:hover:not(:disabled) { background: #F0D080; transform: translateY(-1px); }
        .contact-btn-submit:disabled { opacity: 0.55; cursor: not-allowed; }

        /* ── Spinner ── */
        .contact-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(11,31,58,0.2);
          border-top-color: #0B1F3A;
          border-radius: 50%;
          animation: cSpin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes cSpin { to { transform: rotate(360deg); } }

        /* ── Success ── */
        .contact-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 48px 20px;
          min-height: 280px;
          justify-content: center;
        }
        .contact-success__icon {
          width: 58px; height: 58px;
          background: #0B1F3A;
          color: #C9A84C;
          border-radius: 50%;
          font-size: 24px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        .contact-success h2 {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          color: #0B1F3A;
          margin-bottom: 10px;
        }
        .contact-success__ref {
          font-size: 12px;
          color: #9CA3AF;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
        }
        .contact-success p {
          color: #6B7280;
          font-size: 0.95rem;
          margin-bottom: 28px;
          max-width: 340px;
          line-height: 1.6;
        }
        .contact-btn-reset {
          padding: 11px 26px;
          background: transparent;
          border: 1.5px solid #0B1F3A;
          color: #0B1F3A;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .contact-btn-reset:hover { background: #0B1F3A; color: #fff; }

        /* ── Responsive ── */
        @media (max-width: 600px) {
          .contact-hero { padding: 52px 1.25rem 60px; }
          .contact-content { padding: 36px 1.25rem 56px; }
          .contact-form-card { padding: 28px 20px; }
          .contact-form__row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="contact-body">
        <Header />

        <header className="contact-hero">
          <div className="contact-hero__badge">Credit Committee</div>
          <h1 className="contact-hero__title">
            Contact the<br />
            <span className="contact-hero__accent">Committee</span>
          </h1>
          <p className="contact-hero__subtitle">
            Submit a structured inquiry directly to the Allstate Lending Group
            Credit Committee. We'll confirm receipt and respond within 3–5 business days.
          </p>
        </header>

        <section className="contact-content">
          <div className="contact-form-card">
            {submitted ? (
              <div className="contact-success">
                <div className="contact-success__icon">✓</div>
                <h2>Inquiry Submitted</h2>
                <p>Your message has been received. A committee representative will be in touch shortly.</p>
                <button className="contact-btn-reset" onClick={reset}>Submit Another</button>
              </div>
            ) : (
              <>
                <h2 className="contact-form__title">Send an Inquiry</h2>
                <p className="contact-form__subtitle">
                  All fields are required unless marked optional.
                </p>
                <form className="contact-form" onSubmit={handleSubmit}>

                  <div className="contact-form__row">
                    <div className={`contact-form__group ${focused === 'name' ? 'focused' : ''}`}>
                      <label htmlFor="name">Full Name</label>
                      <input
                        id="name" type="text" name="name"
                        placeholder="Jane Smith"
                        value={formData.name} onChange={handleChange}
                        onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
                        required
                      />
                    </div>
                    <div className={`contact-form__group ${focused === 'email' ? 'focused' : ''}`}>
                      <label htmlFor="email">Email Address</label>
                      <input
                        id="email" type="email" name="email"
                        placeholder="jane@example.com"
                        value={formData.email} onChange={handleChange}
                        onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                        required
                      />
                    </div>
                  </div>

                  <div className="contact-form__row">
                    <div className={`contact-form__group ${focused === 'inquiry_type' ? 'focused' : ''}`}>
                      <label htmlFor="inquiry_type">Inquiry Type</label>
                      <div className="contact-select-wrap">
                        <select
                          id="inquiry_type" name="inquiry_type"
                          value={formData.inquiry_type} onChange={handleChange}
                          onFocus={() => setFocused('inquiry_type')} onBlur={() => setFocused('')}
                        >
                          {INQUIRY_TYPES.map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className={`contact-form__group ${focused === 'member_id' ? 'focused' : ''}`}>
                      <label htmlFor="member_id">
                        Member ID <span className="contact-optional">(optional)</span>
                      </label>
                      <input
                        id="member_id" type="text" name="member_id"
                        placeholder="e.g. ALG-00123"
                        value={formData.member_id} onChange={handleChange}
                        onFocus={() => setFocused('member_id')} onBlur={() => setFocused('')}
                      />
                    </div>
                  </div>

                  <div className={`contact-form__group ${focused === 'subject' ? 'focused' : ''}`}>
                    <label htmlFor="subject">Subject</label>
                    <input
                      id="subject" type="text" name="subject"
                      placeholder="Brief description of your inquiry"
                      value={formData.subject} onChange={handleChange}
                      onFocus={() => setFocused('subject')} onBlur={() => setFocused('')}
                      required
                    />
                  </div>

                  <div className={`contact-form__group ${focused === 'message' ? 'focused' : ''}`}>
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message" name="message" rows="6"
                      placeholder="Please provide as much detail as possible…"
                      value={formData.message} onChange={handleChange}
                      onFocus={() => setFocused('message')} onBlur={() => setFocused('')}
                      required
                    />
                  </div>

                  {error && <div className="contact-error">{error}</div>}

                  <button type="submit" className="contact-btn-submit" disabled={loading}>
                    {loading
                      ? <><span className="contact-spinner" /> Submitting…</>
                      : 'Submit Inquiry →'
                    }
                  </button>

                </form>
              </>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
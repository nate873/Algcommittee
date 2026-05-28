import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Header from '../components/Header';
import Footer from '../components/Footer';

const statusColors = {
  'Approved':         { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0' },
  'Pending Approval': { bg: '#FEF9C3', color: '#92400E', border: '#FDE68A' },
};

export default function MeetingNotes() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');

  useEffect(() => {
    const fetchMeetings = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('meeting_notes')
        .select('*')
        .order('meeting_date', { ascending: false });
      if (!error) setMeetings(data || []);
      setLoading(false);
    };
    fetchMeetings();
  }, []);

  const filtered = meetings.filter((m) =>
    [m.title, m.summary, m.type].some((v) =>
      v?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const approvedCount = meetings.filter((m) => m.status === 'Approved').length;
  const pendingCount  = meetings.filter((m) => m.status === 'Pending Approval').length;

  const fmtDate = (str) =>
    new Date(str).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .mn-page {
          font-family: 'DM Sans', sans-serif;
          background: #F5F4F0;
          color: #0B1F3A;
          min-height: 100vh;
        }

        /* HERO */
        .mn-hero {
          background: #0B1F3A;
          padding: 56px 2.5rem 48px;
        }
        .mn-hero__badge {
          display: inline-block;
          border: 1px solid rgba(201,168,76,0.5);
          color: #C9A84C;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 100px;
          margin-bottom: 20px;
        }
        .mn-hero__title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          color: #fff;
          margin-bottom: 12px;
        }
        .mn-hero__sub {
          color: rgba(255,255,255,0.6);
          font-size: 1rem;
          max-width: 520px;
          line-height: 1.6;
          margin-bottom: 28px;
        }
        .mn-search {
          width: 100%;
          max-width: 420px;
          padding: 11px 18px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.08);
          color: #fff;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s;
        }
        .mn-search::placeholder { color: rgba(255,255,255,0.4); }
        .mn-search:focus { border-color: #C9A84C; }

        /* STATS BAR */
        .mn-stats {
          background: #152E52;
          padding: 16px 2.5rem;
          display: flex;
          gap: 2.5rem;
          flex-wrap: wrap;
        }
        .mn-stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .mn-stat__num {
          font-size: 1.3rem;
          font-weight: 600;
          color: #C9A84C;
        }
        .mn-stat__label {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* CONTENT */
        .mn-content {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 2rem 80px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* LOADING */
        .mn-loading {
          text-align: center;
          padding: 80px 0;
          color: #9CA3AF;
        }
        .mn-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(201,168,76,0.2);
          border-top-color: #C9A84C;
          border-radius: 50%;
          animation: mn-spin 0.7s linear infinite;
          margin: 0 auto 16px;
        }
        @keyframes mn-spin { to { transform: rotate(360deg); } }

        /* MEETING CARD */
        .mn-card {
          background: #fff;
          border: 1px solid #DDD9CE;
          border-radius: 12px;
          padding: 24px 28px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .mn-card:hover {
          border-color: #C9A84C;
          box-shadow: 0 4px 16px rgba(11,31,58,0.08);
        }
        .mn-card__top {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .mn-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 100px;
          border: 1px solid;
        }
        .mn-card__type {
          font-size: 12px;
          color: #9CA3AF;
          font-weight: 500;
        }
        .mn-card__date {
          font-size: 13px;
          color: #9CA3AF;
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .mn-card__date::before {
          content: '📅';
          font-size: 13px;
        }
        .mn-card__title {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          color: #0B1F3A;
        }
        .mn-card__summary {
          font-size: 0.9rem;
          color: #6B7280;
          line-height: 1.65;
        }
        .mn-card__actions {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 4px;
          flex-wrap: wrap;
        }
        .mn-card__pdf {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          background: #0B1F3A;
          padding: 8px 16px;
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.2s;
        }
        .mn-card__pdf:hover { background: #152E52; }
        .mn-card__pdf--disabled {
          background: #E5E7EB;
          color: #9CA3AF;
          cursor: not-allowed;
          pointer-events: none;
        }
        .mn-card__note {
          font-size: 12px;
          color: #9CA3AF;
          font-style: italic;
        }

        .mn-empty {
          text-align: center;
          padding: 60px 0;
          color: #9CA3AF;
          font-size: 15px;
        }

        @media (max-width: 600px) {
          .mn-hero { padding: 40px 1.25rem 36px; }
          .mn-stats { padding: 16px 1.25rem; gap: 1.5rem; }
          .mn-content { padding: 28px 1.25rem 60px; }
          .mn-card { padding: 20px; }
          .mn-card__date { margin-left: 0; }
        }
      `}</style>

      <div className="mn-page">
        <Header />

        {/* HERO */}
        <div className="mn-hero">
          <div className="mn-hero__badge">Credit Committee</div>
          <h1 className="mn-hero__title">Creditors Meeting Notes</h1>
          <p className="mn-hero__sub">
            Official minutes from all creditors meetings. Approved minutes
            are available for download as PDF documents.
          </p>
          <input
            className="mn-search"
            type="text"
            placeholder="Search meeting notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* STATS */}
        <div className="mn-stats">
          <div className="mn-stat">
            <span className="mn-stat__num">{meetings.length}</span>
            <span className="mn-stat__label">Total Meetings</span>
          </div>
          <div className="mn-stat">
            <span className="mn-stat__num">{approvedCount}</span>
            <span className="mn-stat__label">Minutes Approved</span>
          </div>
          <div className="mn-stat">
            <span className="mn-stat__num">{pendingCount}</span>
            <span className="mn-stat__label">Pending Approval</span>
          </div>
        </div>

        {/* MEETING LIST */}
        <div className="mn-content">
          {loading ? (
            <div className="mn-loading">
              <div className="mn-spinner" />
              <p>Loading meeting notes…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="mn-empty">
              {search ? 'No meetings match your search.' : 'No meeting notes have been posted yet.'}
            </div>
          ) : (
            filtered.map((m) => {
              const colors = statusColors[m.status] || statusColors['Pending Approval'];
              return (
                <div key={m.id} className="mn-card">
                  <div className="mn-card__top">
                    <span
                      className="mn-badge"
                      style={{
                        background: colors.bg,
                        color: colors.color,
                        borderColor: colors.border,
                      }}
                    >
                      {m.status}
                    </span>
                    {m.type && <span className="mn-card__type">{m.type}</span>}
                    <span className="mn-card__date">{fmtDate(m.meeting_date)}</span>
                  </div>
                  <h3 className="mn-card__title">{m.title}</h3>
                  <p className="mn-card__summary">{m.summary}</p>
                  <div className="mn-card__actions">
                    {m.pdf_url ? (
                      <a href={m.pdf_url} className="mn-card__pdf" target="_blank" rel="noopener noreferrer">
                        ⬇ Download PDF
                      </a>
                    ) : (
                      <span className="mn-card__pdf mn-card__pdf--disabled">
                        ⬇ Download PDF
                      </span>
                    )}
                    {!m.pdf_url && (
                      <span className="mn-card__note">
                        Available once approved by the committee
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}
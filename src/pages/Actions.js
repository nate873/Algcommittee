import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Header from '../components/Header';
import Footer from '../components/Footer';

const typeColors = {
  'Policy Update': { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
  'Resolution':    { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0' },
  'Decision':      { bg: '#FEF9C3', color: '#92400E', border: '#FDE68A' },
};

const allTypes = ['All', 'Policy Update', 'Resolution', 'Decision'];

const fmtDate = (str) => new Date(str).toLocaleDateString('en-US', {
  month: 'long', day: 'numeric', year: 'numeric',
});

export default function Actions() {
  const [actions, setActions]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('All');
  const [search, setSearch]     = useState('');

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('committee_actions')
        .select('*')
        .eq('published', true)
        .order('action_date', { ascending: false });
      if (!error && data) setActions(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = actions.filter((a) => {
    const matchType   = filter === 'All' || a.type === filter;
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.summary.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .actions-page {
          font-family: 'DM Sans', sans-serif;
          background: #F5F4F0;
          color: #0B1F3A;
          min-height: 100vh;
        }

        .actions-hero { background: #0B1F3A; padding: 56px 2.5rem 48px; }
        .actions-hero__badge {
          display: inline-block;
          border: 1px solid rgba(201,168,76,0.5);
          color: #C9A84C;
          font-size: 11px; font-weight: 600;
          letter-spacing: 2px; text-transform: uppercase;
          padding: 5px 14px; border-radius: 100px; margin-bottom: 20px;
        }
        .actions-hero__title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          color: #fff; margin-bottom: 12px;
        }
        .actions-hero__sub {
          color: rgba(255,255,255,0.6);
          font-size: 1rem; max-width: 520px; line-height: 1.6;
        }

        .actions-controls {
          max-width: 900px; margin: 0 auto;
          padding: 32px 2rem 0;
          display: flex; gap: 12px; flex-wrap: wrap; align-items: center;
        }
        .actions-search {
          flex: 1; min-width: 200px;
          padding: 10px 16px; border: 1px solid #DDD9CE; border-radius: 8px;
          font-size: 14px; font-family: 'DM Sans', sans-serif;
          background: #fff; color: #0B1F3A; outline: none; transition: border-color 0.2s;
        }
        .actions-search:focus { border-color: #C9A84C; }
        .actions-filters { display: flex; gap: 8px; flex-wrap: wrap; }
        .filter-btn {
          padding: 8px 16px; border-radius: 100px;
          border: 1px solid #DDD9CE; background: #fff;
          font-size: 13px; font-family: 'DM Sans', sans-serif;
          color: #6B7280; cursor: pointer; transition: all 0.2s; font-weight: 500;
        }
        .filter-btn:hover { border-color: #C9A84C; color: #0B1F3A; }
        .filter-btn.active { background: #0B1F3A; border-color: #0B1F3A; color: #fff; }

        .actions-list {
          max-width: 900px; margin: 0 auto;
          padding: 24px 2rem 80px;
          display: flex; flex-direction: column; gap: 16px;
        }
        .action-card {
          background: #fff; border: 1px solid #DDD9CE; border-radius: 12px;
          padding: 24px 28px; display: flex; flex-direction: column; gap: 10px;
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .action-card:hover { border-color: #C9A84C; box-shadow: 0 4px 16px rgba(11,31,58,0.08); }
        .action-card__top { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .action-badge {
          display: inline-block; font-size: 11px; font-weight: 600;
          padding: 4px 10px; border-radius: 100px; border: 1px solid;
        }
        .action-card__date { font-size: 13px; color: #9CA3AF; margin-left: auto; }
        .action-card__title {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem; color: #0B1F3A; line-height: 1.3;
        }
        .action-card__summary { font-size: 0.9rem; color: #6B7280; line-height: 1.65; }
        .action-card__link {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 600; color: #C9A84C;
          text-decoration: none; margin-top: 4px; transition: gap 0.2s;
        }
        .action-card__link:hover { gap: 10px; }

        .actions-loading { text-align: center; padding: 80px 0; color: #9CA3AF; }
        .actions-spinner {
          width: 28px; height: 28px;
          border: 2px solid rgba(201,168,76,0.3); border-top-color: #C9A84C;
          border-radius: 50%; animation: aSpin 0.7s linear infinite;
          margin: 0 auto 14px;
        }
        @keyframes aSpin { to { transform: rotate(360deg); } }
        .actions-empty { text-align: center; padding: 60px 0; color: #9CA3AF; font-size: 15px; }

        @media (max-width: 600px) {
          .actions-hero { padding: 40px 1.25rem 36px; }
          .actions-controls { padding: 24px 1.25rem 0; }
          .actions-list { padding: 20px 1.25rem 60px; }
          .action-card { padding: 20px; }
          .action-card__date { margin-left: 0; }
        }
      `}</style>

      <div className="actions-page">
        <Header />

        <div className="actions-hero">
          <div className="actions-hero__badge">Credit Committee</div>
          <h1 className="actions-hero__title">Recent Committee Actions</h1>
          <p className="actions-hero__sub">
            A chronological log of formal decisions, policy updates, and resolutions
            made by the Allstate Lending Group Credit Committee.
          </p>
        </div>

        <div className="actions-controls">
          <input
            className="actions-search"
            type="text"
            placeholder="Search actions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="actions-filters">
            {allTypes.map((t) => (
              <button
                key={t}
                className={`filter-btn ${filter === t ? 'active' : ''}`}
                onClick={() => setFilter(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="actions-list">
          {loading ? (
            <div className="actions-loading">
              <div className="actions-spinner" />
              <p>Loading actions…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="actions-empty">
              {search || filter !== 'All' ? 'No actions match your search.' : 'No committee actions published yet.'}
            </div>
          ) : (
            filtered.map((a) => {
              const colors = typeColors[a.type] || typeColors['Decision'];
              return (
                <div key={a.id} className="action-card">
                  <div className="action-card__top">
                    <span className="action-badge" style={{ background: colors.bg, color: colors.color, borderColor: colors.border }}>
                      {a.type}
                    </span>
                    <span className="action-card__date">{fmtDate(a.action_date)}</span>
                  </div>
                  <h3 className="action-card__title">{a.title}</h3>
                  <p className="action-card__summary">{a.summary}</p>
                  {a.doc_url && (
                    <a href={a.doc_url} className="action-card__link" target="_blank" rel="noopener noreferrer">
                      View Supporting Document →
                    </a>
                  )}
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
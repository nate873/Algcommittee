import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../supabaseClient';

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`faq-item ${open ? 'faq-item--open' : ''}`}
      onClick={() => setOpen(!open)}
    >
      <div className="faq-item__question">
        <span>{q}</span>
        <span className="faq-item__icon">{open ? '−' : '+'}</span>
      </div>
      {open && <div className="faq-item__answer">{a}</div>}
    </div>
  );
}

export default function FAQ() {
  const [search, setSearch]   = useState('');
  const [faqs, setFaqs]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('published', true)
        .order('order_index', { ascending: true });
      if (!error && data) setFaqs(data);
      setLoading(false);
    };
    fetchFaqs();
  }, []);

  // Group by category, preserving order_index sort within each group
  const grouped = faqs.reduce((acc, faq) => {
    const cat = faq.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(faq);
    return acc;
  }, {});

  // Filter by search, then drop empty categories
  const filtered = Object.entries(grouped)
    .map(([category, questions]) => ({
      category,
      questions: questions.filter(
        (item) =>
          item.question.toLowerCase().includes(search.toLowerCase()) ||
          item.answer.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((cat) => cat.questions.length > 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .faq-page {
          font-family: 'DM Sans', sans-serif;
          background: #F5F4F0;
          color: #0B1F3A;
          min-height: 100vh;
        }

        /* HERO */
        .faq-hero {
          background: #0B1F3A;
          padding: 56px 2.5rem 48px;
        }
        .faq-hero__badge {
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
        .faq-hero__title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          color: #fff;
          margin-bottom: 12px;
        }
        .faq-hero__sub {
          color: rgba(255,255,255,0.6);
          font-size: 1rem;
          max-width: 520px;
          line-height: 1.6;
          margin-bottom: 28px;
        }

        /* SEARCH */
        .faq-search-wrap { max-width: 480px; }
        .faq-search {
          width: 100%;
          padding: 11px 18px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.08);
          color: #fff;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .faq-search::placeholder { color: rgba(255,255,255,0.4); }
        .faq-search:focus {
          border-color: #C9A84C;
          background: rgba(255,255,255,0.12);
        }

        /* CONTENT */
        .faq-content {
          max-width: 780px;
          margin: 0 auto;
          padding: 48px 2rem 80px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        /* CATEGORY */
        .faq-category__title {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #C9A84C;
          margin-bottom: 16px;
          padding-bottom: 10px;
          border-bottom: 1px solid #DDD9CE;
        }
        .faq-category__list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        /* FAQ ITEM */
        .faq-item {
          background: #fff;
          border: 1px solid #DDD9CE;
          border-radius: 10px;
          padding: 18px 22px;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
          user-select: none;
        }
        .faq-item:hover {
          border-color: #C9A84C;
          box-shadow: 0 2px 12px rgba(11,31,58,0.07);
        }
        .faq-item--open { border-color: #C9A84C; }
        .faq-item__question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          font-size: 15px;
          font-weight: 500;
          color: #0B1F3A;
          line-height: 1.4;
        }
        .faq-item__icon {
          font-size: 20px;
          color: #C9A84C;
          font-weight: 400;
          flex-shrink: 0;
          line-height: 1;
        }
        .faq-item__answer {
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px solid #F0EDE6;
          font-size: 14px;
          line-height: 1.75;
          color: #6B7280;
        }

        /* LOADING */
        .faq-loading {
          text-align: center;
          padding: 80px 0;
          color: #9CA3AF;
        }
        .faq-spinner {
          width: 28px; height: 28px;
          border: 2px solid rgba(201,168,76,0.3);
          border-top-color: #C9A84C;
          border-radius: 50%;
          animation: faqSpin 0.7s linear infinite;
          margin: 0 auto 14px;
        }
        @keyframes faqSpin { to { transform: rotate(360deg); } }

        /* SUGGEST */
        .faq-suggest {
          background: #0B1F3A;
          border-radius: 12px;
          padding: 28px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        .faq-suggest__text h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          color: #fff;
          margin-bottom: 6px;
        }
        .faq-suggest__text p {
          font-size: 13px;
          color: rgba(255,255,255,0.55);
        }
        .faq-suggest__btn {
          display: inline-block;
          background: #C9A84C;
          color: #0B1F3A;
          font-size: 14px;
          font-weight: 600;
          padding: 10px 22px;
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .faq-suggest__btn:hover { background: #F0D080; }

        .faq-empty {
          text-align: center;
          padding: 60px 0;
          color: #9CA3AF;
          font-size: 15px;
        }

        @media (max-width: 600px) {
          .faq-hero { padding: 40px 1.25rem 36px; }
          .faq-content { padding: 36px 1.25rem 60px; }
          .faq-suggest { flex-direction: column; }
        }
      `}</style>

      <div className="faq-page">
        <Header />

        {/* HERO */}
        <div className="faq-hero">
          <div className="faq-hero__badge">Credit Committee</div>
          <h1 className="faq-hero__title">Frequently Asked Questions</h1>
          <p className="faq-hero__sub">
            Find answers to common questions about the Credit Committee,
            lending criteria, meeting records, and portal access.
          </p>
          <div className="faq-search-wrap">
            <input
              className="faq-search"
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* FAQ CONTENT */}
        <div className="faq-content">
          {loading ? (
            <div className="faq-loading">
              <div className="faq-spinner" />
              <p>Loading questions…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="faq-empty">
              {search ? 'No questions match your search.' : 'No FAQs published yet.'}
            </div>
          ) : (
            filtered.map((cat) => (
              <div key={cat.category}>
                <h2 className="faq-category__title">{cat.category}</h2>
                <div className="faq-category__list">
                  {cat.questions.map((item) => (
                    <FAQItem key={item.id} q={item.question} a={item.answer} />
                  ))}
                </div>
              </div>
            ))
          )}

          {/* SUGGEST A QUESTION */}
          {!loading && (
            <div className="faq-suggest">
              <div className="faq-suggest__text">
                <h3>Don't see your question?</h3>
                <p>Submit it to the committee and we'll get back to you within 3–5 business days.</p>
              </div>
              <a href="/contact" className="faq-suggest__btn">Contact the Committee →</a>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}
import React, { useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const features = [
  {
    icon: '📄',
    num: '01',
    title: 'Meeting Notes',
    description:
      'Access official creditors meeting notes and download approved minutes as PDFs. Organized chronologically with full search functionality.',
    link: '/meeting-notes',
    tag: 'Archive',
  },
  {
    icon: '✉️',
    num: '02',
    title: 'Email the Committee',
    description:
      'Submit structured inquiries directly to the Creditor Committee. Auto-acknowledgment and routing included with every submission.',
    link: '/contact',
    tag: 'Inquiries',
  },
  {
    icon: '❓',
    num: '03',
    title: 'FAQ',
    description:
      'Self-service answers covering committee processes, lending criteria, bankruptcy procedures, and meeting schedules.',
    link: '/faq',
    tag: 'Self-Service',
  },
  {
    icon: '📋',
    num: '04',
    title: 'Recent Actions',
    description:
      'A transparent, chronological log of formal Creditor Committee decisions, policy updates, and resolutions with supporting documentation.',
    link: '/actions',
    tag: 'Transparency',
  },
];

const stats = [
  { value: 'Secure', label: 'Role-Based Access' },
  { value: '100%', label: 'Transparent' },
  { value: 'Live', label: 'Real-Time Updates' },
  { value: 'ALG', label: 'Official Portal' },
];

export default function LandingPage() {
  const heroRef = useRef(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 30;
      const y = (clientY / innerHeight - 0.5) * 30;
      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y}px`);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --navy:   #08192E;
          --navy2:  #0D2440;
          --navy3:  #122B4F;
          --gold:   #C9A84C;
          --gold2:  #E8C97A;
          --cream:  #F5F0E8;
          --warm:   #EDE8DC;
          --muted:  #8A9AB0;
          --border: rgba(201,168,76,0.18);
        }

        .lp {
          font-family: 'Outfit', sans-serif;
          background: var(--navy);
          color: var(--cream);
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ── HERO ─────────────────────────────── */
        .lp-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 120px 2rem 80px;
          overflow: hidden;
          --mx: 0px;
          --my: 0px;
        }

        /* Layered background orbs */
        .lp-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 50% at 70% 40%, rgba(201,168,76,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 40% 60% at 20% 70%, rgba(13,36,64,0.9) 0%, transparent 60%),
            linear-gradient(160deg, #08192E 0%, #0D2440 50%, #06111F 100%);
          pointer-events: none;
        }

        /* Animated grid lines */
        .lp-hero__grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px);
          background-size: 80px 80px;
          pointer-events: none;
          transform: translate(calc(var(--mx) * 0.3), calc(var(--my) * 0.3));
          transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* Decorative gold ring */
        .lp-hero__ring {
          position: absolute;
          right: -120px;
          top: 50%;
          transform: translateY(-50%) translate(calc(var(--mx) * 0.6), calc(var(--my) * 0.6));
          width: 600px;
          height: 600px;
          border-radius: 50%;
          border: 1px solid rgba(201,168,76,0.1);
          pointer-events: none;
          transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .lp-hero__ring::before {
          content: '';
          position: absolute;
          inset: 40px;
          border-radius: 50%;
          border: 1px solid rgba(201,168,76,0.06);
        }
        .lp-hero__ring::after {
          content: '';
          position: absolute;
          inset: 100px;
          border-radius: 50%;
          border: 1px solid rgba(201,168,76,0.04);
        }

        .lp-hero__inner {
          position: relative;
          max-width: 780px;
          animation: lp-fadeUp 0.9s ease both;
        }

        @keyframes lp-fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .lp-hero__eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 28px;
          animation: lp-fadeUp 0.9s 0.1s ease both;
        }
        .lp-hero__eyebrow-line {
          width: 32px;
          height: 1px;
          background: var(--gold);
        }
        .lp-hero__eyebrow-text {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gold);
        }

        .lp-hero__title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3rem, 7vw, 5.2rem);
          font-weight: 600;
          line-height: 1.05;
          color: #fff;
          margin-bottom: 8px;
          animation: lp-fadeUp 0.9s 0.15s ease both;
        }
        .lp-hero__title-sub {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          font-weight: 400;
          font-style: italic;
          color: var(--gold);
          display: block;
          line-height: 1.15;
          margin-bottom: 28px;
          animation: lp-fadeUp 0.9s 0.2s ease both;
        }

        .lp-hero__divider {
          width: 64px;
          height: 2px;
          background: linear-gradient(90deg, var(--gold), transparent);
          margin-bottom: 28px;
          animation: lp-fadeUp 0.9s 0.25s ease both;
        }

        .lp-hero__sub {
          font-size: 1.05rem;
          line-height: 1.75;
          color: var(--muted);
          max-width: 520px;
          font-weight: 300;
          margin-bottom: 44px;
          animation: lp-fadeUp 0.9s 0.3s ease both;
        }

        .lp-hero__actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          animation: lp-fadeUp 0.9s 0.35s ease both;
        }

        .lp-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 30px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Outfit', sans-serif;
          text-decoration: none;
          letter-spacing: 0.5px;
          transition: all 0.25s;
          cursor: pointer;
        }
        .lp-btn--gold {
          background: var(--gold);
          color: var(--navy);
        }
        .lp-btn--gold:hover {
          background: var(--gold2);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(201,168,76,0.3);
        }
        .lp-btn--outline {
          border: 1px solid rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.8);
          background: transparent;
        }
        .lp-btn--outline:hover {
          border-color: var(--gold);
          color: var(--gold);
          background: rgba(201,168,76,0.05);
        }

        /* ── STATS BAR ────────────────────────── */
        .lp-stats {
          background: var(--navy2);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 24px 2rem;
          display: flex;
          justify-content: center;
          gap: 0;
          flex-wrap: wrap;
        }
        .lp-stat {
          flex: 1;
          min-width: 140px;
          max-width: 220px;
          text-align: center;
          padding: 12px 24px;
          position: relative;
        }
        .lp-stat + .lp-stat::before {
          content: '';
          position: absolute;
          left: 0;
          top: 20%;
          height: 60%;
          width: 1px;
          background: var(--border);
        }
        .lp-stat__val {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          font-weight: 600;
          color: var(--gold);
          display: block;
          line-height: 1;
          margin-bottom: 6px;
        }
        .lp-stat__label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--muted);
        }

        /* ── FEATURES ─────────────────────────── */
        .lp-features {
          padding: 80px 2rem 60px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .lp-features__header {
          text-align: center;
          margin-bottom: 56px;
        }
        .lp-features__label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .lp-features__label::before,
        .lp-features__label::after {
          content: '';
          width: 24px;
          height: 1px;
          background: var(--gold);
          opacity: 0.5;
        }
        .lp-features__title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.9rem, 3.5vw, 2.6rem);
          font-weight: 600;
          line-height: 1.15;
          color: #fff;
          margin-bottom: 14px;
        }
        .lp-features__desc {
          font-size: 0.95rem;
          line-height: 1.75;
          color: var(--muted);
          font-weight: 300;
          max-width: 480px;
          margin: 0 auto;
        }

        /* Sleek row list */
        .lp-rows {
          display: flex;
          flex-direction: column;
          border-top: 1px solid var(--border);
        }
        .lp-row {
          display: flex;
          align-items: center;
          gap: 28px;
          padding: 28px 8px;
          border-bottom: 1px solid var(--border);
          text-decoration: none;
          color: inherit;
          transition: padding-left 0.3s ease;
          position: relative;
        }
        .lp-row::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 0;
          background: linear-gradient(90deg, rgba(201,168,76,0.06), transparent);
          transition: width 0.3s ease;
        }
        .lp-row:hover {
          padding-left: 20px;
        }
        .lp-row:hover::before {
          width: 100%;
        }
        .lp-row__num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem;
          font-weight: 400;
          color: rgba(201,168,76,0.4);
          min-width: 28px;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }
        .lp-row__body {
          flex: 1;
          position: relative;
          z-index: 1;
        }
        .lp-row__title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 4px;
          transition: color 0.2s;
        }
        .lp-row:hover .lp-row__title {
          color: var(--gold2);
        }
        .lp-row__desc {
          font-size: 0.87rem;
          color: var(--muted);
          font-weight: 300;
          line-height: 1.6;
        }
        .lp-row__tag {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(201,168,76,0.5);
          min-width: 90px;
          text-align: right;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
          display: none;
        }
        .lp-row__arrow {
          font-size: 18px;
          color: var(--gold);
          opacity: 0;
          transform: translateX(-8px);
          transition: opacity 0.25s, transform 0.25s;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }
        .lp-row:hover .lp-row__arrow {
          opacity: 1;
          transform: translateX(0);
        }

        @media (min-width: 600px) {
          .lp-row__tag { display: block; }
        }

        /* ── MISSION STRIP ────────────────────── */
        .lp-mission {
          background: var(--navy2);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 80px 2rem;
        }
        .lp-mission__inner {
          max-width: 900px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 60px;
          align-items: center;
        }
        .lp-mission__icon {
          width: 80px;
          height: 80px;
          border: 1px solid var(--border);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          flex-shrink: 0;
        }
        .lp-mission__label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 14px;
        }
        .lp-mission__text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.3rem, 2.5vw, 1.75rem);
          font-weight: 400;
          font-style: italic;
          color: rgba(255,255,255,0.85);
          line-height: 1.55;
        }

        /* ── BENEFITS ─────────────────────────── */
        .lp-benefits {
          padding: 100px 2rem;
          max-width: 1160px;
          margin: 0 auto;
        }
        .lp-benefits__header {
          text-align: center;
          margin-bottom: 56px;
        }
        .lp-benefits__label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 14px;
        }
        .lp-benefits__title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 3vw, 2.4rem);
          font-weight: 600;
          color: #fff;
        }

        .lp-benefits__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .lp-benefit {
          padding: 32px 28px;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: rgba(255,255,255,0.02);
          transition: border-color 0.3s, background 0.3s;
        }
        .lp-benefit:hover {
          border-color: rgba(201,168,76,0.4);
          background: rgba(201,168,76,0.03);
        }
        .lp-benefit__icon {
          font-size: 22px;
          margin-bottom: 16px;
        }
        .lp-benefit__title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 10px;
        }
        .lp-benefit__desc {
          font-size: 0.87rem;
          line-height: 1.7;
          color: var(--muted);
          font-weight: 300;
        }

        /* ── CTA ──────────────────────────────── */
        .lp-cta {
          margin: 0 2rem 80px;
          max-width: 1160px;
          margin-left: auto;
          margin-right: auto;
          margin-bottom: 80px;
        }
        .lp-cta__inner {
          background: linear-gradient(135deg, var(--navy2) 0%, var(--navy3) 100%);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 64px 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          flex-wrap: wrap;
          position: relative;
          overflow: hidden;
        }
        .lp-cta__inner::before {
          content: '';
          position: absolute;
          top: -60px;
          right: -60px;
          width: 240px;
          height: 240px;
          border-radius: 50%;
          border: 1px solid rgba(201,168,76,0.08);
          pointer-events: none;
        }
        .lp-cta__inner::after {
          content: '';
          position: absolute;
          top: -20px;
          right: -20px;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          border: 1px solid rgba(201,168,76,0.05);
          pointer-events: none;
        }
        .lp-cta__text {
          position: relative;
        }
        .lp-cta__label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 12px;
        }
        .lp-cta__title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.6rem, 2.5vw, 2.2rem);
          font-weight: 600;
          color: #fff;
          line-height: 1.2;
        }
        .lp-cta__actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          flex-shrink: 0;
          position: relative;
        }

        @media (max-width: 900px) {
          .lp-features__header { grid-template-columns: 1fr; gap: 20px; }
          .lp-mission__inner { grid-template-columns: 1fr; gap: 28px; }
          .lp-mission__icon { display: none; }
          .lp-benefits__grid { grid-template-columns: 1fr 1fr; }
          .lp-cta__inner { padding: 44px 32px; }
        }

        @media (max-width: 600px) {
          .lp-hero { padding: 100px 1.25rem 60px; }
          .lp-features, .lp-benefits { padding: 64px 1.25rem; }
          .lp-mission { padding: 56px 1.25rem; }
          .lp-cta { margin: 0 1.25rem 60px; }
          .lp-cta__inner { padding: 36px 24px; }
          .lp-benefits__grid { grid-template-columns: 1fr; }
          .lp-stat + .lp-stat::before { display: none; }
        }
      `}</style>

      <div className="lp">
        <Header />

        {/* ── HERO ── */}
        <section className="lp-hero" ref={heroRef}>
          <div className="lp-hero__grid" />
          <div className="lp-hero__ring" />

          <div className="lp-hero__inner">
            <div className="lp-hero__eyebrow">
              <span className="lp-hero__eyebrow-line" />
              <span className="lp-hero__eyebrow-text">Official Digital Portal · ALGcommittee.com</span>
            </div>

            <h1 className="lp-hero__title">Allstate Lending Group</h1>
            <span className="lp-hero__title-sub">Creditor Committee Portal</span>

            <div className="lp-hero__divider" />

            <p className="lp-hero__sub">
              The official portal for Allstate Lending Group creditors — providing
              accurate, timely information directly from the Creditor Committee.
              Secure, transparent, and built for authorized members.
            </p>

            <div className="lp-hero__actions">
              <a href="/meeting-notes" className="lp-btn lp-btn--gold">
                View Meeting Notes →
              </a>
              <a href="/contact" className="lp-btn lp-btn--outline">
                Contact the Committee
              </a>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <div className="lp-stats">
          {stats.map((s) => (
            <div className="lp-stat" key={s.label}>
              <span className="lp-stat__val">{s.value}</span>
              <span className="lp-stat__label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── FEATURES ── */}
        <section className="lp-features">
          <div className="lp-features__header">
            <div className="lp-features__label">Portal Features</div>
            <h2 className="lp-features__title">
              Everything you need,<br />in one place.
            </h2>
            <p className="lp-features__desc">
              Four purpose-built modules delivering accurate, up-to-date
              information from the Creditor Committee directly to Allstate Lending creditors.
            </p>
          </div>

          <div className="lp-rows">
            {features.map((f) => (
              <a href={f.link} className="lp-row" key={f.title}>
                <span className="lp-row__num">{f.num}</span>
                <div className="lp-row__body">
                  <div className="lp-row__title">{f.title}</div>
                  <div className="lp-row__desc">{f.description}</div>
                </div>
                <span className="lp-row__tag">{f.tag}</span>
                <span className="lp-row__arrow">→</span>
              </a>
            ))}
          </div>
        </section>

        {/* ── MISSION STRIP ── */}
        <div className="lp-mission">
          <div className="lp-mission__inner">
            <div className="lp-mission__icon">⚖️</div>
            <div>
              <div className="lp-mission__label">Our Mission</div>
              <p className="lp-mission__text">
                "To provide Allstate Lending Group creditors with accurate, timely,
                and transparent information directly from the Creditor Committee —
                ensuring every member has what they need to stay fully informed."
              </p>
            </div>
          </div>
        </div>

        {/* ── BENEFITS ── */}
        <section className="lp-benefits">
          <div className="lp-benefits__header">
            <div className="lp-benefits__label">Why This Portal</div>
            <h2 className="lp-benefits__title">Built for transparency & efficiency</h2>
          </div>
          <div className="lp-benefits__grid">
            {[
              {
                icon: '🔒',
                title: 'Secure Access Control',
                desc: 'Role-based authentication ensures only authorized creditors and members can access Creditor Committee information.',
              },
              {
                icon: '📡',
                title: 'Real-Time Updates',
                desc: 'Meeting notes, actions, and FAQs are published directly by the committee — accurate information with no delays.',
              },
              {
                icon: '📂',
                title: 'Complete Archive',
                desc: 'Every approved meeting minute is stored and searchable. Download PDFs on demand with a single click.',
              },
              {
                icon: '✉️',
                title: 'Structured Communication',
                desc: 'Submit inquiries directly to the Creditor Committee. Every submission is logged, acknowledged, and routed appropriately.',
              },
              {
                icon: '📋',
                title: 'Full Accountability',
                desc: 'A live, searchable log of all formal Creditor Committee decisions, policy changes, and resolutions with supporting docs.',
              },
              {
                icon: '⚙️',
                title: 'Self-Managed Content',
                desc: 'Committee administrators control all content — FAQs, actions, and meeting notes — without developer involvement.',
              },
            ].map((b) => (
              <div className="lp-benefit" key={b.title}>
                <div className="lp-benefit__icon">{b.icon}</div>
                <h4 className="lp-benefit__title">{b.title}</h4>
                <p className="lp-benefit__desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <div className="lp-cta">
          <div className="lp-cta__inner">
            <div className="lp-cta__text">
              <div className="lp-cta__label">Get Started</div>
              <h2 className="lp-cta__title">
                Ready to access<br />the committee portal?
              </h2>
            </div>
            <div className="lp-cta__actions">
              <a href="/meeting-notes" className="lp-btn lp-btn--gold">
                View Meeting Notes
              </a>
              <a href="/contact" className="lp-btn lp-btn--outline">
                Contact Committee
              </a>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
} 
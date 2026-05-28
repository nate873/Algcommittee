import React from 'react';

export default function Footer() {
  return (
    <>
      <style>{`
        .alg-footer {
          background: #0B1F3A;
          color: rgba(255,255,255,0.5);
          font-family: 'DM Sans', sans-serif;
          padding: 48px 2.5rem 28px;
        }
        .alg-footer__top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 2rem;
          padding-bottom: 32px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          margin-bottom: 24px;
        }
        .alg-footer__brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        .alg-footer__logo {
          background: #C9A84C;
          color: #0B1F3A;
          font-weight: 700;
          font-size: 13px;
          padding: 4px 9px;
          border-radius: 6px;
          letter-spacing: 1px;
        }
        .alg-footer__brand-name {
          color: #fff;
          font-size: 15px;
          font-weight: 500;
        }
        .alg-footer__tagline {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          max-width: 260px;
          line-height: 1.6;
        }
        .alg-footer__links {
          display: flex;
          gap: 3rem;
          flex-wrap: wrap;
        }
        .alg-footer__col h4 {
          color: #C9A84C;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 14px;
        }
        .alg-footer__col ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .alg-footer__col ul li a {
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
        }
        .alg-footer__col ul li a:hover { color: #fff; }
        .alg-footer__bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          font-size: 12px;
          color: rgba(255,255,255,0.3);
        }
        .alg-footer__bottom a {
          color: rgba(255,255,255,0.3);
          text-decoration: none;
        }
        .alg-footer__bottom a:hover { color: rgba(255,255,255,0.6); }
        @media (max-width: 600px) {
          .alg-footer { padding: 40px 1.25rem 24px; }
          .alg-footer__top { flex-direction: column; }
          .alg-footer__bottom { flex-direction: column; text-align: center; }
        }
      `}</style>

      <footer className="alg-footer">
        <div className="alg-footer__top">

          <div>
            <div className="alg-footer__brand">
              <span className="alg-footer__logo">ALG</span>
              <span className="alg-footer__brand-name">Credit Committee</span>
            </div>
            <p className="alg-footer__tagline">
              The official digital portal for Allstate Lending Group's
              Creditor Committee — secure, transparent, and accessible.
            </p>
          </div>

          <div className="alg-footer__links">
            <div className="alg-footer__col">
              <h4>Portal</h4>
              <ul>
                <li><a href="/meeting-notes">Meeting Notes</a></li>
                <li><a href="/actions">Recent Actions</a></li>
                <li><a href="/faq">FAQ</a></li>
                <li><a href="/contact">Contact Committee</a></li>
              </ul>
            </div>
            <div className="alg-footer__col">
              <h4>Legal</h4>
              <ul>
                <li><a href="/bylaws">Bylaws</a></li>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/terms">Terms of Use</a></li>
                <li><a href="/accessibility">Accessibility</a></li>
              </ul>
            </div>
          </div>

        </div>

        <div className="alg-footer__bottom">
          <span>© {new Date().getFullYear()} Allstate Lending Group. All rights reserved.</span>
          <span>ALGcommittee.com &nbsp;|&nbsp; Confidential — Authorized Members Only</span>
        </div>
      </footer>
    </>
  );
}
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showCaseInfo, setShowCaseInfo] = useState(false);
  const dropdownRef = useRef(null);
  const caseInfoRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfile(false);
      }
      if (caseInfoRef.current && !caseInfoRef.current.contains(e.target)) {
        setShowCaseInfo(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setShowProfile(false);
        setShowCaseInfo(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const getInitial = () => {
    if (!user) return '?';
    const email = user.email || '';
    const name = user.user_metadata?.full_name || '';
    return (name ? name[0] : email[0] || '?').toUpperCase();
  };

  const getDisplayName = () => {
    return user?.user_metadata?.full_name || user?.email || 'Member';
  };

  const getEmail = () => user?.email || '';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap');

        .alg-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2.5rem;
          height: 70px;
          background: #0B1F3A;
          border-bottom: 1px solid rgba(201,168,76,0.15);
          position: sticky;
          top: 0;
          z-index: 100;
          font-family: 'Outfit', sans-serif;
        }

        /* ── Brand ── */
        .alg-nav__brand {
          display: flex;
          align-items: center;
          gap: 14px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .alg-nav__brand:hover .alg-nav__logo {
          background: #E8C97A;
        }
        .alg-nav__logo {
          background: #C9A84C;
          color: #0B1F3A;
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700;
          font-size: 15px;
          padding: 6px 11px;
          border-radius: 4px;
          letter-spacing: 1px;
          transition: background 0.2s;
          line-height: 1;
          flex-shrink: 0;
        }
        .alg-nav__brand-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .alg-nav__name {
          font-family: 'Cormorant Garamond', serif;
          color: #fff;
          font-size: 18px;
          font-weight: 600;
          letter-spacing: 0.2px;
          line-height: 1;
        }
        .alg-nav__sub {
          font-family: 'Outfit', sans-serif;
          color: #C9A84C;
          font-size: 9.5px;
          font-weight: 500;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          line-height: 1;
        }

        /* ── Nav links ── */
        .alg-nav__center {
          display: flex;
          align-items: center;
          gap: 2rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .alg-nav__center a {
          font-family: 'Outfit', sans-serif;
          color: rgba(255,255,255,0.65);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.2px;
          transition: color 0.2s;
          position: relative;
        }
        .alg-nav__center a::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 0;
          height: 1px;
          background: #C9A84C;
          transform: scaleX(0);
          transition: transform 0.2s;
        }
        .alg-nav__center a:hover {
          color: #fff;
        }
        .alg-nav__center a:hover::after {
          transform: scaleX(1);
        }
        .alg-nav__admin {
          color: rgba(255,255,255,0.35) !important;
          font-size: 12px !important;
          letter-spacing: 0.5px;
          border: 1px solid rgba(255,255,255,0.12);
          padding: 5px 12px;
          border-radius: 4px;
          transition: all 0.2s !important;
        }
        .alg-nav__admin:hover {
          color: rgba(255,255,255,0.75) !important;
          border-color: rgba(255,255,255,0.25) !important;
        }
        .alg-nav__admin::after { display: none !important; }

        /* ── Case Info dropdown ── */
        .alg-caseinfo {
          position: relative;
        }
        .alg-caseinfo__trigger {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          color: rgba(255,255,255,0.65);
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.2px;
          padding: 0;
          transition: color 0.2s;
          position: relative;
        }
        .alg-caseinfo__trigger::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 0;
          height: 1px;
          background: #C9A84C;
          transform: scaleX(0);
          transition: transform 0.2s;
        }
        .alg-caseinfo__trigger:hover,
        .alg-caseinfo.open .alg-caseinfo__trigger {
          color: #fff;
        }
        .alg-caseinfo__trigger:hover::after,
        .alg-caseinfo.open .alg-caseinfo__trigger::after {
          transform: scaleX(1);
        }
        .alg-caseinfo__caret {
          font-size: 8px;
          color: #C9A84C;
          transition: transform 0.18s ease;
        }
        .alg-caseinfo.open .alg-caseinfo__caret {
          transform: rotate(180deg);
        }

        .alg-caseinfo__menu {
          position: absolute;
          top: calc(100% + 22px);
          left: 50%;
          transform: translateX(-50%);
          background: #fff;
          border: 1px solid #DDD9CE;
          border-radius: 10px;
          width: 230px;
          box-shadow: 0 12px 40px rgba(11,31,58,0.18);
          overflow: hidden;
          animation: dropIn 0.18s ease;
          z-index: 200;
          padding: 8px;
        }
        /* invisible hover bridge so the menu doesn't close crossing the gap */
        .alg-caseinfo__menu::before {
          content: '';
          position: absolute;
          top: -22px;
          left: 0;
          right: 0;
          height: 22px;
        }
        .alg-caseinfo__menu a {
          display: block;
          padding: 10px 14px;
          border-radius: 6px;
          font-family: 'Outfit', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          color: #0B1F3A !important;
          text-decoration: none;
          transition: background 0.15s;
        }
        .alg-caseinfo__menu a::after { display: none !important; }
        .alg-caseinfo__menu a:hover {
          background: #F5F4F0;
          color: #0B1F3A !important;
        }

        /* ── Right side ── */
        .alg-nav__right {
          display: flex;
          align-items: center;
          gap: 16px;
          position: relative;
          flex-shrink: 0;
        }

        /* ── Log In button ── */
        .alg-nav__login {
          background: transparent;
          color: #C9A84C;
          border: 1.5px solid rgba(201,168,76,0.6);
          padding: 7px 20px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          letter-spacing: 0.5px;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }
        .alg-nav__login:hover {
          background: #C9A84C;
          color: #0B1F3A;
          border-color: #C9A84C;
        }

        /* ── Avatar ── */
        .alg-nav__avatar {
          width: 36px;
          height: 36px;
          background: #C9A84C;
          color: #0B1F3A;
          border-radius: 50%;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Outfit', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 2px solid transparent;
          transition: border-color 0.2s, transform 0.15s;
          flex-shrink: 0;
        }
        .alg-nav__avatar:hover { border-color: rgba(201,168,76,0.5); transform: scale(1.05); }
        .alg-nav__avatar.open { border-color: #C9A84C; }

        /* ── Profile dropdown ── */
        .alg-profile {
          position: absolute;
          top: calc(100% + 14px);
          right: 0;
          background: #fff;
          border: 1px solid #DDD9CE;
          border-radius: 10px;
          width: 270px;
          box-shadow: 0 12px 40px rgba(11,31,58,0.18);
          overflow: hidden;
          animation: dropIn 0.18s ease;
          z-index: 200;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .alg-caseinfo__menu {
          animation-name: dropInCentered;
        }
        @keyframes dropInCentered {
          from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .alg-profile__header {
          background: #0B1F3A;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          border-bottom: 1px solid rgba(201,168,76,0.15);
        }
        .alg-profile__avatar-lg {
          width: 46px;
          height: 46px;
          background: #C9A84C;
          color: #0B1F3A;
          border-radius: 50%;
          font-size: 19px;
          font-weight: 700;
          font-family: 'Outfit', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .alg-profile__info { overflow: hidden; }
        .alg-profile__name {
          font-family: 'Cormorant Garamond', serif;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .alg-profile__email {
          font-family: 'Outfit', sans-serif;
          color: rgba(255,255,255,0.45);
          font-size: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .alg-profile__body { padding: 8px; }
        .alg-profile__item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 6px;
          font-size: 13.5px;
          font-family: 'Outfit', sans-serif;
          font-weight: 500;
          color: #0B1F3A;
          text-decoration: none;
          cursor: pointer;
          transition: background 0.15s;
          border: none;
          background: none;
          width: 100%;
        }
        .alg-profile__item:hover { background: #F5F4F0; }
        .alg-profile__item--danger { color: #DC2626; }
        .alg-profile__item--danger:hover { background: rgba(220,38,38,0.05); }
        .alg-profile__divider {
          height: 1px;
          background: #F0EDE6;
          margin: 4px 8px;
        }

        @media (max-width: 768px) {
          .alg-nav__center { display: none; }
          .alg-nav { padding: 0 1.25rem; }
          .alg-nav__sub { display: none; }
        }
      `}</style>

      <nav className="alg-nav">
        {/* Brand */}
        <a href="/" className="alg-nav__brand">
          <span className="alg-nav__logo">ALG</span>
          <div className="alg-nav__brand-text">
            <span className="alg-nav__name">Allstate Creditor Committee</span>
            <span className="alg-nav__sub">Official Member Portal</span>
          </div>
        </a>

        {/* Nav links */}
        <ul className="alg-nav__center">
          <li>
            <div
              className={`alg-caseinfo ${showCaseInfo ? 'open' : ''}`}
              ref={caseInfoRef}
              onMouseEnter={() => setShowCaseInfo(true)}
              onMouseLeave={() => setShowCaseInfo(false)}
            >
              <button
                type="button"
                className="alg-caseinfo__trigger"
                aria-haspopup="true"
                aria-expanded={showCaseInfo}
                onClick={() => setShowCaseInfo((p) => !p)}
              >
                Case Info <span className="alg-caseinfo__caret">▼</span>
              </button>

              {showCaseInfo && (
                <div className="alg-caseinfo__menu">
                  <a href="/case-information">Case Information</a>
                  <a href="/proof-of-claim">Proof of Claim</a>
                  <a href="/useful-links">Useful Links</a>
                  <a href="/professionals">Case Professionals</a>
                </div>
              )}
            </div>
          </li>
          <li><a href="/faq">FAQ</a></li>
          <li><a href="/actions">Actions</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/admin" className="alg-nav__admin">Admin</a></li>
        </ul>

        {/* Right side */}
        <div className="alg-nav__right" ref={dropdownRef}>
          {user ? (
            <>
              <div
                className={`alg-nav__avatar ${showProfile ? 'open' : ''}`}
                onClick={() => setShowProfile(p => !p)}
              >
                {getInitial()}
              </div>

              {showProfile && (
                <div className="alg-profile">
                  <div className="alg-profile__header">
                    <div className="alg-profile__avatar-lg">{getInitial()}</div>
                    <div className="alg-profile__info">
                      <div className="alg-profile__name">{getDisplayName()}</div>
                      <div className="alg-profile__email">{getEmail()}</div>
                    </div>
                  </div>
                  <div className="alg-profile__body">
                    <a href="/admin" className="alg-profile__item">
                      ⚙️ Admin Portal
                    </a>
                    <div className="alg-profile__divider" />
                    <button
                      className="alg-profile__item alg-profile__item--danger"
                      onClick={handleSignOut}
                    >
                      → Sign Out
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <a href="/login" className="alg-nav__login">Log In</a>
          )}
        </div>
      </nav>
    </>
  );
}
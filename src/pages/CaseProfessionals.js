import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const sections = [
  {
    heading: 'Official Committee of Unsecured Creditors',
    cards: [
      {
        role: 'Committee Counsel',
        name: 'Franklin Soto Leeds LLP',
        lines: [
          'Paul J. Leeds · Meredith King · Shelby A. Poteet',
          '444 West C Street, Suite 300, San Diego, CA 92101',
        ],
        phone: '619-872-2520',
        emails: ['Pleeds@fsl.law', 'mking@fsl.law', 'spoteet@fsl.law'],
      },
    ],
  },
  {
    heading: 'Debtors (Allstate Lending Group, Inc. & Servicing LLC)',
    cards: [
      {
        role: 'Chief Restructuring Officer (CRO)',
        name: 'Howard B. Grobstein / Grobstein Teeple LLP',
        lines: ['6300 Canoga Ave, Suite 1500W, Woodland Hills, CA 91367'],
        phone: '(818) 532-1120',
      },
      {
        role: "Debtors' Bankruptcy Counsel",
        name: 'Raines Feldman Littrell LLP',
        lines: [
          'Kyra E. Andrassy · Stephen M. Mott',
          '4675 MacArthur Court, Suite 1550, Newport Beach, CA 92660',
        ],
        phone: '(310) 440-4100',
        emails: ['kandrassy@raineslaw.com'],
      },
      {
        role: 'Special Criminal Investigation Counsel',
        name: 'SKT Law',
        lines: ['Retained pursuant to Order entered May 19, 2026.'],
      },
    ],
  },
  {
    heading: 'U.S. Trustee / Court',
    cards: [
      {
        role: 'U.S. Trustee',
        name: 'Peter C. Anderson',
        lines: [
          'Office of the United States Trustee',
          '915 Wilshire Blvd., Suite 1850, Los Angeles, CA 90017',
          'Trial Attorney: Ron Maroko',
        ],
        phone: '(213) 894-6811',
      },
      {
        role: 'Presiding Judge',
        name: 'Hon. Neil W. Bason',
        lines: [
          'U.S. Bankruptcy Court, C.D. Cal. — Los Angeles Division',
          '255 E. Temple Street, Courtroom 1545, Los Angeles, CA 90012',
        ],
      },
    ],
  },
];

export default function CaseProfessionals() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .pros-page {
          font-family: 'DM Sans', sans-serif;
          background: #F5F4F0;
          color: #0B1F3A;
          min-height: 100vh;
        }

        .pros-hero { background: #0B1F3A; padding: 56px 2.5rem 48px; }
        .pros-hero__badge {
          display: inline-block;
          border: 1px solid rgba(201,168,76,0.5);
          color: #C9A84C;
          font-size: 11px; font-weight: 600;
          letter-spacing: 2px; text-transform: uppercase;
          padding: 5px 14px; border-radius: 100px; margin-bottom: 20px;
        }
        .pros-hero__title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          color: #fff; margin-bottom: 12px;
        }
        .pros-hero__sub {
          color: rgba(255,255,255,0.6);
          font-size: 1rem; max-width: 560px; line-height: 1.6;
        }

        .pros-content {
          max-width: 900px; margin: 0 auto;
          padding: 40px 2rem 80px;
          display: flex; flex-direction: column; gap: 32px;
        }
        .pros-section__heading {
          font-size: 12px; font-weight: 600;
          letter-spacing: 1.6px; text-transform: uppercase;
          color: #92400E; margin-bottom: 14px;
        }
        .pros-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }
        .pros-card {
          background: #fff; border: 1px solid #DDD9CE; border-radius: 12px;
          padding: 24px 26px;
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .pros-card:hover { border-color: #C9A84C; box-shadow: 0 4px 16px rgba(11,31,58,0.08); }
        .pros-card__role {
          font-size: 11px; font-weight: 600;
          letter-spacing: 1.4px; text-transform: uppercase;
          color: #C9A84C; margin-bottom: 8px;
        }
        .pros-card__name {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem; color: #0B1F3A; line-height: 1.3;
          margin-bottom: 10px;
        }
        .pros-card__line { font-size: 0.88rem; color: #6B7280; line-height: 1.6; }
        .pros-card__contact { margin-top: 10px; font-size: 0.88rem; line-height: 1.7; }
        .pros-card__contact a {
          color: #92400E; font-weight: 500; text-decoration: none;
        }
        .pros-card__contact a:hover { text-decoration: underline; }

        .pros-disclaimer { font-size: 12.5px; color: #9CA3AF; line-height: 1.7; padding: 0 6px; }
        .pros-disclaimer strong { color: #6B7280; }

        @media (max-width: 600px) {
          .pros-hero { padding: 40px 1.25rem 36px; }
          .pros-content { padding: 28px 1.25rem 60px; gap: 26px; }
          .pros-card { padding: 20px; }
        }
      `}</style>

      <div className="pros-page">
        <Header />

        <div className="pros-hero">
          <div className="pros-hero__badge">Official Committee of Unsecured Creditors</div>
          <h1 className="pros-hero__title">Case Professionals, U.S. Trustee &amp; Court</h1>
          <p className="pros-hero__sub">
            Contact information for the professionals, U.S. Trustee, and Court involved in the
            Allstate Lending bankruptcy cases.
          </p>
        </div>

        <div className="pros-content">
          {sections.map((section) => (
            <div key={section.heading}>
              <div className="pros-section__heading">{section.heading}</div>
              <div className="pros-grid">
                {section.cards.map((card) => (
                  <div className="pros-card" key={card.name}>
                    <div className="pros-card__role">{card.role}</div>
                    <div className="pros-card__name">{card.name}</div>
                    {card.lines.map((line) => (
                      <div className="pros-card__line" key={line}>{line}</div>
                    ))}
                    {(card.phone || card.emails) && (
                      <div className="pros-card__contact">
                        {card.phone && (
                          <div>
                            <a href={`tel:${card.phone.replace(/[^0-9]/g, '')}`}>{card.phone}</a>
                          </div>
                        )}
                        {card.emails && (
                          <div>
                            {card.emails.map((email, i) => (
                              <React.Fragment key={email}>
                                {i > 0 && ' · '}
                                <a href={`mailto:${email}`}>{email}</a>
                              </React.Fragment>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="pros-disclaimer">
            <p>
              <strong>DISCLAIMER:</strong> This website provides information only. Nothing
              herein constitutes legal advice. Creditors are encouraged to consult their own
              counsel.
            </p>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
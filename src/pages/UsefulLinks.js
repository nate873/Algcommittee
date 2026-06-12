import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const groups = [
  {
    heading: 'Allstate Lending Case Specific Resources',
    links: [
      {
        label: "Chief Restructuring Officer's Website",
        url: 'https://www.croallstate.com/communications',
      },
    ],
  },
  {
    heading: 'Proof of Claim Resources',
    links: [
      {
        label: 'ePOC Program — U.S. Bankruptcy Court, Central District of California',
        url: 'https://www.cacb.uscourts.gov/epoc-electronic-proof-claim',
      },
      {
        label: 'Video: Filling Out and Filing a Proof of Claim',
        url: 'https://www.cacb.uscourts.gov/video/filling-out-and-filing-proof-claim',
      },
      {
        label: 'Tutorial Video for Using the ePOC Program',
        note: 'Video is from the Eastern District, which uses the ePOC system.',
        url: 'https://www.youtube.com/watch?v=3MOG0zQAZ88',
      },
      {
        label: 'Central Guide on Filing Claims',
        url: 'https://www.cacb.uscourts.gov/the-central-guide/filing-claims-creditors-proof-claim-epoc-withdrawing-claim-objection-claim',
      },
      {
        label: 'ePOC Filing Guide (PDF)',
        url: 'https://www.cacb.uscourts.gov/sites/cacb/files/documents/ePOC_Filing_GuideCACB.pdf',
      },
      {
        label: 'ePOC Filing Page',
        url: 'https://ecf.cacb.uscourts.gov/cgi-bin/autoFilingClaims.pl',
      },
      {
        label: 'Electronic Drop Box',
        url: 'https://www.cacb.uscourts.gov/request-access-electronic-drop-box',
      },
    ],
  },
  {
    heading: 'Court and Court Documents',
    links: [
      { label: 'Court Website', url: 'https://www.cacb.uscourts.gov/' },
      { label: 'PACER', url: 'https://pacer.uscourts.gov/' },
    ],
  },
];

export default function UsefulLinks() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .links-page {
          font-family: 'DM Sans', sans-serif;
          background: #F5F4F0;
          color: #0B1F3A;
          min-height: 100vh;
        }

        .links-hero { background: #0B1F3A; padding: 56px 2.5rem 48px; }
        .links-hero__badge {
          display: inline-block;
          border: 1px solid rgba(201,168,76,0.5);
          color: #C9A84C;
          font-size: 11px; font-weight: 600;
          letter-spacing: 2px; text-transform: uppercase;
          padding: 5px 14px; border-radius: 100px; margin-bottom: 20px;
        }
        .links-hero__title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          color: #fff; margin-bottom: 12px;
        }
        .links-hero__sub {
          color: rgba(255,255,255,0.6);
          font-size: 1rem; max-width: 520px; line-height: 1.6;
        }

        .links-content {
          max-width: 900px; margin: 0 auto;
          padding: 40px 2rem 80px;
          display: flex; flex-direction: column; gap: 20px;
        }
        .links-card {
          background: #fff; border: 1px solid #DDD9CE; border-radius: 12px;
          padding: 26px 32px;
        }
        .links-card__heading {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem; color: #0B1F3A; margin-bottom: 10px;
        }

        .links-list { list-style: none; }
        .links-list li { border-bottom: 1px solid #EFEDE6; }
        .links-list li:last-child { border-bottom: none; }
        .links-list a {
          display: flex; justify-content: space-between; align-items: baseline; gap: 16px;
          padding: 13px 2px;
          text-decoration: none; color: #0B1F3A;
          font-size: 0.93rem; font-weight: 500;
          transition: color 0.15s;
        }
        .links-list a:hover { color: #92400E; }
        .links-list a::after { content: '↗'; color: #C9A84C; flex: none; font-weight: 600; }
        .links-list__note {
          display: block;
          font-size: 12.5px; font-weight: 400; color: #9CA3AF; margin-top: 2px;
        }

        .links-disclaimer { font-size: 12.5px; color: #9CA3AF; line-height: 1.7; padding: 0 6px; }
        .links-disclaimer strong { color: #6B7280; }

        @media (max-width: 600px) {
          .links-hero { padding: 40px 1.25rem 36px; }
          .links-content { padding: 28px 1.25rem 60px; }
          .links-card { padding: 20px; }
        }
      `}</style>

      <div className="links-page">
        <Header />

        <div className="links-hero">
          <div className="links-hero__badge">Official Committee of Unsecured Creditors</div>
          <h1 className="links-hero__title">Useful Links</h1>
          <p className="links-hero__sub">
            Case resources, claim filing tools, and court information for Allstate Lending
            creditors.
          </p>
        </div>

        <div className="links-content">
          {groups.map((group) => (
            <div className="links-card" key={group.heading}>
              <h2 className="links-card__heading">{group.heading}</h2>
              <ul className="links-list">
                {group.links.map((link) => (
                  <li key={link.url + link.label}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      <span>
                        {link.label}
                        {link.note && <span className="links-list__note">Note: {link.note}</span>}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="links-disclaimer">
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
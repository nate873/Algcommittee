import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const steps = [
  ['Obtain the form', 'Obtain Official Form B410 (Proof of Claim).'],
  ['Complete the form', 'Complete the form with your name, address, claim amount, and basis for the claim.'],
  ['Attach documentation', 'Attach supporting documentation (contracts, account statements, correspondence, etc.).'],
  ['File with the Court', 'File the completed form with the Bankruptcy Court for the Central District of California by either (1) in person, (2) by mail, or (3) via ePOC.'],
  ['Keep a copy', 'Retain a copy of your filed proof of claim for your records.'],
];

export default function ProofOfClaim() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .poc-page {
          font-family: 'DM Sans', sans-serif;
          background: #F5F4F0;
          color: #0B1F3A;
          min-height: 100vh;
        }

        .poc-hero { background: #0B1F3A; padding: 56px 2.5rem 48px; }
        .poc-hero__badge {
          display: inline-block;
          border: 1px solid rgba(201,168,76,0.5);
          color: #C9A84C;
          font-size: 11px; font-weight: 600;
          letter-spacing: 2px; text-transform: uppercase;
          padding: 5px 14px; border-radius: 100px; margin-bottom: 20px;
        }
        .poc-hero__title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          color: #fff; margin-bottom: 12px;
        }
        .poc-hero__sub {
          color: rgba(255,255,255,0.6);
          font-size: 1rem; max-width: 520px; line-height: 1.6;
        }

        .poc-content {
          max-width: 900px; margin: 0 auto;
          padding: 40px 2rem 80px;
          display: flex; flex-direction: column; gap: 20px;
        }

        .poc-bar-alert {
          display: flex; align-items: flex-start; gap: 14px;
          background: #FFF8E6;
          border: 1px solid #C9A84C; border-radius: 12px;
          padding: 18px 22px;
          font-size: 0.95rem; line-height: 1.6; color: #0B1F3A;
        }
        .poc-bar-alert__icon {
          flex: none;
          width: 32px; height: 32px; border-radius: 50%;
          background: #C9A84C; color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-weight: 600; font-size: 16px;
        }
        .poc-bar-alert strong { color: #92400E; }

        .poc-card {
          background: #fff; border: 1px solid #DDD9CE; border-radius: 12px;
          padding: 28px 32px;
        }
        .poc-card__heading {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem; color: #0B1F3A; margin-bottom: 22px;
        }

        .poc-steps { list-style: none; }
        .poc-step { position: relative; display: flex; gap: 18px; padding-bottom: 24px; }
        .poc-step:last-child { padding-bottom: 0; }
        .poc-step__num {
          flex: none;
          width: 34px; height: 34px; border-radius: 50%;
          border: 1.5px solid #C9A84C; color: #92400E;
          font-weight: 600; font-size: 14px;
          display: flex; align-items: center; justify-content: center;
          background: #FFFDF7;
          position: relative; z-index: 1;
        }
        .poc-step:not(:last-child)::before {
          content: '';
          position: absolute; left: 17px; top: 36px; bottom: 2px;
          width: 1px; background: #EFEDE6;
        }
        .poc-step__title { font-weight: 600; font-size: 0.95rem; margin-bottom: 2px; }
        .poc-step__body { font-size: 0.9rem; color: #6B7280; line-height: 1.65; }

        .poc-facts { width: 100%; border-collapse: collapse; }
        .poc-facts th, .poc-facts td {
          text-align: left; vertical-align: top;
          padding: 11px 16px 11px 0;
          border-bottom: 1px solid #EFEDE6;
        }
        .poc-facts tr:last-child th, .poc-facts tr:last-child td { border-bottom: none; }
        .poc-facts th {
          width: 34%;
          font-size: 12px; font-weight: 600;
          letter-spacing: 0.8px; text-transform: uppercase;
          color: #9CA3AF;
        }
        .poc-facts td { font-size: 0.92rem; color: #0B1F3A; line-height: 1.55; }

        .poc-disclaimer { font-size: 12.5px; color: #9CA3AF; line-height: 1.7; padding: 0 6px; }
        .poc-disclaimer strong { color: #6B7280; }

        @media (max-width: 600px) {
          .poc-hero { padding: 40px 1.25rem 36px; }
          .poc-content { padding: 28px 1.25rem 60px; }
          .poc-card { padding: 22px 20px; }
        }
      `}</style>

      <div className="poc-page">
        <Header />

        <div className="poc-hero">
          <div className="poc-hero__badge">Official Committee of Unsecured Creditors</div>
          <h1 className="poc-hero__title">Proof of Claim Information</h1>
          <p className="poc-hero__sub">
            How to assert your claim in the Allstate Lending bankruptcy cases.
          </p>
        </div>

        <div className="poc-content">
          <div className="poc-bar-alert">
            <div className="poc-bar-alert__icon">!</div>
            <p>
              <strong>CLAIMS BAR DATE: July 1, 2026</strong> — Proofs of Claim must be
              filed by this date to participate in any distribution.
            </p>
          </div>

          <div className="poc-card">
            <h2 className="poc-card__heading">How to File a Proof of Claim</h2>
            <ol className="poc-steps">
              {steps.map(([title, body], i) => (
                <li className="poc-step" key={title}>
                  <div className="poc-step__num">{i + 1}</div>
                  <div>
                    <div className="poc-step__title">{title}</div>
                    <div className="poc-step__body">{body}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="poc-card">
            <h2 className="poc-card__heading">Key Information</h2>
            <table className="poc-facts">
              <tbody>
                <tr>
                  <th scope="row">Bar Date</th>
                  <td>July 1, 2026</td>
                </tr>
                <tr>
                  <th scope="row">Debtor / Lead Case No.</th>
                  <td>Allstate Lending Group, Inc. — 2:26-bk-11879-NB</td>
                </tr>
                <tr>
                  <th scope="row">Debtor / Case No.</th>
                  <td>Allstate Lending Group Servicing LLC — 2:26-bk-11882-NB</td>
                </tr>
                <tr>
                  <th scope="row">Court Mailing Address</th>
                  <td>U.S. Bankruptcy Court<br />255 E. Temple Street<br />Los Angeles, CA 90012</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="poc-disclaimer">
            <p>
              <strong>DISCLAIMER:</strong> This information is a general guide only. Creditors
              should consult their own legal counsel regarding proof of claim filing
              requirements.
            </p>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
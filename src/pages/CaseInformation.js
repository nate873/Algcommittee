import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const facts = [
  ['Debtors', 'Allstate Lending Group, Inc. & Allstate Lending Group Servicing LLC'],
  ['Lead Case No.', '2:26-bk-11879-NB'],
  ['Related Case', '2:26-bk-11882-NB'],
  ['Court', 'U.S. Bankruptcy Court, C.D. Cal. (Los Angeles)'],
  ['Judge', 'Hon. Neil W. Bason'],
  ['Chapter', '11 (Voluntary)'],
  ['Petition Date', 'February 27, 2026'],
  ['CRO', 'Howard B. Grobstein (Grobstein Teeple LLP)'],
  ['Debtor Counsel', 'Raines Feldman Littrell LLP'],
  ['Est. Liabilities', '$50M – $100M'],
];

export default function CaseInformation() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .caseinfo-page {
          font-family: 'DM Sans', sans-serif;
          background: #F5F4F0;
          color: #0B1F3A;
          min-height: 100vh;
        }

        .caseinfo-hero { background: #0B1F3A; padding: 56px 2.5rem 48px; }
        .caseinfo-hero__badge {
          display: inline-block;
          border: 1px solid rgba(201,168,76,0.5);
          color: #C9A84C;
          font-size: 11px; font-weight: 600;
          letter-spacing: 2px; text-transform: uppercase;
          padding: 5px 14px; border-radius: 100px; margin-bottom: 20px;
        }
        .caseinfo-hero__title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          color: #fff; margin-bottom: 12px;
        }
        .caseinfo-hero__sub {
          color: rgba(255,255,255,0.6);
          font-size: 1rem; max-width: 560px; line-height: 1.6;
        }

        .caseinfo-content {
          max-width: 900px; margin: 0 auto;
          padding: 40px 2rem 80px;
          display: flex; flex-direction: column; gap: 20px;
        }
        .caseinfo-card {
          background: #fff; border: 1px solid #DDD9CE; border-radius: 12px;
          padding: 28px 32px;
        }
        .caseinfo-card__heading {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem; color: #0B1F3A; margin-bottom: 18px;
        }

        .caseinfo-facts { width: 100%; border-collapse: collapse; }
        .caseinfo-facts th, .caseinfo-facts td {
          text-align: left; vertical-align: top;
          padding: 11px 16px 11px 0;
          border-bottom: 1px solid #EFEDE6;
        }
        .caseinfo-facts tr:last-child th, .caseinfo-facts tr:last-child td { border-bottom: none; }
        .caseinfo-facts th {
          width: 34%;
          font-size: 12px; font-weight: 600;
          letter-spacing: 0.8px; text-transform: uppercase;
          color: #9CA3AF; white-space: nowrap;
        }
        .caseinfo-facts td { font-size: 0.92rem; color: #0B1F3A; line-height: 1.55; }

        .caseinfo-card p { font-size: 0.92rem; color: #4B5563; line-height: 1.75; }
        .caseinfo-card p + p { margin-top: 14px; }

        .caseinfo-disclaimer {
          font-size: 12.5px; color: #9CA3AF; line-height: 1.7;
          padding: 0 6px;
        }
        .caseinfo-disclaimer strong { color: #6B7280; }
        .caseinfo-disclaimer p + p { margin-top: 8px; }

        @media (max-width: 600px) {
          .caseinfo-hero { padding: 40px 1.25rem 36px; }
          .caseinfo-content { padding: 28px 1.25rem 60px; }
          .caseinfo-card { padding: 22px 20px; }
          .caseinfo-facts th { white-space: normal; width: 40%; }
        }
      `}</style>

      <div className="caseinfo-page">
        <Header />

        <div className="caseinfo-hero">
          <div className="caseinfo-hero__badge">Official Committee of Unsecured Creditors</div>
          <h1 className="caseinfo-hero__title">General Case Information</h1>
          <p className="caseinfo-hero__sub">
            In re Allstate Lending Group, Inc., et al. — chapter 11 cases pending in the
            U.S. Bankruptcy Court for the Central District of California.
          </p>
        </div>

        <div className="caseinfo-content">
          <div className="caseinfo-card">
            <h2 className="caseinfo-card__heading">Case Information</h2>
            <table className="caseinfo-facts">
              <tbody>
                {facts.map(([label, value]) => (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="caseinfo-card">
            <h2 className="caseinfo-card__heading">Case Background</h2>
            <p>
              On February 27, 2026, Allstate Lending Group, Inc. and Allstate Lending Group
              Servicing LLC each filed petitions in the United States Bankruptcy Court for the
              Central District of California seeking relief under chapter 11 of the United
              States Bankruptcy Code. The cases are pending before the Honorable Neil W. Bason
              and are being jointly administered under Case No. 2:26-bk-11879-NB.
            </p>
            <p>
              Debtors have retained Howard Grobstein and Grobstein Teeple LLP as the Chief
              Restructuring Officer and restructuring officer personnel. Raines Feldman
              Littrell LLP has been employed as general bankruptcy counsel.
            </p>
            <p>
              On March 18, 2026, the Office of the United States Trustee appointed the
              Committee of Unsecured Creditors. The Committee members are: (1) C-Family
              Investments, (2) Denise Cervenka, (3) Scott Hackman, (4) Jeff Keenan, and
              (5) Marks Capital.
            </p>
            <p>
              The Committee selected the law firm of Franklin Soto Leeds LLP as its attorney.
              The Committee may be contacted through its counsel.
            </p>
          </div>

          <div className="caseinfo-disclaimer">
            <p>
              <strong>DISCLAIMER:</strong> This website provides information only. Nothing
              herein constitutes legal advice. Creditors are encouraged to consult their own
              counsel.
            </p>
            <p>
              This website is maintained by the Official Committee of Unsecured Creditors as a
              public resource. All inquiries are submitted to the Committee Team, and not to
              Debtors.
            </p>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
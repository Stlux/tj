import React from 'react';
import './PayoutsPage.css';

/* ── Icons ── */
const DownloadIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const ExcelIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="16" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

/* ── Data ── */
const PAYOUTS = [
  {
    id: 1,
    month:    'Март 2026',
    period:   '01.03.2026 – 31.03.2026',
    status:   'pending',
    docName:  'Kirill Likholetov. Mar2026.xlsx',
    docPath:  '/docs/Kirill%20Likholetov.%20Mar2026.xlsx',
    paidAt:   '15.04.2026',
  },
];

const STATUS_LABELS = {
  paid:    'Выплачено',
  pending: 'В процессе',
};

function PayoutsPage() {

  return (
    <div className="pp">
      {/* ── Header ── */}
      <div className="pp__header">
        <h2 className="pp__title">Выплаты</h2>
      </div>

      {/* ── Summary cards ── */}
      <div className="pp__summary">
        <div className="pp__card">
          <div className="pp__card-label">Всего документов</div>
          <div className="pp__card-value">{PAYOUTS.length}</div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="pp__table-wrap">
        <div className="pp__table-title">Документы по выплатам</div>

        <table className="pp__table">
          <thead>
            <tr>
              <th>#</th>
              <th>Месяц</th>
              <th>Период</th>
              <th>Дата выплаты</th>
              <th>Документ</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {PAYOUTS.map((row) => (
              <tr key={row.id}>
                <td className="pp__num">{row.id}</td>
                <td style={{ fontWeight: 600 }}>{row.month}</td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{row.period}</td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{row.paidAt || '—'}</td>
                <td>
                  {row.docPath ? (
                    <a
                      className="pp__doc-link"
                      href={row.docPath}
                      download={row.docName}
                      title={row.docName}
                    >
                      <ExcelIcon />
                      {row.docName}
                      <DownloadIcon />
                    </a>
                  ) : (
                    <span className="pp__no-doc">—</span>
                  )}
                </td>
                <td>
                  <span className={`pp__badge pp__badge--${row.status}`}>
                    <span className="pp__badge-dot" />
                    {STATUS_LABELS[row.status] || row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ── Footer ── */}
        <div className="pp__footer">
          <span>{PAYOUTS.length} {PAYOUTS.length === 1 ? 'запись' : 'записей'}</span>
        </div>
      </div>
    </div>
  );
}

export default PayoutsPage;

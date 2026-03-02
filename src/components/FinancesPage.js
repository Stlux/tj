import React, { useState } from 'react';
import './FinancesPage.css';

const STATS = [
  { label: 'Расход ФБ',   value: '13 344.68$' },
  { label: 'Расходники',  value: '70$' },
  { label: 'Доход',       value: '19 293.1$' },
  { label: 'Профит',      value: '5 878.42$' },
  { label: 'ROI',         value: '43.82%' },
  { label: 'с 24.02.2026', value: 'по 02.03.2026', isDate: true },
];

const TABLE_ROWS = [
  {
    id: 26,
    actions: [
      { label: 'Расходы', color: 'blue' },
      { label: 'Профит',  color: 'purple' },
    ],
    name:       'KirillLikholetov',
    расходники: '70$',
    расходы:    '13 344.68$',
    доходы:     '19 293.1$',
    профит:     '5 878.42$',
    roi:        '43.82%',
  },
];

function FinancesPage() {
  const [period] = useState('Последние 7 дней');

  return (
    <div className="fp">
      {/* ── Header ── */}
      <div className="fp__header">
        <h2 className="fp__title">Финансы</h2>
        <div className="fp__controls">
          <span className="fp__period">{period}</span>
          <button className="btn btn--danger">Сбросить</button>
          <button className="btn btn--primary">Применить</button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="fp__stats">
        {STATS.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-card__label">{s.label}</div>
            <div className="stat-card__value">{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── Table ── */}
      <div className="fp__table-card">
        <div className="fp__table-head">
          <span className="fp__table-title">Детальные данные</span>
          <button className="fp__add-btn" aria-label="Добавить">+</button>
        </div>

        <div className="fp__table-scroll">
          <table className="fp__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Действие</th>
                <th>Имя</th>
                <th>Расходники</th>
                <th>Расходы</th>
                <th>Доходы</th>
                <th>Профит</th>
                <th>ROI</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>
                    <div className="fp__badges">
                      {row.actions.map((a) => (
                        <span key={a.label} className={`fp__badge fp__badge--${a.color}`}>
                          {a.label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>{row.name}</td>
                  <td>{row.расходники}</td>
                  <td>{row.расходы}</td>
                  <td>{row.доходы}</td>
                  <td>{row.профит}</td>
                  <td>{row.roi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FinancesPage;

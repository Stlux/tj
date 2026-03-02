import React, { useState, useMemo } from 'react';
import './FinancesPage.css';
import DateRangePicker from './DateRangePicker';
import {
  getPresetRange,
  getAccountStats,
  calcStats,
  getRecordsByRange,
  fmtMoney,
  fmtPct,
  fmtDate,
} from '../data/dataService';

function FinancesPage() {
  // ── Date range state ──────────────────────────────────────────
  const [range, setRange] = useState(() => ({
    ...getPresetRange('7days'),
    label: 'Последние 7 дней',
  }));

  const handleApply = (r) => setRange(r);
  const handleReset = () =>
    setRange({ ...getPresetRange('7days'), label: 'Последние 7 дней' });

  // ── Computed data ─────────────────────────────────────────────
  const records      = useMemo(() => getRecordsByRange(range.from, range.to), [range]);
  const stats        = useMemo(() => calcStats(records), [records]);
  const accountStats = useMemo(() => getAccountStats(range.from, range.to), [range]);

  // ── Stat cards definition ─────────────────────────────────────
  const CARDS = [
    { label: 'Расход ФБ',  value: fmtMoney(stats.fbSpend) },
    { label: 'Расходники', value: fmtMoney(stats.consumables) },
    { label: 'Доход',      value: fmtMoney(stats.revenue) },
    {
      label: 'Профит',
      value: fmtMoney(stats.profit),
      highlight: stats.profit >= 0 ? 'green' : 'red',
    },
    { label: 'ROI', value: fmtPct(stats.roi), highlight: stats.roi >= 0 ? 'green' : 'red' },
    {
      label: `с ${fmtDate(range.from)}`,
      value: `по ${fmtDate(range.to)}`,
      isDate: true,
    },
  ];

  return (
    <div className="fp">
      {/* ── Page header ── */}
      <div className="fp__header">
        <h2 className="fp__title">Финансы</h2>
        <DateRangePicker value={range} onApply={handleApply} onReset={handleReset} />
      </div>

      {/* ── Stat cards ── */}
      <div className="fp__stats">
        {CARDS.map((c, i) => (
          <div key={i} className={`stat-card ${c.isDate ? 'stat-card--date' : ''}`}>
            <div className="stat-card__label">{c.label}</div>
            <div className={`stat-card__value ${c.highlight ? `stat-card__value--${c.highlight}` : ''}`}>
              {c.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Detail table ── */}
      <div className="fp__table-card">
        <div className="fp__table-head">
          <span className="fp__table-title">Детальные данные</span>
          <button className="fp__add-btn" aria-label="Добавить запись">+</button>
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
              {accountStats.length === 0 ? (
                <tr>
                  <td colSpan={8} className="fp__empty">
                    Нет данных за выбранный период
                  </td>
                </tr>
              ) : (
                accountStats.map((row) => (
                  <tr key={row.id}>
                    <td>{row.rowNum}</td>
                    <td>
                      <div className="fp__badges">
                        <span className="fp__badge fp__badge--blue">Расходы</span>
                        <span className="fp__badge fp__badge--purple">Профит</span>
                      </div>
                    </td>
                    <td>{row.name}</td>
                    <td>{fmtMoney(row.consumables)}</td>
                    <td>{fmtMoney(row.fbSpend)}</td>
                    <td>{fmtMoney(row.revenue)}</td>
                    <td className={row.profit >= 0 ? 'fp__positive' : 'fp__negative'}>
                      {fmtMoney(row.profit)}
                    </td>
                    <td className={row.roi >= 0 ? 'fp__positive' : 'fp__negative'}>
                      {fmtPct(row.roi)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Formula reference ── */}
      <div className="fp__formula-note">
        <span>Профит = Доход − Расход&nbsp;ФБ − Расходники</span>
        <span className="fp__formula-sep">·</span>
        <span>ROI = Профит / (Расход&nbsp;ФБ + Расходники) × 100%</span>
      </div>
    </div>
  );
}

export default FinancesPage;

import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import './MyOrdersPage.css';
import DateRangePicker from './DateRangePicker';
import {
  getPresetRange,
  getOrdersByRange,
  fmtDate,
  fmtMoney,
} from '../data/dataService';

/* ── Icons ── */
const ExportIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const STATUS_LABELS = {
  completed: 'completed',
  pending:   'pending',
  cancelled: 'cancelled',
};

function StatusBadge({ status }) {
  return (
    <span className={`mo__badge mo__badge--${status}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

function MyOrdersPage({ user }) {
  const [range, setRange] = useState(() => ({
    ...getPresetRange('30days'),
    label: 'Последние 30 дней',
  }));

  const handleApply = (r) => setRange(r);
  const handleReset = () =>
    setRange({ ...getPresetRange('30days'), label: 'Последние 30 дней' });

  const orders = useMemo(
    () => getOrdersByRange(range.from, range.to),
    [range],
  );

  const totalSpend = useMemo(
    () => orders.reduce((s, o) => s + (o.amount || 0), 0),
    [orders],
  );

  const handleExport = () => {
    const rows = orders.map((o) => ({
      '#':                 o.num,
      'Автор':             o.author,
      'Создан':            fmtDate(o.createdAt),
      'Выполнен':          o.completedAt ? fmtDate(o.completedAt) : '',
      'Заказ':             o.title,
      'Исполнитель':       o.executor,
      'Кол-Во':            o.qty,
      'Сумма ($)':         o.amount,
      'Статус':            STATUS_LABELS[o.status] || o.status,
      'Оценочный Дедлайн': o.deadline ? fmtDate(o.deadline) : '',
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Мои заказы');

    const fileName = `мои_заказы_${range.from}_${range.to}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="mo">
      {/* ── Header ── */}
      <div className="mo__header">
        <h2 className="mo__title">Мои заказы</h2>
        <div className="mo__header-right">
          <button className="mo__export-btn" onClick={handleExport}>
            <ExportIcon />
            Экспорт в эксель
          </button>
          <DateRangePicker value={range} onApply={handleApply} onReset={handleReset} />
        </div>
      </div>

      {/* ── Info cards ── */}
      <div className="mo__cards">
        <div className="mo__card">
          <span className="mo__card-text">Пользователь: <strong>{user?.name || 'KirillLikholetov'}</strong></span>
        </div>
        <div className="mo__card">
          <span className="mo__card-text">Общий расход: <strong>{fmtMoney(totalSpend)}</strong></span>
        </div>
        <div className="mo__card">
          <span className="mo__card-text">{fmtDate(range.from)} — {fmtDate(range.to)}</span>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="mo__table-card">
        <div className="mo__table-scroll">
          <table className="mo__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Создан</th>
                <th>Выполнен</th>
                <th>Заказ</th>
                <th>Исполнитель</th>
                <th>Кол-Во</th>
                <th>Сумма</th>
                <th>Статус</th>
                <th>Оценочный Дедлайн</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="mo__empty">Нет заказов за выбранный период</td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id}>
                    <td className="mo__num-cell">
                      <strong>#{o.num}</strong> <span className="mo__by">by {o.author}</span>
                    </td>
                    <td>{fmtDate(o.createdAt)}</td>
                    <td>{o.completedAt ? fmtDate(o.completedAt) : '—'}</td>
                    <td className="mo__title-cell">{o.title}</td>
                    <td>{o.executor}</td>
                    <td>{o.qty}</td>
                    <td>{fmtMoney(o.amount)}</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td className="mo__muted">{o.deadline ? fmtDate(o.deadline) : '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MyOrdersPage;

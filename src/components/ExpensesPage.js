import React, { useState, useCallback } from 'react';
import './ExpensesPage.css';
import {
  getAllExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  fmtDate,
  toISO,
} from '../data/dataService';

/* ── Icons ── */
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6"  y1="6" x2="18" y2="18" />
  </svg>
);

/* ── Helpers ── */
function todayISO() {
  return toISO(new Date());
}

const EMPTY_FORM = { date: todayISO(), fbAccountId: '', amount: '' };

function isoToDisplay(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}

function displayToISO(display) {
  if (!display) return '';
  const parts = display.split('.');
  if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
  return display;
}

/* ════════════════════════════════════════════ */

function ExpensesPage() {
  const [expenses, setExpenses]   = useState(() => getAllExpenses());
  const [panelOpen, setPanelOpen] = useState(false);
  const [editId,    setEditId]    = useState(null);
  const [sortByAcc, setSortByAcc] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);
  const [dateDisplay, setDateDisplay] = useState(isoToDisplay(todayISO()));

  const reload = useCallback(() => setExpenses(getAllExpenses()), []);

  /* open panel for new record */
  const openAdd = () => {
    const today = todayISO();
    setForm({ ...EMPTY_FORM, date: today });
    setDateDisplay(isoToDisplay(today));
    setEditId(null);
    setPanelOpen(true);
  };

  /* open panel for editing */
  const openEdit = (exp) => {
    setForm({ date: exp.date, fbAccountId: exp.fbAccountId, amount: exp.amount });
    setDateDisplay(isoToDisplay(exp.date));
    setEditId(exp.id);
    setPanelOpen(true);
  };

  const closePanel = () => setPanelOpen(false);

  const handleDateInput = (val) => {
    setDateDisplay(val);
    const iso = displayToISO(val);
    setForm((f) => ({ ...f, date: iso }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      date:        form.date,
      fbAccountId: form.fbAccountId.trim(),
      amount:      parseFloat(form.amount) || 0,
      name:        'KirillLikholetov',
    };
    if (editId) {
      updateExpense(editId, payload);
    } else {
      addExpense(payload);
    }
    reload();
    closePanel();
  };

  const handleDelete = (id) => {
    if (window.confirm('Удалить запись?')) {
      deleteExpense(id);
      reload();
    }
  };

  const displayed = sortByAcc
    ? [...expenses].sort((a, b) => a.fbAccountId.localeCompare(b.fbAccountId))
    : expenses;

  return (
    <div className="ep">
      {/* ── Header ── */}
      <div className="ep__header">
        <h2 className="ep__title">Записи о расходах</h2>
        <button
          className={`ep__sort-btn ${sortByAcc ? 'ep__sort-btn--active' : ''}`}
          onClick={() => setSortByAcc((v) => !v)}
        >
          Сортировка по аккаунтам
        </button>
      </div>

      {/* ── Add button ── */}
      <div className="ep__toolbar">
        <button className="ep__add-btn" onClick={openAdd}>
          Добавить расход
        </button>
      </div>

      {/* ── Table ── */}
      <div className="ep__table-card">
        <div className="ep__table-scroll">
          <table className="ep__table">
            <thead>
              <tr>
                <th>Дата</th>
                <th>ID Аккаунта</th>
                <th>Расход</th>
                <th>Имя</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={5} className="ep__empty">Нет записей</td>
                </tr>
              ) : (
                displayed.map((exp) => (
                  <tr key={exp.id}>
                    <td>{fmtDate(exp.date)}</td>
                    <td>{exp.fbAccountId}</td>
                    <td>{parseFloat(exp.amount).toFixed(2)}</td>
                    <td>{exp.name}</td>
                    <td className="ep__actions">
                      <button className="ep__action-btn ep__action-btn--edit" onClick={() => openEdit(exp)}>
                        <EditIcon />
                      </button>
                      <button className="ep__action-btn ep__action-btn--delete" onClick={() => handleDelete(exp.id)}>
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Slide-in panel ── */}
      {panelOpen && (
        <div className="ep__overlay" onClick={closePanel} />
      )}
      <div className={`ep__panel ${panelOpen ? 'ep__panel--open' : ''}`}>
        <div className="ep__panel-header">
          <h3 className="ep__panel-title">{editId ? 'Редактировать Расход' : 'Добавить Расход'}</h3>
          <button className="ep__panel-close" onClick={closePanel}><CloseIcon /></button>
        </div>

        <form className="ep__form" onSubmit={handleSubmit}>
          <div className="ep__field">
            <label className="ep__label">Дата</label>
            <input
              className="ep__input"
              type="text"
              placeholder="ДД.ММ.ГГГГ"
              value={dateDisplay}
              onChange={(e) => handleDateInput(e.target.value)}
              required
            />
          </div>

          <div className="ep__field">
            <label className="ep__label">ID Account Facebook</label>
            <input
              className="ep__input"
              type="text"
              placeholder="ID Account Facebook"
              value={form.fbAccountId}
              onChange={(e) => setForm((f) => ({ ...f, fbAccountId: e.target.value }))}
              required
            />
          </div>

          <div className="ep__field">
            <label className="ep__label">Расход</label>
            <input
              className="ep__input"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              required
            />
          </div>

          <button className="ep__submit-btn" type="submit">
            {editId ? 'Сохранить' : 'Добавить расход'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ExpensesPage;

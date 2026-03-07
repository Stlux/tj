import React, { useState, useCallback } from 'react';
import './FbAccountsPage.css';
import {
  getAllFbAccounts,
  addFbAccount,
  updateFbAccount,
} from '../data/dataService';

/* ── Icons ── */
const UnblockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

const HistoryIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <line x1="7" y1="9"  x2="17" y2="9" />
    <line x1="7" y1="13" x2="13" y2="13" />
  </svg>
);

const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6"  y1="6" x2="18" y2="18" />
  </svg>
);

const WarnIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

/* ── Status badge renderer ── */
function TopUpBadge({ status }) {
  if (!status) return <span className="fba__dash">—</span>;
  if (status.type === 'topped_up')
    return <span className="fba__badge fba__badge--green">Пополнено {status.amount} $</span>;
  if (status.type === 'appeal')
    return <span className="fba__badge fba__badge--orange">{status.label}</span>;
  if (status.type === 'waiting')
    return <span className="fba__badge fba__badge--orange">{status.label}</span>;
  return <span className="fba__dash">—</span>;
}

function TransferBadge({ status }) {
  if (!status) return <span className="fba__dash">—</span>;
  if (status.type === 'withdrawn')
    return (
      <span className="fba__badge fba__badge--green">
        Выведен ${status.amount}{status.accountName ? ` · ${status.accountName}` : ''}
      </span>
    );
  if (status.type === 'pending')
    return (
      <span className="fba__badge fba__badge--orange">
        В ожидании{status.accountName ? ` · ${status.accountName}` : ''}
      </span>
    );
  return <span className="fba__dash">—</span>;
}

/* ── Empty form ── */
const EMPTY_FORM = {
  name: '',
  accountId: '',
  topUpType: '',
  topUpAmount: '',
  topUpLabel: '',
  transferType: '',
  transferAmount: '',
};

/* ════════════════════════════════════════════ */

function TopUpModal({ accName, onConfirm, onClose }) {
  const [amount, setAmount] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(amount);
  };
  return (
    <div className="fba__modal-overlay" onClick={onClose}>
      <div className="fba__modal" onClick={(e) => e.stopPropagation()}>
        <button className="fba__modal-close" onClick={onClose} aria-label="Закрыть">
          <CloseIcon />
        </button>
        <div className="fba__modal-icon-wrap fba__modal-icon-wrap--blue">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3b82f6"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </div>
        <h3 className="fba__modal-title">Пополнение аккаунта</h3>
        {accName && <p className="fba__modal-subtitle">{accName}</p>}
        <form className="fba__modal-form" onSubmit={handleSubmit}>
          <label className="fba__label">Сумма пополнения ($)</label>
          <input
            className="fba__input"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            autoFocus
          />
          <div className="fba__modal-actions">
            <button type="button" className="fba__bar-btn fba__bar-btn--ghost" onClick={onClose}>Отмена</button>
            <button type="submit" className="fba__bar-btn fba__bar-btn--blue">Заказать пополнение</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TransferModal({ accounts, onConfirm, onClose }) {
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [amount,    setAmount]    = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    const acc = accounts.find((a) => a.id === accountId);
    onConfirm({ accountId, accountName: acc?.name || '', amount });
  };
  return (
    <div className="fba__modal-overlay" onClick={onClose}>
      <div className="fba__modal" onClick={(e) => e.stopPropagation()}>
        <button className="fba__modal-close" onClick={onClose} aria-label="Закрыть">
          <CloseIcon />
        </button>
        <div className="fba__modal-icon-wrap">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#a855f7"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="17 1 21 5 17 9" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <polyline points="7 23 3 19 7 15" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
        </div>
        <h3 className="fba__modal-title">Перевод / Вывод</h3>
        <form className="fba__modal-form" onSubmit={handleSubmit}>
          <label className="fba__label">Кабинет</label>
          <select
            className="fba__input"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            required
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          <label className="fba__label">Сумма ($)</label>
          <input
            className="fba__input"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <div className="fba__modal-actions">
            <button type="button" className="fba__bar-btn fba__bar-btn--ghost" onClick={onClose}>Отмена</button>
            <button type="submit" className="fba__bar-btn fba__bar-btn--purple">Заказать перевод и вывод</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════ */

function FbAccountsPage() {
  const [accounts,       setAccounts]       = useState(() => getAllFbAccounts());
  const [panelOpen,      setPanelOpen]      = useState(false);
  const [transferModal,  setTransferModal]  = useState(false);
  const [topUpModal,     setTopUpModal]     = useState(null); // { id, name }
  const [editId,         setEditId]         = useState(null);
  const [form,           setForm]           = useState(EMPTY_FORM);

  const reload = useCallback(() => setAccounts(getAllFbAccounts()), []);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setPanelOpen(true);
  };

  const openEdit = (acc) => {
    setForm({
      name:           acc.name,
      accountId:      acc.accountId,
      topUpType:      acc.topUpStatus?.type      || '',
      topUpAmount:    acc.topUpStatus?.amount     || '',
      topUpLabel:     acc.topUpStatus?.label      || '',
      transferType:   acc.transferStatus?.type    || '',
      transferAmount: acc.transferStatus?.amount  || '',
    });
    setEditId(acc.id);
    setPanelOpen(true);
  };

  const closePanel = () => setPanelOpen(false);

  const buildStatus = (type, amount, label) => {
    if (!type) return null;
    if (type === 'topped_up') return { type, amount: parseFloat(amount) || 0 };
    if (type === 'withdrawn') return { type, amount: parseFloat(amount) || 0 };
    if (type === 'appeal')    return { type, label: label || 'Подана апелляция' };
    if (type === 'waiting')   return { type, label: label || 'В ожидании' };
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name:           form.name.trim(),
      accountId:      form.accountId.trim(),
      topUpStatus:    buildStatus(form.topUpType, form.topUpAmount, form.topUpLabel),
      unblockStatus:  null,
      transferStatus: buildStatus(form.transferType, form.transferAmount, ''),
    };
    if (editId) {
      updateFbAccount(editId, payload);
    } else {
      addFbAccount(payload);
    }
    reload();
    closePanel();
  };

  const handleTransferConfirm = ({ accountId, accountName, amount }) => {
    updateFbAccount(accountId, {
      transferStatus: { type: 'pending', accountName, amount: parseFloat(amount) || 0 },
    });
    reload();
    setTransferModal(false);
  };

  const handleTopUpConfirm = (amount) => {
    if (topUpModal) {
      updateFbAccount(topUpModal.id, {
        topUpStatus: { type: 'topped_up', amount: parseFloat(amount) || 0 },
      });
      reload();
    }
    setTopUpModal(null);
  };

  const handleUnblock = (acc) => {
    updateFbAccount(acc.id, { unblockStatus: { type: 'sent' } });
    reload();
  };

  const f = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="fba">
      {/* ── Title ── */}
      <h2 className="fba__title">ФБ Аккаунты</h2>

      {/* ── Legend ── */}
      <div className="fba__legend">
        <div className="fba__legend-item">
          <span className="fba__legend-icon fba__legend-icon--red"><UnblockIcon /></span>
          <span>— Отправить аккаунт на разблокировку</span>
        </div>
        <div className="fba__legend-item">
          <span className="fba__legend-icon fba__legend-icon--purple"><HistoryIcon /></span>
          <span>— История пополнений конкретного аккаунта</span>
        </div>
      </div>

      {/* ── Warning banner ── */}
      <div className="fba__warning">
        <span className="fba__warning-icon"><WarnIcon /></span>
        <span>Запросы на пополнения и разблокировки отправляются в агентство 2 раза в день: 09:00 и 14:30 — по Польскому времени</span>
      </div>

      {/* ── Action buttons ── */}
      <div className="fba__actions-bar">
        <button className="fba__bar-btn fba__bar-btn--blue"   onClick={openAdd}>Добавить аккаунт</button>
        <button className="fba__bar-btn fba__bar-btn--purple" onClick={() => setTransferModal(true)}>Перевод/Вывод</button>
      </div>

      {/* ── Table ── */}
      <div className="fba__table-card">
        <div className="fba__table-scroll">
          <table className="fba__table">
            <thead>
              <tr>
                <th>Имя</th>
                <th>Account ID</th>
                <th>Статус Пополнения</th>
                <th>Статус Разблокировки</th>
                <th>Статус Перевода/Вывода</th>
                <th>Пополнение</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {accounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="fba__empty">Нет аккаунтов</td>
                </tr>
              ) : (
                accounts.map((acc) => (
                  <tr key={acc.id}>
                    <td>{acc.name}</td>
                    <td>{acc.accountId}</td>
                    <td><TopUpBadge    status={acc.topUpStatus}    /></td>
                    <td><span className="fba__dash">—</span></td>
                    <td><TransferBadge status={acc.transferStatus} /></td>
                    <td>
                      <button className="fba__topup-btn" onClick={() => setTopUpModal({ id: acc.id, name: acc.name })}>
                        Пополнить
                      </button>
                    </td>
                    <td className="fba__row-actions">
                      <button className="fba__icon-btn fba__icon-btn--red" title="Отправить на разблокировку" onClick={() => handleUnblock(acc)}>
                        <UnblockIcon />
                      </button>
                      <button className="fba__icon-btn fba__icon-btn--blue" title="Редактировать" onClick={() => openEdit(acc)}>
                        <EditIcon />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Top-Up Modal ── */}
      {topUpModal && (
        <TopUpModal
          accName={topUpModal.name}
          onConfirm={handleTopUpConfirm}
          onClose={() => setTopUpModal(null)}
        />
      )}

      {/* ── Transfer Modal ── */}
      {transferModal && (
        <TransferModal
          accounts={accounts}
          onConfirm={handleTransferConfirm}
          onClose={() => setTransferModal(false)}
        />
      )}

      {/* ── Slide-in overlay ── */}
      {panelOpen && <div className="fba__overlay" onClick={closePanel} />}

      {/* ── Slide-in panel ── */}
      <div className={`fba__panel ${panelOpen ? 'fba__panel--open' : ''}`}>
        <div className="fba__panel-header">
          <h3 className="fba__panel-title">{editId ? 'Редактировать аккаунт' : 'Добавить аккаунт'}</h3>
          <button className="fba__panel-close" onClick={closePanel}><CloseIcon /></button>
        </div>

        <form className="fba__form" onSubmit={handleSubmit}>
          <div className="fba__field">
            <label className="fba__label">Имя аккаунта</label>
            <input className="fba__input" placeholder="Имя аккаунта" value={form.name} onChange={f('name')} required />
          </div>

          <div className="fba__field">
            <label className="fba__label">Account ID Facebook</label>
            <input className="fba__input" placeholder="Account ID" value={form.accountId} onChange={f('accountId')} required />
          </div>

          <div className="fba__field">
            <label className="fba__label">Статус пополнения</label>
            <select className="fba__input" value={form.topUpType} onChange={f('topUpType')}>
              <option value="">— нет —</option>
              <option value="topped_up">Пополнено</option>
              <option value="appeal">Подана апелляция</option>
              <option value="waiting">В ожидании</option>
            </select>
          </div>

          {form.topUpType === 'topped_up' && (
            <div className="fba__field">
              <label className="fba__label">Сумма пополнения ($)</label>
              <input className="fba__input" type="number" min="0" step="0.01"
                placeholder="0.00" value={form.topUpAmount} onChange={f('topUpAmount')} />
            </div>
          )}

          <div className="fba__field">
            <label className="fba__label">Статус перевода/вывода</label>
            <select className="fba__input" value={form.transferType} onChange={f('transferType')}>
              <option value="">— нет —</option>
              <option value="withdrawn">Выведен</option>
            </select>
          </div>

          {form.transferType === 'withdrawn' && (
            <div className="fba__field">
              <label className="fba__label">Сумма вывода ($)</label>
              <input className="fba__input" type="number" min="0" step="0.01"
                placeholder="0.00" value={form.transferAmount} onChange={f('transferAmount')} />
            </div>
          )}

          <button className="fba__submit-btn" type="submit">
            {editId ? 'Сохранить' : 'Добавить аккаунт'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FbAccountsPage;

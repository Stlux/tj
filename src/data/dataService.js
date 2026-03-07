/**
 * dataService.js
 * ─────────────────────────────────────────────────────────────────
 * JSON "database" stored in localStorage (seeded from src/db.json).
 *
 * ── SCHEMA ──────────────────────────────────────────────────────
 * accounts[]  { id, name, platform }
 * records[]   { id, accountId, date (YYYY-MM-DD), fbSpend, consumables, revenue }
 *
 * ── FORMULAS ────────────────────────────────────────────────────
 *   Профит = Доход  − Расход ФБ − Расходники
 *   ROI    = Профит / (Расход ФБ + Расходники) × 100
 */

import seedData from '../db.json';

const STORAGE_KEY = 'tj_db_v1';
const SEED_KEY    = 'tj_seed_v1'; // fingerprint of db.json to detect changes

// ── Internal helpers ─────────────────────────────────────────────

function getDB() {
  // Serialize the current db.json to detect if it changed since last load
  const currentSeed = JSON.stringify(seedData);

  try {
    const storedSeed = localStorage.getItem(SEED_KEY);

    if (storedSeed !== currentSeed) {
      // db.json was edited — wipe old data and re-seed automatically
      const fresh = JSON.parse(currentSeed);
      localStorage.setItem(SEED_KEY,    currentSeed);
      localStorage.setItem(STORAGE_KEY, currentSeed);
      return fresh;
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}

  // First visit — seed from db.json
  const initial = JSON.parse(currentSeed);
  localStorage.setItem(SEED_KEY,    currentSeed);
  localStorage.setItem(STORAGE_KEY, currentSeed);
  return initial;
}

function saveDB(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

// ── Date utilities ───────────────────────────────────────────────

/** Date → "YYYY-MM-DD" (local timezone, not UTC) */
export function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** "YYYY-MM-DD" → "DD.MM.YYYY" */
export function fmtDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}

/** Number → "13 344.68$"  (trailing zeros stripped) */
export function fmtMoney(n) {
  const s = parseFloat(n.toFixed(2)).toString();
  const [int, dec] = s.split('.');
  const intFmt = int.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0'); // non-breaking space
  return dec ? `${intFmt}.${dec}$` : `${intFmt}$`;
}

/** Number → "43.82%" */
export function fmtPct(n) {
  return `${n.toFixed(2)}%`;
}

// ── Preset date ranges ───────────────────────────────────────────

export const PRESETS = [
  { key: 'today',     label: 'Сегодня' },
  { key: 'yesterday', label: 'Вчера' },
  { key: '7days',     label: 'Последние 7 дней' },
  { key: '14days',    label: 'Последние 14 дней' },
  { key: '30days',    label: 'Последние 30 дней' },
  { key: 'thisMonth', label: 'Этот месяц' },
];

/** Returns { from: "YYYY-MM-DD", to: "YYYY-MM-DD" } */
export function getPresetRange(key) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const to = toISO(today);

  switch (key) {
    case 'today':
      return { from: to, to };

    case 'yesterday': {
      const d = new Date(today);
      d.setDate(d.getDate() - 1);
      const s = toISO(d);
      return { from: s, to: s };
    }

    case '7days': {
      const d = new Date(today);
      d.setDate(d.getDate() - 6);
      return { from: toISO(d), to };
    }

    case '14days': {
      const d = new Date(today);
      d.setDate(d.getDate() - 13);
      return { from: toISO(d), to };
    }

    case '30days': {
      const d = new Date(today);
      d.setDate(d.getDate() - 29);
      return { from: toISO(d), to };
    }

    case 'thisMonth': {
      const d = new Date(today.getFullYear(), today.getMonth(), 1);
      return { from: toISO(d), to };
    }

    default:
      return { from: to, to };
  }
}

// ── Core formula ─────────────────────────────────────────────────

/**
 * Aggregate an array of records into { fbSpend, consumables, revenue, profit, roi }.
 *
 *   profit = revenue − fbSpend − consumables
 *   roi    = profit  / (fbSpend + consumables) × 100
 */
export function calcStats(records) {
  const fbSpend     = records.reduce((s, r) => s + (r.fbSpend     || 0), 0);
  const consumables = records.reduce((s, r) => s + (r.consumables || 0), 0);
  const revenue     = records.reduce((s, r) => s + (r.revenue     || 0), 0);

  const profit = revenue - fbSpend - consumables;
  const cost   = fbSpend + consumables;
  const roi    = cost > 0 ? (profit / cost) * 100 : 0;

  return {
    fbSpend:      round2(fbSpend),
    consumables:  round2(consumables),
    revenue:      round2(revenue),
    profit:       round2(profit),
    roi:          round2(roi),
  };
}

// ── Records ──────────────────────────────────────────────────────

export function getAllRecords() {
  return getDB().records;
}

export function getRecordsByRange(from, to) {
  return getDB().records.filter(r => r.date >= from && r.date <= to);
}

/**
 * Add a daily record.
 * @param {{ accountId, date, fbSpend, consumables, revenue }} data
 */
export function addRecord(data) {
  const db  = getDB();
  const rec = { id: `rec_${Date.now()}`, ...data };
  db.records.push(rec);
  db.records.sort((a, b) => a.date.localeCompare(b.date));
  saveDB(db);
  return rec;
}

export function updateRecord(id, updates) {
  const db = getDB();
  const i  = db.records.findIndex(r => r.id === id);
  if (i !== -1) {
    db.records[i] = { ...db.records[i], ...updates };
    saveDB(db);
    return db.records[i];
  }
  return null;
}

export function deleteRecord(id) {
  const db = getDB();
  db.records = db.records.filter(r => r.id !== id);
  saveDB(db);
}

// ── Accounts ─────────────────────────────────────────────────────

export function getAccounts() {
  return getDB().accounts;
}

/**
 * Per-account aggregated stats for the given date range.
 * Returns array of { id, name, platform, fbSpend, consumables, revenue, profit, roi }.
 */
export function getAccountStats(from, to) {
  const db      = getDB();
  const records = db.records.filter(r => r.date >= from && r.date <= to);

  return db.accounts.map((acc, idx) => {
    const accRecords = records.filter(r => r.accountId === acc.id);
    const stats      = calcStats(accRecords);
    return {
      rowNum: idx + 1,
      id:     acc.id,
      name:   acc.name,
      platform: acc.platform,
      days:   accRecords.length,
      ...stats,
    };
  });
}

// ── Orders ────────────────────────────────────────────────────────

export function getOrdersByRange(from, to) {
  const db = getDB();
  return (db.orders || [])
    .filter((o) => o.createdAt >= from && o.createdAt <= to)
    .sort((a, b) => b.num - a.num);
}

/** Sum of order amounts for the given date range */
export function getOrdersTotal(from, to) {
  const db = getDB();
  return round2(
    (db.orders || [])
      .filter((o) => o.createdAt >= from && o.createdAt <= to)
      .reduce((s, o) => s + (Number(o.amount) || 0), 0)
  );
}

export function getAllOrders() {
  const db = getDB();
  return (db.orders || []).slice().sort((a, b) => b.num - a.num);
}

export function addOrder(title, qty = 1, amount = 0, author = 'KirillLikholetov') {
  const db = getDB();
  if (!db.orders) db.orders = [];
  const maxNum = db.orders.reduce((m, o) => Math.max(m, o.num || 0), 0);
  const num    = maxNum + 1;
  const today  = new Date().toISOString().slice(0, 10);
  const order  = {
    id:          `ord_${num}`,
    num,
    author,
    createdAt:   today,
    completedAt: null,
    title,
    executor:    '',
    qty,
    amount,
    status:      'pending',
    deadline:    null,
  };
  db.orders.push(order);
  saveDB(db);
  return order;
}

// ── Spend Model ─────────────────────────────────────────────────

export function getAllSpendRecords() {
  const db = getDB();
  const list = (db.spendRecords || []).slice();
  list.sort((a, b) => b.date.localeCompare(a.date));
  return list;
}

export function addSpendRecord(data) {
  const db = getDB();
  if (!db.spendRecords) db.spendRecords = [];
  const rec = { id: `spend_${Date.now()}`, ...data };
  db.spendRecords.push(rec);
  saveDB(db);
  return rec;
}

export function updateSpendRecord(id, updates) {
  const db = getDB();
  if (!db.spendRecords) return null;
  const i = db.spendRecords.findIndex((r) => r.id === id);
  if (i !== -1) {
    db.spendRecords[i] = { ...db.spendRecords[i], ...updates };
    saveDB(db);
    return db.spendRecords[i];
  }
  return null;
}

export function deleteSpendRecord(id) {
  const db = getDB();
  if (!db.spendRecords) return;
  db.spendRecords = db.spendRecords.filter((r) => r.id !== id);
  saveDB(db);
}

// ── FB Accounts ──────────────────────────────────────────────────

export function getAllFbAccounts() {
  return getDB().fbAccounts || [];
}

export function addFbAccount(data) {
  const db = getDB();
  if (!db.fbAccounts) db.fbAccounts = [];
  const acc = { id: `fba_${Date.now()}`, ...data };
  db.fbAccounts.push(acc);
  saveDB(db);
  return acc;
}

export function updateFbAccount(id, updates) {
  const db = getDB();
  if (!db.fbAccounts) return null;
  const i = db.fbAccounts.findIndex((a) => a.id === id);
  if (i !== -1) {
    db.fbAccounts[i] = { ...db.fbAccounts[i], ...updates };
    saveDB(db);
    return db.fbAccounts[i];
  }
  return null;
}

export function deleteFbAccount(id) {
  const db = getDB();
  if (!db.fbAccounts) return;
  db.fbAccounts = db.fbAccounts.filter((a) => a.id !== id);
  saveDB(db);
}

// ── Expenses ─────────────────────────────────────────────────────

export function getAllExpenses() {
  const db = getDB();
  const list = (db.expenses || []).slice();
  list.sort((a, b) => b.date.localeCompare(a.date));
  return list;
}

export function addExpense(data) {
  const db = getDB();
  if (!db.expenses) db.expenses = [];
  const exp = { id: `exp_${Date.now()}`, ...data };
  db.expenses.push(exp);
  saveDB(db);
  return exp;
}

export function updateExpense(id, updates) {
  const db = getDB();
  if (!db.expenses) return null;
  const i = db.expenses.findIndex((e) => e.id === id);
  if (i !== -1) {
    db.expenses[i] = { ...db.expenses[i], ...updates };
    saveDB(db);
    return db.expenses[i];
  }
  return null;
}

export function deleteExpense(id) {
  const db = getDB();
  if (!db.expenses) return;
  db.expenses = db.expenses.filter((e) => e.id !== id);
  saveDB(db);
}

// ── Conversions ──────────────────────────────────────────────────

/**
 * Returns conversions filtered by date range (YYYY-MM-DD prefix match on conversionTime).
 */
export function getConversionsByRange(from, to) {
  const db = getDB();
  const convs = db.conversions || [];
  return convs.filter((c) => {
    const day = c.conversionTime ? c.conversionTime.slice(0, 10) : '';
    return day >= from && day <= to;
  });
}

/** Unique campaign names from all conversions */
export function getConversionCampaigns() {
  const db = getDB();
  const convs = db.conversions || [];
  return [...new Set(convs.map((c) => c.campaign))];
}

/**
 * Calculates profit stats for a given date range.
 * Revenue = sum of conversions with origStatus === 'sale'
 * Expenses = sum of all expense records in range
 * Profit   = Revenue − Expenses
 * ROI      = Profit / Expenses × 100
 */
export function getProfitStats(from, to) {
  const db = getDB();

  const salesConvs = (db.conversions || []).filter((c) => {
    const day = c.conversionTime ? c.conversionTime.slice(0, 10) : '';
    return day >= from && day <= to && c.origStatus === 'sale';
  });
  const revenue = round2(salesConvs.reduce((s, c) => s + (Number(c.revenue) || 0), 0));

  const periodExpenses = (db.expenses || []).filter((e) => e.date >= from && e.date <= to);
  const expenses = round2(periodExpenses.reduce((s, e) => s + (Number(e.amount) || 0), 0));

  const profit = round2(revenue - expenses);
  const roi    = expenses > 0 ? round2((profit / expenses) * 100) : 0;

  return {
    revenue,
    expenses,
    profit,
    roi,
    salesCount: salesConvs.length,
    expenseRows: periodExpenses,
  };
}

/** Wipe localStorage and re-seed from db.json (useful for dev). */
export function resetDB() {
  const initial = JSON.parse(JSON.stringify(seedData));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

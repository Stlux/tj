import React, { useState, useRef, useEffect } from 'react';
import './DateRangePicker.css';
import { PRESETS, getPresetRange, fmtDate, toISO } from '../data/dataService';

/* ── Icons ── */
const CalIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8"  y1="2" x2="8"  y2="6" />
    <line x1="3"  y1="10" x2="21" y2="10" />
  </svg>
);

const ChevronDown = ({ open }) => (
  <svg
    width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
    style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/**
 * DateRangePicker
 *
 * Props:
 *   value   – { from: "YYYY-MM-DD", to: "YYYY-MM-DD", label?: string }
 *   onApply – ({ from, to, label }) => void
 *   onReset – () => void
 */
function DateRangePicker({ value, onApply, onReset }) {
  const defaultDraft = value || getPresetRange('7days');

  const [open, setOpen]               = useState(false);
  const [activePreset, setActivePreset] = useState('7days');
  const [draft, setDraft]             = useState(defaultDraft);

  const wrapRef = useRef(null);

  // Keep draft in sync when value changes externally
  useEffect(() => {
    if (value) setDraft({ from: value.from, to: value.to });
  }, [value]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const selectPreset = (key) => {
    const r = getPresetRange(key);
    setDraft(r);
    setActivePreset(key);
  };

  const handleDateChange = (field, val) => {
    setDraft(prev => ({ ...prev, [field]: val }));
    setActivePreset(null); // custom range → no preset highlighted
  };

  const handleApply = () => {
    const label = activePreset
      ? PRESETS.find(p => p.key === activePreset)?.label
      : `${fmtDate(draft.from)} — ${fmtDate(draft.to)}`;
    onApply({ ...draft, label });
    setOpen(false);
  };

  const handleReset = () => {
    const r = getPresetRange('7days');
    setDraft(r);
    setActivePreset('7days');
    onReset?.();
    setOpen(false);
  };

  const triggerLabel = value?.label
    || (value ? `${fmtDate(value.from)} — ${fmtDate(value.to)}` : 'Выберите период');

  const today = toISO(new Date());

  return (
    <div className="drp" ref={wrapRef}>
      {/* ── Trigger ── */}
      <button className={`drp__trigger ${open ? 'drp__trigger--open' : ''}`}
        onClick={() => setOpen(o => !o)}>
        <span className="drp__trigger-icon"><CalIcon /></span>
        <span className="drp__trigger-label">{triggerLabel}</span>
        <span className="drp__trigger-chevron"><ChevronDown open={open} /></span>
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div className="drp__dropdown">
          <div className="drp__body">

            {/* Presets column */}
            <div className="drp__presets">
              <div className="drp__col-title">Быстрый выбор</div>
              {PRESETS.map(p => (
                <button
                  key={p.key}
                  className={`drp__preset ${activePreset === p.key ? 'drp__preset--active' : ''}`}
                  onClick={() => selectPreset(p.key)}
                >
                  {activePreset === p.key && <span className="drp__preset-dot" />}
                  {p.label}
                </button>
              ))}
            </div>

            {/* Vertical divider */}
            <div className="drp__vdivider" />

            {/* Date inputs column */}
            <div className="drp__range">
              <div className="drp__col-title">Диапазон дат</div>
              <div className="drp__inputs">
                <div className="drp__input-group">
                  <label htmlFor="drp-from">От</label>
                  <input
                    id="drp-from"
                    type="date"
                    value={draft.from}
                    max={draft.to || today}
                    onChange={e => handleDateChange('from', e.target.value)}
                  />
                </div>
                <div className="drp__input-arrow">→</div>
                <div className="drp__input-group">
                  <label htmlFor="drp-to">До</label>
                  <input
                    id="drp-to"
                    type="date"
                    value={draft.to}
                    min={draft.from}
                    max={today}
                    onChange={e => handleDateChange('to', e.target.value)}
                  />
                </div>
              </div>

              {/* Selected range preview */}
              {draft.from && draft.to && (
                <div className="drp__preview">
                  {fmtDate(draft.from)} — {fmtDate(draft.to)}
                </div>
              )}
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="drp__actions">
            <button className="btn btn--danger" onClick={handleReset}>Сбросить</button>
            <button className="btn btn--primary" onClick={handleApply}>Применить</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DateRangePicker;

import React, { useState, useMemo } from 'react';
import './ConversionsPage.css';
import DateRangePicker from './DateRangePicker';
import {
  getPresetRange,
  getConversionsByRange,
  getConversionCampaigns,
  fmtMoney,
} from '../data/dataService';

/* ── Icons ── */
const RefreshIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0114.13-3.88L23 10M1 14l5.36 5.36A9 9 0 0020.49 15" />
  </svg>
);

const ChevronIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

function ConversionsPage() {
  const [range, setRange] = useState(() => ({
    ...getPresetRange('7days'),
    label: 'Последние 7 дней',
  }));

  const [campaignFilter, setCampaignFilter] = useState('');
  const [subidSearch,    setSubidSearch]    = useState('');
  const [campaignOpen,   setCampaignOpen]   = useState(false);

  const handleApply = (r) => setRange(r);
  const handleReset = () =>
    setRange({ ...getPresetRange('7days'), label: 'Последние 7 дней' });

  const allConversions = useMemo(
    () => getConversionsByRange(range.from, range.to),
    [range],
  );

  const campaigns = useMemo(() => getConversionCampaigns(), []);

  const filtered = useMemo(() => {
    let rows = allConversions;
    if (campaignFilter) rows = rows.filter((c) => c.campaign === campaignFilter);
    if (subidSearch.trim()) {
      const q = subidSearch.trim().toLowerCase();
      rows = rows.filter(
        (c) =>
          (c.sub1 || '').toLowerCase().includes(q) ||
          (c.sub2 || '').toLowerCase().includes(q) ||
          (c.sub3 || '').toLowerCase().includes(q) ||
          (c.sub4 || '').toLowerCase().includes(q),
      );
    }
    return rows;
  }, [allConversions, campaignFilter, subidSearch]);

  const salesTotal = useMemo(
    () => filtered
      .filter((c) => c.origStatus === 'sale')
      .reduce((s, c) => s + (Number(c.revenue) || 0), 0),
    [filtered],
  );

  return (
    <div className="cp">
      {/* ── Page header ── */}
      <div className="cp__header">
        <h2 className="cp__title">Лог конверсий</h2>

        <div className="cp__header-right">
          <DateRangePicker value={range} onApply={handleApply} onReset={handleReset} />
          <button className="cp__icon-btn" aria-label="Обновить" onClick={() => setRange({ ...range })}>
            <RefreshIcon />
          </button>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="cp__filters">
        {/* Campaign dropdown */}
        <div className="cp__dropdown-wrap">
          <button
            className="cp__dropdown-btn"
            onClick={() => setCampaignOpen((v) => !v)}
          >
            <span>{campaignFilter ? campaignFilter.slice(0, 28) + '…' : 'Кампании'}</span>
            <ChevronIcon />
          </button>
          {campaignOpen && (
            <div className="cp__dropdown-menu">
              <div
                className={`cp__dropdown-item ${!campaignFilter ? 'cp__dropdown-item--active' : ''}`}
                onClick={() => { setCampaignFilter(''); setCampaignOpen(false); }}
              >
                Все кампании
              </div>
              {campaigns.map((c) => (
                <div
                  key={c}
                  className={`cp__dropdown-item ${campaignFilter === c ? 'cp__dropdown-item--active' : ''}`}
                  onClick={() => { setCampaignFilter(c); setCampaignOpen(false); }}
                >
                  {c}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sub ID search */}
        <input
          className="cp__search"
          type="text"
          placeholder="Искать subid"
          value={subidSearch}
          onChange={(e) => setSubidSearch(e.target.value)}
        />

        <button className="cp__filters-btn">Фильтры</button>
      </div>

      {/* ── Table ── */}
      <div className="cp__table-card">
        <div className="cp__table-scroll">
          <table className="cp__table">
            <thead>
              <tr>
                <th>ID конверсии</th>
                <th>Кампания</th>
                <th>Оффер</th>
                <th>Время конверсии</th>
                <th>Период пр</th>
                <th>Статус</th>
                <th>Ориг. статус</th>
                <th>Доход</th>
                <th>Sub ID 1</th>
                <th>Sub ID 2</th>
                <th>Sub ID 3</th>
                <th>Sub ID 4</th>
                <th>Модель устройства</th>
                <th>Город</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={14} className="cp__empty">
                    Нет данных за выбранный период
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id}>
                    <td className="cp__id-cell" title={c.id}>{c.id.slice(0, 18)}…</td>
                    <td className="cp__campaign-cell" title={c.campaign}>{c.campaign}</td>
                    <td className="cp__offer-cell"    title={c.offer}>{c.offer}</td>
                    <td className="cp__time-cell">{c.conversionTime}</td>
                    <td>{c.period || ''}</td>
                    <td>
                      <span className={`cp__badge ${c.origStatus === 'sale' ? 'cp__badge--green' : 'cp__badge--blue'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="cp__orig-status">{c.origStatus}</td>
                    <td className={c.revenue > 0 ? 'cp__positive' : 'cp__muted'}>
                      {fmtMoney(c.revenue)}
                    </td>
                    <td>{c.sub1 || ''}</td>
                    <td>{c.sub2 || ''}</td>
                    <td>{c.sub3 || ''}</td>
                    <td>{c.sub4 || ''}</td>
                    <td>{c.deviceModel || ''}</td>
                    <td>{c.city || ''}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="cp__table-footer">
          <span>Показано: {filtered.length} из {allConversions.length} конверсий</span>
          <span className="cp__footer-sales">Сумма продаж: <strong>{fmtMoney(salesTotal)}</strong></span>
        </div>
      </div>
    </div>
  );
}

export default ConversionsPage;

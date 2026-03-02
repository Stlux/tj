import React, { useState } from 'react';
import './Sidebar.css';

/* ── Icons ── */
const BarChartIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6"  y1="20" x2="6"  y2="14" />
    <line x1="2"  y1="20" x2="22" y2="20" />
  </svg>
);

const WalletIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const ShopIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const BookIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const ChevronIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* ── Nav config ── */
const NAV = [
  {
    id: 'reports',
    label: 'Отчёты',
    icon: <BarChartIcon />,
    children: ['Профит', 'uEPC', 'Креативы', 'Калы', 'Спенд Модель'],
  },
  {
    id: 'finances',
    label: 'Финансы',
    icon: <WalletIcon />,
    children: ['Расходы', 'ФБ Аккаунты', 'Спенд модель'],
  },
  {
    id: 'shop',
    label: 'Магазин',
    icon: <ShopIcon />,
    children: ['Мои заказы', 'Заказ расходников'],
  },
  {
    id: 'education',
    label: 'Обучение',
    icon: <BookIcon />,
    children: ['База знаний'],
  },
];

function Sidebar({ isOpen, activePage, onNavigate }) {
  const [expanded, setExpanded] = useState({
    reports: true,
    finances: true,
    shop: true,
    education: true,
  });

  const toggle = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : 'sidebar--closed'}`}>
      {/* User info */}
      <div className="sidebar__user">
        <div className="sidebar__avatar">K</div>
        <div className="sidebar__user-info">
          <div className="sidebar__user-name">Hi, KirillLikholetov</div>
          <div className="sidebar__user-email">beaxheam77@gmail.com</div>
        </div>
      </div>
      <div className="sidebar__divider" />

      {/* Navigation */}
      <nav className="sidebar__nav">
        {NAV.map((item) => {
          const active = activePage === item.id;
          const open = expanded[item.id];
          return (
            <div
              key={item.id}
              className={`sidebar__section ${active ? 'sidebar__section--active' : ''}`}
            >
              <button
                className="sidebar__section-btn"
                onClick={() => { toggle(item.id); onNavigate(item.id); }}
              >
                <span className="sidebar__section-icon">{item.icon}</span>
                <span className="sidebar__section-label">{item.label}</span>
                <span className={`sidebar__chevron ${open ? 'sidebar__chevron--open' : ''}`}>
                  <ChevronIcon />
                </span>
              </button>

              {open && (
                <ul className="sidebar__submenu">
                  {item.children.map((child) => (
                    <li key={child} className="sidebar__submenu-item">
                      <span className="sidebar__submenu-dot" />
                      <span>{child}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;

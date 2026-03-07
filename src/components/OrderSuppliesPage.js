import React, { useState, useEffect } from 'react';
import './OrderSuppliesPage.css';
import { addOrder } from '../data/dataService';

/* ─── Schedule Cards ─── */
const SCHEDULES = [
  { title: 'Заказы доменов' },
  { title: 'Заказы Прокси' },
  { title: 'Заказы Аккаунтов, Соц, БМ, Фанок' },
];

const SCHEDULE_ROWS = [
  { day: 'Пн - Пт', time: '08:00 - 15:00' },
  { day: 'Сб',       time: 'Выходной' },
  { day: 'Вс',       time: 'Выходной' },
];

/* ─── Icon components ─── */
const FbIcon = () => (
  <div className="os__icon os__icon--fb">
    <svg viewBox="0 0 36 36" width="52" height="52">
      <circle cx="18" cy="18" r="18" fill="#1877F2" />
      <path
        d="M24.5 18H20v-2.5c0-1.1.9-1.5 1.5-1.5H24V10h-3c-3.3 0-5 2.2-5 5v3h-3v4h3v9h4v-9h2.5l1-4z"
        fill="#fff"
      />
    </svg>
  </div>
);

const NamecheapIcon = () => (
  <div className="os__icon os__icon--namecheap">
    <svg viewBox="0 0 52 52" width="52" height="52">
      <circle cx="26" cy="26" r="26" fill="#DE5000" />
      <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle"
        fill="#fff" fontSize="28" fontWeight="700" fontFamily="Arial, sans-serif">N</text>
    </svg>
  </div>
);

const CreativeIcon = () => (
  <div className="os__icon">
    <svg viewBox="0 0 52 52" width="52" height="52">
      <rect x="4" y="4" width="44" height="44" rx="12" fill="#3B82F6" />
      {/* pencil */}
      <rect x="22" y="8" width="6" height="26" rx="3" fill="#FDE68A" transform="rotate(-15,26,26)" />
      <polygon points="24,36 28,36 26,42" fill="#F87171" transform="rotate(-15,26,26)" />
      {/* brush */}
      <rect x="28" y="10" width="5" height="24" rx="2.5" fill="#A78BFA" transform="rotate(10,26,26)" />
      <ellipse cx="30" cy="35" rx="3" ry="5" fill="#60A5FA" transform="rotate(10,26,26)" />
    </svg>
  </div>
);

const PwaIcon = () => (
  <div className="os__icon os__icon--pwa">
    <svg viewBox="0 0 52 52" width="52" height="52">
      <rect x="0" y="0" width="52" height="52" rx="10" fill="#4F46E5" />
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle"
        fill="#fff" fontSize="13" fontWeight="700" fontFamily="Arial, sans-serif"
        letterSpacing="0.5">PWA</text>
    </svg>
  </div>
);

const WindowsIcon = () => (
  <div className="os__icon">
    <svg viewBox="0 0 52 52" width="52" height="52">
      <rect x="4" y="4" width="20" height="20" rx="3" fill="#00ADEF" />
      <rect x="28" y="4" width="20" height="20" rx="3" fill="#00ADEF" />
      <rect x="4" y="28" width="20" height="20" rx="3" fill="#00ADEF" />
      <rect x="28" y="28" width="20" height="20" rx="3" fill="#00ADEF" />
    </svg>
  </div>
);

const VpnIcon = () => (
  <div className="os__icon">
    <svg viewBox="0 0 52 52" width="52" height="52">
      <rect x="0" y="0" width="52" height="52" rx="10" fill="#2563EB" />
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle"
        fill="#fff" fontSize="13" fontWeight="700" fontFamily="Arial, sans-serif"
        letterSpacing="0.5">VPN</text>
    </svg>
  </div>
);

const DollarIcon = () => (
  <div className="os__icon">
    <svg viewBox="0 0 52 52" width="52" height="52">
      <circle cx="26" cy="26" r="24" fill="none" stroke="#22C55E" strokeWidth="4" />
      <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle"
        fill="#22C55E" fontSize="28" fontWeight="700" fontFamily="Arial, sans-serif">$</text>
    </svg>
  </div>
);

/* ─── Products ─── */
const PRODUCTS = [
  { id: 1,  icon: <NamecheapIcon />, title: 'Домены - от 2$ до 15$',                                   hasQty: false, btnLabel: 'Заказать',      btnClass: 'os__btn--blue' },
  { id: 2,  icon: <FbIcon />,        title: 'Гибкий сет аккаунтов\n[ Агентский ]',                     hasQty: false, btnLabel: 'Заказать',      btnClass: 'os__btn--blue' },
  { id: 3,  icon: <FbIcon />,        title: 'Пакет настроек для запуска в ФБ - 50$\n- [ Агентский ]',   hasQty: false, btnLabel: 'Заказать',      btnClass: 'os__btn--blue' },
  { id: 4,  icon: <FbIcon />,        title: 'Аккаунт для запуска в ФБ - 10$\n- [ Агентский UL Digital ]', hasQty: false, btnLabel: 'Заказать',   btnClass: 'os__btn--blue' },
  { id: 5,  icon: <FbIcon />,        title: 'Аккаунт для запуска в ФБ - 50$\n[ Аккаунт лимит 250$ ]',  hasQty: false, btnLabel: 'Заказать',      btnClass: 'os__btn--blue' },
  { id: 6,  icon: <FbIcon />,        title: 'Аккаунт для запуска в ФБ - 100$\n[ Аккаунт лимит 1500$ ]',hasQty: false, btnLabel: 'Заказать',      btnClass: 'os__btn--blue' },
  { id: 7,  icon: <FbIcon />,        title: 'Аккаунт для запуска в ФБ - 80$\n[ short ID ]',             hasQty: false, btnLabel: 'Заказать',      btnClass: 'os__btn--blue' },
  { id: 8,  icon: <FbIcon />,        title: 'Социальный аккаунт - 19$',                                hasQty: true,  btnLabel: 'Заказать',      btnClass: 'os__btn--blue' },
  { id: 9,  icon: <FbIcon />,        title: 'Социальный аккаунт - 10.50$',                             hasQty: true,  btnLabel: 'Заказать',      btnClass: 'os__btn--blue' },
  { id: 10, icon: <FbIcon />,        title: 'Социальный аккаунт - 13$\n[ Агентский UL Digital ]',      hasQty: true,  btnLabel: 'Заказать',      btnClass: 'os__btn--blue' },
  { id: 11, icon: <FbIcon />,        title: 'Business manager - 17$',                                  hasQty: true,  btnLabel: 'Заказать',      btnClass: 'os__btn--blue' },
  { id: 12, icon: <FbIcon />,        title: 'Business Manager - 12$\n[ Агентский UL Digital ]',         hasQty: true,  btnLabel: 'Заказать',      btnClass: 'os__btn--blue' },
  { id: 13, icon: <FbIcon />,        title: 'Business manager - 7$',                                   hasQty: true,  btnLabel: 'Заказать',      btnClass: 'os__btn--blue', badge: '?' },
  { id: 14, icon: <FbIcon />,        title: 'Fun Page - 8$ / шт',                                      hasQty: true,  btnLabel: 'Заказать',      btnClass: 'os__btn--blue' },
  { id: 15, icon: <FbIcon />,        title: 'Fun Page - 1$ / шт\n[ Агентский UL Digital ]',            hasQty: true,  btnLabel: 'Заказать',      btnClass: 'os__btn--blue' },
  { id: 16, icon: <CreativeIcon />,  title: 'Дизайн креатива - 0$',                                    hasQty: false, btnLabel: 'Заказать',      btnClass: 'os__btn--blue' },
  { id: 17, icon: <PwaIcon />,       title: 'Дизайн PWA - 0$',                                         hasQty: false, btnLabel: 'Заказать',      btnClass: 'os__btn--blue' },
  { id: 18, icon: <WindowsIcon />,   title: 'RDP - (Remote Desktop Protocol) - 25$',                   hasQty: true,  btnLabel: 'Заказать',      btnClass: 'os__btn--blue' },
  { id: 19, icon: <VpnIcon />,       title: 'VPN - от 5$ до 7$',                                       hasQty: false, btnLabel: 'Заказать',      btnClass: 'os__btn--blue' },
  { id: 20, icon: <DollarIcon />,    title: 'Кастомные расходы',                                        hasQty: false, btnLabel: 'Создать расход', btnClass: 'os__btn--blue' },
];

function ProductCard({ product, onOrderClick }) {
  const [qty, setQty] = useState(1);

  const lines = product.title.split('\n');

  return (
    <div className="os__card os__card--product">
      {product.badge && (
        <span className="os__badge os__badge--corner">{product.badge}</span>
      )}
      {product.icon}
      <p className="os__product-title">
        {lines.map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < lines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
      <div className="os__card-footer">
        {product.hasQty && (
          <input
            type="number"
            className="os__qty-input"
            value={qty}
            min={1}
            onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
          />
        )}
        <button
          className={`os__btn ${product.btnClass}`}
          onClick={() => onOrderClick(product, qty)}
        >
          {product.btnLabel}
        </button>
      </div>
    </div>
  );
}

/* ─── Confirm Modal ─── */
function ConfirmModal({ product, qty, onConfirm, onClose }) {
  if (!product) return null;
  const lines = product.title.split('\n');
  return (
    <div className="os__overlay" onClick={onClose}>
      <div className="os__modal" onClick={(e) => e.stopPropagation()}>
        <button className="os__modal-close" onClick={onClose} aria-label="Закрыть">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="os__modal-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3B82F6"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 className="os__modal-title">Подтвердите заказ</h3>
        <p className="os__modal-text">
          Вы действительно хотите заказать
          <br />
          <strong>
            {lines.map((l, i) => (
              <React.Fragment key={i}>{l}{i < lines.length - 1 && <br />}</React.Fragment>
            ))}
          </strong>
          {qty > 1 && <span className="os__modal-qty"> × {qty}</span>}
          ?
        </p>
        <div className="os__modal-actions">
          <button className="os__btn os__btn--ghost" onClick={onClose}>Отмена</button>
          <button className="os__btn os__btn--blue" onClick={onConfirm}>Заказать</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Success Toast ─── */
function Toast({ visible }) {
  if (!visible) return null;
  return (
    <div className="os__toast">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff"
        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
      Успешно — заказ создан
    </div>
  );
}

export default function OrderSuppliesPage() {
  const [modalProduct, setModalProduct] = useState(null);
  const [modalQty,     setModalQty]     = useState(1);
  const [toast,        setToast]        = useState(false);

  const handleOrderClick = (product, qty) => {
    setModalProduct(product);
    setModalQty(qty);
  };

  const handleConfirm = () => {
    addOrder(modalProduct.title.replace(/\n/g, ' '), modalQty);
    setModalProduct(null);
    setToast(true);
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="os__page">
      <Toast visible={toast} />

      <ConfirmModal
        product={modalProduct}
        qty={modalQty}
        onConfirm={handleConfirm}
        onClose={() => setModalProduct(null)}
      />

      {/* Schedule Row */}
      <div className="os__schedule-row">
        {SCHEDULES.map((s) => (
          <div key={s.title} className="os__card os__card--schedule">
            <div className="os__schedule-header">{s.title}</div>
            <div className="os__schedule-subtitle">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              По Польскому Времени
            </div>
            <table className="os__schedule-table">
              <thead>
                <tr>
                  <th>День</th>
                  <th>Время</th>
                </tr>
              </thead>
              <tbody>
                {SCHEDULE_ROWS.map((r) => (
                  <tr key={r.day}>
                    <td>{r.day}</td>
                    <td>{r.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Products Grid */}
      <div className="os__products-grid">
        {PRODUCTS.map((p) => (
          <ProductCard key={p.id} product={p} onOrderClick={handleOrderClick} />
        ))}
      </div>
    </div>
  );
}

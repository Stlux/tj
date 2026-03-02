import React, { useState, useEffect } from 'react';
import './Header.css';

function Header({ onToggleSidebar, title }) {
  const [dateTime, setDateTime] = useState('');

  useEffect(() => {
    const format = () => {
      const now = new Date();
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const day = days[now.getDay()];
      const month = months[now.getMonth()];
      const date = now.getDate();
      const year = now.getFullYear();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      setDateTime(`${day}, ${month} ${date}, ${year} ${hours}:${minutes} ${ampm}`);
    };
    format();
    const interval = setInterval(format, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="header">
      {/* Left zone — aligns visually with sidebar */}
      <div className="header__sidebar-zone">
        <span className="header__logo">Traffic Jam</span>
        <button className="header__burger" onClick={onToggleSidebar} aria-label="Toggle menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Page title */}
      <div className="header__title">
        <span>{title}</span>
      </div>

      {/* Right controls */}
      <div className="header__right">
        <span className="header__datetime">{dateTime}</span>
        <button className="header__icon-btn" aria-label="Dark mode">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>
        <button className="header__icon-btn" aria-label="Logout">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </header>
  );
}

export default Header;

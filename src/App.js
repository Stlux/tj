import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FinancesPage from './components/FinancesPage';
import LoginPage from './components/LoginPage';

const SESSION_KEY = 'tj_session';

function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); } catch { return null; }
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage]   = useState('finances');

  const handleLogin = (u) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(u));
    setUser(u);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  if (!user) return <LoginPage onLogin={handleLogin} />;

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleNavigate = (page) => {
    setActivePage(page);
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };

  return (
    <div className="app">
      <Header onToggleSidebar={toggleSidebar} title="Главная страница" onLogout={handleLogout} />

      <Sidebar
        isOpen={sidebarOpen}
        activePage={activePage}
        onNavigate={handleNavigate}
        user={user}
      />

      {sidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <main className={`app__content ${sidebarOpen ? 'app__content--shifted' : ''}`}>
        {activePage === 'finances' && <FinancesPage />}
      </main>
    </div>
  );
}

export default App;

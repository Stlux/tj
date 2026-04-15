import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FinancesPage from './components/FinancesPage';
import ConversionsPage from './components/ConversionsPage';
import ExpensesPage from './components/ExpensesPage';
import FbAccountsPage from './components/FbAccountsPage';
import SpendModelPage from './components/SpendModelPage';
import MyOrdersPage from './components/MyOrdersPage';
import OrderSuppliesPage from './components/OrderSuppliesPage';
import LoginPage from './components/LoginPage';
import PayoutsPage from './components/PayoutsPage';

const SESSION_KEY = 'tj_session';

function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); } catch { return null; }
  });

  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 768);
  const [activePage, setActivePage]   = useState('reports');

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
        {activePage === 'reports'      && <FinancesPage />}
        {activePage === 'conversions'  && <ConversionsPage />}
        {activePage === 'expenses'     && <ExpensesPage />}
        {activePage === 'fb-accounts'  && <FbAccountsPage />}
        {activePage === 'spend-model'  && <SpendModelPage />}
        {activePage === 'my-orders'      && <MyOrdersPage user={user} />}
        {activePage === 'order-supplies'  && <OrderSuppliesPage />}
        {activePage === 'payouts'           && <PayoutsPage />}
      </main>
    </div>
  );
}

export default App;

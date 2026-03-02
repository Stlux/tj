import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FinancesPage from './components/FinancesPage';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('finances');

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleNavigate = (page) => {
    setActivePage(page);
    // On mobile close the sidebar after tapping a nav item
    if (window.innerWidth <= 768) setSidebarOpen(false);
  };

  return (
    <div className="app">
      <Header onToggleSidebar={toggleSidebar} title="Главная страница" />

      <Sidebar
        isOpen={sidebarOpen}
        activePage={activePage}
        onNavigate={handleNavigate}
      />

      {/* Dim overlay — visible only on mobile when sidebar is open */}
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

import React, { useState } from 'react';
import './LoginPage.css';
import db from '../db.json';

function LoginPage({ onLogin }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate a tiny async delay for feel
    setTimeout(() => {
      const user = db.users.find(
        (u) => u.email === email.trim().toLowerCase() && u.password === password
      );

      if (user) {
        onLogin({ id: user.id, name: user.name, email: user.email });
      } else {
        setError('Неверный email или пароль');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="lp">
      <div className="lp__card">
        {/* Logo */}
        <div className="lp__logo">Traffic Jam</div>
        <p className="lp__sub">Войдите в свой аккаунт</p>

        <form className="lp__form" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="lp__field">
            <label htmlFor="lp-email">Email</label>
            <input
              id="lp-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          {/* Password */}
          <div className="lp__field">
            <label htmlFor="lp-password">Пароль</label>
            <div className="lp__pwd-wrap">
              <input
                id="lp-password"
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="lp__eye"
                onClick={() => setShowPwd((v) => !v)}
                aria-label={showPwd ? 'Скрыть пароль' : 'Показать пароль'}
              >
                {showPwd ? (
                  /* eye-off */
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  /* eye */
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && <div className="lp__error">{error}</div>}

          {/* Submit */}
          <button className="lp__btn" type="submit" disabled={loading}>
            {loading ? <span className="lp__spinner" /> : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;

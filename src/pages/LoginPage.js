import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate a tiny delay
    setTimeout(() => {
      if (username === 'testuser' && password === 'Test123') {
        sessionStorage.setItem('jotish_auth', 'true');
        sessionStorage.setItem('jotish_user', username);
        navigate('/list');
      } else {
        setError('Hmm, that doesn\'t look right. Check your credentials and try again.');
        setLoading(false);
      }
    }, 700);
  };

  return (
    <div className="login-page">
      {/* Decorative blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div className="login-card card fade-up">
        {/* Logo area */}
        <div className="login-logo">
          <i className="fa-solid fa-star logo-icon"></i>
          <h1>DashBoard</h1>
          <p>Welcome back! Sign in to continue.</p>
        </div>

        <form onSubmit={handleLogin} noValidate>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="pass-wrap">
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-pass"
                onClick={() => setShowPass(p => !p)}
                aria-label="Toggle password visibility"
              >
                {showPass ? <i className="fa-solid fa-eye"></i> :  <i className="fa-solid fa-eye-slash"></i>}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-msg fade-in">
              <i className="fa-solid fa-triangle-exclamation"></i> {error}
            </div>
          )}

          <button
            type="submit"
            className={`btn btn-primary login-btn ${loading ? 'loading' : ''}`}
            disabled={loading || !username || !password}
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              <>Sign In <i className="fa-solid fa-arrow-right"></i></>
            )}
          </button>
        </form>

        <p className="hint">
          <i className="fa-solid fa-circle-info"></i> Hint: <code>testuser</code> / <code>Test123</code>
        </p>
      </div>
    </div>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ title, showBack = false }) {
  const navigate  = useNavigate();
  const user      = sessionStorage.getItem('jotish_user') || 'User';

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {showBack && (
          <button className="back-btn" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left"></i> Back
          </button>
        )}
        <div className="nav-brand">
          <i className="fa-solid fa-star nav-logo"></i>
          <span className="nav-title">{title || 'Jotish'}</span>
        </div>
      </div>
      <div className="navbar-right">
        <div className="nav-avatar">{user.charAt(0).toUpperCase()}</div>
        <button className="btn btn-ghost logout-btn" onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket"></i> Logout
        </button>
      </div>
    </nav>
  );
}

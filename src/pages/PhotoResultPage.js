import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './PhotoResultPage.css';

export default function PhotoResultPage() {
  const { state }  = useLocation();
  const navigate   = useNavigate();
  const photoUrl   = state?.photoUrl;
  const employee   = state?.employee;

  const downloadPhoto = () => {
    const link    = document.createElement('a');
    link.href     = photoUrl;
    link.download = `${(employee?.name || 'photo').replace(/\s+/g, '_')}.jpg`;
    link.click();
  };

  if (!photoUrl) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p>No photo found.</p>
        <button className="btn btn-primary" onClick={() => navigate('/list')} style={{ marginTop: 20 }}>
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="photo-page">
      <Navbar title="Photo Result" showBack />

      <div className="photo-container">
        <div className="photo-hero card fade-up">
          <div className="photo-badge">
            <i className="fa-solid fa-camera"></i> Photo Captured!
          </div>
          <h2>Looking great!</h2>
          {employee && <p>Photo taken for <strong>{employee.name}</strong></p>}
        </div>

        <div className="photo-frame card fade-up">
          <img src={photoUrl} alt="Captured" className="photo-img" />
          <div className="photo-overlay">
            <div className="photo-timestamp">
              <i className="fa-regular fa-clock"></i> {new Date().toLocaleString()}
            </div>
          </div>
        </div>

        <div className="photo-actions fade-up">
          <button className="btn btn-primary" onClick={downloadPhoto}>
            <i className="fa-solid fa-download"></i> Save Photo
          </button>
          <button className="btn btn-outline" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-rotate-left"></i> Retake
          </button>
          <button className="btn btn-ghost" onClick={() => navigate('/list')}>
            <i className="fa-solid fa-house"></i> Go to List
          </button>
        </div>

        {employee && (
          <div className="photo-emp-card card fade-up">
            <div className="pec-avatar">{(employee.name || 'U').charAt(0)}</div>
            <div>
              <div className="pec-name">{employee.name}</div>
              <div className="pec-role">{employee.designation} · {employee.city}</div>
            </div>
            <div className="pec-salary">₹{Number(employee.salary).toLocaleString()}</div>
          </div>
        )}
      </div>
    </div>
  );
}

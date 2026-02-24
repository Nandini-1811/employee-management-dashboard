import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { fetchEmployees } from '../api';
import './DetailsPage.css';

function getWorkingDuration(startDate) {
  const start = new Date(startDate.replace(/\//g, '-'));
  const now   = new Date();

  let years  = now.getFullYear() - start.getFullYear();
  let months = now.getMonth()    - start.getMonth();

  if (months < 0) {
    years  -= 1;
    months += 12;
  }

  return { years, months };
}

function getExperienceBadge(years) {
  if (years < 3)  return { label: 'Junior',   color: '#7c72e0' };
  if (years < 7)  return { label: 'Mid-level', color: '#4caf89' };
  if (years < 11) return { label: 'Senior',   color: '#f6a623' };
  return { label: 'Veteran',  color: '#e05757' };
}


export default function DetailsPage() {
  const { id }       = useParams();
  const { state }    = useLocation();
  const navigate     = useNavigate();

  const [employee, setEmployee] = useState(state?.employee || null);
  const [camOpen, setCamOpen]   = useState(false);
  const [stream, setStream]     = useState(null);
  const [camErr, setCamErr]     = useState('');
  const videoRef  = useRef();
  const canvasRef = useRef();

  // Fallback: fetch from API if navigated directly
  useEffect(() => {
    if (!employee) {
      fetchEmployees().then(data => {
        const found = data.find((e, i) => String(e.id || i) === String(id));
        setEmployee(found || null);
      });
    }
  }, [id, employee]);

  // Open camera
  const openCamera = async () => {
    setCamErr('');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setStream(s);
      setCamOpen(true);
    } catch {
      setCamErr('Could not access camera. Please allow camera permissions and try again.');
    }
  };

  // Bind stream to video element
  useEffect(() => {
    if (camOpen && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [camOpen, stream]);

  // Stop camera on unmount
  useEffect(() => {
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, [stream]);

  const capturePhoto = () => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg');

    // Stop camera
    stream.getTracks().forEach(t => t.stop());
    navigate('/photo-result', { state: { photoUrl: dataUrl, employee } });
  };

  const closeCam = () => {
    if (stream) stream.getTracks().forEach(t => t.stop());
    setStream(null);
    setCamOpen(false);
  };

  if (!employee) {
    return (
      <div className="details-page">
        <Navbar title="Details" showBack />
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading employee details...
        </div>
      </div>
    );
  }

  const initials = (employee.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase();
  const duration = getWorkingDuration(employee.startDate);
  const badge    = getExperienceBadge(duration.years);  
  return (
    <div className="details-page">
      <Navbar title="Employee Details" showBack />

      <div className="details-container">
        {/* Hero card */}
        <div className="hero-card card fade-up">
          <div className="hero-bg" />
          <div className="hero-avatar">{initials}</div>
          <h2 className="hero-name">{employee.name}</h2>
          <p className="hero-role">{employee.designation}</p>
          <div className="hero-badges">
            <span className="badge badge-purple">{employee.designation}</span>
            <span className="badge badge-green"><i className="fa-solid fa-location-dot"></i> {employee.city}</span>
          </div>
          <div style={{ marginTop: 12 }}>
            <span style={{
              background: badge.color,
              color: 'white',
              padding: '4px 16px',
              borderRadius: '50px',
              fontSize: '13px',
              fontWeight: '700',
              fontFamily: 'Nunito, sans-serif',
            }}>
              <i className="fa-solid fa-star"></i> {badge.label} · {duration.years} yrs
            </span>
          </div>
        </div>

        {/* Info grid */}
        <div className="info-grid fade-up">
          {[
            { icon: 'fa-id-badge',            label: 'Employee ID',  val: employee.empId },
            { icon: 'fa-briefcase',           label: 'Designation',  val: employee.designation },
            { icon: 'fa-city',                label: 'City',         val: employee.city },
            { icon: 'fa-calendar-days',       label: 'Joined On',    val: employee.startDate },
            { icon: 'fa-dollar-sign',         label: 'Salary',       val: `$${Number(employee.salary).toLocaleString()}` },
            { icon: 'fa-calendar',            label: 'Experience',  val: `${duration.years} yrs, ${duration.months} months` },
          ].map(row => (
            <div className="info-row card" key={row.label}>
              <i className={`fa-solid ${row.icon} info-icon`}></i>
              <div>
                <div className="info-label">{row.label}</div>
                <div className="info-val">{row.val || '—'}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Camera section */}
        <div className="cam-section card fade-up">
          <div className="cam-header">
            <div>
              <h3><i className="fa-solid fa-camera"></i> Capture a Photo</h3>
              <p>Take a quick photo using your camera</p>
            </div>
            {!camOpen && (
              <button className="btn btn-primary" onClick={openCamera}>
                <i className="fa-solid fa-camera"></i> Open Camera
              </button>
            )}
          </div>

          {camErr && <div className="error-msg fade-in">⚠️ {camErr}</div>}

          {camOpen && (
            <div className="cam-view fade-in">
              <video ref={videoRef} autoPlay playsInline className="cam-video" />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <div className="cam-controls">
                <button className="btn btn-outline" onClick={closeCam}>Cancel</button>
                <button className="btn btn-primary" onClick={capturePhoto}>
                  <i className="fa-solid fa-circle"></i> Snap!
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

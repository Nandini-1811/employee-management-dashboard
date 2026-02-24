import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { fetchEmployees } from '../api';
import './ListPage.css';

// City badge colour — cycles through 3 colours by city initial
function cityColor() {
  return 'badge-purple';
}

export default function ListPage() {
  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees().then(data => {
      setEmployees(data);
      setFiltered(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      employees.filter(e =>
        (e.name || '').toLowerCase().includes(q) ||
        (e.city || '').toLowerCase().includes(q) ||
        (e.designation || '').toLowerCase().includes(q)
      )
    );
  }, [search, employees]);

  return (
    <div className="list-page">
      <Navbar title="Employees" />

      <div className="list-container">
        {/* Header strip */}
        <div className="list-header fade-up">
          <div>
            <h2>Team Directory</h2>
            <p>{filtered.length} people found</p>
          </div>
          <button
            className="btn btn-accent"
            onClick={() => navigate('/charts')}
          >
            <i className="fa-solid fa-chart-bar"></i> Salary Chart
          </button>
        </div>

        {/* Search */}
        <div className="search-wrap fade-up">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            placeholder="Search by name, city or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="clear-search" onClick={() => setSearch('')}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        {/* Stats cards */}
        {!loading && (
          <div className="stat-row fade-up">
            <div className="stat-card card">
              <i className="fa-solid fa-users stat-icon"></i>
              <div>
                <div className="stat-num">{employees.length}</div>
                <div className="stat-label">Total Employees</div>
              </div>
            </div>
            <div className="stat-card card">
              <i className="fa-solid fa-city stat-icon"></i>
              <div>
                <div className="stat-num">{[...new Set(employees.map(e => e.city))].length}</div>
                <div className="stat-label">Cities</div>
              </div>
            </div>
            <div className="stat-card card">
              <i className="fa-solid fa-dollar-sign stat-icon"></i>
              <div>
                <div className="stat-num">
                  ${employees.length
                    ? Math.round(employees.reduce((s, e) => s + Number(e.salary || 0), 0) / employees.length).toLocaleString()
                    : 0}
                </div>
                <div className="stat-label">Avg Salary</div>
              </div>
            </div>
          </div>
        )}

        {/* Employee list */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner" style={{ borderColor: 'rgba(91,79,207,0.2)', borderTopColor: 'var(--primary)', width: 36, height: 36 }} />
            <p>Fetching employees...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state fade-in">
            <i className="fa-solid fa-magnifying-glass empty-icon"></i>
            <p>No matches for "<strong>{search}</strong>"</p>
          </div>
        ) : (
          <div className="emp-grid">
            {filtered.map((emp, i) => (
              <div
                key={emp.id || i}
                className="emp-card card fade-up"
                style={{ animationDelay: `${i * 50}ms` }}
                onClick={() => navigate(`/details/${emp.id || i}`, { state: { employee: emp } })}
              >
                <div className="emp-avatar">
                  {(emp.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="emp-info">
                  <div className="emp-name">{emp.name}</div>
                  <div className="emp-role">{emp.designation}</div>
                  <div className="emp-meta">
                    <span><i className="fa-solid fa-location-dot"></i> {emp.city}</span>
                    <span className={`badge ${cityColor(emp.city)}`}>
                      <i className="fa-solid fa-calendar-days"></i> {emp.startDate}
                    </span>
                  </div>
                </div>
                <div className="emp-salary">
                  <div className="salary-num">${Number(emp.salary).toLocaleString()}</div>
                  <div className="salary-label">/ yr</div>
                </div>
                <div className="emp-arrow"><i className="fa-solid fa-chevron-right"></i></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import Navbar from '../components/Navbar';
import { fetchEmployees } from '../api';
import './BarChartPage.css';

// Custom hover tooltip 
function CustomTooltip({ active, payload }) {
  if (active && payload?.length) {
    const d = payload[0].payload;
    return (
      <div className="chart-tooltip">
        <div className="ct-name">{d.name}</div>
        <div className="ct-salary">${Number(d.salary).toLocaleString()}</div>
        <div className="ct-role">{d.designation}</div>
      </div>
    );
  }
  return null;
}

//Bar colors 
const COLORS = [
  '#5b4fcf','#7c72e0','#f6a623','#4caf89','#e05757',
  '#5b4fcf','#7c72e0','#f6a623','#4caf89','#e05757',
];


export default function BarChartPage() {
  const [allEmployees, setAllEmployees] = useState([]);  // full dataset
  const [loading,      setLoading]      = useState(true);
  const [activeTab,    setActiveTab]    = useState('salary'); // 'salary' | 'dept'
  const navigate = useNavigate();

  
  useEffect(() => {
    fetchEmployees().then(data => {
      // Convert salary to number for every employee
      const mapped = data.map(e => ({ ...e, salary: Number(e.salary) }));
      setAllEmployees(mapped);
      setLoading(false);
    });
  }, []);

  

  // Tab 1 — Top 10 by salary (sorted highest first)
  const topBySalary = [...allEmployees]
    .sort((a, b) => b.salary - a.salary)
    .slice(0, 10);

  // Tab 2 — Best earner per unique designation (no duplicates)
  const topByDept = Object.values(
    allEmployees.reduce((acc, emp) => {
      const key = emp.designation;
      //Highest paid person per designation
      if (!acc[key] || emp.salary > acc[key].salary) {
        acc[key] = emp;
      }
      return acc;
    }, {})
  ).sort((a, b) => b.salary - a.salary);

  // What the chart and table actually render — switches on tab
  const chartData = activeTab === 'salary' ? topBySalary : topByDept;

  // Top earner badge — always from salary sort
  const highest = topBySalary[0];

  // Top 5 for performers section — from whichever tab is active
  const top5 = chartData.slice(0, 5);

  
  return (
    <div className="chart-page">
      <Navbar title="Salary Chart" showBack />

      <div className="chart-container">

        {/*Header + Filter Tabs*/}
        <div className="chart-header fade-up">

          {/* Left title */}
          <div>
            <h2><i className="fa-solid fa-chart-column"></i> Salary Overview</h2>
            <p>
              {activeTab === 'salary'
                ? 'Top 10 employees by annual salary'
                : 'Top earner per role / designation'}
            </p>
          </div>

          {/* Centre tabs (filter picker) */}
          <div className="perf-tabs">
            <button
              className={`perf-tab ${activeTab === 'salary' ? 'active' : ''}`}
              onClick={() => setActiveTab('salary')}
            >
              <i className="fa-solid fa-dollar-sign"></i> By Salary
            </button>
            <button
              className={`perf-tab ${activeTab === 'dept' ? 'active' : ''}`}
              onClick={() => setActiveTab('dept')}
            >
              <i className="fa-solid fa-briefcase"></i> By Role
            </button>
          </div>

          {/* Right top earner badge */}
          {highest && (
            <div className="top-earner card">
              <span className="te-label">
                <i className="fa-solid fa-trophy"></i> Top Earner
              </span>
              <span className="te-name">{highest.name}</span>
              <span className="te-amount">${highest.salary.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/*Chart*/}
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
            <div
              className="spinner"
              style={{
                margin: '0 auto 16px',
                width: 32, height: 32,
                borderColor: 'rgba(91,79,207,0.2)',
                borderTopColor: 'var(--primary)',
              }}
            />
            Loading chart...
          </div>
        ) : (
          <div className="chart-card card fade-up">
            <ResponsiveContainer width="100%" height={360}>
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 20, left: 10, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(91,79,207,0.08)" />
                <XAxis
                  dataKey="name"
                  tick={{ fontFamily: 'DM Sans', fontSize: 11, fill: '#7b7b9d' }}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
                  tick={{ fontFamily: 'DM Sans', fontSize: 11, fill: '#7b7b9d' }}
                  width={55}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: 'rgba(91,79,207,0.06)' }}
                />
                <Bar dataKey="salary" radius={[8, 8, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/*Ranked Table*/}
        {!loading && (
          <div className="salary-table card fade-up">
            <div className="st-head">
              <span>Employee</span>
              <span>City</span>
              <span>Salary</span>
            </div>
            {chartData.map((emp, i) => (
              <div
                className="st-row"
                key={emp.empId || i}
                onClick={() =>
                  navigate(`/details/${emp.id ?? i}`, { state: { employee: emp } })
                }
              >
                <div className="st-emp">
                  <div
                    className="st-rank"
                    style={{ background: COLORS[i % COLORS.length] }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <div className="st-name">{emp.name}</div>
                    <div className="st-role">{emp.designation}</div>
                  </div>
                </div>
                <div className="st-city">
                  <i className="fa-solid fa-location-dot"></i> {emp.city}
                </div>
                <div className="st-salary">${emp.salary.toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}

        {/*Top Performers Section*/}
        {!loading && (
          <div className="performers-section card fade-up">

            <div className="perf-header">
              <h3>
                <i className="fa-solid fa-ranking-star"></i> Top Performers
              </h3>
              <p>
                {activeTab === 'salary'
                  ? 'Top 5 highest paid employees'
                  : 'Top earner from each role'}
              </p>
            </div>

            <div className="perf-list">
              {top5.map((emp, i) => (
                <div
                  key={emp.empId || i}
                  className="perf-row"
                  onClick={() =>
                    navigate(`/details/${emp.id ?? i}`, { state: { employee: emp } })
                  }
                >
                  {/* Medal / rank number */}
                  <div className="perf-rank">
                    {i === 0 ? '#1' : i === 1 ? '#2' : i === 2 ? '#3' : i + 1}
                  </div>

                  {/* Avatar */}
                  <div className="perf-avatar">
                    {(emp.name || 'U').charAt(0).toUpperCase()}
                  </div>

                  {/* Name + role */}
                  <div className="perf-info">
                    <div className="perf-name">{emp.name}</div>
                    <div className="perf-role">
                      <i className="fa-solid fa-location-dot"></i> {emp.city}
                      &nbsp;·&nbsp;
                      {emp.designation}
                    </div>
                  </div>

                  {/* Salary */}
                  <div className="perf-salary">
                    ${emp.salary.toLocaleString()}
                  </div>

                  <i className="fa-solid fa-chevron-right perf-arrow"></i>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}


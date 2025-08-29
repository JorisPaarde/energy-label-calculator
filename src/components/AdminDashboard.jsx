import React, { useState, useEffect } from 'react';
import '@styles/admin-dashboard.scss';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    lastWeek: 0,
    lastMonth: 0,
    lastYear: 0
  });
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    // Simulate fetching data from WordPress
    fetchDashboardData();
  }, []);

  const fetchDashboardData = () => {
    // In a real implementation, this would fetch from WordPress REST API
    // For now, we'll simulate with mock data
    const mockStats = {
      lastWeek: 3,
      lastMonth: 9,
      lastYear: 27
    };

    const mockWeeklyData = [
      { date: '2025-08-23', value: 0 },
      { date: '2025-08-24', value: 0 },
      { date: '2025-08-25', value: 0 },
      { date: '2025-08-26', value: 0 },
      { date: '2025-08-27', value: 0 },
      { date: '2025-08-28', value: 3 },
      { date: '2025-08-29', value: 0 }
    ];

    const mockMonthlyData = [
      { date: '2025-07-31', value: 0 },
      { date: '2025-08-01', value: 0 },
      { date: '2025-08-02', value: 0 },
      { date: '2025-08-03', value: 0 },
      { date: '2025-08-04', value: 0 },
      { date: '2025-08-05', value: 2 },
      { date: '2025-08-06', value: 1 },
      { date: '2025-08-07', value: 1 },
      { date: '2025-08-08', value: 0 },
      { date: '2025-08-09', value: 0 },
      { date: '2025-08-10', value: 0 },
      { date: '2025-08-11', value: 0 },
      { date: '2025-08-12', value: 1 },
      { date: '2025-08-13', value: 1 },
      { date: '2025-08-14', value: 0 },
      { date: '2025-08-15', value: 0 },
      { date: '2025-08-16', value: 0 },
      { date: '2025-08-17', value: 0 },
      { date: '2025-08-18', value: 0 },
      { date: '2025-08-19', value: 0 },
      { date: '2025-08-20', value: 0 },
      { date: '2025-08-21', value: 0 },
      { date: '2025-08-22', value: 0 },
      { date: '2025-08-23', value: 0 },
      { date: '2025-08-24', value: 0 },
      { date: '2025-08-25', value: 0 },
      { date: '2025-08-26', value: 0 },
      { date: '2025-08-27', value: 0 },
      { date: '2025-08-28', value: 3 },
      { date: '2025-08-29', value: 0 }
    ];

    setStats(mockStats);
    setWeeklyData(mockWeeklyData);
    setMonthlyData(mockMonthlyData);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  };

  const getMaxValue = (data) => {
    return Math.max(...data.map(item => item.value), 1);
  };

  const renderChart = (data, color, title) => {
    const maxValue = getMaxValue(data);
    
    return (
      <div className="admin-dashboard__chart">
        <h3 className="admin-dashboard__chart-title">{title}</h3>
        <div className="admin-dashboard__chart-container">
          <div className="admin-dashboard__chart-y-axis">
            {[0, 0.5, 1, 1.5, 2, 2.5, 3].map(tick => (
              <div key={tick} className="admin-dashboard__chart-y-tick">
                {tick}
              </div>
            ))}
          </div>
          <div className="admin-dashboard__chart-content">
            <svg width="100%" height="200" viewBox="0 0 400 200">
              <defs>
                <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <path
                d={data.map((item, index) => {
                  const x = (index / (data.length - 1)) * 400;
                  const y = 200 - ((item.value / maxValue) * 200);
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
                stroke={color}
                strokeWidth="2"
                fill="none"
              />
              <path
                d={data.map((item, index) => {
                  const x = (index / (data.length - 1)) * 400;
                  const y = 200 - ((item.value / maxValue) * 200);
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ') + ` L 400 200 L 0 200 Z`}
                fill={`url(#gradient-${color})`}
                opacity="0.1"
              />
            </svg>
            <div className="admin-dashboard__chart-x-axis">
              {data.map((item, index) => (
                <div key={index} className="admin-dashboard__chart-x-tick">
                  {formatDate(item.date)}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="admin-dashboard__chart-legend">
          <div className="admin-dashboard__chart-legend-item">
            <div 
              className="admin-dashboard__chart-legend-color" 
              style={{ backgroundColor: color }}
            ></div>
            <span>Zoekopdrachten</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <h1>Energielabel Calculator Dashboard</h1>
        <p>Overzicht van formulier inzendingen</p>
      </div>

      <div className="admin-dashboard__stats">
        <div className="admin-dashboard__stat-card">
          <h3>Afgelopen Week</h3>
          <div className="admin-dashboard__stat-value">{stats.lastWeek}</div>
          <div className="admin-dashboard__stat-label">ZOEKOPDRACHTEN</div>
        </div>
        <div className="admin-dashboard__stat-card">
          <h3>Afgelopen Maand</h3>
          <div className="admin-dashboard__stat-value">{stats.lastMonth}</div>
          <div className="admin-dashboard__stat-label">ZOEKOPDRACHTEN</div>
        </div>
        <div className="admin-dashboard__stat-card">
          <h3>Afgelopen Jaar</h3>
          <div className="admin-dashboard__stat-value">{stats.lastYear}</div>
          <div className="admin-dashboard__stat-label">ZOEKOPDRACHTEN</div>
        </div>
      </div>

      <div className="admin-dashboard__charts">
        {renderChart(weeklyData, '#2196F3', 'Gebruik Afgelopen Week')}
        {renderChart(monthlyData, '#4CAF50', 'Gebruik Afgelopen Maand')}
      </div>

      <div className="admin-dashboard__footer">
        <p>Door JPWebCreation - Joris Paardekooper | <a href="#" target="_blank">Bezoek plugin site</a></p>
      </div>
    </div>
  );
};

export default AdminDashboard;

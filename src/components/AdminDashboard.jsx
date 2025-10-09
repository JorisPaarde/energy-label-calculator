import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    lastWeek: 0,
    lastMonth: 0,
    lastYear: 0
  });
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    // Initial data fetch
    fetchDashboardData();
    
    // Auto-refresh every 30 seconds to keep data up-to-date
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000); // 30 seconds
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = () => {
    setIsLoading(true);
    console.log('Fetching dashboard data...');
    console.log('Window AJAX object:', window.energy_label_calculator_ajax);
    
    // Fetch real data from WordPress AJAX endpoint
    if (window.energy_label_calculator_ajax) {
      const formData = new FormData();
      formData.append('action', 'energy_label_calculator_get_dashboard_stats');
      formData.append('nonce', window.energy_label_calculator_ajax.nonce);

      console.log('Making fetch request to:', window.energy_label_calculator_ajax.ajax_url);
      console.log('FormData:', formData);

      fetch(window.energy_label_calculator_ajax.ajax_url, {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setStats(data.data.stats);
          
          // Transform weekly data for charts
          const weeklyData = data.data.weeklyData.map(item => ({
            date: item.date,
            value: parseInt(item.count)
          }));
          setWeeklyData(weeklyData);
          
          // Transform monthly data for charts
          const monthlyData = data.data.monthlyData.map(item => ({
            date: item.date,
            value: parseInt(item.count)
          }));
          setMonthlyData(monthlyData);
          
          setLastUpdated(new Date());
        } else {
          console.error('Failed to fetch dashboard data:', data.data.message);
          // Fallback to empty data
          setStats({ lastWeek: 0, lastMonth: 0, lastYear: 0 });
          setWeeklyData([]);
          setMonthlyData([]);
        }
      })
      .catch(error => {
        console.error('Error fetching dashboard data:', error);
        // Fallback to empty data
        setStats({ lastWeek: 0, lastMonth: 0, lastYear: 0 });
        setWeeklyData([]);
        setMonthlyData([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
    } else {
      // Fallback for development/testing
      console.log('WordPress AJAX not available, using mock data');
      setStats({ lastWeek: 0, lastMonth: 0, lastYear: 0 });
      setWeeklyData([]);
      setMonthlyData([]);
      setIsLoading(false);
    }
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
    
    // Build smooth bezier path from data points
    const computePoints = (series) => {
      if (!series || series.length === 0) return [];
      const width = 400;
      const height = 200;
      const len = series.length - 1 || 1;
      return series.map((item, index) => {
        const x = (index / len) * width;
        const y = height - ((item.value / maxValue) * height);
        return { x, y };
      });
    };

    const generateSmoothLinePath = (points) => {
      if (points.length === 0) return 'M 0 200';
      if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
      let d = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        const p0 = points[i - 1];
        const p1 = points[i];
        const cx1 = (p0.x + p1.x) / 2;
        const cy1 = p0.y;
        const cx2 = (p0.x + p1.x) / 2;
        const cy2 = p1.y;
        d += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p1.x} ${p1.y}`;
      }
      return d;
    };

    const points = computePoints(data);
    const smoothLineD = generateSmoothLinePath(points);
    const smoothAreaD = `${points.length > 0 ? smoothLineD : 'M 0 200'} L 400 200 L 0 200 Z`;

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
              <path d={smoothLineD} stroke={color} strokeWidth="2" fill="none" />
              <path d={smoothAreaD} fill={`url(#gradient-${color})`} opacity="0.1" />
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
        <div className="admin-dashboard__header-content">
          <div>
            <h1>Energielabel Calculator Dashboard</h1>
            <p>Overzicht van formulier inzendingen</p>
            {lastUpdated && (
              <small className="admin-dashboard__last-updated">
                Laatst bijgewerkt: {lastUpdated.toLocaleString('nl-NL')}
              </small>
            )}
          </div>
        </div>
      </div>

      <div className="admin-dashboard__stats">
        <div className="admin-dashboard__stat-card">
          <h3>Afgelopen Week</h3>
          <div className="admin-dashboard__stat-value">
            {isLoading ? '...' : stats.lastWeek}
          </div>
          <div className="admin-dashboard__stat-label">ZOEKOPDRACHTEN</div>
        </div>
        <div className="admin-dashboard__stat-card">
          <h3>Afgelopen Maand</h3>
          <div className="admin-dashboard__stat-value">
            {isLoading ? '...' : stats.lastMonth}
          </div>
          <div className="admin-dashboard__stat-label">ZOEKOPDRACHTEN</div>
        </div>
        <div className="admin-dashboard__stat-card">
          <h3>Afgelopen Jaar</h3>
          <div className="admin-dashboard__stat-value">
            {isLoading ? '...' : stats.lastYear}
          </div>
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

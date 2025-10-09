/**
 * Mock WordPress environment for local development testing
 * This simulates WordPress AJAX functionality when running locally
 */

// Mock WordPress AJAX object
window.energy_label_calculator_ajax = {
  ajax_url: '/mock-ajax',
  nonce: 'mock_nonce_123'
};

// Mock form submissions storage
let mockSubmissions = [];

// Mock AJAX endpoint for form submissions
window.mockTrackSubmission = (formData) => {
  const submission = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    form_data: formData.form_data,
    calculated_label: formData.calculated_label,
    calculated_score: formData.calculated_score,
    user_ip: '127.0.0.1',
    user_agent: navigator.userAgent
  };
  
  mockSubmissions.push(submission);
  console.log('Mock submission tracked:', submission);
  
  return Promise.resolve({
    success: true,
    message: 'Submission tracked successfully (mock)'
  });
};

// Mock AJAX endpoint for dashboard stats
window.mockGetDashboardStats = () => {
  console.log('Mock: Getting dashboard stats');
  console.log('Current mock submissions:', mockSubmissions);
  
  const now = new Date();
  const lastWeek = mockSubmissions.filter(s => {
    const submissionDate = new Date(s.timestamp);
    return submissionDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }).length;
  
  const lastMonth = mockSubmissions.filter(s => {
    const submissionDate = new Date(s.timestamp);
    return submissionDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }).length;
  
  const lastYear = mockSubmissions.filter(s => {
    const submissionDate = new Date(s.timestamp);
    return submissionDate >= new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  }).length;
  
  // Generate weekly data for the last 7 days
  const weeklyData = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    const count = mockSubmissions.filter(s => {
      const submissionDate = new Date(s.timestamp);
      return submissionDate.toISOString().split('T')[0] === dateStr;
    }).length;
    
    weeklyData.push({ date: dateStr, count: count.toString() });
  }
  
  // Generate monthly data for the last 30 days
  const monthlyData = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    const count = mockSubmissions.filter(s => {
      const submissionDate = new Date(s.timestamp);
      return submissionDate.toISOString().split('T')[0] === dateStr;
    }).length;
    
    monthlyData.push({ date: dateStr, count: count.toString() });
  }
  
  return Promise.resolve({
    success: true,
    data: {
      stats: {
        lastWeek,
        lastMonth,
        lastYear
      },
      weeklyData,
      monthlyData
    }
  });
};

// Mock fetch function for local testing
const originalFetch = window.fetch;
window.fetch = function(url, options) {
  if (url === '/mock-ajax') {
    // Handle FormData properly
    let action = '';
    let formData = {};
    
    if (options.body instanceof FormData) {
      action = options.body.get('action');
      // Extract all form data
      for (let [key, value] of options.body.entries()) {
        formData[key] = value;
      }
    } else if (typeof options.body === 'string') {
      // Handle URL-encoded strings
      const params = new URLSearchParams(options.body);
      action = params.get('action');
      for (let [key, value] of params.entries()) {
        formData[key] = value;
      }
    }
    
    if (action === 'energy_label_calculator_track_submission') {
      const submissionData = {
        form_data: formData.form_data || '',
        calculated_label: formData.calculated_label || '',
        calculated_score: formData.calculated_score || ''
      };
      
      return window.mockTrackSubmission(submissionData)
        .then(response => ({
          json: () => Promise.resolve(response)
        }));
    }
    
    if (action === 'energy_label_calculator_get_dashboard_stats') {
      return window.mockGetDashboardStats()
        .then(response => ({
          json: () => Promise.resolve(response)
        }));
    }
  }
  
  // Fall back to original fetch for other URLs
  return originalFetch.apply(this, arguments);
};

// Add some sample data for testing
if (process.env.NODE_ENV === 'development') {
  // Add mock submissions for testing
  const sampleSubmissions = [
    {
      id: 1,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      calculated_label: 'A++',
      calculated_score: 850
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      calculated_label: 'B',
      calculated_score: 550
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      calculated_label: 'C',
      calculated_score: 450
    }
  ];
  
  mockSubmissions = sampleSubmissions;
  console.log('Mock WordPress environment initialized with sample data');
  console.log('Sample submissions:', mockSubmissions);
}

export default window.energy_label_calculator_ajax;

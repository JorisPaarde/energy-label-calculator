import React from 'react';
import AdminDashboard from './AdminDashboard';
import '@styles/main.scss';

// Add WordPress AJAX data to window object for admin dashboard
if (typeof window !== 'undefined' && window.energy_label_calculator_ajax) {
  // WordPress AJAX data is already available
} else {
  // Mock data for development/testing
  window.energy_label_calculator_ajax = {
    ajax_url: '/wp-admin/admin-ajax.php',
    nonce: 'dev_nonce'
  };
}

const WordPressAdmin = () => {
  return (
    <div className="wordpress-admin-wrapper">
      <AdminDashboard />
    </div>
  );
};

export default WordPressAdmin;

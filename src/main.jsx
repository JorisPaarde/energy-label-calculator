import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Mount the app when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('wordpress-widget-wp-container')
  if (container) {
    const root = ReactDOM.createRoot(container)
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  }
})

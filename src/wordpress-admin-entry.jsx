import React from 'react'
import ReactDOM from 'react-dom/client'
import WordPressAdmin from './components/WordPressAdmin'

// Mount the admin dashboard when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('energy-label-calculator-admin-container')
  if (container) {
    const root = ReactDOM.createRoot(container)
    root.render(
      <React.StrictMode>
        <WordPressAdmin />
      </React.StrictMode>
    )
  }
})

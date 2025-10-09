import React from 'react'
import ReactDOM from 'react-dom/client'
import WordPressAdmin from './components/WordPressAdmin'

// Import mock WordPress environment for local development
import './utils/mockWordPress'

// Mount the admin dashboard when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('Admin Dashboard: DOM Content Loaded')
  const container = document.getElementById('admin-dashboard-container')
  console.log('Admin container found:', container)
  
  if (container) {
    console.log('Creating admin React root...')
    const root = ReactDOM.createRoot(container)
    root.render(
      <React.StrictMode>
        <WordPressAdmin />
      </React.StrictMode>
    )
    console.log('Admin dashboard rendered')
  } else {
    console.error('Admin container not found!')
  }
})

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Import mock WordPress environment for local development
try {
  import('./utils/mockWordPress')
  console.log('Mock WordPress imported successfully')
} catch (error) {
  console.error('Error importing mock WordPress:', error)
}

// Mount the app when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded')
  const container = document.getElementById('wordpress-widget-wp-container')
  console.log('Container found:', container)
  
  if (container) {
    console.log('Creating React root...')
    const root = ReactDOM.createRoot(container)
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
    console.log('React app rendered')
  } else {
    console.error('Container not found!')
  }
})

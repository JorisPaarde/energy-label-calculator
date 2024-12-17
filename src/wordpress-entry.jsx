import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// WordPress-specific initialization
const initEnergyCalculator = () => {
  // Find all calculator instances on the page
  const containers = document.querySelectorAll('.wordpress-widget-wp-container')
  
  containers.forEach((container, index) => {
    // Get any WordPress-specific data attributes
    const settings = {
      ...container.dataset
    }
    
    const root = ReactDOM.createRoot(container)
    root.render(
      <App 
        instanceId={index}
        settings={settings}
      />
    )
  })
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEnergyCalculator)
} else {
  initEnergyCalculator()
}

// Export initialization function for manual initialization
window.initEnergyCalculator = initEnergyCalculator 
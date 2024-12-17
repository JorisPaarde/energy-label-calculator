import React from 'react'

const styles = {
  light: {
    background: '#f0f0f0',
    color: '#333',
    padding: '20px',
    borderRadius: '8px',
    margin: '10px 0'
  },
  dark: {
    background: '#333',
    color: '#f0f0f0',
    padding: '20px',
    borderRadius: '8px',
    margin: '10px 0'
  }
}

const TestComponent = ({ instanceId, settings }) => {
  const theme = settings?.theme || 'light'
  
  return (
    <div style={styles[theme]}>
      <h2>React is Working! 🎉</h2>
      <p>Instance ID: {instanceId}</p>
      <p>Theme: {theme}</p>
      <button 
        onClick={() => alert(`Button clicked in instance ${instanceId}`)}
        style={{ padding: '8px 16px', cursor: 'pointer' }}
      >
        Test Interactivity
      </button>
    </div>
  )
}

export default TestComponent 
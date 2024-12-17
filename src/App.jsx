import React from 'react'
import TestComponent from './components/TestComponent'

function App({ instanceId = 0, settings = {} }) {
  return (
    <div>
      <TestComponent 
        instanceId={instanceId} 
        settings={settings}
      />
    </div>
  )
}

export default App

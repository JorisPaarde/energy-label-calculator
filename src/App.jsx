import React from 'react'
import DynamicForm from './components/DynamicForm'

function App({ instanceId = 0, settings = {} }) {
  return (
    <div className="energy-calculator-widget">
      <DynamicForm 
        instanceId={instanceId} 
        settings={settings}
      />
    </div>
  )
}

export default App

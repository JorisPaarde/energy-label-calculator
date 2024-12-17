import React from 'react'
import DynamicForm from './components/DynamicForm'

function App({ instanceId = 0, settings = {} }) {
  return (
    <div>
      <DynamicForm 
        instanceId={instanceId} 
        settings={settings}
      />
    </div>
  )
}

export default App

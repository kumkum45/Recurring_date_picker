import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import RecurringDatePicker from './components/RecurringDatePicker'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <RecurringDatePicker />
    </div>
  )
}

export default App

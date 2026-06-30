import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { HabitsProvider } from './context/HabitsContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <HabitsProvider>
        <App />
      </HabitsProvider>
    </HashRouter>
  </React.StrictMode>,
)

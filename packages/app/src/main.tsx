import './css/main.css'
import './css/fonts.css'
import './utils/sentry.ts'

import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.tsx'
import { TopLevelErrorBoundary } from './features/errors'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TopLevelErrorBoundary>
      <App />
    </TopLevelErrorBoundary>
  </React.StrictMode>,
)

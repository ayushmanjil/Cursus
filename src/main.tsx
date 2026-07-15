import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Wipe all localStorage data once to reset the database completely
if (window.localStorage.getItem('my-library:wiped-clean-credentials') !== 'true') {
  window.localStorage.clear();
  window.localStorage.setItem('my-library:wiped-clean-credentials', 'true');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

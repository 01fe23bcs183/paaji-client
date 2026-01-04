import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initializeDefaultData } from './services/storage'

// Initialize default data BEFORE rendering
// This ensures localStorage has settings before SettingsContext loads
initializeDefaultData()
  .then(() => {
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
  .catch(error => {
    console.error('Failed to initialize app:', error);
    // Render error state
    document.getElementById('root').innerHTML = `
      <div style="padding: 40px; text-align: center; font-family: Arial;">
        <h1 style="color: #C85A54;">Failed to Initialize</h1>
        <p>Please refresh the page</p>
        <pre style="text-align: left; background: #f5f5f5; padding: 20px; border-radius: 8px;">${error.message}</pre>
      </div>
    `;
  });

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'

// ATENCIÓN: Reemplaza esto con tu Client ID real de Google Cloud Console
const GOOGLE_CLIENT_ID = "REEMPLAZAR_CON_TU_CLIENT_ID_DE_GOOGLE.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)

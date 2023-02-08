import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react'
import ReactDOM from 'react-dom/client'
import BlurpRoutes from './routes.jsx'
import './styles/tailwind.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId='220935592619-e7j93usk2h7vhcuoauos59rhgvqlcmsa.apps.googleusercontent.com'>
    <React.StrictMode>
      < BlurpRoutes/>
    </React.StrictMode>
  </GoogleOAuthProvider>
);

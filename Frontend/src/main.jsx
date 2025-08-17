import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleReCaptchaProvider reCaptchaKey="6LfvJKkrAAAAAILFgfpSOCCAxRWXhu6oLeIT-7lr">
      <App />
    </GoogleReCaptchaProvider>
  </StrictMode>,
)

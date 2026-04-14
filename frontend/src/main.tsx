// UniSphere notu: Uygulamanin React giris noktasi burada baslatiliyor.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppProviders } from './app/providers'
import './index.css'
import './pages/pageStyles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders />
  </StrictMode>,
)

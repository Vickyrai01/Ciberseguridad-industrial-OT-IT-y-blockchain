import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './i18n'
import './styles/tokens.css'
import './styles/base.css'
import './styles/tailwind.css'
import './styles/visuals.css'
import './styles/multiplayer.css'
import './styles/presenter.css'
import './styles/responsive.css'
import './styles/console.css'
import './styles/i18n.css'
import './styles/motion.css'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

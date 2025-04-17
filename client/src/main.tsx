import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import reduxStore from './redux/store.ts'
import { DarkModeProvider } from './context/ThemeContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={reduxStore}>
      <DarkModeProvider>
        <App />
      </DarkModeProvider>
    </Provider>
  </StrictMode>,
)

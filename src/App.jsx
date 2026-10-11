import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ErrorBoundary from './components/common/ErrorBoundary'
import Router from './routes/Router'

export default function App() {
  return (
    <ErrorBoundary fullScreen>
      <ThemeProvider>
        <AuthProvider>
          <Router />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-fg)',
                border: '1px solid var(--toast-border)',
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
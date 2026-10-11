import { Component } from 'react'
import { FiAlertTriangle } from 'react-icons/fi'
import Button from './Button'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Unhandled UI error:', error, info.componentStack)
  }

  reset = () => this.setState({ hasError: false })

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div
        role="alert"
        className={`flex flex-col items-center justify-center gap-4 p-6 text-center ${
          this.props.fullScreen ? 'min-h-screen' : 'py-20'
        }`}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <FiAlertTriangle size={28} aria-hidden="true" />
        </span>
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="max-w-sm text-sm text-slate-600 dark:text-slate-400">
          An unexpected error occurred. Try again, or reload the page. If you just
          updated the app, reloading usually fixes it.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={this.reset}>
            Try again
          </Button>
          <Button onClick={() => window.location.reload()}>Reload page</Button>
        </div>
      </div>
    )
  }
}
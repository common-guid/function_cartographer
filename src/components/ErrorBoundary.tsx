import React from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  error?: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: undefined }

  static getDerivedStateFromError(err: Error): ErrorBoundaryState {
    return { error: err }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: '2rem',
          color: '#fff',
          background: '#b91c1c',
          fontFamily: 'monospace',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>
            ⚠️ Application Initialization Error
          </h1>
          <pre style={{
            background: '#7f1d1d',
            padding: '1rem',
            borderRadius: '0.5rem',
            overflow: 'auto',
            margin: 0
          }}>
            {this.state.error.name}: {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
          <p style={{ margin: 0 }}>
            Please check the browser console for additional details.
          </p>
        </div>
      )
    }
    return this.props.children
  }
}

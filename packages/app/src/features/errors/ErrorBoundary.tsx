import { Component, ReactNode } from 'react'

export interface ErrorBoundaryProps {
  children: ReactNode
  fallback: ReactNode
}

export type ErrorBoundaryState =
  | {
      error: any
      hasError: true
    }
  | {
      hasError: false
    }

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return {
      error,
      hasError: true,
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

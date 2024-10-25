/* eslint-disable react-refresh/only-export-components */
import React from 'react'

import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { NotConnectedError } from '../src/domain/errors/not-connected'
import { Button } from '../src/ui/atoms/button/Button'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  error: Error | undefined
}

export class StorybookErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { error: undefined }
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return {
      error,
    }
  }

  render() {
    if (this.state.error) {
      return <ErrorComponent error={this.state.error} />
    }

    return this.props.children
  }
}

function ErrorComponent({ error }: { error: Error }) {
  const { setShowAuthFlow } = useDynamicContext()

  if (error instanceof NotConnectedError) {
    return <Button onClick={() => setShowAuthFlow(true)}>Connect wallet</Button>
  }
  return <>Unknown error: {error.message}</>
}

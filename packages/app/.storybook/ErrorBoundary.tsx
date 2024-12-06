import { Button } from '@/ui/atoms/button/Button'
/* eslint-disable react-refresh/only-export-components */
import { useConnectModal } from '@rainbow-me/rainbowkit'
import React from 'react'
import { NotConnectedError } from '../src/domain/errors/not-connected'

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
  const { openConnectModal } = useConnectModal()

  if (error instanceof NotConnectedError) {
    return <Button onClick={openConnectModal}>Connect wallet</Button>
  }
  return <>Unknown error: {error.message}</>
}

import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useNavigate, useRouteError } from 'react-router-dom'
import { useAccountEffect } from 'wagmi'

import { NotConnectedError } from '@/domain/errors/not-connected'
import { NotFoundError } from '@/domain/errors/not-found'
import { Button } from '@/ui/atoms/button/Button'
import { Typography } from '@/ui/atoms/typography/Typography'
import { ErrorLayout } from '@/ui/layouts/ErrorLayout'

import { NotFound } from './NotFound'

export function ErrorContainer() {
  const error = useRouteError()

  if (error instanceof NotConnectedError) {
    return <NotConnected />
  }

  if (error instanceof NotFoundError) {
    return <NotFound />
  }

  return <UnknownError />
}

export function NotConnected() {
  const { openConnectModal } = useConnectModal()
  const navigate = useNavigate()
  useAccountEffect({
    onConnect: () => {
      navigate(0)
    },
  })

  return (
    <ErrorLayout>
      <Typography variant="h3">This page is available ony for connected users</Typography>
      <Button onClick={openConnectModal}>Connect wallet</Button>
    </ErrorLayout>
  )
}

export function UnknownError() {
  const navigate = useNavigate()

  return (
    <ErrorLayout>
      <Typography variant="h1">Oops</Typography>
      <Typography variant="h3">Something went wrong</Typography>
      <Button onClick={() => navigate(0)}>Reload</Button>
    </ErrorLayout>
  )
}

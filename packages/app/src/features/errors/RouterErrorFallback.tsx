import { useRouteError } from 'react-router-dom'

import { NotConnectedError } from '@/domain/errors/not-connected'
import { NotFoundError } from '@/domain/errors/not-found'

import { NotConnected } from './NotConnected'
import { NotFound } from './NotFound'
import { UnknownError } from './UnknownError'

interface RouterErrorFallbackProps {
  fullScreen?: boolean
}

export function RouterErrorFallback({ fullScreen }: RouterErrorFallbackProps) {
  const error = useRouteError()
  if (error instanceof NotConnectedError) {
    return <NotConnected />
  }

  if (error instanceof NotFoundError) {
    return <NotFound fullScreen={fullScreen} />
  }

  return <UnknownError error={error} fullScreen={fullScreen} />
}

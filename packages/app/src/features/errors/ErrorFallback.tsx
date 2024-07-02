import { NotConnectedError } from '@/domain/errors/not-connected'
import { NotFoundError } from '@/domain/errors/not-found'

import { NotConnected } from './NotConnected'
import { NotFound } from './NotFound'
import { UnknownError } from './UnknownError'

export interface ErrorFallbackProps {
  fullScreen?: boolean
  error?: any
}
export function ErrorFallback({ fullScreen, error }: ErrorFallbackProps) {
  if (error instanceof NotConnectedError) {
    return <NotConnected />
  }

  if (error instanceof NotFoundError) {
    return <NotFound fullScreen={fullScreen} />
  }

  return <UnknownError error={error} fullScreen={fullScreen} />
}

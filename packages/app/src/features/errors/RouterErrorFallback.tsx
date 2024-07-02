import { useRouteError } from 'react-router-dom'
import { ErrorFallback } from './ErrorFallback'

export interface RouterErrorFallbackProps {
  fullScreen?: boolean
}

export function RouterErrorFallback({ fullScreen }: RouterErrorFallbackProps) {
  const error = useRouteError()

  return <ErrorFallback error={error} fullScreen={fullScreen} />
}

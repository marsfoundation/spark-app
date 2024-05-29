import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { captureError } from '@/utils/sentry'

import { ErrorFallback } from './ErrorFallback'

interface UnknownErrorProps {
  error: any
  fullScreen?: boolean
}

export function UnknownError({ error, fullScreen }: UnknownErrorProps) {
  const navigate = useNavigate()

  useEffect(() => {
    captureError(error)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <ErrorFallback onReload={() => navigate(0)} fullScreen={fullScreen} />
}

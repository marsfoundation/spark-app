import { useEffect, useState } from 'react'

export interface DelayedComponentProps {
  children: React.ReactNode
  delay: number
}

export function DelayedComponent({ children, delay }: DelayedComponentProps) {
  const [shouldDisplay, setShouldDisplay] = useState(false)

  useEffect(() => {
    const timeoutId = setTimeout(() => setShouldDisplay(true), delay)
    return () => clearTimeout(timeoutId)
  }, [delay])

  if (shouldDisplay) {
    return children
  }

  return null
}

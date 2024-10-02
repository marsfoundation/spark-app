import { useEffect, useState } from 'react'

export interface DelayedComponentProps {
  children: React.ReactNode
}

const DELAYED_COMPONENT_DELAY = 300

export function DelayedComponent({ children }: DelayedComponentProps) {
  const [shouldDisplay, setShouldDisplay] = useState(false)

  useEffect(() => {
    const timeoutId = setTimeout(() => setShouldDisplay(true), DELAYED_COMPONENT_DELAY)
    return () => clearTimeout(timeoutId)
  }, [])

  if (shouldDisplay) {
    return children
  }

  return null
}

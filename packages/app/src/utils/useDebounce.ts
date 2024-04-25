import { useEffect, useRef, useState } from 'react'

export interface UseDebounceOptions {
  delay?: number
}

export interface UseDebounceResult<T> {
  debouncedValue: T
  isDebouncing: boolean
}

/**
 * Since value might be a complex object and we don't want to do deep eq checks, we introduce key to indicate when value has changed.
 */
export function useDebounce<T>(value: T, key: string, { delay = 300 }: UseDebounceOptions = {}): UseDebounceResult<T> {
  const [debouncedValue, setDebouncedValue] = useState(value)
  const [isDebouncing, setIsDebouncing] = useState(false)
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    setIsDebouncing(true)
    const handler = setTimeout(() => {
      setIsDebouncing(false)
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, delay])

  return {
    debouncedValue,
    isDebouncing,
  }
}

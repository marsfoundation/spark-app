import { useEffect, useRef } from 'react'

export function useValueChangeCallback<T>(value: T, callback: (newValue: T, oldValue: T | undefined) => void): void {
  const previousValueRef = useRef(value)

  useEffect(() => {
    if (value !== previousValueRef.current) {
      callback(value, previousValueRef.current)
      previousValueRef.current = value
    }
  }, [value, callback])
}

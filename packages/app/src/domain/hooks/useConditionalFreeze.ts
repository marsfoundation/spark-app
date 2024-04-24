import { useEffect, useRef } from 'react'

export function useConditionalFreeze<T>(value: T, freeze: boolean): T {
  const frozenValue = useRef(value)

  useEffect(() => {
    if (!freeze) {
      frozenValue.current = value
    }
  }, [value, freeze])

  return freeze ? frozenValue.current : value
}

import { RefObject, useRef } from 'react'
import { useResizeObserver } from './useResizeObserver'

type UseElementSizeReturnType<T> = [RefObject<T>, { width: number; height: number }]

export function useElementSize<T extends HTMLElement = HTMLDivElement>(): UseElementSizeReturnType<T> {
  const ref = useRef<T>(null)

  const size = useResizeObserver({
    ref,
  })

  return [ref, size]
}

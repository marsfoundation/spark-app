import { RefObject, useRef } from 'react'
import { useResizeObserver } from './useResizeObserver'

type UseParentWidthReturnType<T> = [RefObject<T>, { width: number; height: number }]

export function useParentSize<T extends HTMLElement = HTMLDivElement>(): UseParentWidthReturnType<T> {
  const ref = useRef<T>(null)

  const size = useResizeObserver({
    ref,
  })

  return [ref, size]
}

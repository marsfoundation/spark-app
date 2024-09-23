import { RefObject, useRef, useState } from 'react'
import { useResizeObserver } from './useResizeObserver'

type UseIsTruncatedResult<T> = [RefObject<T>, boolean]

export function useIsTruncated<T extends HTMLElement = HTMLParagraphElement>(): UseIsTruncatedResult<T> {
  const ref = useRef<T>(null)
  const [isTruncated, setIsTruncated] = useState(false)

  useResizeObserver({
    ref,
    onResize: () => {
      if (ref.current) {
        setIsTruncated(ref.current.offsetWidth < ref.current.scrollWidth)
      }
    },
  })

  return [ref, isTruncated]
}

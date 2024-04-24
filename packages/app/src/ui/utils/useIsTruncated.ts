import { RefObject, useEffect, useRef, useState } from 'react'

type UseIsTruncatedResult<T> = [RefObject<T>, boolean]

export function useIsTruncated<T extends HTMLElement = HTMLParagraphElement>(): UseIsTruncatedResult<T> {
  const ref = useRef<T>(null)
  const [isTruncated, setIsTruncated] = useState(false)

  useEffect(function observeTruncation() {
    const observer = new ResizeObserver(() => {
      if (ref.current) {
        setIsTruncated(ref.current.offsetWidth < ref.current.scrollWidth)
      }
    })

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return [ref, isTruncated]
}

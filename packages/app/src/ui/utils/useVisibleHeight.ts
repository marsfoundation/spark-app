import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'

export function useVisibleHeight(): [RefObject<HTMLElement>, { height: number; refresh: () => void }] {
  const ref = useRef<HTMLElement>(null)
  const [height, setHeight] = useState(0)
  const intersectionObserver = useMemo(
    () =>
      new IntersectionObserver((entries) => {
        if (entries[0]) {
          setHeight(entries[0].intersectionRect.height)
        }
      }),
    [],
  )
  const refresh = useCallback(() => {
    if (ref.current) {
      // hack to trigger update
      intersectionObserver.unobserve(ref.current)
      intersectionObserver.observe(ref.current)
    }
  }, [intersectionObserver])

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => refresh())

    if (ref.current) {
      intersectionObserver.observe(ref.current)
      resizeObserver.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        intersectionObserver.unobserve(ref.current)
        resizeObserver.unobserve(ref.current)
      }
    }
  }, [intersectionObserver, refresh])

  return [ref, { height, refresh }]
}

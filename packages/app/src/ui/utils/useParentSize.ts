import { RefObject, useEffect, useRef, useState } from 'react'

type UseParentWidthReturnType<T> = [RefObject<T>, { width: number; height: number }]

export function useParentSize<T extends HTMLElement = HTMLDivElement>(): UseParentWidthReturnType<T> {
  const ref = useRef<T>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(function observeSize() {
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect
        setSize({ width, height })
      }
    })

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return [ref, size]
}

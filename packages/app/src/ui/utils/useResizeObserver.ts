import { useEffect, useRef, useState } from 'react'

import type { RefObject } from 'react'

type Size = {
  width: number
  height: number
}

type UseResizeObserverOptions<T extends HTMLElement = HTMLElement> = {
  ref: RefObject<T>
  onResize?: (size: Size) => void
}

const initialSize: Size = {
  width: 0,
  height: 0,
}

// Based on https://usehooks-ts.com/react-hook/use-resize-observer
export function useResizeObserver<T extends HTMLElement = HTMLElement>(options: UseResizeObserverOptions<T>): Size {
  const { ref } = options
  const [{ width, height }, setSize] = useState<Size>(initialSize)
  const previousSize = useRef<Size>({ ...initialSize })
  const onResize = useRef<((size: Size) => void) | undefined>(options.onResize)

  useEffect(() => {
    if (!ref.current) return

    if (typeof window === 'undefined' || !('ResizeObserver' in window)) return

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return

      const newWidth = extractSize(entry, 'inlineSize')
      const newHeight = extractSize(entry, 'blockSize')

      const hasChanged = previousSize.current.width !== newWidth || previousSize.current.height !== newHeight

      if (hasChanged) {
        const newSize: Size = { width: newWidth, height: newHeight }
        previousSize.current.width = newWidth
        previousSize.current.height = newHeight

        if (onResize.current) {
          onResize.current(newSize)
        } else {
          setSize(newSize)
        }
      }
    })

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [ref])

  return { width, height }
}

function extractSize(entry: ResizeObserverEntry, sizeType: keyof ResizeObserverSize): number {
  return entry.contentRect[sizeType === 'inlineSize' ? 'width' : 'height']
}

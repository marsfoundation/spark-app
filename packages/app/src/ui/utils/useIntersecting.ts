import { RefObject, useEffect, useRef } from 'react'

type UseIsIntersectingResult<
  ScrollAreaElement extends HTMLElement = HTMLDivElement,
  SentinelElement extends HTMLElement = HTMLDivElement,
> = {
  scrollAreaRef: RefObject<ScrollAreaElement>
  sentinelRef: RefObject<SentinelElement>
}

interface UseIsIntersectingParams {
  onIntersect: (isVisible: boolean) => void
}

export function useIsIntersecting<
  ScrollAreaElement extends HTMLElement = HTMLDivElement,
  SentinelElement extends HTMLElement = HTMLDivElement,
>({ onIntersect }: UseIsIntersectingParams): UseIsIntersectingResult<ScrollAreaElement, SentinelElement> {
  const scrollAreaRef = useRef<ScrollAreaElement>(null)
  const sentinelRef = useRef<SentinelElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        onIntersect(!!entries[0]?.isIntersecting)
      },
      {
        root: scrollAreaRef.current,
        threshold: 1.0,
      },
    )

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current)
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current)
      }
    }
  }, [onIntersect])

  return {
    scrollAreaRef,
    sentinelRef,
  }
}

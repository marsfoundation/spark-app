import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'

import { screensOverrides } from '@/config/tailwind'

// hardcoded defualt values from tailwind
// this way we don't have to import the whole default config
const defaultBreakpoints = {
  all: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}
const breakpoints = {
  ...defaultBreakpoints,
  ...screensOverrides,
}

export type BreakpointKey = keyof typeof breakpoints

function useMediaQuery(query: string): boolean {
  const subscribe = React.useCallback(
    (callback: () => void) => {
      const matchMedia = window.matchMedia(query)

      matchMedia.addEventListener('change', callback)
      return () => {
        matchMedia.removeEventListener('change', callback)
      }
    },
    [query],
  )
  function getSnapshot(): boolean {
    return window.matchMedia(query).matches
  }

  const { data, refetch } = useQuery({
    queryKey: ['useMediaQuery', query],
    queryFn: getSnapshot,
    initialData: getSnapshot(),
    staleTime: 0,
  })

  useEffect(() => {
    return subscribe(() => {
      void refetch()
    })
  }, [query, refetch, subscribe])

  return data
}

export function useBreakpoint(breakpoint: BreakpointKey): boolean {
  const query = `(min-width: ${breakpoints[breakpoint]})`
  return useMediaQuery(query)
}

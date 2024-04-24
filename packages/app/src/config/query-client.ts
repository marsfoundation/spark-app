import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1_000 * 60 * 60 * 24, // 24 hours
      refetchOnWindowFocus: true,
      retry: 0,
      staleTime: 1_000 * 60, // 1 minute
    },
  },
})

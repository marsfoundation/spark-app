import { QueryClient } from '@tanstack/react-query'
import { hashFn } from 'wagmi/query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1_000 * 60 * 60 * 24, // 24 hours
      refetchOnWindowFocus: true,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(300 * 2 ** attemptIndex, 10_000), // reduce base default 1000 ms delay to 300 ms
      staleTime: 1_000 * 60, // 1 minute
      queryKeyHashFn: hashFn,
    },
  },
})

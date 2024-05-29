import { QueryClient } from '@tanstack/react-query'

import { captureError } from '@/utils/sentry'

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

queryClient.getQueryCache().subscribe(({ query }) => {
  if (query.state.status === 'error') {
    captureError(query.state.error)
  }
})

queryClient.getMutationCache().subscribe(({ mutation }) => {
  if (mutation && mutation.state.status === 'error') {
    captureError(mutation.state.error)
  }
})

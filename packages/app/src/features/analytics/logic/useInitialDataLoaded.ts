import { useIsFetching } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export interface UseInitialDataLoadedOptions {
  /**
   * Delay after queries are finished loading before considering data loaded
   * @default 500 (0.5 second)
   */
  loadingCompletionDelay?: number

  /**
   * Maximum time to wait before forcibly marking data as loaded
   * @default 10000 (10 seconds)
   */
  maxWaitTime?: number
}

/**
 * Hook to track initial data loading state across React Query
 *
 * @returns boolean indicating if initial data loading is complete
 */
export function useInitialDataLoaded({
  loadingCompletionDelay = 500,
  maxWaitTime = 10000,
}: UseInitialDataLoadedOptions = {}): boolean {
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false)
  const isFetching = useIsFetching()

  useEffect(() => {
    // If already loaded, do nothing
    if (isInitialDataLoaded) {
      return
    }

    // Something is loading, do nothing
    if (isFetching > 0) {
      return
    }

    const loadingCompleteTimer = setTimeout(() => {
      setIsInitialDataLoaded(true)
    }, loadingCompletionDelay)

    return () => {
      clearTimeout(loadingCompleteTimer)
    }
  }, [isFetching, isInitialDataLoaded, loadingCompletionDelay])

  useEffect(() => {
    // Force load after max wait time
    const maxWaitTimer = setTimeout(() => {
      setIsInitialDataLoaded(true)
    }, maxWaitTime)

    return () => {
      clearTimeout(maxWaitTimer)
    }
  }, [maxWaitTime])

  return isInitialDataLoaded
}

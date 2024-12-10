import { MIXPANEL_ENABLED, optInTracking, optOutTracking } from '@/domain/analytics/mixpanel'
import { useStore } from '@/domain/state'
import { useTrackAccount } from './useTrackAccount'

export interface UseAnalyticsResult {
  showCookieBanner: boolean
  onAcceptCookieBanner: () => void
  onDeclineCookieBanner: () => void
}

export function useAnalytics(): UseAnalyticsResult {
  useTrackAccount()
  const { accepted, setAccepted } = useStore((state) => state.analytics)
  if (accepted) {
    optInTracking()
  } else {
    optOutTracking()
  }

  return {
    showCookieBanner: MIXPANEL_ENABLED && accepted === undefined,
    onAcceptCookieBanner: () => setAccepted(true),
    onDeclineCookieBanner: () => setAccepted(false),
  }
}

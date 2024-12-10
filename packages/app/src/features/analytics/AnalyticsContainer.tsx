import { CookieBanner } from './components/CookieBanner'
import { useAnalytics } from './logic/useAnalytics'

export function AnalyticsContainer() {
  const { showCookieBanner, onAcceptCookieBanner, onDeclineCookieBanner } = useAnalytics()

  if (!showCookieBanner) {
    return null
  }

  return (
    <CookieBanner
      onAccept={onAcceptCookieBanner}
      onDecline={onDeclineCookieBanner}
      className="fixed right-6 bottom-6 z-[1000]"
    />
  )
}

import { cn } from '@/ui/utils/style'
import { CookieBanner } from './components/CookieBanner'
import { useAnalytics } from './logic/useAnalytics'

export function AnalyticsContainer() {
  const { showCookieBanner, onAcceptCookieBanner, onDeclineCookieBanner } = useAnalytics()

  return (
    <CookieBanner
      onAccept={onAcceptCookieBanner}
      onDecline={onDeclineCookieBanner}
      className={cn(
        'fixed inset-x-2 bottom-2 z-[1000] sm:right-6 sm:bottom-6 sm:left-auto',
        'transform transition-all duration-500 ease-in-out',
        showCookieBanner ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0',
      )}
    />
  )
}

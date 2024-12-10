// import { JSONStringifyRich } from '@/utils/object'
// import { solidFetch } from '@/utils/solidFetch'

import './mixpanel'
import mixpanel from 'mixpanel-browser'

// const plausibleId = import.meta.env.VITE_ANALYTICS_PLAUSIBLE_ID

/**
 * Track an event for analytic purposes.
 * @note: this function creates a "floating" promise to avoid slowing down or breaking the functionality that it's called from.
 */
export function recordEvent(event: string, props: Record<string, any> = {}): void {
  mixpanel.track(event, props)
}

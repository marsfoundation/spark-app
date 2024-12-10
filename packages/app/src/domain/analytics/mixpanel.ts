import { CheckedAddress } from '@marsfoundation/common-universal'
import mixpanel from 'mixpanel-browser'
import { useStore } from '../state'

const mixpanelProjectToken = import.meta.env.VITE_ANALYTICS_MIXPANEL_PROJECT_TOKEN

mixpanel.init(mixpanelProjectToken, {
  opt_out_tracking_by_default: useStore.getState().analytics.accepted !== true,
  debug: true,
  track_pageview: true,
  persistence: 'localStorage',
  record_sessions_percent: 100,
  record_mask_text_selector: '',
})

export const MIXPANEL_ENABLED = mixpanelProjectToken !== undefined && mixpanelProjectToken !== ''

export function optInTracking(): void {
  if (!MIXPANEL_ENABLED) {
    return
  }

  if (!mixpanel.has_opted_in_tracking()) {
    mixpanel.opt_in_tracking()
  }
}

export function optOutTracking(): void {
  if (!MIXPANEL_ENABLED) {
    return
  }

  if (!mixpanel.has_opted_out_tracking()) {
    mixpanel.opt_out_tracking()
  }
}

export function trackUserAddress(address: CheckedAddress): void {
  if (!MIXPANEL_ENABLED) {
    return
  }

  mixpanel.identify(address)
}

export function trackEvent(event: string, props: Record<string, any> = {}): void {
  if (!MIXPANEL_ENABLED) {
    return
  }

  mixpanel.track(event, props)
}

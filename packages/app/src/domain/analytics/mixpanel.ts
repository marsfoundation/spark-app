import mixpanel from 'mixpanel-browser'
import { CheckedAddress } from '@marsfoundation/common-universal'
import { WalletType } from '@/domain/hooks/useWalletType'

console.log('Enabling mixpanel integration')

const mixpanelProjectToken = import.meta.env.VITE_ANALYTICS_MIXPANEL_PROJECT_TOKEN

const isEnabled = localStorage.getItem('mixpanel-enabled') === 'true'

// Near entry of your product, init Mixpanel
mixpanel.init(isEnabled && mixpanelProjectToken, {
  debug: true,
  track_pageview: true,
  persistence: 'localStorage',
  record_sessions_percent: 100,
  record_mask_text_selector: '',
})

export function trackUserAddress(address: CheckedAddress, walletType: WalletType): void {
  console.log('Tracking user address', { address, walletType })

  mixpanel.identify(address)
  mixpanel.people.set({ walletType })
}

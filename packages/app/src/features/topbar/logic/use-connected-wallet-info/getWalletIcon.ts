import { Connector } from 'wagmi'

import { assets } from '@/ui/assets'

export function getWalletIcon(connector: Connector): string {
  if (connector.name === 'WalletConnect') {
    return assets.walletIcons.walletConnect
  }

  return connector.icon ?? assets.walletIcons.default
}

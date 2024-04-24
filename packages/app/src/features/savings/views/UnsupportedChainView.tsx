import { assets } from '@/ui/assets'
import { WalletActionPanel } from '@/ui/organisms/wallet-action-panel/WalletActionPanel'

import { PageHeader } from '../components/PageHeader'
import { PageLayout } from '../components/PageLayout'

interface UnsupportedChainViewProps {
  openChainModal: () => void
  openConnectModal: () => void
  guestMode: boolean
}

export function UnsupportedChainView({ guestMode, openChainModal, openConnectModal }: UnsupportedChainViewProps) {
  return (
    <PageLayout>
      <PageHeader />
      <WalletActionPanel
        callToAction={`${guestMode ? 'Connect' : 'Switch'} to Ethereum Mainnet and start saving!`}
        iconPaths={TOKEN_ICONS}
        walletAction={guestMode ? openConnectModal : openChainModal}
        actionButtonTitle={guestMode ? 'Connect wallet' : 'Switch network'}
      />
    </PageLayout>
  )
}

const tokens = assets.token
const TOKEN_ICONS = [tokens.sdai, tokens.dai, tokens.usdc, tokens.usdt]

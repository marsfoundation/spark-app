import { Percentage } from '@/domain/types/NumericValues'
import { assets } from '@/ui/assets'
import { WalletActionPanel } from '@/ui/organisms/wallet-action-panel/WalletActionPanel'

import { PageHeader } from '../components/PageHeader'
import { PageLayout } from '../components/PageLayout'
import { SavingsOpportunityGuestMode } from '../components/savings-opportunity/SavingsOpportunityGuestMode'

interface GuestViewProps {
  DSR: Percentage
  openConnectModal: () => void
}

export function GuestView({ DSR, openConnectModal }: GuestViewProps) {
  return (
    <PageLayout>
      <PageHeader />
      <SavingsOpportunityGuestMode DSR={DSR} openConnectModal={openConnectModal} />
      <WalletActionPanel
        callToAction="Connect your wallet and start saving!"
        iconPaths={TOKEN_ICONS}
        walletAction={openConnectModal}
        actionButtonTitle="Connect wallet"
      />
    </PageLayout>
  )
}

const tokens = assets.token
const TOKEN_ICONS = [tokens.sdai, tokens.dai, tokens.usdc, tokens.usdt]

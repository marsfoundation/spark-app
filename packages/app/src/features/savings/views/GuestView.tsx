import { SupportedChainId } from '@/config/chain/types'
import { Percentage } from '@/domain/types/NumericValues'
import { assets } from '@/ui/assets'
import { WalletActionPanel } from '@/ui/organisms/wallet-action-panel/WalletActionPanel'

import { PageHeader } from '../components/PageHeader'
import { PageLayout } from '../components/PageLayout'
import { SavingsOpportunityGuestMode } from '../components/savings-opportunity/SavingsOpportunityGuestMode'

interface GuestViewProps {
  APY: Percentage
  chainId: SupportedChainId
  openConnectModal: () => void
}

export function GuestView({ APY, chainId, openConnectModal }: GuestViewProps) {
  return (
    <PageLayout>
      <PageHeader />
      <SavingsOpportunityGuestMode APY={APY} chainId={chainId} openConnectModal={openConnectModal} />
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

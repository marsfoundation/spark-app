import { SupportedChainId } from '@/config/chain/types'
import { Percentage } from '@/domain/types/NumericValues'
import { assets } from '@/ui/assets'
import { ConnectOrSandboxCTAPanel } from '@/ui/organisms/connect-or-sandbox-cta-panel/ConnectOrSandboxCTAPanel'
import { PageHeader } from '../components/PageHeader'
import { PageLayout } from '../components/PageLayout'
import { SavingsOpportunityGuestMode } from '../components/savings-opportunity/SavingsOpportunityGuestMode'

interface GuestViewProps {
  APY: Percentage
  chainId: SupportedChainId
  openConnectModal: () => void
  openSandboxModal: () => void
}

export function GuestView({ APY, chainId, openConnectModal, openSandboxModal }: GuestViewProps) {
  return (
    <PageLayout>
      <PageHeader />
      <SavingsOpportunityGuestMode APY={APY} chainId={chainId} openConnectModal={openConnectModal} />
      <ConnectOrSandboxCTAPanel
        header="Connect your wallet and start saving!"
        iconPaths={TOKEN_ICONS}
        action={openConnectModal}
        buttonText="Connect wallet"
        openSandboxModal={openSandboxModal}
      />
    </PageLayout>
  )
}

const tokens = assets.token
const TOKEN_ICONS = [tokens.sdai, tokens.dai, tokens.usdc, tokens.usdt]

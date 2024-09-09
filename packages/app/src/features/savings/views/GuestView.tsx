import { SupportedChainId } from '@/config/chain/types'
import { Percentage } from '@/domain/types/NumericValues'
import { assets } from '@/ui/assets'
import { ConnectOrSandboxCTAPanel } from '@/ui/organisms/connect-or-sandbox-cta-panel/ConnectOrSandboxCTAPanel'
import { PageHeader } from '../components/PageHeader'
import { PageLayout } from '../components/PageLayout'
import { SavingsOpportunityGuestMode } from '../components/savings-opportunity/SavingsOpportunityGuestMode'
import { SavingsMeta } from '../logic/makeSavingsMeta'

interface GuestViewProps {
  APY: Percentage
  originChainId: SupportedChainId
  savingsMeta: SavingsMeta
  openConnectModal: () => void
  openSandboxModal: () => void
}

export function GuestView({ APY, originChainId, openConnectModal, openSandboxModal, savingsMeta }: GuestViewProps) {
  return (
    <PageLayout>
      <PageHeader />
      <SavingsOpportunityGuestMode
        APY={APY}
        originChainId={originChainId}
        openConnectModal={openConnectModal}
        savingsMeta={savingsMeta}
      />
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

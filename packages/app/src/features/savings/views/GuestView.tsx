import { SupportedChainId } from '@/config/chain/types'
import { UseSavingsChartsInfoQueryResult } from '@/domain/savings-charts/useSavingsChartsInfoQuery'
import { Percentage } from '@/domain/types/NumericValues'
import { assets } from '@/ui/assets'
import { ConnectOrSandboxCTAPanel } from '@/ui/organisms/connect-or-sandbox-cta-panel/ConnectOrSandboxCTAPanel'
import { PageHeader } from '../components/PageHeader'
import { PageLayout } from '../components/PageLayout'
import { UsdsSavingsCharts } from '../components/savings-charts/UsdsSavingsCharts'
import { SavingsOpportunityGuestMode } from '../components/savings-opportunity/SavingsOpportunityGuestMode'
import { SavingsMeta } from '../logic/makeSavingsMeta'

interface GuestViewProps {
  APY: Percentage
  originChainId: SupportedChainId
  savingsMeta: SavingsMeta
  openConnectModal: () => void
  openSandboxModal: () => void
  savingsChartsInfo: UseSavingsChartsInfoQueryResult
}

export function GuestView({
  APY,
  originChainId,
  openConnectModal,
  openSandboxModal,
  savingsMeta,
  savingsChartsInfo,
}: GuestViewProps) {
  const displaySavingsChart = savingsChartsInfo.chartsSupported

  return (
    <PageLayout>
      <PageHeader />
      <div className="flex flex-col gap-6 sm:grid sm:grid-cols-2">
        <SavingsOpportunityGuestMode
          APY={APY}
          originChainId={originChainId}
          openConnectModal={openConnectModal}
          savingsMeta={savingsMeta}
          compact={displaySavingsChart}
        />
        {displaySavingsChart && <UsdsSavingsCharts {...savingsChartsInfo} />}
      </div>

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

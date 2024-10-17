import { getChainConfigEntry } from '@/config/chain'
import { SupportedChainId } from '@/config/chain/types'
import { UseSavingsChartsInfoQueryResult } from '@/domain/savings-charts/useSavingsChartsInfoQuery'
import { assets } from '@/ui/assets'
import { ConnectOrSandboxCTAPanel } from '@/ui/organisms/connect-or-sandbox-cta-panel/ConnectOrSandboxCTAPanel'
import { PageHeader } from '../components/PageHeader'
import { PageLayout } from '../components/PageLayout'
import { DaiSavingsCharts } from '../components/savings-charts/DaiSavingsCharts'
import { UsdsSavingsCharts } from '../components/savings-charts/UsdsSavingsCharts'
import { SavingsOpportunityGuestMode } from '../components/savings-opportunity/SavingsOpportunityGuestMode'
import { SavingsViewGrid } from '../components/savings-view-grid/SavingsViewGrid'
import { SavingsMeta } from '../logic/makeSavingsMeta'
import { SavingsTokenDetails } from '../logic/useSavings'

interface GuestViewProps {
  originChainId: SupportedChainId
  savingsMeta: SavingsMeta
  openConnectModal: () => void
  openSandboxModal: () => void
  savingsChartsInfo: UseSavingsChartsInfoQueryResult
  savingsTokenDetails: SavingsTokenDetails
}

export function GuestView({
  originChainId,
  openConnectModal,
  openSandboxModal,
  savingsMeta,
  savingsChartsInfo,
  savingsTokenDetails,
}: GuestViewProps) {
  const displaySavingsChart = savingsChartsInfo.chartsSupported

  const { susdsSymbol } = getChainConfigEntry(originChainId)

  const Charts =
    savingsTokenDetails.savingsTokenWithBalance.token.symbol === susdsSymbol ? UsdsSavingsCharts : DaiSavingsCharts

  return (
    <PageLayout>
      <PageHeader />
      <SavingsViewGrid>
        <SavingsOpportunityGuestMode
          APY={savingsTokenDetails.APY}
          originChainId={originChainId}
          openConnectModal={openConnectModal}
          savingsMeta={savingsMeta}
          openSandboxModal={openSandboxModal}
        />
        {displaySavingsChart && <Charts {...savingsChartsInfo} />}
      </SavingsViewGrid>

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

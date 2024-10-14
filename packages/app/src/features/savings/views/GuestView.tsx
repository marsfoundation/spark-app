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

  const { sUSDSSymbol } = getChainConfigEntry(originChainId)

  const Charts =
    savingsTokenDetails.tokenWithBalance.token.symbol === sUSDSSymbol ? UsdsSavingsCharts : DaiSavingsCharts

  return (
    <PageLayout>
      <PageHeader />
      <div className="flex flex-col gap-6 sm:grid sm:grid-cols-2">
        <SavingsOpportunityGuestMode
          APY={savingsTokenDetails.APY}
          originChainId={originChainId}
          openConnectModal={openConnectModal}
          savingsMeta={savingsMeta}
          compact={displaySavingsChart}
          openSandboxModal={openSandboxModal}
        />
        {displaySavingsChart && <Charts {...savingsChartsInfo} />}
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

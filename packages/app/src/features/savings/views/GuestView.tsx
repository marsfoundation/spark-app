import { getChainConfigEntry } from '@/config/chain'
import { SupportedChainId } from '@/config/chain/types'
import { UseSavingsChartsInfoQueryResult } from '@/domain/savings-charts/useSavingsChartsInfoQuery'
import { TokenSymbol } from '@/domain/types/TokenSymbol'
import { getTokenImage } from '@/ui/assets'
import { PageLayout } from '@/ui/layouts/PageLayout'
import { ConnectOrSandboxCTAPanel } from '@/ui/organisms/connect-or-sandbox-cta-panel/ConnectOrSandboxCTAPanel'
import { PageHeader } from '../components/PageHeader'
import { SavingsCharts } from '../components/savings-charts/SavingsCharts'
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
  const { savings, sdaiSymbol, susdsSymbol } = getChainConfigEntry(originChainId)
  const tokenIcons = [susdsSymbol, sdaiSymbol, ...(savings?.inputTokens ?? [])]
    .filter(Boolean)
    .map((symbol) => getTokenImage(TokenSymbol(symbol)))

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
        {displaySavingsChart && (
          <SavingsCharts
            savingsTokenSymbol={savingsTokenDetails.savingsTokenWithBalance.token.symbol}
            {...savingsChartsInfo}
          />
        )}
      </SavingsViewGrid>

      <ConnectOrSandboxCTAPanel
        header="Connect your wallet and start saving!"
        iconPaths={tokenIcons}
        action={openConnectModal}
        buttonText="Connect wallet"
        openSandboxModal={openSandboxModal}
      />
    </PageLayout>
  )
}

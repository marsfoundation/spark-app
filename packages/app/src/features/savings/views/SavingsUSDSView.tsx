import { PageLayout } from '@/ui/layouts/PageLayout'
import { PageHeader } from '../components/PageHeader'
import { SavingsCharts } from '../components/savings-charts/SavingsCharts'
import { skySavingsChartMeta } from '../components/savings-charts/constants'
import { SavingsOpportunity } from '../components/savings-opportunity/SavingsOpportunity'
import { SavingsTokenPanel } from '../components/savings-token-panel/SavingsTokenPanel'
import { SavingsViewGrid } from '../components/savings-view-grid/SavingsViewGrid'
import { StablecoinsInWallet } from '../components/stablecoins-in-wallet/StablecoinsInWallet'
import { SavingsViewContentProps } from './types'

export function SavingsUsdsView({
  savingsTokenDetails,
  migrationInfo,
  originChainId,
  assetsInWallet,
  maxBalanceToken,
  totalEligibleCashUSD,
  openDialog,
  showConvertDialogButton,
  savingsMeta,
  savingsChartsInfo,
}: SavingsViewContentProps) {
  const displaySavingsUsds = savingsTokenDetails.savingsTokenWithBalance.balance.gt(0)

  const displaySavingsUsdsChart = savingsChartsInfo.chartsSupported
  const displaySavingsOpportunity = !displaySavingsUsds || !displaySavingsUsdsChart

  return (
    <PageLayout>
      <PageHeader />
      <SavingsViewGrid>
        {displaySavingsUsds && (
          <SavingsTokenPanel
            variant="usds"
            originChainId={originChainId}
            openDialog={openDialog}
            savingsMetaItem={savingsMeta.primary}
            {...savingsTokenDetails}
          />
        )}

        {displaySavingsOpportunity && (
          <SavingsOpportunity
            APY={savingsTokenDetails.APY}
            originChainId={originChainId}
            maxBalanceToken={maxBalanceToken}
            openDialog={openDialog}
            totalEligibleCashUSD={totalEligibleCashUSD}
            savingsMeta={savingsMeta}
          />
        )}

        {displaySavingsUsdsChart && <SavingsCharts {...skySavingsChartMeta} {...savingsChartsInfo} />}
      </SavingsViewGrid>
      <StablecoinsInWallet
        assets={assetsInWallet}
        openDialog={openDialog}
        showConvertDialogButton={showConvertDialogButton}
        migrationInfo={migrationInfo}
      />
    </PageLayout>
  )
}

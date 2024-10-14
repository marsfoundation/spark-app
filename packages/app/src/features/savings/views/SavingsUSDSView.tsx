import { cn } from '@/ui/utils/style'
import { PageHeader } from '../components/PageHeader'
import { PageLayout } from '../components/PageLayout'
import { UsdsSavingsCharts } from '../components/savings-charts/UsdsSavingsCharts'
import { SavingsOpportunity } from '../components/savings-opportunity/SavingsOpportunity'
import { SavingsTokenPanel } from '../components/savings-token-panel/SavingsTokenPanel'
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
  savingsMeta,
  savingsChartsInfo,
}: SavingsViewContentProps) {
  const displaySavingsUsds = savingsTokenDetails.tokenWithBalance.balance.gt(0)

  const displaySavingsUsdsChart = savingsChartsInfo.chartsSupported
  const displaySavingsOpportunity = !displaySavingsUsds || !displaySavingsUsdsChart

  return (
    <PageLayout>
      <PageHeader />
      <div className={cn('flex flex-col gap-6 sm:grid sm:grid-cols-2', displaySavingsUsds && 'sm:min-h-[384px]')}>
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
            compact={displaySavingsUsdsChart || displaySavingsUsds}
          />
        )}

        {displaySavingsUsdsChart && <UsdsSavingsCharts {...savingsChartsInfo} />}
      </div>
      <StablecoinsInWallet assets={assetsInWallet} openDialog={openDialog} migrationInfo={migrationInfo} />
    </PageLayout>
  )
}

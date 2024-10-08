import { PageHeader } from '../components/PageHeader'
import { PageLayout } from '../components/PageLayout'
import { UsdsSavingsCharts } from '../components/savings-charts/UsdsSavingsCharts'
import { SavingsOpportunity } from '../components/savings-opportunity/SavingsOpportunity'
import { SavingsOpportunityNoCash } from '../components/savings-opportunity/SavingsOpportunityNoCash'
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
  opportunityProjections,
  openDialog,
  savingsMeta,
  savingsChartsInfo,
}: SavingsViewContentProps) {
  const displaySavingsUsds = savingsTokenDetails.tokenWithBalance.balance.gt(0)

  const displaySavingsUsdsChart = savingsChartsInfo.chartsSupported
  const displaySavingsOpportunity = !displaySavingsUsds && opportunityProjections.thirtyDays.gt(0)
  const displaySavingsNoCash = !displaySavingsUsds && !displaySavingsOpportunity

  return (
    <PageLayout>
      <PageHeader />
      <div className="flex flex-col gap-6 sm:flex-row">
        {displaySavingsUsds && (
          <>
            <SavingsTokenPanel
              variant="usds"
              originChainId={originChainId}
              openDialog={openDialog}
              savingsMetaItem={savingsMeta.primary}
              {...savingsTokenDetails}
            />
          </>
        )}
        {displaySavingsOpportunity && (
          <SavingsOpportunity
            APY={savingsTokenDetails.APY}
            originChainId={originChainId}
            projections={opportunityProjections}
            maxBalanceToken={maxBalanceToken}
            openDialog={openDialog}
            totalEligibleCashUSD={totalEligibleCashUSD}
            savingsMeta={savingsMeta}
          />
        )}
        {displaySavingsNoCash && (
          <SavingsOpportunityNoCash
            APY={savingsTokenDetails.APY}
            originChainId={originChainId}
            savingsMeta={savingsMeta}
          />
        )}
        {displaySavingsUsdsChart && <UsdsSavingsCharts {...savingsChartsInfo} />}
      </div>
      <StablecoinsInWallet assets={assetsInWallet} openDialog={openDialog} migrationInfo={migrationInfo} />
    </PageLayout>
  )
}

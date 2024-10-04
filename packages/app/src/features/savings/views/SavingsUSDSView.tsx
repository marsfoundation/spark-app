import { PageHeader } from '../components/PageHeader'
import { PageLayout } from '../components/PageLayout'
import { UsdsSavingsCharts } from '../components/savings-charts/UsdsSavingsCharts'
import { SavingsOpportunityNoCash } from '../components/savings-opportunity/SavingsOpportunityNoCash'
import { SavingsTokenPanel } from '../components/savings-token-panel/SavingsTokenPanel'
import { StablecoinsInWallet } from '../components/stablecoins-in-wallet/StablecoinsInWallet'
import { SavingsViewContentProps } from './types'

export function SavingsUsdsView({
  savingsTokenDetails,
  migrationInfo,
  originChainId,
  assetsInWallet,
  openDialog,
  savingsMeta,
  savingsChartsInfo,
}: SavingsViewContentProps) {
  const displaySavingsUsds = savingsTokenDetails.tokenWithBalance.balance.gt(0)
  const displaySavingsNoCash = !displaySavingsUsds

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
            <UsdsSavingsCharts {...savingsChartsInfo} />
          </>
        )}

        {displaySavingsNoCash && (
          <SavingsOpportunityNoCash
            APY={savingsTokenDetails.APY}
            originChainId={originChainId}
            savingsMeta={savingsMeta}
          />
        )}
      </div>
      <StablecoinsInWallet assets={assetsInWallet} openDialog={openDialog} migrationInfo={migrationInfo} />
    </PageLayout>
  )
}

import { PageHeader } from '../components/PageHeader'
import { PageLayout } from '../components/PageLayout'
import { DaiSavingsCharts } from '../components/savings-charts/DaiSavingsCharts'
import { SavingsOpportunity } from '../components/savings-opportunity/SavingsOpportunity'
import { SavingsTokenPanel } from '../components/savings-token-panel/SavingsTokenPanel'
import { StablecoinsInWallet } from '../components/stablecoins-in-wallet/StablecoinsInWallet'
import { UpgradeSavingsBanner } from '../components/upgrade-savings-banner/UpgradeSavingsBanner'
import { SavingsViewContentProps } from './types'

export function SavingsDaiView({
  savingsTokenDetails,
  migrationInfo,
  originChainId,
  assetsInWallet,
  maxBalanceToken,
  totalEligibleCashUSD,
  savingsMeta,
  openDialog,
  savingsChartsInfo,
}: SavingsViewContentProps) {
  const displaySavingsDai = savingsTokenDetails.tokenWithBalance.balance.gt(0)

  const displaySavingsDaiChart = savingsChartsInfo.chartsSupported
  const displaySavingsOpportunity = !displaySavingsDai || !displaySavingsDaiChart

  return (
    <PageLayout>
      <PageHeader />
      {displaySavingsDai && migrationInfo && (
        <UpgradeSavingsBanner
          onUpgradeSavingsClick={migrationInfo.openSDaiToSUsdsUpgradeDialog}
          apyImprovement={migrationInfo.apyImprovement}
        />
      )}
      <div className="flex flex-col gap-6 sm:grid sm:min-h-[384px] sm:grid-cols-2">
        {displaySavingsDai && (
          <SavingsTokenPanel
            variant="dai"
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
            compact={displaySavingsDaiChart || displaySavingsDai}
          />
        )}

        {displaySavingsDaiChart && <DaiSavingsCharts {...savingsChartsInfo} />}
      </div>
      <StablecoinsInWallet assets={assetsInWallet} openDialog={openDialog} migrationInfo={migrationInfo} />
    </PageLayout>
  )
}

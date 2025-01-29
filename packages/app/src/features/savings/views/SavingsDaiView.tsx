import { PageLayout } from '@/ui/layouts/PageLayout'
import { PageHeader } from '../components/PageHeader'
import { EntryAssetsPanel } from '../components/entry-assets-panel/EntryAssetsPanel'
import { SavingsCharts } from '../components/savings-charts/SavingsCharts'
import { SavingsOpportunity } from '../components/savings-opportunity/SavingsOpportunity'
import { SavingsTokenPanel } from '../components/savings-token-panel/SavingsTokenPanel'
import { SavingsViewGrid } from '../components/savings-view-grid/SavingsViewGrid'
import { UpgradeSavingsBanner } from '../components/upgrade-savings-banner/UpgradeSavingsBanner'
import { SavingsViewContentProps } from './types'

export function SavingsDaiView({
  savingsTokenDetails,
  migrationInfo,
  originChainId,
  entryAssets,
  maxBalanceToken,
  totalEligibleCashUSD,
  savingsMeta,
  openDialog,
  showConvertDialogButton,
  savingsChartsInfo,
}: SavingsViewContentProps) {
  const displaySavingsDai = savingsTokenDetails.savingsTokenWithBalance.balance.gt(0)

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
      <SavingsViewGrid>
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
            savingsToken={savingsTokenDetails.savingsTokenWithBalance.token}
          />
        )}

        {displaySavingsDaiChart && (
          <SavingsCharts
            savingsTokenSymbol={savingsTokenDetails.savingsTokenWithBalance.token.symbol}
            {...savingsChartsInfo}
          />
        )}
      </SavingsViewGrid>
      <EntryAssetsPanel
        assets={entryAssets}
        openDialog={openDialog}
        showConvertDialogButton={showConvertDialogButton}
        migrationInfo={migrationInfo}
        savingsToken={savingsTokenDetails.savingsTokenWithBalance.token}
      />
    </PageLayout>
  )
}

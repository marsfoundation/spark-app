import { UseSavingsChartsInfoQueryResult } from '@/domain/savings-charts/useSavingsChartsInfoQuery'
import { PageLayout } from '@/ui/layouts/PageLayout'
import { assert, raise } from '@marsfoundation/common-universal'
import { PageHeader } from '../components/PageHeader'
import { EntryAssetsPanel } from '../components/entry-assets-panel/EntryAssetsPanel'
import { SavingsCharts } from '../components/savings-charts/SavingsCharts'
import { SavingsOpportunity } from '../components/savings-opportunity/SavingsOpportunity'
import { SavingsTokenPanel } from '../components/savings-token-panel/SavingsTokenPanel'
import { SavingsViewGrid } from '../components/savings-view-grid/SavingsViewGrid'
import { UpgradeSavingsBanner } from '../components/upgrade-savings-banner/UpgradeSavingsBanner'
import { WelcomeDialog } from '../components/welcome-dialog/WelcomeDialog'
import { SavingsTokenDetails } from '../logic/useSavings'
import { SavingsViewContentProps } from './types'

export interface SavingsDaiAndUsdsViewProps extends Omit<SavingsViewContentProps, 'savingsTokenDetails'> {
  sDaiDetails: SavingsTokenDetails
  sUSDSDetails: SavingsTokenDetails
  showWelcomeDialog: boolean
  saveConfirmedWelcomeDialog: (confirmedWelcomeDialog: boolean) => void
  savingsChartsInfo: UseSavingsChartsInfoQueryResult
}

export function SavingsDaiAndUsdsView({
  sDaiDetails,
  sUSDSDetails,
  migrationInfo,
  originChainId,
  entryAssets,
  maxBalanceToken,
  totalEligibleCashUSD,
  savingsMeta,
  openDialog,
  showConvertDialogButton,
  showWelcomeDialog,
  saveConfirmedWelcomeDialog,
  savingsChartsInfo,
}: SavingsDaiAndUsdsViewProps) {
  const displaySavingsDai = sDaiDetails.savingsTokenWithBalance.balance.gt(0)
  const displaySavingsUsds = sUSDSDetails.savingsTokenWithBalance.balance.gt(0)

  const displaySavingsOpportunity =
    (!displaySavingsDai && !displaySavingsUsds) ||
    (!savingsChartsInfo.chartsSupported && (!displaySavingsDai || !displaySavingsUsds))

  const displaySavingsUsdsCharts =
    savingsChartsInfo.chartsSupported && ((displaySavingsUsds && !displaySavingsDai) || displaySavingsOpportunity)

  const displaySavingsDaiCharts =
    savingsChartsInfo.chartsSupported &&
    !displaySavingsUsdsCharts &&
    ((displaySavingsDai && !displaySavingsUsds) || displaySavingsOpportunity)

  assert(migrationInfo, 'Migration info should be defined in sDai and sUSDS view')

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
        {displaySavingsUsds && (
          <SavingsTokenPanel
            variant="usds"
            originChainId={originChainId}
            openDialog={openDialog}
            savingsMetaItem={savingsMeta.primary}
            {...sUSDSDetails}
          />
        )}

        {displaySavingsDai && (
          <SavingsTokenPanel
            variant="dai"
            originChainId={originChainId}
            openDialog={openDialog}
            savingsMetaItem={savingsMeta.secondary ?? raise('Dai savings meta should be defined')}
            {...sDaiDetails}
          />
        )}

        {displaySavingsOpportunity && (
          <SavingsOpportunity
            APY={sUSDSDetails.APY}
            originChainId={originChainId}
            maxBalanceToken={maxBalanceToken}
            openDialog={openDialog}
            totalEligibleCashUSD={totalEligibleCashUSD}
            savingsMeta={savingsMeta}
          />
        )}

        {displaySavingsUsdsCharts && (
          <SavingsCharts
            savingsTokenSymbol={sUSDSDetails.savingsTokenWithBalance.token.symbol}
            {...savingsChartsInfo}
          />
        )}

        {displaySavingsDaiCharts && (
          <SavingsCharts savingsTokenSymbol={sDaiDetails.savingsTokenWithBalance.token.symbol} {...savingsChartsInfo} />
        )}
      </SavingsViewGrid>
      <EntryAssetsPanel
        assets={entryAssets}
        openDialog={openDialog}
        showConvertDialogButton={showConvertDialogButton}
        migrationInfo={migrationInfo}
      />
      {import.meta.env.VITE_FEATURE_SAVINGS_WELCOME_DIALOG === '1' && (
        <WelcomeDialog
          open={showWelcomeDialog}
          onConfirm={() => saveConfirmedWelcomeDialog(true)}
          apyImprovement={migrationInfo.apyImprovement}
        />
      )}
    </PageLayout>
  )
}

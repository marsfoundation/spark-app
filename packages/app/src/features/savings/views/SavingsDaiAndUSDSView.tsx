import { UseSavingsChartsInfoQueryResult } from '@/domain/savings-charts/useSavingsChartsInfoQuery'
import { assert, raise } from '@/utils/assert'
import { PageHeader } from '../components/PageHeader'
import { PageLayout } from '../components/PageLayout'
import { DaiSavingsCharts } from '../components/savings-charts/DaiSavingsCharts'
import { UsdsSavingsCharts } from '../components/savings-charts/UsdsSavingsCharts'
import { SavingsOpportunity } from '../components/savings-opportunity/SavingsOpportunity'
import { SavingsOpportunityNoCash } from '../components/savings-opportunity/SavingsOpportunityNoCash'
import { SavingsTokenPanel } from '../components/savings-token-panel/SavingsTokenPanel'
import { StablecoinsInWallet } from '../components/stablecoins-in-wallet/StablecoinsInWallet'
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
  assetsInWallet,
  savingsMeta,
  openDialog,
  showWelcomeDialog,
  saveConfirmedWelcomeDialog,
  savingsChartsInfo,
  opportunityProjections,
  maxBalanceToken,
  totalEligibleCashUSD,
}: SavingsDaiAndUsdsViewProps) {
  const displaySavingsDai = sDaiDetails.tokenWithBalance.balance.gt(0)
  const displaySavingsUsds = sUSDSDetails.tokenWithBalance.balance.gt(0)

  const displaySavingsDaiCharts = displaySavingsDai && !displaySavingsUsds
  const displaySavingsUsdsCharts = displaySavingsUsds && !displaySavingsDai

  const noSavingsDisplay = !displaySavingsDai && !displaySavingsUsds
  const displaySavingsOpportunity = noSavingsDisplay && opportunityProjections.thirtyDays.gt(0)
  const displaySavingsNoCash = noSavingsDisplay && !displaySavingsOpportunity

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
      <div className="flex flex-col gap-6 sm:flex-row">
        {displaySavingsUsds && (
          <SavingsTokenPanel
            variant="usds"
            originChainId={originChainId}
            openDialog={openDialog}
            savingsMetaItem={savingsMeta.primary}
            {...sUSDSDetails}
          />
        )}
        {displaySavingsUsdsCharts && <UsdsSavingsCharts {...savingsChartsInfo} />}

        {displaySavingsDai && (
          <SavingsTokenPanel
            variant="dai"
            originChainId={originChainId}
            openDialog={openDialog}
            savingsMetaItem={savingsMeta.secondary ?? raise('Dai savings meta should be defined')}
            {...sDaiDetails}
          />
        )}
        {displaySavingsDaiCharts && <DaiSavingsCharts {...savingsChartsInfo} />}

        {displaySavingsOpportunity && (
          <SavingsOpportunity
            APY={sUSDSDetails.APY}
            originChainId={originChainId}
            projections={opportunityProjections}
            maxBalanceToken={maxBalanceToken}
            openDialog={openDialog}
            totalEligibleCashUSD={totalEligibleCashUSD}
            savingsMeta={savingsMeta}
          />
        )}
        {displaySavingsNoCash && (
          <SavingsOpportunityNoCash APY={sUSDSDetails.APY} originChainId={originChainId} savingsMeta={savingsMeta} />
        )}
      </div>
      <StablecoinsInWallet assets={assetsInWallet} openDialog={openDialog} migrationInfo={migrationInfo} />
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

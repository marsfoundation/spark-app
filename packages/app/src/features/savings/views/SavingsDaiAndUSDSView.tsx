import { assert, raise } from '@/utils/assert'
import { PageHeader } from '../components/PageHeader'
import { PageLayout } from '../components/PageLayout'
import { SavingsOpportunity } from '../components/savings-opportunity/SavingsOpportunity'
import { SavingsOpportunityNoCash } from '../components/savings-opportunity/SavingsOpportunityNoCash'
import { SavingsTokenPanel } from '../components/savings-token-panel/SavingsTokenPanel'
import { StablecoinsInWallet } from '../components/stablecoins-in-wallet/StablecoinsInWallet'
import { UpgradeSavingsBanner } from '../components/upgrade-savings-banner/UpgradeSavingsBanner'
import { WelcomeDialog } from '../components/welcome-dialog/WelcomeDialog'
import { SavingsTokenDetails } from '../logic/useSavings'
import { SavingsViewContentProps } from './types'

export interface SavingsDaiAndUSDSViewProps extends Omit<SavingsViewContentProps, 'savingsTokenDetails'> {
  sDaiDetails: SavingsTokenDetails
  sUSDSDetails: SavingsTokenDetails
  showWelcomeDialog: boolean
  saveConfirmedWelcomeDialog: (confirmedWelcomeDialog: boolean) => void
}

export function SavingsDaiAndUSDSView({
  sDaiDetails,
  sUSDSDetails,
  migrationInfo,
  opportunityProjections,
  originChainId,
  assetsInWallet,
  maxBalanceToken,
  totalEligibleCashUSD,
  savingsMeta,
  openDialog,
  showWelcomeDialog,
  saveConfirmedWelcomeDialog,
}: SavingsDaiAndUSDSViewProps) {
  const displaySavingsDai = sDaiDetails.tokenWithBalance.balance.gt(0)
  const displaySavingsUSDS = sUSDSDetails.tokenWithBalance.balance.gt(0)
  const displaySavingsOpportunity =
    (!displaySavingsDai || !displaySavingsUSDS) && opportunityProjections.thirtyDays.gt(0)
  const displaySavingsNoCash = !displaySavingsDai && !displaySavingsUSDS && !displaySavingsOpportunity

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
        {displaySavingsUSDS && (
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

import { PageLayout } from '@/features/savings/components/PageLayout'
import { assert } from '@/utils/assert'
import { PageHeader } from '../../savings/components/PageHeader'
import { SavingsOpportunity } from '../../savings/components/savings-opportunity/SavingsOpportunity'
import { SavingsOpportunityNoCash } from '../../savings/components/savings-opportunity/SavingsOpportunityNoCash'
import { CashInWallet } from '../components/cash-in-wallet/CashInWallet'
import { SavingsTokenPanel } from '../components/savings-token-panel/SavingsTokenPanel'
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
  chainId,
  assetsInWallet,
  maxBalanceToken,
  totalEligibleCashUSD,
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
          dsr={migrationInfo.dsr}
          ssr={migrationInfo.ssr}
        />
      )}
      <div className="flex flex-col gap-6 sm:flex-row">
        {displaySavingsDai && (
          <SavingsTokenPanel variant="dai" chainId={chainId} openDialog={openDialog} {...sDaiDetails} />
        )}
        {displaySavingsUSDS && (
          <SavingsTokenPanel variant="usds" chainId={chainId} openDialog={openDialog} {...sUSDSDetails} />
        )}
        {displaySavingsOpportunity && (
          <SavingsOpportunity
            APY={sUSDSDetails.APY}
            chainId={chainId}
            projections={opportunityProjections}
            maxBalanceToken={maxBalanceToken}
            openDialog={openDialog}
            totalEligibleCashUSD={totalEligibleCashUSD}
          />
        )}
        {displaySavingsNoCash && <SavingsOpportunityNoCash APY={sDaiDetails.APY} chainId={chainId} />}
      </div>
      <CashInWallet assets={assetsInWallet} openDialog={openDialog} migrationInfo={migrationInfo} />
      {import.meta.env.VITE_FEATURE_SAVINGS_WELCOME_DIALOG === '1' && (
        <WelcomeDialog
          open={showWelcomeDialog}
          onConfirm={() => saveConfirmedWelcomeDialog(true)}
          apyDifference={migrationInfo.apyDifference}
        />
      )}
    </PageLayout>
  )
}

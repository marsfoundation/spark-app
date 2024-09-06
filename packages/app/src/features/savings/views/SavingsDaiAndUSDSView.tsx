import { PageHeader } from '../components/PageHeader'
import { PageLayout } from '../components/PageLayout'
import { CashInWallet } from '../components/cash-in-wallet/CashInWallet'
import { SavingsOpportunity } from '../components/savings-opportunity/SavingsOpportunity'
import { SavingsOpportunityNoCash } from '../components/savings-opportunity/SavingsOpportunityNoCash'
import { SavingsTokenPanel } from '../components/savings-token-panel/SavingsTokenPanel'
import { UpgradeSavingsBanner } from '../components/upgrade-savings-banner/UpgradeSavingsBanner'
import { SavingsTokenDetails } from '../logic/useSavings'
import { SavingsViewContentProps } from './types'

export interface SavingsDaiAndUSDSViewProps extends Omit<SavingsViewContentProps, 'savingsTokenDetails'> {
  sDaiDetails: SavingsTokenDetails
  sUSDSDetails: SavingsTokenDetails
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
}: SavingsDaiAndUSDSViewProps) {
  const displaySavingsDai = sDaiDetails.tokenWithBalance.balance.gt(0)
  const displaySavingsUSDS = sUSDSDetails.tokenWithBalance.balance.gt(0)
  const displaySavingsOpportunity =
    (!displaySavingsDai || !displaySavingsUSDS) && opportunityProjections.thirtyDays.gt(0)
  const displaySavingsNoCash = !displaySavingsDai && !displaySavingsUSDS && !displaySavingsOpportunity

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
    </PageLayout>
  )
}
import { PageHeader } from '../../savings/components/PageHeader'
import { SavingsOpportunity } from '../../savings/components/savings-opportunity/SavingsOpportunity'
import { SavingsOpportunityNoCash } from '../../savings/components/savings-opportunity/SavingsOpportunityNoCash'
import { PageLayout } from '../components/PageLayout'
import { CashInWallet } from '../components/cash-in-wallet/CashInWallet'
import { SavingsTokenPanel } from '../components/savings-token-panel/SavingsTokenPanel'
import { SavingsViewContentProps } from './types'

export function SavingsUSDSView({
  savingsTokenDetails,
  migrationInfo,
  chainId,
  assetsInWallet,
  maxBalanceToken,
  totalEligibleCashUSD,
  opportunityProjections,
  openDialog,
  showWelcomeDialog,
  saveConfirmedWelcomeDialog,
}: SavingsViewContentProps) {
  const displaySavingsUSDS = savingsTokenDetails.tokenWithBalance.balance.gt(0)
  const displaySavingsOpportunity = opportunityProjections.thirtyDays.gt(0)
  const displaySavingsNoCash = !displaySavingsUSDS && !displaySavingsOpportunity

  return (
    <PageLayout showWelcomeDialog={showWelcomeDialog} saveConfirmedWelcomeDialog={saveConfirmedWelcomeDialog}>
      <PageHeader />
      <div className="flex flex-col gap-6 sm:flex-row">
        {displaySavingsUSDS && (
          <SavingsTokenPanel variant="usds" chainId={chainId} openDialog={openDialog} {...savingsTokenDetails} />
        )}
        {displaySavingsOpportunity && (
          <SavingsOpportunity
            APY={savingsTokenDetails.APY}
            chainId={chainId}
            projections={opportunityProjections}
            maxBalanceToken={maxBalanceToken}
            openDialog={openDialog}
            totalEligibleCashUSD={totalEligibleCashUSD}
          />
        )}
        {displaySavingsNoCash && <SavingsOpportunityNoCash APY={savingsTokenDetails.APY} chainId={chainId} />}
      </div>
      <CashInWallet assets={assetsInWallet} openDialog={openDialog} migrationInfo={migrationInfo} />
    </PageLayout>
  )
}

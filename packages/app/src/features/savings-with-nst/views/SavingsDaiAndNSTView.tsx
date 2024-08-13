import { PageHeader } from '../../savings/components/PageHeader'
import { PageLayout } from '../../savings/components/PageLayout'
import { SavingsOpportunity } from '../../savings/components/savings-opportunity/SavingsOpportunity'
import { SavingsOpportunityNoCash } from '../../savings/components/savings-opportunity/SavingsOpportunityNoCash'
import { CashInWallet } from '../components/cash-in-wallet/CashInWallet'
import { SavingsTokenPanel } from '../components/savings-token-panel/SavingsTokenPanel'
import { SavingsTokenDetails } from '../logic/useSavings'
import { SavingsViewContentProps } from './types'

export interface SavingsDaiAndNSTViewProps extends Omit<SavingsViewContentProps, 'savingsTokenDetails'> {
  sDaiDetails: SavingsTokenDetails
  sNSTDetails: SavingsTokenDetails
}

export function SavingsDaiAndNSTView({
  sDaiDetails,
  sNSTDetails,
  upgradeInfo,
  opportunityProjections,
  chainId,
  assetsInWallet,
  maxBalanceToken,
  totalEligibleCashUSD,
  openDialog,
}: SavingsDaiAndNSTViewProps) {
  const displaySavingsDai = sDaiDetails.tokenWithBalance.balance.gt(0)
  const displaySavingsNST = sNSTDetails.tokenWithBalance.balance.gt(0)
  const displaySavingsOpportunity =
    (!displaySavingsDai || !displaySavingsNST) && opportunityProjections.thirtyDays.gt(0)
  const displaySavingsNoCash = !displaySavingsDai && !displaySavingsNST && !displaySavingsOpportunity

  return (
    <PageLayout>
      <PageHeader />
      <div className="flex flex-col gap-6 sm:flex-row">
        {displaySavingsDai && (
          <SavingsTokenPanel variant="dai" chainId={chainId} openDialog={openDialog} {...sDaiDetails} />
        )}
        {displaySavingsNST && (
          <SavingsTokenPanel variant="nst" chainId={chainId} openDialog={openDialog} {...sNSTDetails} />
        )}
        {displaySavingsOpportunity && (
          <SavingsOpportunity
            APY={sNSTDetails.APY}
            chainId={chainId}
            projections={opportunityProjections}
            maxBalanceToken={maxBalanceToken}
            openDialog={openDialog}
            totalEligibleCashUSD={totalEligibleCashUSD}
          />
        )}
        {displaySavingsNoCash && <SavingsOpportunityNoCash APY={sDaiDetails.APY} chainId={chainId} />}
      </div>
      <CashInWallet assets={assetsInWallet} openDialog={openDialog} upgradeInfo={upgradeInfo} />
    </PageLayout>
  )
}

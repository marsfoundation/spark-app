import { PageHeader } from '../../savings/components/PageHeader'
import { PageLayout } from '../../savings/components/PageLayout'
import { SavingsOpportunity } from '../../savings/components/savings-opportunity/SavingsOpportunity'
import { SavingsOpportunityNoCash } from '../../savings/components/savings-opportunity/SavingsOpportunityNoCash'
import { CashInWallet } from '../components/cash-in-wallet/CashInWallet'
import { SavingsTokenPanel } from '../components/savings-token-panel/SavingsTokenPanel'
import { UpgradeSavingsBanner } from '../components/upgrade-savings-banner/UpgradeSavingsBanner'
import { SavingsViewContentProps } from './types'

export function SavingsDaiView({
  savingsTokenDetails,
  migrationInfo,
  chainId,
  assetsInWallet,
  maxBalanceToken,
  totalEligibleCashUSD,
  opportunityProjections,
  openDialog,
}: SavingsViewContentProps) {
  const displaySavingsDai = savingsTokenDetails.tokenWithBalance.balance.gt(0)
  const displaySavingsOpportunity = opportunityProjections.thirtyDays.gt(0)
  const displaySavingsNoCash = !displaySavingsDai && !displaySavingsOpportunity

  return (
    <PageLayout>
      <PageHeader />
      {displaySavingsDai && migrationInfo && (
        <UpgradeSavingsBanner onUpgradeSavingsClick={migrationInfo.openSDaiToSUsdsUpgradeDialog} />
      )}
      <div className="flex flex-col gap-6 sm:flex-row">
        {displaySavingsDai && (
          <SavingsTokenPanel variant="dai" chainId={chainId} openDialog={openDialog} {...savingsTokenDetails} />
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
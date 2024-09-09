import { PageHeader } from '../components/PageHeader'
import { PageLayout } from '../components/PageLayout'
import { CashInWallet } from '../components/cash-in-wallet/CashInWallet'
import { SavingsOpportunity } from '../components/savings-opportunity/SavingsOpportunity'
import { SavingsOpportunityNoCash } from '../components/savings-opportunity/SavingsOpportunityNoCash'
import { SavingsTokenPanel } from '../components/savings-token-panel/SavingsTokenPanel'
import { UpgradeSavingsBanner } from '../components/upgrade-savings-banner/UpgradeSavingsBanner'
import { SavingsViewContentProps } from './types'

export function SavingsDaiView({
  savingsTokenDetails,
  migrationInfo,
  originChainId,
  assetsInWallet,
  maxBalanceToken,
  totalEligibleCashUSD,
  opportunityProjections,
  savingsMeta,
  openDialog,
}: SavingsViewContentProps) {
  const displaySavingsDai = savingsTokenDetails.tokenWithBalance.balance.gt(0)
  const displaySavingsOpportunity = opportunityProjections.thirtyDays.gt(0)
  const displaySavingsNoCash = !displaySavingsDai && !displaySavingsOpportunity

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
          <SavingsTokenPanel
            variant="dai"
            originChainId={originChainId}
            openDialog={openDialog}
            {...savingsTokenDetails}
          />
        )}
        {displaySavingsOpportunity && (
          <SavingsOpportunity
            APY={savingsTokenDetails.APY}
            originChainId={originChainId}
            projections={opportunityProjections}
            maxBalanceToken={maxBalanceToken}
            openDialog={openDialog}
            totalEligibleCashUSD={totalEligibleCashUSD}
            savingsMeta={savingsMeta}
          />
        )}
        {displaySavingsNoCash && (
          <SavingsOpportunityNoCash
            APY={savingsTokenDetails.APY}
            originChainId={originChainId}
            savingsMeta={savingsMeta}
          />
        )}
      </div>
      <CashInWallet assets={assetsInWallet} openDialog={openDialog} migrationInfo={migrationInfo} />
    </PageLayout>
  )
}

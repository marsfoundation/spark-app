import { TokenWithBalance } from '@/domain/common/types'
import { OpenDialogFunction } from '@/domain/state/dialogs'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'

import { CashInWallet } from '../components/cash-in-wallet/CashInWallet'
import { PageHeader } from '../components/PageHeader'
import { PageLayout } from '../components/PageLayout'
import { SavingsDAI } from '../components/savings-dai/SavingsDAI'
import { SavingsOpportunity } from '../components/savings-opportunity/SavingsOpportunity'
import { SavingsOpportunityNoCash } from '../components/savings-opportunity/SavingsOpportunityNoCash'
import { Projections } from '../types'

export interface SavingsViewProps {
  DSR: Percentage
  depositedUSD: NormalizedUnitNumber
  depositedUSDPrecision: number
  sDAIBalance: TokenWithBalance
  currentProjections: Projections
  opportunityProjections: Projections
  assetsInWallet: TokenWithBalance[]
  maxBalanceToken: TokenWithBalance
  totalEligibleCashUSD: NormalizedUnitNumber
  openDialog: OpenDialogFunction
}

export function SavingsView({
  DSR,
  depositedUSD,
  depositedUSDPrecision,
  sDAIBalance,
  currentProjections,
  opportunityProjections,
  assetsInWallet,
  totalEligibleCashUSD,
  maxBalanceToken,
  openDialog,
}: SavingsViewProps) {
  const displaySavingsDai = depositedUSD.gt(0)
  const displaySavingsOpportunity = opportunityProjections.thirtyDays.gt(0) && opportunityProjections.oneYear.gt(0)
  const displaySavingsNoCash = !displaySavingsDai && !displaySavingsOpportunity

  return (
    <PageLayout>
      <PageHeader />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {displaySavingsDai && (
          <div className="last:sm:col-span-2">
            <SavingsDAI
              DSR={DSR}
              depositedUSD={depositedUSD}
              projections={currentProjections}
              depositedUSDPrecision={depositedUSDPrecision}
              sDAIBalance={sDAIBalance}
              openDialog={openDialog}
            />
          </div>
        )}
        {displaySavingsOpportunity && (
          <div className="first:sm:col-span-2">
            <SavingsOpportunity
              DSR={DSR}
              projections={opportunityProjections}
              maxBalanceToken={maxBalanceToken}
              openDialog={openDialog}
              totalEligibleCashUSD={totalEligibleCashUSD}
            />
          </div>
        )}
        {displaySavingsNoCash && (
          <div className="sm:col-span-2">
            <SavingsOpportunityNoCash DSR={DSR} />
          </div>
        )}
      </div>
      <CashInWallet assets={assetsInWallet} openDialog={openDialog} />
    </PageLayout>
  )
}

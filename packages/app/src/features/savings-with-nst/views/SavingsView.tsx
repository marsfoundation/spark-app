import { SupportedChainId } from '@/config/chain/types'
import { TokenWithBalance } from '@/domain/common/types'
import { OpenDialogFunction } from '@/domain/state/dialogs'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { PageHeader } from '../../savings/components/PageHeader'
import { PageLayout } from '../../savings/components/PageLayout'
import { CashInWallet } from '../../savings/components/cash-in-wallet/CashInWallet'
import { SavingsOpportunity } from '../../savings/components/savings-opportunity/SavingsOpportunity'
import { SavingsOpportunityNoCash } from '../../savings/components/savings-opportunity/SavingsOpportunityNoCash'
import { SavingsTokenPanel } from '../components/savings-token-panel/SavingsTokenPanel'
import { SavingsTokenDetails } from '../logic/useSavings'

export type SavingsViewTokenDetails =
  | { sDai: SavingsTokenDetails }
  | { sNST: SavingsTokenDetails }
  | { sDai: SavingsTokenDetails; sNST: SavingsTokenDetails }

export type SavingsViewProps = {
  chainId: SupportedChainId
  assetsInWallet: TokenWithBalance[]
  maxBalanceToken: TokenWithBalance
  totalEligibleCashUSD: NormalizedUnitNumber
  openDialog: OpenDialogFunction
} & SavingsViewTokenDetails

export function SavingsView({
  chainId,
  assetsInWallet,
  totalEligibleCashUSD,
  maxBalanceToken,
  openDialog,
  ...savingTokensDetails
}: SavingsViewProps) {
  if ('sDai' in savingTokensDetails && 'sNST' in savingTokensDetails) {
    return (
      <SavingsDaiAndNST
        sDaiDetails={savingTokensDetails.sDai}
        sNSTDetails={savingTokensDetails.sNST}
        chainId={chainId}
        assetsInWallet={assetsInWallet}
        maxBalanceToken={maxBalanceToken}
        totalEligibleCashUSD={totalEligibleCashUSD}
        openDialog={openDialog}
      />
    )
  }

  if ('sDai' in savingTokensDetails) {
    return (
      <OnlySavingsDai
        savingsTokenDetails={savingTokensDetails.sDai}
        chainId={chainId}
        assetsInWallet={assetsInWallet}
        maxBalanceToken={maxBalanceToken}
        totalEligibleCashUSD={totalEligibleCashUSD}
        openDialog={openDialog}
      />
    )
  }

  return (
    <OnlySavingsNST
      savingsTokenDetails={savingTokensDetails.sNST}
      chainId={chainId}
      assetsInWallet={assetsInWallet}
      maxBalanceToken={maxBalanceToken}
      totalEligibleCashUSD={totalEligibleCashUSD}
      openDialog={openDialog}
    />
  )
}

interface SavingsViewContentProps {
  savingsTokenDetails: SavingsTokenDetails
  chainId: SupportedChainId
  assetsInWallet: TokenWithBalance[]
  maxBalanceToken: TokenWithBalance
  totalEligibleCashUSD: NormalizedUnitNumber
  openDialog: OpenDialogFunction
}

function OnlySavingsDai({
  savingsTokenDetails,
  chainId,
  assetsInWallet,
  maxBalanceToken,
  totalEligibleCashUSD,
  openDialog,
}: SavingsViewContentProps) {
  const displaySavingsDai = savingsTokenDetails.tokenWithBalance.balance.gt(0)
  const displaySavingsOpportunity = totalEligibleCashUSD.gt(0)
  const displaySavingsNoCash = !displaySavingsDai && !displaySavingsOpportunity

  return (
    <PageLayout>
      <PageHeader />
      <div className="flex flex-col gap-6 sm:flex-row">
        {displaySavingsDai && (
          <SavingsTokenPanel variant="dai" chainId={chainId} openDialog={openDialog} {...savingsTokenDetails} />
        )}
        {displaySavingsOpportunity && (
          <SavingsOpportunity
            APY={savingsTokenDetails.APY}
            chainId={chainId}
            projections={savingsTokenDetails.opportunityProjections}
            maxBalanceToken={maxBalanceToken}
            openDialog={openDialog}
            totalEligibleCashUSD={totalEligibleCashUSD}
          />
        )}
        {displaySavingsNoCash && <SavingsOpportunityNoCash APY={savingsTokenDetails.APY} chainId={chainId} />}
      </div>
      <CashInWallet assets={assetsInWallet} openDialog={openDialog} />
    </PageLayout>
  )
}

function OnlySavingsNST({
  savingsTokenDetails,
  chainId,
  assetsInWallet,
  maxBalanceToken,
  totalEligibleCashUSD,
  openDialog,
}: SavingsViewContentProps) {
  const displaySavingsNST = savingsTokenDetails.tokenWithBalance.balance.gt(0)
  const displaySavingsOpportunity = totalEligibleCashUSD.gt(0)
  const displaySavingsNoCash = !displaySavingsNST && !displaySavingsOpportunity

  return (
    <PageLayout>
      <PageHeader />
      <div className="flex flex-col gap-6 sm:flex-row">
        <SavingsTokenPanel variant="nst" chainId={chainId} openDialog={openDialog} {...savingsTokenDetails} />
        {displaySavingsOpportunity && (
          <SavingsOpportunity
            APY={savingsTokenDetails.APY}
            chainId={chainId}
            projections={savingsTokenDetails.opportunityProjections}
            maxBalanceToken={maxBalanceToken}
            openDialog={openDialog}
            totalEligibleCashUSD={totalEligibleCashUSD}
          />
        )}
        {displaySavingsNoCash && <SavingsOpportunityNoCash APY={savingsTokenDetails.APY} chainId={chainId} />}
      </div>
      <CashInWallet assets={assetsInWallet} openDialog={openDialog} />
    </PageLayout>
  )
}

function SavingsDaiAndNST({
  sDaiDetails,
  sNSTDetails,
  chainId,
  assetsInWallet,
  maxBalanceToken,
  totalEligibleCashUSD,
  openDialog,
}: Omit<SavingsViewContentProps, 'savingsTokenDetails'> & {
  sDaiDetails: SavingsTokenDetails
  sNSTDetails: SavingsTokenDetails
}) {
  const displaySavingsDai = sDaiDetails.tokenWithBalance.balance.gt(0)
  const displaySavingsNST = sNSTDetails.tokenWithBalance.balance.gt(0)
  const opportunityProjections = displaySavingsDai
    ? sDaiDetails.opportunityProjections
    : sNSTDetails.opportunityProjections
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
      <CashInWallet assets={assetsInWallet} openDialog={openDialog} />
    </PageLayout>
  )
}
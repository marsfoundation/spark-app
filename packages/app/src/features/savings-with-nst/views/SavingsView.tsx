import { SupportedChainId } from '@/config/chain/types'
import { TokenWithBalance } from '@/domain/common/types'
import { OpenDialogFunction } from '@/domain/state/dialogs'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { PageHeader } from '../../savings/components/PageHeader'
import { PageLayout } from '../../savings/components/PageLayout'
import { CashInWallet } from '../../savings/components/cash-in-wallet/CashInWallet'
import { SavingsOpportunity } from '../../savings/components/savings-opportunity/SavingsOpportunity'
import { SavingsOpportunityNoCash } from '../../savings/components/savings-opportunity/SavingsOpportunityNoCash'
import { Projections } from '../../savings/types'
import { SavingsTokenPanel } from '../components/savings-token-panel/SavingsTokenPanel'

interface SavingsTokenProps {
  APY: Percentage
  tokenWithBalance: TokenWithBalance
  projections: Projections
  depositedUSD: NormalizedUnitNumber
  depositedUSDPrecision: number
}

export interface SavingsViewProps {
  chainId: SupportedChainId
  opportunityProjections: Projections
  assetsInWallet: TokenWithBalance[]
  maxBalanceToken: TokenWithBalance
  totalEligibleCashUSD: NormalizedUnitNumber
  openDialog: OpenDialogFunction
  sDai: SavingsTokenProps
  sNst?: SavingsTokenProps
}

export function SavingsView({
  sDai,
  sNst,
  chainId,
  opportunityProjections,
  assetsInWallet,
  totalEligibleCashUSD,
  maxBalanceToken,
  openDialog,
}: SavingsViewProps) {
  const displaySavingsDai = sDai.tokenWithBalance.balance.gt(0)
  // biome-ignore lint/complexity/useOptionalChain:
  const displaySavingsNST = sNst && sNst.tokenWithBalance.balance.gt(0)
  const displaySavingsOpportunity =
    (!displaySavingsDai || !displaySavingsNST) && opportunityProjections.thirtyDays.gt(0)
  const displaySavingsNoCash = !displaySavingsDai && !displaySavingsNST && !displaySavingsOpportunity
  const APY = sNst?.APY.gt(sDai.APY) ? sNst.APY : sDai.APY

  return (
    <PageLayout>
      <PageHeader />
      <div className="flex flex-col gap-6 sm:flex-row">
        {displaySavingsDai && (
          <SavingsTokenPanel
            variant="dai"
            APY={sDai.APY}
            chainId={chainId}
            depositedUSD={sDai.depositedUSD}
            projections={sDai.projections}
            depositedUSDPrecision={sDai.depositedUSDPrecision}
            savingsTokenWithBalance={sDai.tokenWithBalance}
            openDialog={openDialog}
          />
        )}
        {displaySavingsNST && (
          <SavingsTokenPanel
            variant="nst"
            APY={sNst.APY}
            chainId={chainId}
            depositedUSD={sNst.depositedUSD}
            projections={sNst.projections}
            depositedUSDPrecision={sNst.depositedUSDPrecision}
            savingsTokenWithBalance={sNst.tokenWithBalance}
            openDialog={openDialog}
          />
        )}
        {displaySavingsOpportunity && (
          <SavingsOpportunity
            APY={APY}
            chainId={chainId}
            projections={opportunityProjections}
            maxBalanceToken={maxBalanceToken}
            openDialog={openDialog}
            totalEligibleCashUSD={totalEligibleCashUSD}
          />
        )}
        {displaySavingsNoCash && <SavingsOpportunityNoCash APY={APY} chainId={chainId} />}
      </div>
      <CashInWallet assets={assetsInWallet} openDialog={openDialog} />
    </PageLayout>
  )
}

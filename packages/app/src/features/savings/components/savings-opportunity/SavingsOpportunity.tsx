import { SupportedChainId } from '@/config/chain/types'
import { TokenWithBalance } from '@/domain/common/types'
import { OpenDialogFunction } from '@/domain/state/dialogs'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { savingsDepositDialogConfig } from '@/features/dialogs/savings/deposit/SavingsDepositDialog'
import { SavingsMeta } from '../../logic/makeSavingsMeta'
import { Card } from './components/Card'
import { CardButton } from './components/CardButton'
import { Explainer } from './components/Explainer'
import { RateGrid } from './components/RateGrid'
import { SavingsRate } from './components/SavingsRate'

export interface SavingsOpportunityProps {
  APY: Percentage
  originChainId: SupportedChainId
  maxBalanceToken: TokenWithBalance
  openDialog: OpenDialogFunction
  totalEligibleCashUSD: NormalizedUnitNumber
  savingsMeta: SavingsMeta
}

export function SavingsOpportunity({
  APY,
  originChainId,
  maxBalanceToken,
  openDialog,
  totalEligibleCashUSD,
  savingsMeta,
}: SavingsOpportunityProps) {
  const hasNoCash = totalEligibleCashUSD.isZero()
  const stablecoinValue = hasNoCash ? undefined : totalEligibleCashUSD

  function openDepositDialog(): void {
    openDialog(savingsDepositDialogConfig, { initialToken: maxBalanceToken.token })
  }

  return (
    <Card hasNoCash={hasNoCash}>
      <RateGrid hasNoCash={hasNoCash}>
        <SavingsRate originChainId={originChainId} APY={APY} savingsMetaItem={savingsMeta.primary} />
        {!hasNoCash && <CardButton onClick={openDepositDialog}>Start saving!</CardButton>}
      </RateGrid>
      <Explainer stablecoinValue={stablecoinValue} savingsMeta={savingsMeta} originChainId={originChainId} />
    </Card>
  )
}

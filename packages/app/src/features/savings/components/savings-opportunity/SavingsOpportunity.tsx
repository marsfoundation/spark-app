import { SupportedChainId } from '@/config/chain/types'
import { formatPercentage } from '@/domain/common/format'
import { TokenWithBalance } from '@/domain/common/types'
import { OpenDialogFunction } from '@/domain/state/dialogs'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { savingsDepositDialogConfig } from '@/features/dialogs/savings/deposit/SavingsDepositDialog'
import { Button } from '@/ui/atoms/button/Button'
import { Panel } from '@/ui/atoms/panel/Panel'
import { cn } from '@/ui/utils/style'
import { SavingsMeta } from '../../logic/makeSavingsMeta'
import { SavingsInfoTile } from '../savings-info-tile/SavingsInfoTile'
import { DSRLabel } from './components/DSRLabel'
import { Explainer } from './components/Explainer'

export interface SavingsOpportunityProps {
  APY: Percentage
  originChainId: SupportedChainId
  maxBalanceToken: TokenWithBalance
  openDialog: OpenDialogFunction
  totalEligibleCashUSD: NormalizedUnitNumber
  savingsMeta: SavingsMeta
  compact?: boolean
}

export function SavingsOpportunity({
  APY,
  originChainId,
  maxBalanceToken,
  openDialog,
  totalEligibleCashUSD,
  savingsMeta,
  compact,
}: SavingsOpportunityProps) {
  const hasNoCash = totalEligibleCashUSD.isZero()
  const stablecoinValue = hasNoCash ? undefined : totalEligibleCashUSD

  function openDepositDialog(): void {
    openDialog(savingsDepositDialogConfig, { initialToken: maxBalanceToken.token })
  }

  return (
    <Panel.Wrapper
      className={cn(
        'flex h-full w-full flex-1 flex-col justify-between gap-5 self-stretch p-6 md:px-8',
        !compact && 'col-span-2',
      )}
      variant="green"
    >
      {compact ? (
        <>
          <Explainer stablecoinValue={stablecoinValue} savingsMeta={savingsMeta} />

          <div className="flex items-end justify-between gap-5">
            <SavingsInfoTile>
              <SavingsInfoTile.Value size="extraLarge">
                {formatPercentage(APY, { minimumFractionDigits: 0 })}
              </SavingsInfoTile.Value>
              <DSRLabel originChainId={originChainId} savingsMetaItem={savingsMeta.primary} />
            </SavingsInfoTile>

            {!hasNoCash && (
              <Button variant="green" onClick={openDepositDialog}>
                Start saving!
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col justify-between gap-10 sm:flex-row sm:items-center">
            <SavingsInfoTile alignItems="center" className="mx-auto">
              <SavingsInfoTile.Value size="huge">
                {formatPercentage(APY, { minimumFractionDigits: 0 })}
              </SavingsInfoTile.Value>
              <DSRLabel originChainId={originChainId} savingsMetaItem={savingsMeta.primary} />
            </SavingsInfoTile>

            <Explainer stablecoinValue={stablecoinValue} savingsMeta={savingsMeta} />
            {!hasNoCash && (
              <Button variant="green" onClick={openDepositDialog}>
                Start saving!
              </Button>
            )}
          </div>
        </>
      )}
    </Panel.Wrapper>
  )
}

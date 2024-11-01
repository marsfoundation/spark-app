import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokenAmount } from '@/ui/molecules/token-amount/TokenAmount'
import { MoveRightIcon } from 'lucide-react'

export interface TransactionOverviewAmountChangeProps {
  token: Token
  currentAmount: NormalizedUnitNumber
  updatedAmount?: NormalizedUnitNumber
}

export function TransactionOverviewAmountChange({
  token,
  currentAmount,
  updatedAmount,
}: TransactionOverviewAmountChangeProps) {
  return (
    <div className="flex gap-2.5">
      <TokenAmount token={token} amount={currentAmount} />
      {updatedAmount && (
        <>
          <MoveRightIcon className="icon-xxs mt-[3px] text-secondary" />
          <TokenAmount token={token} amount={updatedAmount} />
        </>
      )}
    </div>
  )
}

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokenAmount } from '@/ui/molecules/token-amount/TokenAmount'
import { MoveRightIcon } from 'lucide-react'

export interface TransactionOverviewTokenAmountChangeProps {
  token: Token
  currentAmount: NormalizedUnitNumber
  updatedAmount?: NormalizedUnitNumber
}

export function TransactionOverviewTokenAmountChange({
  token,
  currentAmount,
  updatedAmount,
}: TransactionOverviewTokenAmountChangeProps) {
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

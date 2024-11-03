import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokenAmount } from '@/ui/molecules/token-amount/TokenAmount'

export interface TransactionOverviewTokenAmountProps {
  token: Token
  amount: NormalizedUnitNumber
  usdAmount?: NormalizedUnitNumber
}

export function TransactionOverviewTokenAmount({ token, amount, usdAmount }: TransactionOverviewTokenAmountProps) {
  return <TokenAmount token={token} amount={amount} usdAmount={usdAmount} variant="horizontal" />
}

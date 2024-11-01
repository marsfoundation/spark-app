import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokenAmount } from '@/ui/molecules/token-amount/TokenAmount'

export interface TransactionOverviewOutcomeProps {
  token: Token
  amount: NormalizedUnitNumber
}

export function TransactionOverviewOutcome({ token, amount }: TransactionOverviewOutcomeProps) {
  return <TokenAmount token={token} amount={amount} variant="horizontal" />
}

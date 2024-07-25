import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { RouteItem } from '../../../types'

export interface TransactionOutcomeProps {
  outcome: RouteItem
  'data-testid'?: string
}

export function TransactionOutcome({ outcome, 'data-testid': dataTestId }: TransactionOutcomeProps) {
  return (
    <div className="flex flex-col items-end gap-0.5 md:block" data-testid={dataTestId}>
      <span>
        {outcome.token.format(outcome.value, { style: 'auto' })} {outcome.token.symbol}
      </span>
      <span> worth </span>
      <span className="font-semibold">{USD_MOCK_TOKEN.formatUSD(outcome.usdValue)}</span>
    </div>
  )
}

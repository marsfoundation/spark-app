import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { assets } from '@/ui/assets'
import { TransactionOverviewDetailsItem } from './TransactionOverviewDetailsItem'

interface TokenValueChangeProps {
  token: Token
  label: string
  currentValue: NormalizedUnitNumber
  updatedValue?: NormalizedUnitNumber
}

export function TokenValueChange({ token, label, currentValue, updatedValue }: TokenValueChangeProps) {
  if (updatedValue === undefined) {
    return (
      <TransactionOverviewDetailsItem label={label}>
        <TokenValue token={token} value={currentValue} />
      </TransactionOverviewDetailsItem>
    )
  }

  return (
    <TransactionOverviewDetailsItem label={label}>
      <div className="flex flex-row items-center gap-2">
        <TokenValue token={token} value={currentValue} /> <img src={assets.arrowRight} />
        <TokenValue token={token} value={updatedValue} />
      </div>
    </TransactionOverviewDetailsItem>
  )
}

function TokenValue({
  value,
  token,
}: {
  value: NormalizedUnitNumber
  token: Token
}) {
  const formattedValue = token.format(value, { style: 'auto' })
  return (
    <span className="text-center">
      {formattedValue} {token.symbol}
    </span>
  )
}

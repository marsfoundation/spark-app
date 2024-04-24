import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

import { formatWithHighPrecision } from '../../utils/formatWithHighPrecision'

export function TokenValue({
  value,
  token,
  variant,
}: {
  value: NormalizedUnitNumber
  token: Token
  variant: 'compact' | 'high-precision' | 'auto-precision'
}) {
  const formattedValue =
    variant === 'compact'
      ? token.format(value, { style: 'compact' })
      : variant === 'high-precision'
        ? formatWithHighPrecision(value)
        : token.format(value, { style: 'auto' })
  return (
    <span className="text-center">
      {formattedValue} {token.symbol}
    </span>
  )
}

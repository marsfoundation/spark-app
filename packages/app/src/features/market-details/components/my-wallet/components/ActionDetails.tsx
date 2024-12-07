import { Token } from '@/domain/types/Token'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'

interface ActionDetailsProps {
  label: string
  token: Token
  value: NormalizedUnitNumber
}

export function ActionDetails({ label, token, value }: ActionDetailsProps) {
  return (
    <div className="flex flex-col items-baseline">
      <p className="typography-label-6 text-secondary">{label}</p>
      <p className="typography-body-4 text-primary">
        {token.format(value, { style: 'auto' })} {token.symbol}
      </p>
      <div className="typography-label-6 text-secondary">{token.formatUSD(value)}</div>
    </div>
  )
}

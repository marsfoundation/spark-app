import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'

interface ActionDetailsProps {
  label: string
  token: Token
  value: NormalizedUnitNumber
}

export function ActionDetails({ label, token, value }: ActionDetailsProps) {
  return (
    <div className="flex flex-col">
      <p className="text-white/50 text-xs leading-none">{label}</p>
      <p className="text-base">
        {token.format(value, { style: 'auto' })} {token.symbol}
      </p>
      <div className="text-white/50 text-xs leading-none">{token.formatUSD(value)}</div>
    </div>
  )
}

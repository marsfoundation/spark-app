import { Token } from '@/domain/types/Token'
import { NormalizedUnitNumber } from '@marsfoundation/common-universal'

interface ActionDetailsProps {
  label: string
  token: Token
  value: NormalizedUnitNumber
}

export function ActionDetails({ label, token, value }: ActionDetailsProps) {
  return (
    <div className="flex flex-col">
      <p className="text-slate-500 text-xs leading-none">{label}</p>
      <p className="text-base text-sky-950">
        {token.format(value, { style: 'auto' })} {token.symbol}
      </p>
      <div className="text-slate-500 text-xs leading-none">{token.formatUSD(value)}</div>
    </div>
  )
}

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'

export interface SuccessViewTokenRowProps {
  token: Token
  amount: NormalizedUnitNumber
}

export function SuccessViewTokenRow({ token, amount }: SuccessViewTokenRowProps) {
  return (
    <div className="mb-2 flex w-full items-center justify-between">
      <div className="flex items-center gap-1">
        <TokenIcon token={token} className="h-5" />
        <span className="typography-label-4 text-primary">{token.symbol}</span>
      </div>
      <div className="flex grow flex-col text-right">
        <div className="typography-label-4 text-primary">{token.format(amount, { style: 'auto' })}</div>
        <div className="typography-label-5 text-secondary"> {token.formatUSD(amount)}</div>
      </div>
    </div>
  )
}

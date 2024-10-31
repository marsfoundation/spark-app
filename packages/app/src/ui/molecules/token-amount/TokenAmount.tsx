import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'

export interface TokenAmountProps {
  token: Token
  amount: NormalizedUnitNumber
  variant?: 'vertical' | 'horizontal'
}

export function TokenAmount({ token, amount, variant = 'vertical' }: TokenAmountProps) {
  if (variant === 'horizontal') {
    return (
      <div className="flex w-fit items-center gap-1.5">
        <TokenIcon token={token} className="h-4 w-4" />
        <div className="flex items-end gap-0.5">
          <div className="typography-label-4 !leading-none text-primary">{token.format(amount, { style: 'auto' })}</div>
          <div className="typography-body-6 !leading-none text-secondary">{token.formatUSD(amount)}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid w-fit grid-cols-[auto_auto] grid-rows-[auto_auto] items-center gap-x-1.5 gap-y-0.5">
      <TokenIcon token={token} className="h-4 w-4" />
      <div className="typography-label-4 !leading-none text-primary">{token.format(amount, { style: 'auto' })}</div>
      <div />
      <div className="typography-body-6 !leading-none text-secondary">{token.formatUSD(amount)}</div>
    </div>
  )
}

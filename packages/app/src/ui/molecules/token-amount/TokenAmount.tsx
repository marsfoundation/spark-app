import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token, USD_MOCK_TOKEN } from '@/domain/types/Token'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'

export interface TokenAmountProps {
  token: Token
  amount: NormalizedUnitNumber
  usdAmount?: NormalizedUnitNumber
  variant?: 'vertical' | 'horizontal'
}

export function TokenAmount({ token, amount, usdAmount, variant = 'vertical' }: TokenAmountProps) {
  const formattedAmount = token.format(amount, { style: 'auto' })
  const formattedUsdAmount = usdAmount ? USD_MOCK_TOKEN.formatUSD(usdAmount) : token.formatUSD(amount)

  if (variant === 'horizontal') {
    return (
      <div className="flex w-fit items-center gap-1.5">
        <TokenIcon token={token} className="h-4 w-4" />
        <div className="flex items-end gap-0.5">
          <div className="typography-label-4 !leading-none text-primary">{formattedAmount}</div>
          <div className="typography-body-6 !leading-none text-secondary">{formattedUsdAmount}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid w-fit grid-cols-[auto_auto] grid-rows-[auto_auto] items-center gap-x-1.5 gap-y-0.5">
      <TokenIcon token={token} className="h-4 w-4" />
      <div className="typography-label-4 !leading-none text-primary">{formattedAmount}</div>
      <div />
      <div className="typography-body-6 !leading-none text-secondary">{formattedUsdAmount}</div>
    </div>
  )
}

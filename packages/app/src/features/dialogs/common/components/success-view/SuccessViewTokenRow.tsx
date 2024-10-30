import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { Typography } from '@/ui/atoms/typography/Typography'

export interface SuccessViewTokenRowProps {
  token: Token
  amount: NormalizedUnitNumber
}

export function SuccessViewTokenRow({ token, amount }: SuccessViewTokenRowProps) {
  return (
    <div className="mb-2 flex justify-between">
      <div className="flex items-center gap-2">
        <TokenIcon token={token} className="h-6" />
        <span className="font-semibold">{token.symbol}</span>
      </div>
      <div className="flex grow flex-col">
        <Typography className="text-right font-primary">{token.format(amount, { style: 'auto' })}</Typography>
        <Typography variant="prompt" className="text-right">
          {token.formatUSD(amount)}
        </Typography>
      </div>
    </div>
  )
}

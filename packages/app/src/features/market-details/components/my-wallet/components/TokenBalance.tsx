import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokenIcon } from '@/ui/atoms/token-icon/TokenIcon'
import { testIds } from '@/ui/utils/testIds'

interface TokenBalanceProps {
  token: Token
  balance: NormalizedUnitNumber
}

export function TokenBalance({ token, balance }: TokenBalanceProps) {
  return (
    <div className="my-4 flex flex-col gap-1">
      <p className="text-white/50 text-xs">Balance:</p>
      <div className="flex items-center">
        <TokenIcon token={token} className="mr-2 h-6 w-6" />
        <p className="font-semibold text-base md:text-xl" data-testid={testIds.marketDetails.walletPanel.balance}>
          {token.format(balance, { style: 'auto' })} {token.symbol}
        </p>
      </div>
    </div>
  )
}

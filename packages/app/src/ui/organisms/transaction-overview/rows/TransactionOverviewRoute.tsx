import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokenAmount } from '@/ui/molecules/token-amount/TokenAmount'
import { MoveRightIcon } from 'lucide-react'
import { Fragment } from 'react'

export interface TransactionOverviewRouteProps {
  route: {
    token: Token
    amount: NormalizedUnitNumber
    usdAmount?: NormalizedUnitNumber
  }[]
}

export function TransactionOverviewRoute({ route }: TransactionOverviewRouteProps) {
  return (
    <div className="flex gap-2">
      {route.map(({ token, amount, usdAmount }, index) => (
        <Fragment key={token.symbol}>
          <TokenAmount token={token} amount={amount} usdAmount={usdAmount} />
          {index !== route.length - 1 && (
            <div className="p-0.5">
              <MoveRightIcon size={12} className="text-secondary" />
            </div>
          )}
        </Fragment>
      ))}
    </div>
  )
}
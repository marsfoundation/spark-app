import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { Token } from '@/domain/types/Token'
import { TokenAmount } from '@/ui/molecules/token-amount/TokenAmount'
import { testIds } from '@/ui/utils/testIds'
import { MoveRightIcon } from 'lucide-react'
import { Fragment } from 'react'

export type RouteItem =
  | {
      type: 'token-amount'
      token: Token
      amount: NormalizedUnitNumber
      usdAmount?: NormalizedUnitNumber
    }
  | {
      type: 'generic'
      upperText: string
      lowerText: string
      upperTextDataTestId?: string
      lowerTextDataTestId?: string
    }

export interface TransactionOverviewRouteProps {
  route: RouteItem[]
}

export function TransactionOverviewRoute({ route }: TransactionOverviewRouteProps) {
  return (
    <div className="flex gap-2.5">
      {route.map((item, index) => (
        <Fragment key={item.type === 'token-amount' ? item.token.symbol : item.upperText}>
          {item.type === 'token-amount' ? (
            <TokenAmount
              token={item.token}
              amount={item.amount}
              usdAmount={item.usdAmount}
              amountDataTestId={testIds.dialog.transactionOverview.routeItem.tokenWithAmount(index)}
              usdAmountDataTestId={testIds.dialog.transactionOverview.routeItem.tokenUsdValue(index)}
            />
          ) : (
            <div className="flex flex-col items-end gap-1.5">
              <div className="typography-label-4 text-primary" data-testid={item.upperTextDataTestId}>
                {item.upperText}
              </div>
              <div className="typography-body-6 text-secondary" data-testid={item.lowerTextDataTestId}>
                {item.lowerText}
              </div>
            </div>
          )}
          {index !== route.length - 1 && <MoveRightIcon className="icon-xxs mt-[3px] text-secondary" />}
        </Fragment>
      ))}
    </div>
  )
}

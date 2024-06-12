import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { assets } from '@/ui/assets'
import { cn } from '@/ui/utils/style'
import { testIds } from '@/ui/utils/testIds'
import { RouteItem as RouteItemType } from '../../../types'

export interface RouteItemProps {
  item: RouteItemType
  index: number
  isLast: boolean
  verticalRouteDisplay: boolean
}
export function RouteItem({ item, index, isLast, verticalRouteDisplay }: RouteItemProps) {
  return (
    <div className={cn('grid grid-cols-1 items-center gap-x-2 gap-y-0.5', !isLast && !verticalRouteDisplay && 'md:grid-cols-[auto_auto]')}>
      <div data-testid={testIds.dialog.savings.nativeRouteTransactionOverview.routeItem.tokenWithAmount(index)}>
        {item.token.format(item.value, { style: 'auto' })} {item.token.symbol}
      </div>
      <div
        className={cn("justify-self-end text-basics-dark-grey text-sm ", !verticalRouteDisplay && "md:order-last")}
        data-testid={testIds.dialog.savings.nativeRouteTransactionOverview.routeItem.tokenUsdValue(index)}
      >
        {USD_MOCK_TOKEN.formatUSD(item.usdValue)}
      </div>
      {!isLast && (
        <img src={assets.arrowRight} className={cn("mt-1.5 h-3.5 w-3.5 rotate-90 justify-self-end", !verticalRouteDisplay&& "md:mt-0 md:rotate-0")} />
      )}
    </div>
  )
}

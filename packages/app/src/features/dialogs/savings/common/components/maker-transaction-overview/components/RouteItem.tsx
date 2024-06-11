import { USD_MOCK_TOKEN } from '@/domain/types/Token'
import { assets } from '@/ui/assets'
import { cn } from '@/ui/utils/style'
import { RouteItem as RouteItemType } from '../../../types'

export interface RouteItemProps {
  item: RouteItemType
  isLast: boolean
}
export function RouteItem({ item, isLast }: RouteItemProps) {
  return (
    <div className={cn('grid grid-cols-1 items-center gap-x-2 gap-y-0.5', !isLast && 'md:grid-cols-[auto_auto]')}>
      <div>
        {item.token.format(item.value, { style: 'auto' })} {item.token.symbol}
      </div>
      <div className="justify-self-end text-basics-dark-grey text-sm md:order-last">
        {USD_MOCK_TOKEN.formatUSD(item.usdValue)}
      </div>
      {!isLast && (
        <img src={assets.arrowRight} className="mt-1.5 h-3.5 w-3.5 rotate-90 justify-self-end md:mt-0 md:rotate-0" />
      )}
    </div>
  )
}

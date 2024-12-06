import { assets } from '@/ui/assets'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/atoms/tooltip/Tooltip'
import { cn } from '@/ui/utils/style'
import { InfoIcon } from 'lucide-react'
import { HTMLAttributes } from 'react'
import { TransactionOverviewApyChange } from './rows/TransactionOverviewApyChange'
import { TransactionOverviewAvailableAssets } from './rows/TransactionOverviewAvailableAssets'
import { TransactionOverviewFarmApy } from './rows/TransactionOverviewFarmApy'
import { TransactionOverviewHealthFactorChange } from './rows/TransactionOverviewHealthFactorChange'
import { TransactionOverviewMaxLtvChange } from './rows/TransactionOverviewMaxLtvChange'
import { TransactionOverviewRoute, TransactionOverviewRoutePlaceholder } from './rows/TransactionOverviewRoute'
import { TransactionOverviewSavingsApy } from './rows/TransactionOverviewSavingsApy'
import { TransactionOverviewStakedInFarm } from './rows/TransactionOverviewStakedInFarm'
import { TransactionOverviewTokenAmount } from './rows/TransactionOverviewTokenAmount'
import { TransactionOverviewTokenAmountChange } from './rows/TransactionOverviewTokenAmountChange'

export interface TransactionOverviewProps {
  children: React.ReactNode
  showSkyBadge?: boolean
}

function TransactionOverview({ children, showSkyBadge = false }: TransactionOverviewProps) {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h5 className="typography-body-5 text-secondary">Transaction overview</h5>
        {showSkyBadge && (
          <div className="flex items-center gap-1.5">
            <img src={assets.token.sky} className="icon-xs" />
            <div className="typography-label-6 text-brand-primary">Powered by Sky</div>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="icon-xs text-brand-primary" />
              </TooltipTrigger>
              <TooltipContent>The transaction uses infrastructure provided by the Sky Ecosystem.</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
      <div
        className="grid grid-cols-[auto_1fr] gap-x-6 rounded-sm bg-secondary"
        style={{ gridAutoRows: 'minmax(0, 1fr)' }}
      >
        {children}
      </div>
    </section>
  )
}

function TransactionOverviewLabel({ children }: { children: React.ReactNode }) {
  return <div className="typography-label-5 text-secondary">{children}:</div>
}

function TransactionOverviewRow({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'col-span-full grid grid-cols-subgrid items-center',
        'border-primary border-b px-5 py-4 last:border-none',
        '[&:not(:has(>*:nth-child(2)))]:hidden', // there is no second child, e.g. either or both label and content are missing
      )}
    >
      {children}
    </div>
  )
}

function TransactionOverviewGenericRow({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div {...rest} className={cn('typography-label-4 text-primary', className)} />
}

TransactionOverview.Label = TransactionOverviewLabel
TransactionOverview.Row = TransactionOverviewRow

TransactionOverview.TokenAmount = TransactionOverviewTokenAmount
TransactionOverview.Route = TransactionOverviewRoute
TransactionOverview.RoutePlaceholder = TransactionOverviewRoutePlaceholder
TransactionOverview.FarmApy = TransactionOverviewFarmApy
TransactionOverview.SavingsApy = TransactionOverviewSavingsApy
TransactionOverview.ApyChange = TransactionOverviewApyChange
TransactionOverview.TokenAmountChange = TransactionOverviewTokenAmountChange
TransactionOverview.HealthFactorChange = TransactionOverviewHealthFactorChange
TransactionOverview.AvailableAssets = TransactionOverviewAvailableAssets
TransactionOverview.MaxLtvChange = TransactionOverviewMaxLtvChange
TransactionOverview.StakedInFarm = TransactionOverviewStakedInFarm
TransactionOverview.Generic = TransactionOverviewGenericRow

export { TransactionOverview }

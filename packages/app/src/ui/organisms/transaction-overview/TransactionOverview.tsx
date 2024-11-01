import { cn } from '@/ui/utils/style'
import { HTMLAttributes } from 'react'
import { TransactionOverviewAmountChange } from './rows/TransactionOverviewAmountChange'
import { TransactionOverviewApy } from './rows/TransactionOverviewApy'
import { TransactionOverviewApyChange } from './rows/TransactionOverviewApyChange'
import { TransactionOverviewAvailableAssets } from './rows/TransactionOverviewAvailableAssets'
import { TransactionOverviewHealthFactorChange } from './rows/TransactionOverviewHealthFactorChange'
import { TransactionOverviewMaxLtvChange } from './rows/TransactionOverviewMaxLtvChange'
import { TransactionOverviewOutcome } from './rows/TransactionOverviewOutcome'
import { TransactionOverviewRoute } from './rows/TransactionOverviewRoute'

export interface TransactionOverviewProps {
  children: React.ReactNode
}

function TransactionOverview({ children }: TransactionOverviewProps) {
  return (
    <div
      className="grid grid-cols-[auto_1fr] gap-x-6 rounded-sm bg-secondary"
      style={{ gridAutoRows: 'minmax(0, 1fr)' }}
    >
      {children}
    </div>
  )
}

function TransactionOverviewLabel({ children }: { children: React.ReactNode }) {
  return <div className="typography-label-5 text-secondary">{children}:</div>
}

function TransactionOverviewRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-full grid grid-cols-subgrid items-center border-primary border-b px-5 py-4 last:border-none">
      {children}
    </div>
  )
}

function TransactionOverviewGenericRow({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div {...rest} className={cn('typography-label-4 text-primary', className)} />
}

TransactionOverview.Label = TransactionOverviewLabel
TransactionOverview.Row = TransactionOverviewRow

TransactionOverview.Outcome = TransactionOverviewOutcome
TransactionOverview.Route = TransactionOverviewRoute
TransactionOverview.Apy = TransactionOverviewApy
TransactionOverview.ApyChange = TransactionOverviewApyChange
TransactionOverview.AmountChange = TransactionOverviewAmountChange
TransactionOverview.HealthFactorChange = TransactionOverviewHealthFactorChange
TransactionOverview.AvailableAssets = TransactionOverviewAvailableAssets
TransactionOverview.MaxLtvChange = TransactionOverviewMaxLtvChange
TransactionOverview.Generic = TransactionOverviewGenericRow

export { TransactionOverview }

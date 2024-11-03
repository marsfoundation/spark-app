import { cn } from '@/ui/utils/style'
import { HTMLAttributes } from 'react'
import { TransactionOverviewApyChange } from './rows/TransactionOverviewApyChange'
import { TransactionOverviewAvailableAssets } from './rows/TransactionOverviewAvailableAssets'
import { TransactionOverviewFarmApy } from './rows/TransactionOverviewFarmApy'
import { TransactionOverviewHealthFactorChange } from './rows/TransactionOverviewHealthFactorChange'
import { TransactionOverviewMaxLtvChange } from './rows/TransactionOverviewMaxLtvChange'
import { TransactionOverviewRoute } from './rows/TransactionOverviewRoute'
import { TransactionOverviewSavingsApy } from './rows/TransactionOverviewSavingsApy'
import { TransactionOverviewTokenAmount } from './rows/TransactionOverviewTokenAmount'
import { TransactionOverviewTokenAmountChange } from './rows/TransactionOverviewTokenAmountChange'

export interface TransactionOverviewProps {
  children: React.ReactNode
}

function TransactionOverview({ children }: TransactionOverviewProps) {
  return (
    <section className="flex flex-col gap-3">
      <h5 className="typography-body-5 text-secondary">Transaction overview</h5>
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

TransactionOverview.TokenAmount = TransactionOverviewTokenAmount
TransactionOverview.Route = TransactionOverviewRoute
TransactionOverview.FarmApy = TransactionOverviewFarmApy
TransactionOverview.SavingsApy = TransactionOverviewSavingsApy
TransactionOverview.ApyChange = TransactionOverviewApyChange
TransactionOverview.TokenAmountChange = TransactionOverviewTokenAmountChange
TransactionOverview.HealthFactorChange = TransactionOverviewHealthFactorChange
TransactionOverview.AvailableAssets = TransactionOverviewAvailableAssets
TransactionOverview.MaxLtvChange = TransactionOverviewMaxLtvChange
TransactionOverview.Generic = TransactionOverviewGenericRow

export { TransactionOverview }

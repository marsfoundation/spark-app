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

TransactionOverview.Label = TransactionOverviewLabel
TransactionOverview.Row = TransactionOverviewRow

TransactionOverview.Outcome = TransactionOverviewOutcome
TransactionOverview.Route = TransactionOverviewRoute

export { TransactionOverview }

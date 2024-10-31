import { TransactionOverviewOutcome } from './rows/TransactionOverviewOutcome'

export interface TransactionOverviewProps {
  children: React.ReactNode
}

function TransactionOverview({ children }: TransactionOverviewProps) {
  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-6 rounded-sm bg-secondary px-5 py-4">
      {children}
    </div>
  )
}

function TransactionOverviewLabel({ children }: { children: React.ReactNode }) {
  return <div className="typography-label-5 text-secondary">{children}:</div>
}

TransactionOverview.Label = TransactionOverviewLabel
TransactionOverview.Outcome = TransactionOverviewOutcome

export { TransactionOverview }

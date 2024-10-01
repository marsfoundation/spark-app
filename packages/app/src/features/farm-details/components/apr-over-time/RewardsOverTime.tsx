import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'
import { AlertTriangle } from 'lucide-react'
import { FarmHistoryQueryResult } from '../../logic/historic/useFarmHistoryQuery'
import { ChartPanel } from './components/ChartPanel'
import { RewardsChartPanel } from './components/RewardsChartPanel'

export interface RewardsOverTimeProps {
  farmHistory: FarmHistoryQueryResult
}

// @note: Should be further refactored/extracted when working on chart tabs panel
export function RewardsOverTime({ farmHistory }: RewardsOverTimeProps) {
  if (farmHistory.isPending) {
    return (
      <ChartPanel>
        <ChartPanel.Header />
        <Skeleton className="mt-6 w-full flex-grow opacity-20" />
      </ChartPanel>
    )
  }

  if (farmHistory.error) {
    return (
      <ChartPanel>
        <ChartPanel.Header />
        <div className="mt-6 flex flex-grow flex-col items-center justify-center rounded-md bg-basics-light-grey">
          <div className="flex items-center rounded-full bg-basics-grey/60 px-3 py-1 text-basics-dark-grey/80 text-sm">
            <AlertTriangle className="h-4 opacity-50" /> Failed to load chart data
          </div>
        </div>
      </ChartPanel>
    )
  }

  return <RewardsChartPanel data={farmHistory.data} />
}

import { DelayedComponent } from '@/ui/atoms/delayed-component/DelayedComponent'
import { AlertTriangle, Loader2 } from 'lucide-react'
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
        <div className="flex h-full flex-grow items-center justify-center">
          {/* @note: Delaying spinner to prevent it from flashing on chart load. For most cases loader won't be shown. */}
          <DelayedComponent delay={300}>
            <Loader2 className="h-8 animate-spin text-basics-grey" data-chromatic="ignore" />
          </DelayedComponent>
        </div>
      </ChartPanel>
    )
  }

  if (farmHistory.error) {
    return (
      <ChartPanel>
        <ChartPanel.Header />
        <div className="flex flex-grow flex-col items-center justify-center">
          <div className="flex items-center rounded-full bg-basics-grey/60 px-3 py-1 text-basics-dark-grey/80 text-sm">
            <AlertTriangle className="h-4 opacity-50" /> Failed to load chart data
          </div>
        </div>
      </ChartPanel>
    )
  }

  return <RewardsChartPanel data={farmHistory.data} />
}

import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { Percentage } from '@/domain/types/NumericValues'
import { TimeframeButtons } from '@/ui/charts/components/TimeframeButtons'
import { Timeframe } from '@/ui/charts/defaults'
import { filterDataByTimeframe } from '@/ui/charts/utils'
import { useTimestamp } from '@/utils/useTimestamp'
import { sort } from 'd3-array'
import { useState } from 'react'
import { ChartDataPoint, RewardsChart } from '../../chart/rewards/RewardsChart'
import { ChartPanel } from './ChartPanel'

export function RewardsChartPanel({ data, farmAddress }: { data: ChartDataPoint[]; farmAddress: CheckedAddress }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('All')
  const { timestamp, timestampInMs } = useTimestamp()
  const sortedData = sort(data, (a, b) => a.date.getTime() - b.date.getTime())
  const filteredData = filterDataByTimeframe({
    data: sortedData,
    timeframe: selectedTimeframe,
    currentTimestamp: timestamp,
  })
  filteredData.push({
    date: new Date(timestampInMs),
    apr: filteredData.at(-1)?.apr ?? Percentage(0),
  })

  return (
    <ChartPanel>
      <div className="flex justify-between">
        <ChartPanel.Header farmAddress={farmAddress} />
        <div className="flex items-center gap-1">
          <TimeframeButtons onTimeframeChange={setSelectedTimeframe} selectedTimeframe={selectedTimeframe} />
        </div>
      </div>
      <RewardsChart data={filteredData} height={300} />
    </ChartPanel>
  )
}

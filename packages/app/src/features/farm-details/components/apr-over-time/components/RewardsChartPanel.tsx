import { Percentage } from '@/domain/types/NumericValues'
import { TimeframeButtons } from '@/ui/charts/components/TimeframeButtons'
import { Timeframe } from '@/ui/charts/defaults'
import { useTimestamp } from '@/utils/useTimestamp'
import { sort } from 'd3-array'
import { useState } from 'react'
import { GraphDataPoint } from '../types'
import { Chart } from './Chart'
import { ChartPanel } from './ChartPanel'

export function RewardsChartPanel({ data }: { data: GraphDataPoint[] }) {
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
        <ChartPanel.Header />
        <div className="flex items-center gap-1">
          <TimeframeButtons onTimeframeChange={setSelectedTimeframe} selectedTimeframe={selectedTimeframe} />
        </div>
      </div>
      <Chart data={filteredData} height={300} />
    </ChartPanel>
  )
}

interface FilterDataByTimeframeParams {
  data: GraphDataPoint[]
  timeframe: Timeframe
  currentTimestamp: number
}
function filterDataByTimeframe({ data, timeframe, currentTimestamp }: FilterDataByTimeframeParams): GraphDataPoint[] {
  const now = new Date(currentTimestamp * 1000)

  switch (timeframe) {
    case '7D': {
      const sevenDaysAgo = new Date(now)
      sevenDaysAgo.setDate(now.getDate() - 7)
      return data.filter((d) => new Date(d.date) >= sevenDaysAgo)
    }

    case '1M': {
      const oneMonthAgo = new Date(now)
      oneMonthAgo.setMonth(now.getMonth() - 1)
      return data.filter((d) => new Date(d.date) >= oneMonthAgo)
    }

    case '1Y': {
      const oneYearAgo = new Date(now)
      oneYearAgo.setFullYear(now.getFullYear() - 1)
      return data.filter((d) => new Date(d.date) >= oneYearAgo)
    }

    case 'All':
      return data
  }
}

import { Panel } from '@/ui/atoms/panel/Panel'
import { Info } from '@/ui/molecules/info/Info'
import { useTimestamp } from '@/utils/useTimestamp'
import { sort } from 'd3-array'
import { useState } from 'react'
import { Chart } from './components/Chart'
import { AVAILABLE_TIMEFRAMES, TimeframeButtons } from './components/TimeframeButtons'
import { GraphDataPoint } from './types'

export interface AprOverTimeProps {
  data: GraphDataPoint[]
}

export function AprOverTime({ data }: AprOverTimeProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<(typeof AVAILABLE_TIMEFRAMES)[number]>('All')
  const { timestamp } = useTimestamp()
  const sortedData = sort(data, (a, b) => a.date.getTime() - b.date.getTime())
  const filteredData = filterDataByTimeframe({
    data: sortedData,
    timeframe: selectedTimeframe,
    currentTimestamp: timestamp,
  })

  return (
    <Panel.Wrapper className="flex min-h-[380px] w-full flex-1 flex-col justify-between self-stretch px-6 py-6 md:px-[32px]">
      <div className="flex justify-between">
        <div className="flex items-center gap-1">
          <h2 className="font-semibold text-lg md:text-xl">APR over time</h2>
          <Info>APR over time</Info>
        </div>
        <div className="flex items-center gap-1">
          <TimeframeButtons setSelectedTimeframe={setSelectedTimeframe} selectedTimeframe={selectedTimeframe} />
        </div>
      </div>
      <Chart data={filteredData} height={300} />
    </Panel.Wrapper>
  )
}

interface FilterDataByTimeframeParams {
  data: GraphDataPoint[]
  timeframe: (typeof AVAILABLE_TIMEFRAMES)[number]
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

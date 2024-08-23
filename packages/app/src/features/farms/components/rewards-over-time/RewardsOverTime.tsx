import { Panel } from '@/ui/atoms/panel/Panel'
import { Info } from '@/ui/molecules/info/Info'
import { useTimestamp } from '@/utils/useTimestamp'
import { useState } from 'react'
import { Chart } from './components/Chart'
import { AVAILABLE_TIMEFRAMES, TimeframeButtons } from './components/TimeframeButtons'
import { GraphDataPoint } from './types'

export interface RewardsOverTimeProps {
  data: GraphDataPoint[]
}

export function RewardsOverTime({ data }: RewardsOverTimeProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<(typeof AVAILABLE_TIMEFRAMES)[number]>('All')
  const { timestamp } = useTimestamp()
  const filteredData = filterDataByTimeframe({ data, timeframe: selectedTimeframe, currentTimestamp: timestamp })

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
    case '1D': {
      const oneDayAgo = new Date(now)
      oneDayAgo.setDate(now.getDate() - 1)
      return data.filter((d) => new Date(d.date) >= oneDayAgo)
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

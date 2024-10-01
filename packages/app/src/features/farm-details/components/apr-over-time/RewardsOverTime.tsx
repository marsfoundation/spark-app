import { Percentage } from '@/domain/types/NumericValues'
import { Panel } from '@/ui/atoms/panel/Panel'
import { useTimestamp } from '@/utils/useTimestamp'
import { sort } from 'd3-array'
import { useState } from 'react'
import { FarmHistoryQueryResult } from '../../logic/historic/useFarmHistoryQuery'
import { ApyTooltip } from '../ApyTooltip'
import { Chart } from './components/Chart'
import { AVAILABLE_TIMEFRAMES, TimeframeButtons } from './components/TimeframeButtons'
import { GraphDataPoint } from './types'

export interface RewardsOverTimeProps {
  farmHistory: FarmHistoryQueryResult
}

// @note: Will be refactored in separate PR
export function RewardsOverTime({ farmHistory }: RewardsOverTimeProps) {
  if (farmHistory.isPending) {
    return (
      <Panel.Wrapper className="flex min-h-[380px] w-full flex-1 flex-col justify-between self-stretch px-6 py-6 md:px-[32px]">
        LOADING...
      </Panel.Wrapper>
    )
  }

  if (farmHistory.error) {
    return (
      <Panel.Wrapper className="flex min-h-[380px] w-full flex-1 flex-col justify-between self-stretch px-6 py-6 md:px-[32px]">
        ERROR: {farmHistory.error.message}
      </Panel.Wrapper>
    )
  }

  return <ChartSuccess data={farmHistory.data} />
}

function ChartSuccess({ data }: { data: GraphDataPoint[] }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<(typeof AVAILABLE_TIMEFRAMES)[number]>('All')
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
    <Panel.Wrapper className="flex min-h-[380px] w-full flex-1 flex-col justify-between self-stretch px-6 py-6 md:px-[32px]">
      <div className="flex justify-between">
        <div className="flex items-center gap-1">
          <h2 className="font-semibold text-lg md:text-xl">Rewards over time</h2>
          <ApyTooltip />
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

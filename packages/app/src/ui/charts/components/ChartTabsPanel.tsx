import { Panel } from '@/ui/atoms/panel/Panel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/atoms/tabs/Tabs'
import { assert } from '@/utils/assert'
import { ReactNode, cloneElement } from 'react'
import { Timeframe } from '../defaults'
import { TimeframeButtons } from './TimeframeButtons'

interface ChartTab {
  chart: JSX.Element
  id: string
  label: ReactNode
  isLoading?: boolean
  isError?: boolean
}

interface ChartTabsPanelProps {
  selectedTimeframe: Timeframe
  onTimeframeChange: (timeframe: Timeframe) => void
  height?: number
  tabs: ChartTab[]
}

export function ChartTabsPanel({ tabs, onTimeframeChange, selectedTimeframe, height = 300 }: ChartTabsPanelProps) {
  const firstTab = tabs[0]
  assert(firstTab, 'ChartTabsPanel: at least 1 tab is required')

  if (tabs.length === 1) {
    return (
      <Panel.Wrapper className="flex min-h-[380px] w-full flex-1 flex-col justify-between self-stretch px-6 py-6 md:px-[32px]">
        <div className="flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
          <div className="flex items-center gap-1 font-semibold text-lg md:text-xl">{firstTab.label}</div>
          <TimeframeButtons onTimeframeChange={onTimeframeChange} selectedTimeframe={selectedTimeframe} />
        </div>

        {cloneElement(firstTab.chart, { height })}
      </Panel.Wrapper>
    )
  }

  return (
    <Panel.Wrapper className="flex min-h-[380px] w-full flex-1 flex-col justify-between self-stretch px-6 py-6 md:px-[32px]">
      <Tabs defaultValue={firstTab.id}>
        <div className="flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
          <TabsList className="justify-start">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="w-max grow-0 px-4"
                indicatorClassName="w-[calc(100%+1rem)]"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TimeframeButtons onTimeframeChange={onTimeframeChange} selectedTimeframe={selectedTimeframe} />
        </div>
        {tabs.map(({ id, chart }) => (
          <TabsContent key={id} value={id}>
            {cloneElement(chart, { height })}
          </TabsContent>
        ))}
      </Tabs>
    </Panel.Wrapper>
  )
}

import { DelayedComponent } from '@/ui/atoms/delayed-component/DelayedComponent'
import { Panel } from '@/ui/atoms/panel/Panel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/atoms/tabs/Tabs'
import { assert } from '@/utils/assert'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { Timeframe } from '../defaults'
import { TimeframeButtons } from './TimeframeButtons'

type ChartTabDefinition<C> = C extends React.ComponentType<infer P>
  ? P extends { height?: number }
    ? {
        component: C
        props: P
        id: string
        label: string
        isLoading?: boolean
        isError?: boolean
      }
    : never
  : never

declare const __CHART_TAB_OPAQUE_TYPE__: unique symbol

interface ChartTab {
  component: React.ComponentType<{ height: number }>
  props: { height: number }
  id: string
  label: string
  readonly [__CHART_TAB_OPAQUE_TYPE__]: true
  isLoading?: boolean
  isError?: boolean
}

export function createChartTab<C>({ component, props, id, label }: ChartTabDefinition<C>): ChartTab {
  return {
    component,
    props,
    id,
    label,
  } as unknown as ChartTab
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

        <div className="flex w-full flex-grow flex-col items-center justify-center">
          <ChartPanel {...firstTab} height={height} />
        </div>
      </Panel.Wrapper>
    )
  }

  return (
    <Panel.Wrapper className="flex min-h-[380px] w-full flex-1 flex-col justify-between self-stretch px-6 py-6 md:px-[32px]">
      <Tabs defaultValue={firstTab.id} className="flex flex-1 flex-col">
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
        {tabs.map((chartTab) => (
          <TabsContent
            key={chartTab.id}
            value={chartTab.id}
            className="w-full flex-1 data-[state=active]:flex data-[state=active]:items-center data-[state=active]:justify-center"
          >
            <ChartPanel {...chartTab} height={height} />
          </TabsContent>
        ))}
      </Tabs>
    </Panel.Wrapper>
  )
}

interface ChartPanelProps extends ChartTab {
  height: number
}

function ChartPanel({ height, component: Chart, isError, isLoading, props }: ChartPanelProps) {
  if (isLoading) {
    return (
      // @note: Delaying spinner to prevent it from flashing on chart load. For most cases loader won't be shown.
      <DelayedComponent delay={300}>
        <Loader2 className="h-8 animate-spin text-basics-grey" data-chromatic="ignore" />
      </DelayedComponent>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center rounded-full bg-basics-grey/60 px-3 py-1 text-basics-dark-grey/80 text-sm">
        <AlertTriangle className="h-4" /> Failed to load chart data
      </div>
    )
  }

  return <Chart {...props} height={height} />
}

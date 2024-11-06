import { DelayedComponent } from '@/ui/atoms/delayed-component/DelayedComponent'
import { Panel } from '@/ui/atoms/new/panel/Panel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/atoms/tabs/Tabs'
import { useParentSize } from '@/ui/utils/useParentSize'
import { assert } from '@/utils/assert'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { Timeframe } from '../defaults'
import { TimeframeButtons } from './TimeframeButtons'

export interface ChartTabComponentProps {
  height: number
  width: number
}

type ChartTabDefinition<C> = C extends React.ComponentType<infer P>
  ? P extends ChartTabComponentProps
    ? {
        component: C
        props: Omit<P, keyof ChartTabComponentProps>
        id: string
        label: string
        isPending: boolean
        isError: boolean
      }
    : never
  : never

declare const __CHART_TAB_OPAQUE_TYPE__: unique symbol

export interface ChartTab {
  component: React.ComponentType<ChartTabComponentProps>
  props: ChartTabComponentProps
  id: string
  label: string
  readonly [__CHART_TAB_OPAQUE_TYPE__]: true
  isPending: boolean
  isError: boolean
}

export function createChartTab<C>(chart: ChartTabDefinition<C>): ChartTab {
  return chart as unknown as ChartTab
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
      <Panel className="flex min-h-[380px] w-full flex-1 flex-col justify-between self-stretch px-6 py-6">
        <div className="grid grid-cols-1 grid-rows-2 items-center gap-4 lg:grid-cols-2 lg:grid-rows-1">
          <div className="flex items-center gap-1 font-semibold text-lg md:text-xl">{firstTab.label}</div>
          <TimeframeButtons onTimeframeChange={onTimeframeChange} selectedTimeframe={selectedTimeframe} />
        </div>

        <div className="flex w-full flex-grow flex-col items-center justify-center">
          <ChartPanel {...firstTab} height={height} />
        </div>
      </Panel>
    )
  }

  return (
    <Panel className="flex min-h-[380px] w-full flex-1 flex-col justify-between self-stretch px-6 py-6">
      <Tabs defaultValue={firstTab.id} className="flex flex-1 flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2 lg:flex-nowrap">
          <TabsList className="justify-start">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="w-max grow-0 px-3 text-sm"
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
    </Panel>
  )
}

interface ChartPanelProps extends ChartTab {
  height: number
}

function ChartPanel({ height, component: Chart, isError, isPending, props }: ChartPanelProps) {
  const [ref, { width }] = useParentSize()

  if (isPending) {
    return (
      <div className="flex items-center justify-center" style={{ height }} ref={ref}>
        <DelayedComponent>
          <Loader2 className="h-8 animate-spin text-basics-grey" data-chromatic="ignore" />
        </DelayedComponent>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center" style={{ height }} ref={ref}>
        <div className="flex items-center rounded-full bg-basics-grey/60 px-3 py-1 text-basics-dark-grey/80 text-sm">
          <AlertTriangle className="h-4" /> Failed to load chart data
        </div>
      </div>
    )
  }

  return (
    <div ref={ref} className="w-full flex-1">
      <Chart {...props} height={height} width={width} />
    </div>
  )
}

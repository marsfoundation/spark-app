import { Panel } from '@/ui/atoms/panel/Panel'
import { ReactNode } from 'react'
import { ApyTooltip } from '../../ApyTooltip'

export function ChartPanel({ children: [header, chart] }: { children: ReactNode[] }) {
  return (
    <Panel.Wrapper className="flex min-h-[380px] w-full flex-col px-6 py-6 md:px-[32px]">
      {header}
      {chart}
    </Panel.Wrapper>
  )
}

function ChartPanelHeader() {
  return (
    <div className="flex h-8 items-center gap-1">
      <h2 className="font-semibold text-lg md:text-xl">Rewards over time</h2>
      <ApyTooltip />
    </div>
  )
}

ChartPanel.Header = ChartPanelHeader

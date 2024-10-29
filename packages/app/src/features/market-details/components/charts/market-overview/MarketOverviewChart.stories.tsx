import { WithClassname } from '@storybook-config/decorators'
import { tokens } from '@storybook-config/tokens'
import { getMobileStory, getTabletStory } from '@storybook-config/viewports'
import { Meta, StoryObj } from '@storybook/react'

import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'

import { MarketOverviewChart } from './MarketOverviewChart'
import { Legend } from './components/Legend'

const meta: Meta<typeof MarketOverviewChart> = {
  title: 'Features/MarketDetails/Components/Charts/MarketOverview',
  decorators: [WithClassname('max-w-xs')],
  component: MarketOverviewChart,
}

export default meta
type Story = StoryObj<typeof MarketOverviewChart>

export const Default: Story = {
  name: 'Default',
  args: {
    data: [
      { value: 800_000_000, color: '#3F66EF' },
      { value: 200_000_000, color: '#33BE27' },
    ],
    children: (
      <Legend
        token={tokens.USDC}
        utilized={NormalizedUnitNumber(800_000_000)}
        total={NormalizedUnitNumber(1_000_000_000)}
        utilizationRate={Percentage(0.66)}
      />
    ),
  },
}

export const Mobile = getMobileStory(Default)
export const Tablet = getTabletStory(Default)

export const ZeroUtilization: Story = {
  name: 'Zero Utilization',
  args: {
    data: [
      { value: 0, color: '#3F66EF' },
      { value: 1_000_000_000, color: '#33BE27' },
    ],
    children: (
      <Legend
        token={tokens.USDC}
        utilized={NormalizedUnitNumber(0)}
        total={NormalizedUnitNumber(1_000_000_000)}
        utilizationRate={Percentage(0)}
      />
    ),
  },
}
export const ZeroUtilizationMobile = getMobileStory(ZeroUtilization)
export const ZeroUtilizationTablet = getTabletStory(ZeroUtilization)

export const FullUtilization: Story = {
  name: 'Full Utilization',
  args: {
    data: [
      { value: 1_000_000_000, color: '#3F66EF' },
      { value: 0, color: '#33BE27' },
    ],
    children: (
      <Legend
        token={tokens.USDC}
        utilized={NormalizedUnitNumber(1_000_000_000)}
        total={NormalizedUnitNumber(1_000_000_000)}
        utilizationRate={Percentage(1)}
      />
    ),
  },
}
export const FullUtilizationMobile = getMobileStory(FullUtilization)
export const FullUtilizationTablet = getTabletStory(FullUtilization)

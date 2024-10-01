import { MyEarningsChart } from '@/features/savings/components/savings-chart/components/MyEarningsChart'
import { DsrChart } from '@/features/savings/components/savings-chart/components/savings-rate-chart/DsrChart'
import { SsrChart } from '@/features/savings/components/savings-chart/components/savings-rate-chart/SsrChart'
import {
  mockEarningsChartData,
  mockEarningsPredictionsChartData,
} from '@/features/savings/components/savings-chart/fixtures/mockEarningsChartData'
import {
  mockDsrChartData,
  mockSsrChartData,
} from '@/features/savings/components/savings-chart/fixtures/mockSavingsRateChartData'
import { WithClassname } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { ChartTabsPanel } from './ChartTabsPanel'

const meta: Meta<typeof ChartTabsPanel> = {
  title: 'Components/Charts/ChartTabsPanel',
  component: ChartTabsPanel,
  decorators: [WithClassname('max-w-lg')],
  args: {
    height: 300,
    selectedTimeframe: 'All',
    tabs: [
      {
        id: 'earningns',
        label: 'My Earnings',
        chart: <MyEarningsChart data={mockEarningsChartData} predictions={mockEarningsPredictionsChartData} />,
      },
      {
        id: 'ssr',
        label: 'SSR',
        chart: <SsrChart data={mockSsrChartData} />,
      },
      {
        id: 'dsr',
        label: 'DSR',
        chart: <DsrChart data={mockDsrChartData} />,
      },
    ],
  },
}

export default meta
type Story = StoryObj<typeof ChartTabsPanel>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
export const Tablet: Story = getTabletStory(Desktop)

export const SingleTabDesktop: Story = {
  args: {
    tabs: [
      {
        id: 'earningns',
        label: 'My Earnings',
        chart: <MyEarningsChart data={mockEarningsChartData} predictions={mockEarningsPredictionsChartData} />,
      },
    ],
  },
}
export const SingleTabMobile: Story = getMobileStory(SingleTabDesktop)
export const SingleTabTablet: Story = getTabletStory(SingleTabDesktop)

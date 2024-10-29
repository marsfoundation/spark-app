import { WithClassname } from '@storybook-config/decorators'
import { getMobileStory, getTabletStory } from '@storybook-config/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { mockChartsPanelMultipleTabs, mockChartsPanelSingleTab } from '../fixtures/mockChartsPanelTabs'
import { ChartTabsPanel } from './ChartTabsPanel'

const meta: Meta<typeof ChartTabsPanel> = {
  title: 'Components/Charts/ChartTabsPanel',
  component: ChartTabsPanel,
  decorators: [WithClassname('max-w-lg')],
  args: {
    height: 300,
    selectedTimeframe: 'All',
    tabs: mockChartsPanelMultipleTabs,
  },
}

export default meta
type Story = StoryObj<typeof ChartTabsPanel>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
export const Tablet: Story = getTabletStory(Desktop)

export const SingleTabDesktop: Story = {
  args: {
    tabs: mockChartsPanelSingleTab,
  },
}
export const SingleTabMobile: Story = getMobileStory(SingleTabDesktop)
export const SingleTabTablet: Story = getTabletStory(SingleTabDesktop)

export const LoadingTabsDesktop: Story = {
  args: {
    tabs: mockChartsPanelMultipleTabs.map((tab) => ({ ...tab, isPending: true })),
  },
}

export const LoadingTabDesktop: Story = {
  args: {
    tabs: mockChartsPanelSingleTab.map((tab) => ({ ...tab, isPending: true })),
  },
}
export const LoadingTabMobile: Story = getMobileStory(LoadingTabDesktop)
export const LoadingTabTablet: Story = getTabletStory(LoadingTabDesktop)

export const ErrorTabsDesktop: Story = {
  args: {
    tabs: mockChartsPanelMultipleTabs.map((tab) => ({ ...tab, isError: true })),
  },
}
export const ErrorTabDesktop: Story = {
  args: {
    tabs: mockChartsPanelSingleTab.map((tab) => ({ ...tab, isError: true })),
  },
}
export const ErrorTabMobile: Story = getMobileStory(ErrorTabDesktop)
export const ErrorTabTablet: Story = getTabletStory(ErrorTabDesktop)

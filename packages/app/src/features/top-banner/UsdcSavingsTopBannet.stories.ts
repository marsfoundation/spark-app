import { WithClassname, ZeroAllowanceWagmiDecorator } from '@sb/decorators'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { withRouter } from 'storybook-addon-remix-react-router'

import { UsdcSavingsTopBanner } from './UsdcSavingsTopBanner'

const meta: Meta<typeof UsdcSavingsTopBanner> = {
  title: 'Features/TopBanner/UsdcSavingsTopBanner',
  component: UsdcSavingsTopBanner,
  decorators: [WithClassname('w-full'), withRouter, ZeroAllowanceWagmiDecorator()],
}

export default meta
type Story = StoryObj<typeof UsdcSavingsTopBanner>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
export const Tablet: Story = getTabletStory(Desktop)

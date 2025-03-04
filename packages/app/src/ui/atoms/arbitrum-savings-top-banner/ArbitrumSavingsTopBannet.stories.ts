import { WithClassname, ZeroAllowanceWagmiDecorator } from '@sb/decorators'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { withRouter } from 'storybook-addon-remix-react-router'

import { ArbitrumSavingsTopBanner } from './ArbitrumSavingsTopBanner'

const meta: Meta<typeof ArbitrumSavingsTopBanner> = {
  title: 'Components/Atoms/SavingsAccountsTopBanner',
  component: ArbitrumSavingsTopBanner,
  decorators: [WithClassname('w-full'), withRouter, ZeroAllowanceWagmiDecorator()],
}

export default meta
type Story = StoryObj<typeof ArbitrumSavingsTopBanner>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
export const Tablet: Story = getTabletStory(Desktop)

import { WithClassname, ZeroAllowanceWagmiDecorator } from '@sb/decorators'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { withRouter } from 'storybook-addon-remix-react-router'

import { SavingsAccountsTopBanner } from './SavingsAccountsTopBanner'

const meta: Meta<typeof SavingsAccountsTopBanner> = {
  title: 'Components/Atoms/SavingsAccountsTopBanner',
  component: SavingsAccountsTopBanner,
  decorators: [WithClassname('w-full'), withRouter, ZeroAllowanceWagmiDecorator()],
}

export default meta
type Story = StoryObj<typeof SavingsAccountsTopBanner>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
export const Tablet: Story = getTabletStory(Desktop)

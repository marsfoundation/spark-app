import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { mainnet } from 'viem/chains'

import { Percentage } from '@/domain/types/NumericValues'

import { SavingsOpportunityGuestMode } from './SavingsOpportunityGuestMode'

const meta: Meta<typeof SavingsOpportunityGuestMode> = {
  title: 'Features/Savings/Components/SavingsOpportunityGuestMode',
  component: SavingsOpportunityGuestMode,
  decorators: [WithTooltipProvider(), WithClassname('max-w-5xl')],
  args: {
    APY: Percentage(0.05),
    chainId: mainnet.id,
    openConnectModal: () => {},
  },
}

export default meta
type Story = StoryObj<typeof SavingsOpportunityGuestMode>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

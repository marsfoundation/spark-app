import { WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { mainnet } from 'viem/chains'

import { Percentage } from '@/domain/types/NumericValues'

import { GuestView } from './GuestView'

const meta: Meta<typeof GuestView> = {
  title: 'Features/Savings/Views/GuestView',
  component: GuestView,
  decorators: [WithTooltipProvider()],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    APY: Percentage(0.05),
    chainId: mainnet.id,
    openConnectModal: () => {},
  },
}

export default meta
type Story = StoryObj<typeof GuestView>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

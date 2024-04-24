import { WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { UnsupportedChainView } from './UnsupportedChainView'

const meta: Meta<typeof UnsupportedChainView> = {
  title: 'Features/Savings/Views/UnsupportedChainView',
  component: UnsupportedChainView,
  decorators: [WithTooltipProvider()],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    openChainModal: () => {},
    openConnectModal: () => {},
    guestMode: false,
  },
}

export default meta
type Story = StoryObj<typeof UnsupportedChainView>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const Disconnected: Story = {
  args: {
    guestMode: true,
  },
}
export const DisconnectedMobile = getMobileStory(Disconnected)
export const DisconnectedTablet = getTabletStory(Disconnected)

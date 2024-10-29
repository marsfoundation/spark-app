import { WithTooltipProvider } from '@sb/decorators'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'

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
    openSandboxModal: () => {},
    isGuestMode: false,
  },
}

export default meta
type Story = StoryObj<typeof UnsupportedChainView>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const Disconnected: Story = {
  args: {
    isGuestMode: true,
  },
}
export const DisconnectedMobile = getMobileStory(Disconnected)
export const DisconnectedTablet = getTabletStory(Disconnected)

import { WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { gnosis } from 'viem/chains'
import { UnsupportedChainView } from './UnsupportedChainView'

const meta: Meta<typeof UnsupportedChainView> = {
  title: 'Features/Farms/Views/UnsupportedChainView',
  component: UnsupportedChainView,
  decorators: [WithTooltipProvider()],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    chainId: gnosis.id,
    switchChain: () => {},
    openSandboxModal: () => {},
  },
}

export default meta
type Story = StoryObj<typeof UnsupportedChainView>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

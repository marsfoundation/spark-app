import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { gnosis, mainnet } from 'viem/chains'

import { NetworkSelector } from './NetworkSelector'

const meta: Meta = {
  title: 'Features/Navbar/Components/NetworkSelector',
  component: NetworkSelector,
  args: {
    currentChain: {
      id: mainnet.id,
      name: 'Ethereum Mainnet',
    },
    supportedChains: [
      {
        id: mainnet.id,
        name: 'Ethereum Mainnet',
      },
      {
        id: gnosis.id,
        name: 'Gnosis Chain',
      },
    ],
    onNetworkChange: () => {},
  },
  play: async ({ canvasElement }) => {
    const button = await within(canvasElement).findByRole('button')
    await userEvent.click(button)
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
export const Tablet: Story = getTabletStory(Desktop)

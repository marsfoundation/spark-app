import { Meta, StoryObj } from '@storybook/react'
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
}

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
export const Tablet: Story = getTabletStory(Desktop)

import { Meta, StoryObj } from '@storybook/react'
import { mainnet } from 'viem/chains'
import { TopbarNetwork } from './TopbarNetwork'

const meta: Meta = {
  title: 'Components/Molecules/New/TopbarNetwork',
  component: TopbarNetwork,
  args: {
    currentChain: {
      id: mainnet.id,
      name: 'Ethereum Mainnet',
    },
    onSelectNetwork: () => {},
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

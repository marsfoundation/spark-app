import { StoryGrid } from '@sb/components/StoryGrid'
import { Meta, StoryObj } from '@storybook/react'
import { arbitrum, base, gnosis, mainnet } from 'viem/chains'
import { NetworkBadge } from './NetworkBadge'

const meta: Meta<typeof NetworkBadge> = {
  title: 'Components/Atoms/NetworkBadge',
  component: () => (
    <StoryGrid className="grid-cols-1 justify-items-start bg-neutral-100">
      <NetworkBadge chainId={mainnet.id} />
      <NetworkBadge chainId={base.id} />
      <NetworkBadge chainId={arbitrum.id} />
      <NetworkBadge chainId={gnosis.id} />
    </StoryGrid>
  ),
}

export default meta
type Story = StoryObj<typeof NetworkBadge>

export const Default: Story = {}

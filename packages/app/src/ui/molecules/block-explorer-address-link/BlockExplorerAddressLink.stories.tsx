import { ZeroAllowanceWagmiDecorator } from '@storybook-config/decorators'
import { Meta, StoryObj } from '@storybook/react'

import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { BlockExplorerAddressLink } from './BlockExplorerAddressLink'

const meta: Meta<typeof BlockExplorerAddressLink> = {
  title: 'Components/Molecules/BlockExplorerAddressLink',
  component: BlockExplorerAddressLink,
  args: {
    address: CheckedAddress('0xBa2C8F2eA5B56690bFb8b709438F049e5Dd76B96'),
  },
  decorators: [ZeroAllowanceWagmiDecorator()],
}

export default meta
type Story = StoryObj<typeof BlockExplorerAddressLink>

export const Default: Story = {
  name: 'Default',
  args: {},
}

export const InvalidChainId: Story = {
  args: {
    chainId: -1,
  },
}

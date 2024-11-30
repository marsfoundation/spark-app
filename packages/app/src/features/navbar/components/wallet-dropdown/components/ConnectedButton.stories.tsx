import type { Meta, StoryObj } from '@storybook/react'

import { CheckedAddress } from '@marsfoundation/common-universal'
import { EnsName } from '@/domain/types/EnsName'

import { assets } from '@/ui/assets'
import { ConnectedButton } from './ConnectedButton'

const meta: Meta<typeof ConnectedButton> = {
  title: 'Features/Navbar/Components/WalletDropdown/ConnectedButton',
  component: ConnectedButton,
  args: {
    mode: 'connected',
    avatar: assets.walletIcons.default,
    open: true,
    address: CheckedAddress('0x1234567890123456789012345678901234567890'),
  },
}

export default meta
type Story = StoryObj<typeof ConnectedButton>

export const Connected: Story = {}

export const ConnectedEnsName: Story = {
  args: {
    ensName: EnsName('maker.ens'),
  },
}

export const ConnectedEnsLongName: Story = {
  args: {
    ensName: EnsName('makerdaowagmi.ens'),
  },
}

export const Sandbox: Story = {
  args: {
    mode: 'sandbox',
  },
}

import { EnsName } from '@/domain/types/EnsName'
import { assets } from '@/ui/assets'
import { CheckedAddress } from '@marsfoundation/common-universal'
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import { WalletDropdown, WalletDropdownProps } from './WalletDropdown'

const meta: Meta<typeof WalletDropdown> = {
  title: 'Features/Navbar/Components/WalletDropdown',
  component: WalletDropdown,
  play: async ({ canvasElement }) => {
    const button = await within(canvasElement).findByRole('button')
    await userEvent.click(button)
  },
}

export default meta
type Story = StoryObj<typeof WalletDropdown>

const args = {
  connectedWalletInfo: {
    dropdownTriggerInfo: {
      mode: 'connected',
      avatar: assets.walletIcons.default,
      address: CheckedAddress('0x1234567890123456789012345678901234567890'),
    },
    dropdownContentInfo: {
      walletIcon: assets.walletIcons.metamask,
      address: CheckedAddress('0x1234567890123456789012345678901234567890'),
      onDisconnect: () => {},
      blockExplorerAddressLink: '/',
    },
  },
  onConnect: () => {},
} satisfies WalletDropdownProps

export const Connected: Story = {
  args,
}

export const ConnectedEnsName: Story = {
  args: {
    ...args,
    connectedWalletInfo: {
      ...args.connectedWalletInfo,
      dropdownTriggerInfo: {
        ...args.connectedWalletInfo.dropdownTriggerInfo,
        ensName: EnsName('maker.ens'),
      },
    },
  },
}

export const ConnectedEnsLongName: Story = {
  args: {
    ...args,
    connectedWalletInfo: {
      ...args.connectedWalletInfo,
      dropdownTriggerInfo: {
        ...args.connectedWalletInfo.dropdownTriggerInfo,
        ensName: EnsName('makerdaowagmi.ens'),
      },
    },
  },
}

export const Disconnected: Story = {
  args: {
    onConnect: () => {},
  },
}

export const Sandbox: Story = {
  args: {
    ...args,
    connectedWalletInfo: {
      dropdownContentInfo: {
        ...args.connectedWalletInfo.dropdownContentInfo,
      },
      dropdownTriggerInfo: {
        ...args.connectedWalletInfo.dropdownTriggerInfo,
        mode: 'sandbox',
      },
    },
  },
}

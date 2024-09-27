import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/test'

import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { EnsName } from '@/domain/types/EnsName'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { assets } from '@/ui/assets'

import { DEFAULT_WALLET_AVATAR } from '../../logic/generateWalletAvatar'
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
      avatar: DEFAULT_WALLET_AVATAR,
      address: CheckedAddress('0x1234567890123456789012345678901234567890'),
    },
    dropdownContentInfo: {
      walletIcon: assets.walletIcons.metamask,
      address: CheckedAddress('0x1234567890123456789012345678901234567890'),
      onDisconnect: () => {},
      balanceInfo: {
        isLoading: false,
        totalBalanceUSD: NormalizedUnitNumber(123_002),
      },
      isEphemeralAccount: false,
      isInSandbox: false,
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
        isInSandbox: true,
        isEphemeralAccount: true,
      },
      dropdownTriggerInfo: {
        ...args.connectedWalletInfo.dropdownTriggerInfo,
        mode: 'sandbox',
      },
    },
  },
}

export const ReadOnly: Story = {
  args: {
    ...args,
    connectedWalletInfo: {
      ...args.connectedWalletInfo,
      dropdownTriggerInfo: {
        ...args.connectedWalletInfo.dropdownTriggerInfo,
        mode: 'read-only',
      },
    },
  },
}

import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { EnsName } from '@/domain/types/EnsName'
import { assets } from '@/ui/assets'
import { WithTooltipProvider } from '@sb/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import { TopbarWallet, TopbarWalletProps } from './TopbarWallet'

const meta: Meta<typeof TopbarWallet> = {
  title: 'Components/Molecules/New/TopbarWallet',
  component: TopbarWallet,
  decorators: [WithTooltipProvider()],
  play: async ({ canvasElement }) => {
    const button = await within(canvasElement).findByRole('button')

    await userEvent.click(button)
  },
}

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
} satisfies TopbarWalletProps

export default meta
type Story = StoryObj<typeof TopbarWallet>

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
        ensName: EnsName('sky.ens'),
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
        ensName: EnsName('phoenixlabs.ens'),
      },
    },
  },
}

export const Disconnected: Story = {
  args: {
    onConnect: () => {},
  },
  play: () => {},
}

export const Sandbox: Story = {
  args: {
    ...args,
    connectedWalletInfo: {
      dropdownContentInfo: {
        ...args.connectedWalletInfo.dropdownContentInfo,
        walletIcon: assets.walletIcons.default,
      },
      dropdownTriggerInfo: {
        ...args.connectedWalletInfo.dropdownTriggerInfo,
        mode: 'sandbox',
      },
    },
  },
  play: () => {},
}

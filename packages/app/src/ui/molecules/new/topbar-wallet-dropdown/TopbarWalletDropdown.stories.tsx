import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { DEFAULT_WALLET_AVATAR } from '@/features/navbar/logic/generateWalletAvatar'
import { assets } from '@/ui/assets'
import { WithClassname, WithTooltipProvider } from '@sb/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { TopbarWalletDropdown } from './TopbarWalletDropdown'

const meta: Meta<typeof TopbarWalletDropdown> = {
  title: 'Components/Molecules/New/TopbarWalletDropdown',
  component: TopbarWalletDropdown,
  // @note to make dropdown display in correct position
  decorators: [WithClassname('flex justify-end'), WithTooltipProvider()],
  args: {
    dropdownTriggerInfo: {
      mode: 'connected',
      avatar: DEFAULT_WALLET_AVATAR,
      address: CheckedAddress('0x1234567890123456789012345678901234567890'),
    },
    dropdownContentInfo: {
      walletIcon: assets.walletIcons.metamask,
      address: CheckedAddress('0x1234567890123456789012345678901234567890'),
      onDisconnect: () => {},
      isEphemeralAccount: false,
      isInSandbox: false,
      blockExplorerAddressLink: '/',
    },
  },
}

export default meta
type Story = StoryObj<typeof TopbarWalletDropdown>

export const Default: Story = {}

import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/test'

import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { assets } from '@/ui/assets'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/ui/atoms/dropdown/DropdownMenu'

import { WalletDropdownContent } from './WalletDropdownContent'

const meta: Meta<typeof WalletDropdownContent> = {
  title: 'Features/Navbar/Components/WalletDropdown/WalletDropdownContent',
  component: WalletDropdownContent,
}

export default meta
type Story = StoryObj<typeof WalletDropdownContent>

const args = {
  walletIcon: assets.token.eth,
  address: CheckedAddress('0x1234567890abcdef1234567890abcdef12345678'),
  onSwitch: () => {},
  onDisconnect: () => {},
  balanceInfo: {
    isLoading: false,
    totalBalanceUSD: NormalizedUnitNumber(123_002),
  },
  isEphemeralAccount: false,
  isInSandbox: false,
  blockExplorerAddressLink: '/',
} as const

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger>Open</DropdownMenuTrigger>
      <DropdownMenuContent>
        <WalletDropdownContent {...args} />
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvasElement }) => {
    const button = await within(canvasElement).findByRole('button')
    await userEvent.click(button)
  },
}

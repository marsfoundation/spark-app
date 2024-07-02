import { WithClassname } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { SuccessView } from './SuccessView'

const meta: Meta<typeof SuccessView> = {
  title: 'Features/Dialogs/Views/Savings/Withdraw/Success',
  component: SuccessView,
  decorators: [WithClassname('max-w-xl')],
  args: {
    tokenToWithdraw: {
      token: tokens.DAI,
      value: NormalizedUnitNumber(2000),
    },
    closeDialog: () => {},
  },
}

export default meta
type Story = StoryObj<typeof SuccessView>

export const Default: Story = {}

export const MobileWithdraw = getMobileStory(Default)
export const TabletWithdraw = getTabletStory(Default)

export const SendMode: Story = {
  args: {
    sendModeOptions: {
      isSendMode: true,
      receiverAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      blockExplorerAddressLink: 'https://etherscan.io/address/0x1234567890123456789012345678901234567890',
    },
  },
}
export const SendModeMobile = getMobileStory(SendMode)
export const SendModeTablet = getTabletStory(SendMode)

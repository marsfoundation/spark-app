import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { WithClassname, ZeroAllowanceWagmiDecorator } from '@storybook-config/decorators'
import { tokens } from '@storybook-config/tokens'
import { getMobileStory, getTabletStory } from '@storybook-config/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { SuccessView } from './SuccessView'

const meta: Meta<typeof SuccessView> = {
  title: 'Features/Dialogs/Views/Savings/Withdraw/Success',
  component: SuccessView,
  decorators: [WithClassname('max-w-xl'), ZeroAllowanceWagmiDecorator()],
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
    sendModeExtension: {
      receiver: CheckedAddress('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'),
    },
  },
}
export const SendModeMobile = getMobileStory(SendMode)
export const SendModeTablet = getTabletStory(SendMode)

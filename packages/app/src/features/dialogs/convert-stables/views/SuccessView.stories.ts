import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { WithClassname, ZeroAllowanceWagmiDecorator } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { TxOverview } from '../logic/createTxOverview'
import { SuccessView } from './SuccessView'

const meta: Meta<typeof SuccessView> = {
  title: 'Features/Dialogs/Views/ConvertStables/SuccessView',
  component: SuccessView,
  decorators: [WithClassname('max-w-xl'), ZeroAllowanceWagmiDecorator()],
  args: {
    txOverview: {
      status: 'success',
      inToken: tokens.DAI,
      outcome: { token: tokens.USDC, value: NormalizedUnitNumber(2000) },
    } as TxOverview,
    onProceed: () => {},
    proceedText: 'Back to Savings',
  },
}

export default meta
type Story = StoryObj<typeof SuccessView>

export const Desktop: Story = {}
export const MobileWithdraw = getMobileStory(Desktop)
export const TabletWithdraw = getTabletStory(Desktop)

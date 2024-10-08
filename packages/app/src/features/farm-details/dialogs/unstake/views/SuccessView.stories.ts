import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import { WithClassname, ZeroAllowanceWagmiDecorator } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { SuccessView } from './SuccessView'

const meta: Meta<typeof SuccessView> = {
  title: 'Features/FarmDetails/Dialogs/Views/Unstake/SuccessView',
  component: SuccessView,
  decorators: [WithClassname('max-w-xl'), ZeroAllowanceWagmiDecorator()],
  args: {
    outcome: {
      token: tokens.DAI,
      value: NormalizedUnitNumber(2000),
    },
    reward: {
      token: tokens.SKY,
      tokenPrice: tokens.SKY.unitPriceUsd,
      amount: NormalizedUnitNumber(500),
    },
    isExiting: false,
    closeDialog: () => {},
  },
}

export default meta
type Story = StoryObj<typeof SuccessView>

export const Desktop: Story = {}
export const MobileWithdraw = getMobileStory(Desktop)
export const TabletWithdraw = getTabletStory(Desktop)

export const Exit: Story = { args: { isExiting: true } }
export const ExitMobile = getMobileStory(Exit)
export const ExitTablet = getTabletStory(Exit)

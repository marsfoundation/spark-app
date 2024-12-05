import { NormalizedUnitNumber } from '@marsfoundation/common-universal'
import { WithClassname, ZeroAllowanceWagmiDecorator } from '@sb/decorators'
import { tokens } from '@sb/tokens'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'
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
      value: NormalizedUnitNumber(500),
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

export const ExitNoApiData: Story = {
  args: {
    isExiting: true,
    reward: {
      token: tokens.SKY.clone({ unitPriceUsd: NormalizedUnitNumber(0) }),
      value: NormalizedUnitNumber(500),
    },
  },
}
export const ExitNoApiDataMobile = getMobileStory(ExitNoApiData)
export const ExitNoApiDataTablet = getTabletStory(ExitNoApiData)

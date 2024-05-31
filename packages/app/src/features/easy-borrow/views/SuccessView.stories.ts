import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { withRouter } from 'storybook-addon-remix-react-router'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

import { SuccessView } from './SuccessView'

const meta: Meta<typeof SuccessView> = {
  title: 'Features/EasyBorrow/Views/SuccessView',
  component: SuccessView,
  decorators: [withRouter],
  args: {
    deposited: [
      {
        token: tokens.ETH,
        value: NormalizedUnitNumber(13.74),
      },
      {
        token: tokens.stETH,
        value: NormalizedUnitNumber(34.21),
      },
    ],
    borrowed: [
      {
        token: tokens.DAI,
        value: NormalizedUnitNumber(50000),
      },
    ],
    runConfetti: false,
  },
}

export default meta
type Story = StoryObj<typeof SuccessView>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const OnlyBorrowed: Story = {
  args: {
    deposited: [],
  },
}
export const OnlyBorrowedMobile = getMobileStory(OnlyBorrowed)
export const OnlyBorrowedTablet = getTabletStory(OnlyBorrowed)

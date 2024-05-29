import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { chromatic } from '@storybook/viewports'
import { withRouter } from 'storybook-addon-react-router-v6'

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
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    chromatic: { viewports: [chromatic.mobile] },
  },
}

export const OnlyBorrowed: Story = {
  args: {
    deposited: [],
  },
}

export const OnlyBorrowedMobile: Story = {
  args: {
    deposited: [],
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
    chromatic: { viewports: [chromatic.mobile] },
  },
}

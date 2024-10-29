import { WithTooltipProvider } from '@sb/decorators'
import { tokens } from '@sb/tokens'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { zeroAddress } from 'viem'

import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

import { ActionsView } from './ActionsView'

const meta: Meta<typeof ActionsView> = {
  title: 'Features/Actions/ActionsView',
  component: ActionsView,
  decorators: [WithTooltipProvider()],
  args: {
    variant: 'default',
    actionHandlers: [
      {
        action: {
          type: 'approve',
          token: tokens.WETH,
          spender: CheckedAddress(zeroAddress),
          value: NormalizedUnitNumber(1),
        },
        state: { status: 'success' },
        onAction: () => {},
      },
      {
        action: {
          type: 'deposit',
          token: tokens.ETH,
          value: NormalizedUnitNumber(1),
        },
        state: { status: 'loading' },
        onAction: () => {},
      },
      {
        action: {
          type: 'approve',
          token: tokens.wstETH,
          spender: CheckedAddress(zeroAddress),
          value: NormalizedUnitNumber(1),
        },
        state: { status: 'error', message: 'Insufficient balance' },
        onAction: () => {},
      },
      {
        action: {
          type: 'deposit',
          token: tokens.wstETH,
          value: NormalizedUnitNumber(1),
        },
        state: { status: 'ready' },
        onAction: () => {},
      },
      {
        action: {
          type: 'borrow',
          token: tokens.DAI,
          value: NormalizedUnitNumber(1),
        },
        state: { status: 'ready' },
        onAction: () => {},
      },
    ],
  },
}

export default meta
type Story = StoryObj<typeof ActionsView>

export const Extended: Story = {}
export const Compact: Story = {
  args: {
    variant: 'dialog',
  },
}
export const ExtendedMobile = getMobileStory(Extended)
export const CompactMobile = getMobileStory(Compact)
export const ExtendedTablet = getTabletStory(Extended)
export const CompactTablet = getTabletStory(Compact)

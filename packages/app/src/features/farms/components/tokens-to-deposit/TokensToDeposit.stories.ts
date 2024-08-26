import type { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

import { TokensToDeposit } from './TokensToDeposit'

const meta: Meta<typeof TokensToDeposit> = {
  title: 'Features/Farms/Components/TokensToDeposit',
  component: TokensToDeposit,
}

export default meta
type Story = StoryObj<typeof TokensToDeposit>

export const Desktop: Story = {
  args: {
    assets: [
      {
        token: tokens.NST,
        balance: NormalizedUnitNumber(10_000),
      },
      {
        token: tokens.DAI,
        balance: NormalizedUnitNumber(20_864.56),
      },
      {
        token: tokens.USDC,
        balance: NormalizedUnitNumber(0),
      },
      {
        token: tokens.sDAI,
        balance: NormalizedUnitNumber(0),
      },
      {
        token: tokens.sNST,
        balance: NormalizedUnitNumber(0),
      },
    ],
    openStakeDialog: () => {},
  },
}

export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

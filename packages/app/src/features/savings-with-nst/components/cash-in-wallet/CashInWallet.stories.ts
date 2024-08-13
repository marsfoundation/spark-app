import type { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

import { CashInWallet } from './CashInWallet'

const meta: Meta<typeof CashInWallet> = {
  title: 'Features/SavingsWithNst/Components/CashInWallet',
  component: CashInWallet,
}

export default meta
type Story = StoryObj<typeof CashInWallet>

export const Desktop: Story = {
  name: 'Cash in wallet',
  args: {
    assets: [
      {
        token: tokens.DAI,
        balance: NormalizedUnitNumber(22727),
      },
      {
        token: tokens.USDT,
        balance: NormalizedUnitNumber(22727),
      },
      {
        token: tokens.USDC,
        balance: NormalizedUnitNumber(0),
      },
    ],
    upgradableDaiDetails: {
      isUpgradable: true,
      daiSymbol: tokens.DAI.symbol,
      NSTSymbol: tokens.sNST.symbol,
    },
    openDialog: () => {},
  },
}

export const Mobile: Story = {
  ...getMobileStory(Desktop),
  name: 'Cash in wallet (Mobile)',
}
export const Tablet: Story = {
  ...getTabletStory(Desktop),
  name: 'Cash in wallet (Tablet)',
}

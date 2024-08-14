import { NormalizedUnitNumber } from '@/domain/types/NumericValues'
import type { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
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
        token: tokens.NST,
        balance: NormalizedUnitNumber(22727),
      },
      {
        token: tokens.USDC,
        balance: NormalizedUnitNumber(0),
      },
    ],
    upgradeInfo: {
      daiSymbol: tokens.DAI.symbol,
      NSTSymbol: tokens.NST.symbol,
      daiToNstUpgradeAvailable: true,
      openDaiToNstUpgradeDialog: () => {},
    },
    openDialog: () => {},
  },
}

export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

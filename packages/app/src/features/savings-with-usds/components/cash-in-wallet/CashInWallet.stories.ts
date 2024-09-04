import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import type { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { CashInWallet } from './CashInWallet'

const meta: Meta<typeof CashInWallet> = {
  title: 'Features/SavingsWithUsds/Components/CashInWallet',
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
        token: tokens.USDS,
        balance: NormalizedUnitNumber(22727),
      },
      {
        token: tokens.USDC,
        balance: NormalizedUnitNumber(0),
      },
    ],
    migrationInfo: {
      daiSymbol: tokens.DAI.symbol,
      usdsSymbol: tokens.USDS.symbol,
      daiToUsdsUpgradeAvailable: true,
      dsr: Percentage(0.05),
      ssr: Percentage(0.06),
      apyDifference: Percentage(0.01),
      openDaiToUsdsUpgradeDialog: () => {},
      openUsdsToDaiDowngradeDialog: () => {},
      openSDaiToSUsdsUpgradeDialog: () => {},
    },
    openDialog: () => {},
  },
}

export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

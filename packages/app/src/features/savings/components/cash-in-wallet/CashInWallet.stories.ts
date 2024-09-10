import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import type { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { withRouter } from 'storybook-addon-remix-react-router'
import { CashInWallet } from './CashInWallet'

const meta: Meta<typeof CashInWallet> = {
  title: 'Features/Savings/Components/CashInWallet',
  component: CashInWallet,
}

export default meta
type Story = StoryObj<typeof CashInWallet>

export const Desktop: Story = {
  name: 'Cash in wallet',
  decorators: [withRouter()],
  args: {
    assets: [
      {
        token: tokens.DAI,
        balance: NormalizedUnitNumber(22727),
        blockExplorerLink: '/',
      },
      {
        token: tokens.USDC,
        balance: NormalizedUnitNumber(0),
        blockExplorerLink: '/',
      },
      {
        token: tokens.USDS,
        balance: NormalizedUnitNumber(22727),
        blockExplorerLink: '/',
      },
    ],
    migrationInfo: {
      daiSymbol: tokens.DAI.symbol,
      usdsSymbol: tokens.USDS.symbol,
      daiToUsdsUpgradeAvailable: true,
      apyImprovement: Percentage(0.01),
      openDaiToUsdsUpgradeDialog: () => {},
      openUsdsToDaiDowngradeDialog: () => {},
      openSDaiToSUsdsUpgradeDialog: () => {},
    },
    openDialog: () => {},
  },
}

export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

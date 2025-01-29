import { NormalizedUnitNumber, Percentage } from '@marsfoundation/common-universal'
import { tokens } from '@sb/tokens'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import type { Meta, StoryObj } from '@storybook/react'
import { withRouter } from 'storybook-addon-remix-react-router'
import { EntryAssetsPanel } from './EntryAssetsPanel'

const meta: Meta<typeof EntryAssetsPanel> = {
  title: 'Features/Savings/Components/EntryAssetsPanel',
  decorators: [withRouter()],
  component: EntryAssetsPanel,
}

export default meta
type Story = StoryObj<typeof EntryAssetsPanel>

export const Desktop: Story = {
  args: {
    assets: [
      {
        token: tokens.DAI,
        balance: NormalizedUnitNumber(22727),
        blockExplorerLink: '/',
      },
      {
        token: tokens.USDS,
        balance: NormalizedUnitNumber(22720),
        blockExplorerLink: '/',
      },
      {
        token: tokens.USDC,
        balance: NormalizedUnitNumber(0),
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
    showConvertDialogButton: true,
  },
}

export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

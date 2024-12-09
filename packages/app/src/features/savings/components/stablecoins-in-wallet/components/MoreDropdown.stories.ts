import { NormalizedUnitNumber, Percentage } from '@marsfoundation/common-universal'
import { WithClassname } from '@sb/decorators'
import { tokens } from '@sb/tokens'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import { withRouter } from 'storybook-addon-remix-react-router'
import { MoreDropdown } from './MoreDropdown'

const meta: Meta<typeof MoreDropdown> = {
  title: 'Features/Savings/Components/StablecoinsInWallet/MoreDropdown',
  decorators: [WithClassname('p-8 bg-primary flex justify-end h-48'), withRouter()],
  component: MoreDropdown,
  args: {
    token: tokens.USDS,
    blockExplorerLink: '/',
    migrationInfo: {
      daiSymbol: tokens.DAI.symbol,
      usdsSymbol: tokens.USDS.symbol,
      daiToUsdsUpgradeAvailable: true,
      apyImprovement: Percentage(0.01),
      openDaiToUsdsUpgradeDialog: () => {},
      openUsdsToDaiDowngradeDialog: () => {},
      openSDaiToSUsdsUpgradeDialog: () => {},
    },
    balance: NormalizedUnitNumber(100),
  },
  play: async ({ canvasElement }) => {
    const button = await within(canvasElement).findByRole('button')
    await userEvent.click(button)
  },
}

export default meta
type Story = StoryObj<typeof MoreDropdown>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const WithZeroBalance: Story = {
  args: {
    balance: NormalizedUnitNumber(0),
  },
}

export const OnlyLearnMore: Story = {
  args: {
    token: tokens.DAI,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  play: () => {},
}

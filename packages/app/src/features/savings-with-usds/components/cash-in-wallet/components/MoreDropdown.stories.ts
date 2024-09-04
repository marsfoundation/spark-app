import { Percentage } from '@/domain/types/NumericValues'
import { WithClassname } from '@storybook/decorators'
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { MoreDropdown } from './MoreDropdown'

const meta: Meta<typeof MoreDropdown> = {
  title: 'Features/SavingsWithUsds/Components/CashInWallet/MoreDropdown',
  decorators: [WithClassname('p-8 bg-white flex justify-end')],
  component: MoreDropdown,
  args: {
    token: tokens.USDS,
    migrationInfo: {
      daiSymbol: tokens.DAI.symbol,
      usdsSymbol: tokens.USDS.symbol,
      daiToUsdsUpgradeAvailable: true,
      apyImprovement: Percentage(0.01),
      openDaiToUsdsUpgradeDialog: () => {},
      openUsdsToDaiDowngradeDialog: () => {},
      openSDaiToSUsdsUpgradeDialog: () => {},
    },
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

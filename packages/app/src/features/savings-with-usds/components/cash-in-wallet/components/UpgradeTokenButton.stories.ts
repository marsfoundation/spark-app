import { WithClassname } from '@storybook/decorators'
import type { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { UpgradeTokenButton } from './UpgradeTokenButton'

const meta: Meta<typeof UpgradeTokenButton> = {
  title: 'Features/SavingsWithUsds/Components/CashInWallet/UpgradeTokenButton',
  decorators: [WithClassname('p-8 bg-white')],
  component: UpgradeTokenButton,
  args: {
    token: tokens.DAI,
    upgradedTokenSymbol: tokens.USDS.symbol,
  },
}

export default meta
type Story = StoryObj<typeof UpgradeTokenButton>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

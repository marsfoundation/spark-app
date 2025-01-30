import { WithClassname } from '@sb/decorators'
import { tokens } from '@sb/tokens'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import type { Meta, StoryObj } from '@storybook/react'
import { UpgradeTokenButton } from './UpgradeTokenButton'

const meta: Meta<typeof UpgradeTokenButton> = {
  title: 'Features/Savings/Components/EntryAssetsPanel/UpgradeTokenButton',
  decorators: [WithClassname('p-8 bg-primary')],
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

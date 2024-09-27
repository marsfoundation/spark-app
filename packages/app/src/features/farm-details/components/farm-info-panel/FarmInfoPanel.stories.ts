import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { FarmInfoPanel } from './FarmInfoPanel'

const meta: Meta<typeof FarmInfoPanel> = {
  title: 'Features/FarmDetails/Components/FarmInfoPanel',
  component: FarmInfoPanel,
  decorators: [WithClassname('max-w-lg'), WithTooltipProvider()],
  args: {
    assetsGroupType: 'stablecoins',
    farm: {
      address: CheckedAddress('0x1234567890123456789012345678901234567890'),
      apy: Percentage(0.05),
      entryAssetsGroup: {
        type: 'stablecoins',
        name: 'Stablecoins',
        assets: [tokens.DAI.symbol, tokens.USDC.symbol, tokens.USDT.symbol],
      },
      rewardToken: tokens.SKY,
      stakingToken: tokens.DAI,
      earned: NormalizedUnitNumber(0),
      staked: NormalizedUnitNumber(0),
      rewardRate: NormalizedUnitNumber(0.0000000003756),
      earnedTimestamp: 1724337615,
      periodFinish: 2677721600,
      totalSupply: NormalizedUnitNumber(100_000),
      depositors: 6,
    },
    walletConnected: true,
  },
}

export default meta
type Story = StoryObj<typeof FarmInfoPanel>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
export const Tablet: Story = getTabletStory(Desktop)

import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { WithClassname } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { withRouter } from 'storybook-addon-remix-react-router'
import { FarmTile } from './FarmTile'

const meta: Meta<typeof FarmTile> = {
  title: 'Features/Farms/Components/FarmTile',
  component: FarmTile,
  decorators: [WithClassname('flex w-80'), withRouter],
  args: {
    farmConfig: {
      address: CheckedAddress('0x1234567890123456789012345678901234567890'),
      entryAssetsGroup: {
        type: 'stablecoins',
        name: 'Stablecoins',
        assets: [tokens.DAI.symbol, tokens.USDC.symbol, tokens.USDT.symbol],
      },
    },
    farmInfo: {
      rewardToken: tokens.weETH,
      stakingToken: tokens.NST,
      apy: Percentage(0.05),
      deposit: NormalizedUnitNumber(0),
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Desktop: Story = {}
export const Mobile = getMobileStory(Desktop)
export const Tablet = getTabletStory(Desktop)

export const WithDeposit: Story = {
  args: {
    farmInfo: {
      rewardToken: tokens.weETH,
      stakingToken: tokens.NST,
      apy: Percentage(0.05),
      deposit: NormalizedUnitNumber(100),
    },
  },
}

export const GovernanceEntryAssets: Story = {
  args: {
    farmConfig: {
      address: CheckedAddress('0x1234567890123456789012345678901234567890'),
      entryAssetsGroup: {
        type: 'governance',
        name: 'Governance Tokens',
        assets: [tokens.MKR.symbol, tokens.GNO.symbol],
      },
    },
    farmInfo: {
      rewardToken: tokens.NST,
      stakingToken: tokens.weETH,
      apy: Percentage(0.05),
      deposit: NormalizedUnitNumber(0),
    },
  },
}

import { FarmConfig } from '@/domain/farms/types'
import { CheckedAddress } from '@/domain/types/CheckedAddress'
import { NormalizedUnitNumber, Percentage } from '@/domain/types/NumericValues'
import { WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { withRouter } from 'storybook-addon-remix-react-router'
import { FarmsView } from './FarmsView'

const farmConfig: FarmConfig = {
  address: CheckedAddress('0x1234567890123456789012345678901234567890'),
  entryAssetsGroup: {
    type: 'stablecoins',
    name: 'Stablecoins',
    assets: [tokens.DAI.symbol, tokens.USDC.symbol, tokens.USDT.symbol],
  },
}

const meta: Meta<typeof FarmsView> = {
  title: 'Features/Farms/Views/FarmsView',
  component: FarmsView,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [WithTooltipProvider(), withRouter],
  args: {
    farms: [
      {
        farmConfig,
        farmInfo: {
          apy: Percentage(0.051),
          deposit: NormalizedUnitNumber(0),
          rewardToken: tokens.wstETH,
          stakingToken: tokens.DAI,
        },
        farmLink: '/',
      },
      {
        farmConfig,
        farmInfo: {
          apy: Percentage(0.076),
          deposit: NormalizedUnitNumber(0),
          rewardToken: tokens.MKR,
          stakingToken: tokens.DAI,
        },
        farmLink: '/',
      },
    ],
    activeFarms: [
      {
        farmConfig,
        farmInfo: {
          apy: Percentage(0.034),
          deposit: NormalizedUnitNumber(100),
          rewardToken: tokens.weETH,
          stakingToken: tokens.NST,
        },
        farmLink: '/',
      },
    ],
  },
}

export default meta
type Story = StoryObj<typeof FarmsView>

export const Desktop: Story = {}
export const Mobile: Story = getMobileStory(Desktop)
export const Tablet: Story = getTabletStory(Desktop)

import { WithClassname, WithTooltipProvider } from '@storybook/decorators'
import { Meta, StoryObj } from '@storybook/react'
import { tokens } from '@storybook/tokens'
import { getMobileStory, getTabletStory } from '@storybook/viewports'
import { withRouter } from 'storybook-addon-react-router-v6'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

import { WalletComposition } from './WalletComposition'

const meta: Meta<typeof WalletComposition> = {
  title: 'Features/Dashboard/Components/WalletComposition',
  component: WalletComposition,
  decorators: [withRouter, WithClassname('max-w-5xl'), WithTooltipProvider()],
  args: {
    chainId: 1,
    hasCollaterals: true,
    includeDeposits: true,
    setIncludeDeposits: () => {},
  },
}

export default meta
type Story = StoryObj<typeof WalletComposition>

const assets = [
  {
    token: tokens.ETH,
    value: NormalizedUnitNumber(132.28),
  },
  {
    token: tokens.stETH,
    value: NormalizedUnitNumber(48.32),
  },
  {
    token: tokens.USDC,
    value: NormalizedUnitNumber(90000),
  },
  {
    token: tokens.WBTC,
    value: NormalizedUnitNumber(2),
  },
  {
    token: tokens.sDAI,
    value: NormalizedUnitNumber(50000),
  },
  {
    token: tokens.DAI,
    value: NormalizedUnitNumber(50000),
  },
  {
    token: tokens.MKR,
    value: NormalizedUnitNumber(15),
  },
  {
    token: tokens.USDT,
    value: NormalizedUnitNumber(7000),
  },
]

export const Default: Story = {
  name: 'Normal',
  args: {
    assets: [...assets.slice(0, 4)],
  },
}
export const NormalMobile = getMobileStory(Default)
export const NormalTablet = getTabletStory(Default)

export const TwoAssets: Story = {
  name: 'Two Assets',
  args: {
    assets: [...assets.slice(4, 6)],
  },
}
export const TwoAssetsMobile = getMobileStory(TwoAssets)
export const TwoAssetsTablet = getTabletStory(TwoAssets)

export const EightAssets: Story = {
  name: 'Eight Assets',
  args: {
    assets,
  },
}
export const EightAssetsMobile = getMobileStory(EightAssets)
export const EightAssetsTablet = getTabletStory(EightAssets)

export const NoDeposits: Story = {
  name: 'No Deposits',
  args: {
    assets: [...assets.slice(4, 6)],
    hasCollaterals: false,
    includeDeposits: false,
    setIncludeDeposits: () => {},
  },
}
export const NoDepositsMobile = getMobileStory(NoDeposits)
export const NoDepositsTablet = getTabletStory(NoDeposits)

export const NoAssets: Story = {
  name: 'No Assets',
  args: {
    assets: [],
    hasCollaterals: false,
  },
}
export const NoAssetsMobile = getMobileStory(NoAssets)
export const NoAssetsTablet = getTabletStory(NoAssets)

export const OneAsset: Story = {
  name: 'One Asset',
  args: {
    assets: [assets[0]!],
    hasCollaterals: false,
  },
}
export const OneAssetMobile = getMobileStory(OneAsset)
export const OneAssetTablet = getTabletStory(OneAsset)

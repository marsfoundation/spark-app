import { WithClassname, WithTooltipProvider } from '@sb/decorators'
import { tokens } from '@sb/tokens'
import { getMobileStory, getTabletStory } from '@sb/viewports'
import { Meta, StoryObj } from '@storybook/react'
import { withRouter } from 'storybook-addon-remix-react-router'

import { NormalizedUnitNumber } from '@/domain/types/NumericValues'

import { AssetsTableRow } from './AssetTable'
import { WalletComposition } from './WalletComposition'

const meta: Meta<typeof WalletComposition> = {
  title: 'Features/MyPortfolio/Components/WalletComposition',
  component: WalletComposition,
  decorators: [withRouter, WithClassname('max-w-5xl'), WithTooltipProvider()],
  args: {
    hasCollaterals: true,
    includeDeposits: true,
    setIncludeDeposits: () => {},
  },
}

export default meta
type Story = StoryObj<typeof WalletComposition>

const assets: AssetsTableRow[] = [
  {
    token: tokens.ETH,
    value: NormalizedUnitNumber(132.28),
    detailsLink: '',
  },
  {
    token: tokens.stETH,
    value: NormalizedUnitNumber(48.32),
    detailsLink: '',
  },
  {
    token: tokens.USDC,
    value: NormalizedUnitNumber(90000),
    detailsLink: '',
  },
  {
    token: tokens.WBTC,
    value: NormalizedUnitNumber(2),
    detailsLink: '',
  },
  {
    token: tokens.sDAI,
    value: NormalizedUnitNumber(50000),
    detailsLink: '',
  },
  {
    token: tokens.DAI,
    value: NormalizedUnitNumber(50000),
    detailsLink: '',
  },
  {
    token: tokens.SKY,
    value: NormalizedUnitNumber(15),
    detailsLink: '',
  },
  {
    token: tokens.USDT,
    value: NormalizedUnitNumber(7000),
    detailsLink: '',
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
